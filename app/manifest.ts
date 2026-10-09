import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Alemu Kelemework - Developer Portfolio',
    short_name: 'AleMu Dev',
    description: 'Alemu Kelemework - Full-stack developer portfolio',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#10120f',
    theme_color: '#10120f',
    icons: [
      { src: '/pwa-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  }
}