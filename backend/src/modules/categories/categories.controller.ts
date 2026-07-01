import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';
import { slugify } from '../../utils/slug.js';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: 'asc' },
    });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, parentId, icon, color, sortOrder, isVisible } = req.body;

    const slug = slugify(name);

    // Check slug uniqueness
    const existing = await prisma.category.findUnique({
      where: { slug },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category with slug "${slug}" already exists. Please choose a different name.`,
      });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId === '' || parentId === null ? null : parentId,
        icon,
        color,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, parentId, icon, color, sortOrder, isVisible } = req.body;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    let slug = category.slug;
    if (name && name !== category.name) {
      slug = slugify(name);
      // Verify slug uniqueness
      const existing = await prisma.category.findUnique({
        where: { slug },
      });
      if (existing && existing.id !== id) {
        return res.status(400).json({
          success: false,
          message: `Category with slug "${slug}" already exists. Please choose a different name.`,
        });
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        parentId: parentId === '' || parentId === null ? null : parentId,
        icon,
        color,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
        isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Prevent deletion of system core categories
    const protectedSlugs = ['canh-bao-lua-dao', 'an-ninh-mang', 'cong-dong'];
    if (protectedSlugs.includes(category.slug)) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa chuyên mục hệ thống mặc định: "${category.name}".`,
      });
    }

    // Check if category has articles
    const articleCount = await prisma.article.count({
      where: { categoryId: id },
    });

    if (articleCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category because it contains articles. Please delete or reassign those articles first.',
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
