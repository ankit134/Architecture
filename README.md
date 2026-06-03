# Adarsha Sapkota — Portfolio

Portfolio site inspired by [Kento Kawazoe](https://kentokawazoe.com/), with content from [adarshasapkota.github.io](https://adarshasapkota.github.io/).

## Features

- WebGL2 mouse-trail smoke effect
- Custom cursor with hover states
- Section scroll snapping (native, no smooth-scroll conflict)
- Active section highlight in the left navigation
- Light / dark theme toggle

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder. GitHub Pages workflow is configured in `.github/workflows/deploy.yml` (base path `/Architecture/`).

## Stack

- React 19 + Vite 8
- Tailwind CSS 4
- Framer Motion
- Zustand
