import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision mediump float;

layout(location = 0) out vec4 pc_FragDensity;
layout(location = 1) out vec4 pc_FragVelocity;

uniform sampler2D uPrevVelocity;
uniform sampler2D uPrevDensity;
uniform float uTime;
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

  pc_FragDensity = nextDen;
  pc_FragVelocity = vec4(vec3(nextVel.x), 1.0);
}
`

function useFluidTargets() {
  const { size, viewport } = useThree()
  const width = size.width * viewport.dpr
  const height = size.height * viewport.dpr

  const targets = useMemo(() => {
    const createTarget = () => {
      const target = new THREE.WebGLRenderTarget(width, height, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        type: THREE.HalfFloatType,
        depthBuffer: true,
        depthTexture: new THREE.DepthTexture(width, height, THREE.UnsignedIntType),
        count: 2,
      })
      return target
    }
    return [createTarget(), createTarget()]
  }, [width, height])

  useEffect(() => {
    targets.forEach((target) => target.setSize(width, height))
  }, [targets, width, height])

  useEffect(
    () => () => {
      targets.forEach((target) => target.dispose())
    },
    [targets],
  )

  return targets
}

function FluidSimulation() {
  const materialRef = useRef(null)
  const prevMouse = useRef([2, 2])
  const currentMouse = useRef([2, 2])
  const targets = useFluidTargets()
  const ping = useRef(0)
  const { gl, scene, camera, clock, size, viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uCurrentMouse: { value: new THREE.Vector2() },
      uPrevMouse: { value: new THREE.Vector2() },
      uPrevVelocity: { value: null },
      uPrevDensity: { value: null },
    }),
    [],
  )

  useEffect(() => {
    const onMove = (e) => {
      currentMouse.current[0] = (e.clientX / window.innerWidth) * 2 - 1
      currentMouse.current[1] = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    if (!materialRef.current) return

    const dpr = viewport.dpr
    materialRef.current.uniforms.uTime.value = clock.elapsedTime
    materialRef.current.uniforms.uResolution.value.set(
      size.width * dpr,
      size.height * dpr,
    )

    const mx = currentMouse.current[0]
    const my = currentMouse.current[1]
    materialRef.current.uniforms.uCurrentMouse.value.set(mx, my)
    materialRef.current.uniforms.uPrevMouse.value.set(
      prevMouse.current[0],
      prevMouse.current[1],
    )

    const writeTarget = targets[ping.current % 2]
    const readTarget = targets[(ping.current + 1) % 2]

    materialRef.current.uniforms.uPrevVelocity.value = readTarget.textures[0]
    materialRef.current.uniforms.uPrevDensity.value = readTarget.textures[1]

    gl.setRenderTarget(writeTarget)
    gl.render(scene, camera)
    gl.setRenderTarget(null)

    prevMouse.current = [mx, my]
    ping.current += 1
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        glslVersion={THREE.GLSL3}
        uniforms={uniforms}
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export function FluidBackground() {
  return (
    <div className="pointer-fine-block fixed inset-0 -z-50 bg-black w-screen h-screen">
      <Canvas
        orthographic
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
        camera={{ zoom: 1 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <FluidSimulation />
      </Canvas>
    </div>
  )
}
