export function PersonJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tania Lapalelo',
    jobTitle: 'Frontend Engineer',
    url: 'https://tanialapalelo.vercel.app',
    sameAs: [
      'https://github.com/tanialapalelo',
      'https://linkedin.com/in/tanialapalelo',
      'https://medium.com/@tanialapalelo',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
