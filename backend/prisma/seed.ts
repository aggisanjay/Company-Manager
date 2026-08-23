import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_COMPANIES = [
  {
    companyName: 'Stripe',
    website: 'https://stripe.com',
    industry: 'Fintech & Banking',
    employeeCount: 8000,
  },
  {
    companyName: 'OpenAI',
    website: 'https://openai.com',
    industry: 'Artificial Intelligence',
    employeeCount: 1500,
  },
  {
    companyName: 'Supabase',
    website: 'https://supabase.com',
    industry: 'Software & SaaS',
    employeeCount: 120,
  },
  {
    companyName: 'Vercel',
    website: 'https://vercel.com',
    industry: 'Software & SaaS',
    employeeCount: 550,
  },
  {
    companyName: 'GitHub',
    website: 'https://github.com',
    industry: 'Software & SaaS',
    employeeCount: 3000,
  },
  {
    companyName: 'Datadog',
    website: 'https://www.datadoghq.com',
    industry: 'Cybersecurity',
    employeeCount: 5200,
  },
  {
    companyName: 'Shopify',
    website: 'https://www.shopify.com',
    industry: 'E-Commerce & Retail',
    employeeCount: 11600,
  },
  {
    companyName: 'Linear',
    website: 'https://linear.app',
    industry: 'Software & SaaS',
    employeeCount: 75,
  },
  {
    companyName: 'Figma',
    website: 'https://www.figma.com',
    industry: 'Software & SaaS',
    employeeCount: 1300,
  },
  {
    companyName: 'Canva',
    website: 'https://www.canva.com',
    industry: 'Media & Entertainment',
    employeeCount: 4500,
  },
  {
    companyName: 'Notion',
    website: 'https://www.notion.so',
    industry: 'Software & SaaS',
    employeeCount: 600,
  },
  {
    companyName: 'Cloudflare',
    website: 'https://www.cloudflare.com',
    industry: 'Cybersecurity',
    employeeCount: 3600,
  },
  {
    companyName: 'Spotify',
    website: 'https://www.spotify.com',
    industry: 'Media & Entertainment',
    employeeCount: 9000,
  },
  {
    companyName: 'Airbnb',
    website: 'https://www.airbnb.com',
    industry: 'E-Commerce & Retail',
    employeeCount: 6800,
  },
  {
    companyName: 'Snowflake',
    website: 'https://www.snowflake.com',
    industry: 'Software & SaaS',
    employeeCount: 7000,
  },
  {
    companyName: 'HubSpot',
    website: 'https://www.hubspot.com',
    industry: 'Consulting & Services',
    employeeCount: 7600,
  },
  {
    companyName: 'Twilio',
    website: 'https://www.twilio.com',
    industry: 'Software & SaaS',
    employeeCount: 5800,
  },
  {
    companyName: 'Slack',
    website: 'https://slack.com',
    industry: 'Software & SaaS',
    employeeCount: 2500,
  },
  {
    companyName: 'Zoom',
    website: 'https://zoom.us',
    industry: 'Software & SaaS',
    employeeCount: 7400,
  },
  {
    companyName: 'Atlassian',
    website: 'https://www.atlassian.com',
    industry: 'Software & SaaS',
    employeeCount: 11000,
  },
];

async function main() {
  console.log('Seeding 20 production-grade companies with active URLs...');

  // Delete existing records to clean out old dummy data
  const deleted = await prisma.company.deleteMany();
  console.log(`Cleared ${deleted.count} existing records.`);

  for (const company of SEED_COMPANIES) {
    const created = await prisma.company.create({
      data: company,
    });
    console.log(`✓ Inserted: ${created.companyName} (${created.website})`);
  }

  console.log(`Successfully seeded ${SEED_COMPANIES.length} companies!`);
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
