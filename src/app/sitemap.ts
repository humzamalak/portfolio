import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://humzamalak.com'
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    // Add blog posts dynamically if you have them
    // {
    //   url: `${baseUrl}/blog/getting-started-with-nextjs`,
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 0.7,
    // },
  ]
}
