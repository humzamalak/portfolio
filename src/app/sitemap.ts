import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

// Search engines ignore #fragments, so only real pages are listed. URLs end in "/" to match trailingSlash in next.config.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://humzamalak.dev'
  return [
    { url: `${baseUrl}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/projects/`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/privacy/`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/terms/`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
