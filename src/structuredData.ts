export function injectStructuredData(): void {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'BASSOLE Éric Kévin',
    alternateName: 'KevCompilePas',
    jobTitle: 'Développeur Lead Fullstack & Mobile',
    worksFor: {
      '@type': 'Organization',
      name: 'Volska Média',
    },
    knowsAbout: [
      'React',
      'Next.js',
      'Flutter',
      'TypeScript',
      'Python',
      'Supabase',
      'PostgreSQL',
      'Développement Mobile',
    ],
    email: 'bassolekevin022@gmail.com',
    telephone: '+2250140448289',
  });

  document.head.appendChild(script);
}
