import { Helmet } from 'react-helmet-async';

export const SEO = () => (
  <Helmet>
    <title>Sourav Debnath | AI PM</title>
    <meta name="description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <link rel="canonical" href="https://souravdebnath.com" />

    <meta property="og:title" content="Sourav Debnath | AI PM" />
    <meta property="og:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <meta property="og:url" content="https://souravdebnath.com" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://souravdebnath.com/og-image.jpg" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Sourav Debnath | AI PM" />
    <meta name="twitter:description" content="AI Product Manager | Solving Business Problems with Scalable AI Products" />
    <meta name="twitter:image" content="https://souravdebnath.com/og-image.jpg" />

    <script type="application/ld+json">{JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Sourav Debnath',
      jobTitle: 'Senior Product Manager',
      description: 'AI Product Manager building GenAI products at scale',
      url: 'https://souravdebnath.com',
      sameAs: [
        'https://linkedin.com/in/souravdebnath',
        'https://github.com/sourav27',
      ],
      alumniOf: [
        { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Management Bangalore' },
        { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Madras' },
      ],
      worksFor: { '@type': 'Organization', name: 'AB InBev' },
    })}</script>
  </Helmet>
);
