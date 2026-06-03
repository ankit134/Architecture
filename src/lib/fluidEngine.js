/**
 * WebGL2 mouse-trail fluid (smoke) — matches kentokawazoe.com simulation model.
 * Self-contained; no Three.js / R3F.
 */

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const SIM_FRAG = `#version 300 es
precision highp float;

layout(location = 0) out vec4 outDensity;
layout(location = 1) out vec4 outVelocity;

uniform sampler2D uPrevVelocity;
uniform sampler2D uPrevDensity;
uniform vec2 uResolution;
uniform vec2 uCurrentMouse;
uniform vec2 uPrevMouse;

float distToSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = gl_FragCoord.xy / uResolution.xy;

  vec2 st = uv * 2.0 - 1.0;
  st.x *= aspect;

  vec2 mouseC = uCurrentMouse;
  vec2 mouseP = uPrevMouse;
  mouseC.x *= aspect;
  mouseP.x *= aspect;

  vec2 mouseVel = mouseC - mouseP;
  if (length(mouseVel) > 1.0) mouseVel = vec2(0.0);

  float dist = distToSegment(st, mouseP, mouseC);
  float strength = smoothstep(0.1, 0.0, dist);
  strength = pow(strength, 2.0);

  vec2 prevVel = texture(uPrevVelocity, uv).xy;
  vec2 movedVel = texture(uPrevVelocity, uv - prevVel * 0.01).xy;
  vec2 nextVel = movedVel * 0.96 + mouseVel * strength;

  float mouseSpeed = length(mouseVel);
  vec4 movedDen = texture(uPrevDensity, uv + nextVel * 0.01);
  vec4 nextDen = movedDen * 0.98 + vec4(1.0) * strength * mouseSpeed * 10.0;

  outDensity = nextDen;
  outVelocity = vec4(vec3(nextVel.x), 1.0);
}
`

const DISPLAY_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uDensity;
uniform vec2 uResolution;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float density = texture(uDensity, uv).r;
  float alpha = clamp(density * 2.5, 0.0, 0.55);
  fragColor = vec4(vec3(1.0), alpha);
}
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(log || 'Shader compile failed')
  }
  return shader
}

function createProgram(gl, vsSource, fsSource) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)
  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(log || 'Program link failed')
  }
  return program
}

function createTexture(gl, width, height) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  )
  gl.bindTexture(gl.TEXTURE_2D, null)
  return texture
}

function createDoubleFbo(gl, width, height) {
  const fbo = [gl.createFramebuffer(), gl.createFramebuffer()]
  const velocity = [createTexture(gl, width, height), createTexture(gl, width, height)]
  const density = [createTexture(gl, width, height), createTexture(gl, width, height)]

  for (let i = 0; i < 2; i++) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo[i])
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      density[i],
      0,
    )
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT1,
      gl.TEXTURE_2D,
      velocity[i],
      0,
    )
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1])
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      throw new Error(`Framebuffer incomplete: ${status}`)
    }
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.drawBuffers([gl.BACK])

  return { fbo, velocity, density }
}

