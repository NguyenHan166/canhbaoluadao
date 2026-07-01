import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Categories ---');
  const categories = await prisma.category.findMany();
  console.log('Categories in DB:', JSON.stringify(categories, null, 2));

  console.log('\n--- Articles ---');
  const articles = await prisma.article.findMany({
    include: {
      category: true
    }
  });
  console.log('Articles in DB:', JSON.stringify(articles, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
