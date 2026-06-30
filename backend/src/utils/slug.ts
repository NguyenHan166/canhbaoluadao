import { prisma } from '../config/db.js';

/**
 * Helper to convert a Vietnamese string into a clean URL-friendly slug
 */
export const slugify = (str: string): string => {
  if (!str) return '';

  let slug = str.toLowerCase();

  // Normalize Vietnamese letters with accents
  slug = slug.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  slug = slug.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  slug = slug.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  slug = slug.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  slug = slug.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  slug = slug.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  slug = slug.replace(/đ/g, 'd');

  // Remove invalid characters
  slug = slug.replace(/[^a-z0-9 -]/g, '');

  // Replace spaces and collapse multiple spaces/dashes
  slug = slug.replace(/\s+/g, '-');
  slug = slug.replace(/-+/g, '-');

  // Trim dashes from start and end
  slug = slug.replace(/^-+/, '');
  slug = slug.replace(/-+$/, '');

  return slug;
};

/**
 * Helper to generate a unique slug for Articles or Categories
 */
export const generateUniqueSlug = async (
  title: string,
  modelName: 'article' | 'category' = 'article',
  currentId?: string
): Promise<string> => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 0;
  let isUnique = false;

  while (!isUnique) {
    const checkSlug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`;
    let existing;

    if (modelName === 'article') {
      existing = await prisma.article.findUnique({
        where: { slug: checkSlug },
      });
    } else {
      existing = await prisma.category.findUnique({
        where: { slug: checkSlug },
      });
    }

    if (!existing || (currentId && existing.id === currentId)) {
      slug = checkSlug;
      isUnique = true;
    } else {
      counter++;
    }
  }

  return slug;
};
