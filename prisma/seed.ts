import { PrismaClient, TenantRole, BlockType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
      role: 'USER',
    },
  });
  console.log('✅ Created demo user:', demoUser.email);

  // Create demo tenant
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Workspace',
      slug: 'demo',
      ownerId: demoUser.id,
    },
  });
  console.log('✅ Created demo tenant:', demoTenant.slug);

  // Create membership for owner
  await prisma.membership.upsert({
    where: {
      userId_tenantId: {
        userId: demoUser.id,
        tenantId: demoTenant.id,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      tenantId: demoTenant.id,
      role: TenantRole.OWNER,
    },
  });
  console.log('✅ Created owner membership');

  // Create demo profile
  const demoProfile = await prisma.profile.upsert({
    where: { handle: 'jhonamath' },
    update: {},
    create: {
      handle: 'jhonamath',
      displayName: 'Jhona Math',
      tagline1: '👨‍💻 Full-Stack Developer',
      tagline2: '🎮 Game Developer & Content Creator',
      bio: 'Building amazing things with code. Passionate about web development, game design, and creating educational content.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jhonamath',
      tenantId: demoTenant.id,
      published: true,
      themeJson: JSON.stringify({
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
      }),
    },
  });
  console.log('✅ Created demo profile:', demoProfile.handle);

  // Create Social section
  const socialSection = await prisma.section.create({
    data: {
      title: 'Social',
      order: 1,
      profileId: demoProfile.id,
    },
  });

  await prisma.block.createMany({
    data: [
      {
        type: BlockType.SOCIAL,
        title: 'Twitter',
        content: 'Follow me on Twitter',
        url: 'https://twitter.com/jhonamath',
        order: 1,
        sectionId: socialSection.id,
      },
      {
        type: BlockType.SOCIAL,
        title: 'GitHub',
        content: 'Check out my code',
        url: 'https://github.com/JhonaMath',
        order: 2,
        sectionId: socialSection.id,
      },
      {
        type: BlockType.SOCIAL,
        title: 'LinkedIn',
        content: 'Connect professionally',
        url: 'https://linkedin.com/in/jhonamath',
        order: 3,
        sectionId: socialSection.id,
      },
    ],
  });
  console.log('✅ Created Social section with 3 blocks');

  // Create Dev section
  const devSection = await prisma.section.create({
    data: {
      title: 'Development',
      order: 2,
      profileId: demoProfile.id,
    },
  });

  await prisma.block.createMany({
    data: [
      {
        type: BlockType.LINK,
        title: 'Portfolio Website',
        content: 'Check out my latest projects and work',
        url: 'https://example.com/portfolio',
        order: 1,
        sectionId: devSection.id,
      },
      {
        type: BlockType.LINK,
        title: 'Blog',
        content: 'Read my articles on web development',
        url: 'https://example.com/blog',
        order: 2,
        sectionId: devSection.id,
      },
      {
        type: BlockType.LIST,
        title: 'Tech Stack',
        content: JSON.stringify([
          'Next.js & React',
          'TypeScript',
          'Node.js',
          'PostgreSQL',
          'TailwindCSS',
          'Prisma ORM',
        ]),
        order: 3,
        sectionId: devSection.id,
      },
    ],
  });
  console.log('✅ Created Development section with 3 blocks');

  // Create Gamedev section
  const gamedevSection = await prisma.section.create({
    data: {
      title: 'Game Development',
      order: 3,
      profileId: demoProfile.id,
    },
  });

  await prisma.block.createMany({
    data: [
      {
        type: BlockType.LINK,
        title: 'Latest Game Project',
        content: 'Play my newest indie game',
        url: 'https://example.com/games',
        order: 1,
        sectionId: gamedevSection.id,
      },
      {
        type: BlockType.EMBED,
        title: 'Game Dev Tutorial',
        content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        order: 2,
        sectionId: gamedevSection.id,
      },
      {
        type: BlockType.TEXT,
        title: null,
        content: '🎮 Currently working on a multiplayer RPG using Unity and C#. Follow my journey on Twitter for updates!',
        order: 3,
        sectionId: gamedevSection.id,
      },
    ],
  });
  console.log('✅ Created Game Development section with 3 blocks');

  // Create Portfolio section
  const portfolioSection = await prisma.section.create({
    data: {
      title: 'Featured Work',
      order: 4,
      profileId: demoProfile.id,
    },
  });

  await prisma.block.createMany({
    data: [
      {
        type: BlockType.LINK,
        title: 'E-Commerce Platform',
        content: 'Full-stack marketplace with 10k+ users',
        url: 'https://example.com/ecommerce',
        order: 1,
        sectionId: portfolioSection.id,
      },
      {
        type: BlockType.LINK,
        title: 'SaaS Dashboard',
        content: 'Analytics platform with real-time data',
        url: 'https://example.com/saas',
        order: 2,
        sectionId: portfolioSection.id,
      },
      {
        type: BlockType.LINK,
        title: 'Mobile App',
        content: 'React Native app with 50k+ downloads',
        url: 'https://example.com/app',
        order: 3,
        sectionId: portfolioSection.id,
      },
    ],
  });
  console.log('✅ Created Featured Work section with 3 blocks');

  // Create Travelling section
  const travelSection = await prisma.section.create({
    data: {
      title: 'Travel Adventures',
      order: 5,
      profileId: demoProfile.id,
    },
  });

  await prisma.block.createMany({
    data: [
      {
        type: BlockType.TEXT,
        title: null,
        content: '✈️ Digital nomad exploring the world while building software. Here are some places I\'ve been:',
        order: 1,
        sectionId: travelSection.id,
      },
      {
        type: BlockType.LIST,
        title: 'Visited Countries',
        content: JSON.stringify([
          '🇯🇵 Japan - Tokyo & Kyoto',
          '🇹🇭 Thailand - Bangkok & Chiang Mai',
          '🇵🇹 Portugal - Lisbon',
          '🇪🇸 Spain - Barcelona',
          '🇲🇽 Mexico - Mexico City',
          '🇦🇷 Argentina - Buenos Aires',
        ]),
        order: 2,
        sectionId: travelSection.id,
      },
      {
        type: BlockType.LINK,
        title: 'Travel Blog',
        content: 'Read about my adventures',
        url: 'https://example.com/travel',
        order: 3,
        sectionId: travelSection.id,
      },
    ],
  });
  console.log('✅ Created Travel Adventures section with 3 blocks');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Demo Account Credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: demo123');
  console.log('   Profile: /jhonamath');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