export class FluidEngine {
  constructor(canvas) {
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    })

    if (!gl) {
      throw new Error('WebGL2 is required for the mouse trail effect')
    }

    this.canvas = canvas
    this.gl = gl
    this.width = 0
    this.height = 0
    this.ping = 0

    this.simProgram = createProgram(gl, VERT, SIM_FRAG)
    this.displayProgram = createProgram(gl, VERT, DISPLAY_FRAG)

    this.quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    )

    this.simUniforms = {
      uPrevVelocity: gl.getUniformLocation(this.simProgram, 'uPrevVelocity'),
      uPrevDensity: gl.getUniformLocation(this.simProgram, 'uPrevDensity'),
      uResolution: gl.getUniformLocation(this.simProgram, 'uResolution'),
      uCurrentMouse: gl.getUniformLocation(this.simProgram, 'uCurrentMouse'),
      uPrevMouse: gl.getUniformLocation(this.simProgram, 'uPrevMouse'),
    }

    this.displayUniforms = {
      uDensity: gl.getUniformLocation(this.displayProgram, 'uDensity'),
      uResolution: gl.getUniformLocation(this.displayProgram, 'uResolution'),
    }

    this.simPosLoc = gl.getAttribLocation(this.simProgram, 'position')
    this.displayPosLoc = gl.getAttribLocation(this.displayProgram, 'position')

    this.fbo = null
    this.currentMouse = [0, 0]
    this.prevMouse = [0, 0]
  }

  resize(displayWidth, displayHeight) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.floor(displayWidth * dpr))
    const height = Math.max(1, Math.floor(displayHeight * dpr))

    if (width === this.width && height === this.height) return

    this.width = width
    this.height = height
    this.canvas.width = width
    this.canvas.height = height

    const { gl } = this

    if (this.fbo) {
      for (let i = 0; i < 2; i++) {
        gl.deleteFramebuffer(this.fbo.fbo[i])
        gl.deleteTexture(this.fbo.velocity[i])
        gl.deleteTexture(this.fbo.density[i])
      }
    }

    this.fbo = createDoubleFbo(gl, width, height)
    this.ping = 0
    this.prevMouse = [0, 0]
    this.currentMouse = [0, 0]
  }

  setMouse(clientX, clientY) {
    const w = window.innerWidth
    const h = window.innerHeight
    this.currentMouse[0] = (clientX / w) * 2 - 1
    this.currentMouse[1] = -(clientY / h) * 2 + 1
  }

  step() {
    if (!this.fbo || this.width === 0) return

    const { gl, fbo } = this
    const read = this.ping % 2
    const write = (this.ping + 1) % 2

    gl.useProgram(this.simProgram)
    gl.bindVertexArray(null)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.enableVertexAttribArray(this.simPosLoc)
    gl.vertexAttribPointer(this.simPosLoc, 2, gl.FLOAT, false, 0, 0)

    gl.uniform2f(this.simUniforms.uResolution, this.width, this.height)
    gl.uniform2f(
      this.simUniforms.uCurrentMouse,
      this.currentMouse[0],
      this.currentMouse[1],
    )
    gl.uniform2f(
      this.simUniforms.uPrevMouse,
      this.prevMouse[0],
      this.prevMouse[1],
    )

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, fbo.velocity[read])
    gl.uniform1i(this.simUniforms.uPrevVelocity, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, fbo.density[read])
    gl.uniform1i(this.simUniforms.uPrevDensity, 1)

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fbo[write])
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1])
    gl.viewport(0, 0, this.width, this.height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.drawBuffers([gl.BACK])
    gl.viewport(0, 0, this.width, this.height)

    gl.useProgram(this.displayProgram)
    gl.enableVertexAttribArray(this.displayPosLoc)
    gl.vertexAttribPointer(this.displayPosLoc, 2, gl.FLOAT, false, 0, 0)

    gl.uniform2f(this.displayUniforms.uResolution, this.width, this.height)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, fbo.density[write])
    gl.uniform1i(this.displayUniforms.uDensity, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.disable(gl.BLEND)

    this.prevMouse[0] = this.currentMouse[0]
    this.prevMouse[1] = this.currentMouse[1]
    this.ping += 1
  }

  destroy() {
    const { gl, fbo } = this
    if (fbo) {
      for (let i = 0; i < 2; i++) {
        gl.deleteFramebuffer(fbo.fbo[i])
        gl.deleteTexture(fbo.velocity[i])
        gl.deleteTexture(fbo.density[i])
      }
    }
    gl.deleteBuffer(this.quadBuffer)
    gl.deleteProgram(this.simProgram)
    gl.deleteProgram(this.displayProgram)
    this.fbo = null
  }
}
