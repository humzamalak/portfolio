import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Humza Malak - Full Stack Developer Portfolio',
    short_name: 'Humza Portfolio',
    description: 'Senior Full Stack Developer specializing in React, Node.js, and cloud technologies.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
