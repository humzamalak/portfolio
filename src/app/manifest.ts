import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Humza Malak — Platform & DevOps Engineer',
    short_name: 'Humza Malak',
    description: 'Humza Malak designs calm, observable cloud platforms and delivery systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f2f0ea',
    theme_color: '#f2f0ea',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
