import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const articles = await prisma.article.findMany();
  console.log(`Checking ${articles.length} articles for old R2 URLs...`);
  for (const art of articles) {
    console.log(`Article: ${art.title}`);
    if (art.content.includes('r2.dev')) {
      console.log(`  -> FOUND OLD R2 URL in content!`);
      // Find all matches
      const regex = /https:\/\/[a-zA-Z0-9-]+\.r2\.dev[^\s"']*/g;
      const matches = art.content.match(regex);
      if (matches) {
        console.log(`  -> Matches:`, matches);
      }
    } else {
      console.log(`  -> Clean (no R2 URLs)`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
