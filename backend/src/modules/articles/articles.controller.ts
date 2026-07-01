import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';
import { slugify, generateUniqueSlug } from '../../utils/slug.js';
import { sanitizeHtml } from '../../utils/sanitizer.js';

// 1. GET /api/public/articles - Get published articles (paginated, searched, filtered)
export const getPublicArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, categoryId, warningLevel, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      status: 'published',
    };

    if (categoryId) {
      whereClause.categoryId = String(categoryId);
    }

    if (warningLevel) {
      whereClause.warningLevel = String(warningLevel);
    }

    if (search) {
      const searchStr = String(search);
      whereClause.OR = [
        { title: { contains: searchStr, mode: 'insensitive' } },
        { summary: { contains: searchStr, mode: 'insensitive' } },
        { tags: { has: searchStr } }
      ];
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where: whereClause }),
      prisma.article.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, name: true } },
          source: { select: { id: true, name: true, website: true, trustStatus: true } }
        }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: articles,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /api/public/articles/latest - Get latest 5 published articles
export const getLatestArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      take: 5,
      orderBy: { publishedAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } }
      }
    });

    return res.status(200).json({
      success: true,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// 3. GET /api/public/articles/featured - Get featured articles
export const getFeaturedArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: 'published',
        isFeatured: true
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } }
      }
    });

    return res.status(200).json({
      success: true,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// 4. GET /api/public/articles/:slug - Detail by slug with atomic view increment
export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;

    const article = await prisma.article.findUnique({
      where: { slug }
    });

    if (!article || article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    // Atomically increment views and return updated document
    const updatedArticle = await prisma.article.update({
      where: { id: article.id },
      data: {
        views: { increment: 1 }
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, name: true } },
        source: { select: { id: true, name: true, website: true, trustStatus: true } }
      }
    });

    return res.status(200).json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN CONTROLLERS ---

// 5. GET /api/admin/articles - Get all articles (for editors/admins)
export const getAdminArticles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, categoryId, warningLevel, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (status) {
      whereClause.status = String(status);
    }

    if (categoryId) {
      whereClause.categoryId = String(categoryId);
    }

    if (warningLevel) {
      whereClause.warningLevel = String(warningLevel);
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where: whereClause }),
      prisma.article.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true } },
          author: { select: { id: true, name: true } },
          source: { select: { id: true, name: true } }
        }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: articles,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 6. GET /api/admin/articles/:id - Admin detail by id
export const getAdminArticleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } },
        source: { select: { id: true, name: true } }
      }
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// 7. POST /api/admin/articles - Create article (sanitized content, unique slug)
export const createArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      title,
      summary,
      content,
      coverImageId,
      coverImageUrl,
      categoryId,
      tags,
      warningLevel,
      sourceId,
      sourceUrl,
      status = 'draft',
      isFeatured = false
    } = req.body;

    // Check category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Invalid categoryId. Category does not exist.'
      });
    }

    // Check source exists if provided
    if (sourceId) {
      const source = await prisma.source.findUnique({
        where: { id: sourceId }
      });
      if (!source) {
        return res.status(400).json({
          success: false,
          message: 'Invalid sourceId. Source does not exist.'
        });
      }
    }

    const sanitizedContent = sanitizeHtml(content);
    const slug = await generateUniqueSlug(title);

    const publishedAt = status === 'published' ? new Date() : null;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary,
        content: sanitizedContent,
        coverImageId: coverImageId || null,
        coverImageUrl: coverImageUrl || null,
        categoryId,
        tags: Array.isArray(tags) ? tags : [],
        warningLevel,
        sourceId: sourceId || null,
        sourceUrl: sourceUrl || null,
        status,
        isFeatured: Boolean(isFeatured),
        authorId: req.user!.id,
        publishedAt
      },
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Article created successfully.',
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// 8. PATCH /api/admin/articles/:id - Update article
export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      content,
      coverImageId,
      coverImageUrl,
      categoryId,
      tags,
      warningLevel,
      sourceId,
      sourceUrl,
      status,
      isFeatured
    } = req.body;

    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    // Check category exists if provided
    if (categoryId && categoryId !== existingArticle.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(400).json({
          success: false,
          message: 'Invalid categoryId. Category does not exist.'
        });
      }
    }

    // Check source exists if provided
    if (sourceId && sourceId !== existingArticle.sourceId) {
      const source = await prisma.source.findUnique({
        where: { id: sourceId }
      });
      if (!source) {
        return res.status(400).json({
          success: false,
          message: 'Invalid sourceId. Source does not exist.'
        });
      }
    }

    // Handle updates
    let slug = existingArticle.slug;
    if (title && title !== existingArticle.title) {
      slug = await generateUniqueSlug(title, 'article', id);
    }

    let sanitizedContent = existingArticle.content;
    if (content !== undefined) {
      sanitizedContent = sanitizeHtml(content);
    }

    let publishedAt = existingArticle.publishedAt;
    if (status && status === 'published' && existingArticle.status !== 'published') {
      publishedAt = new Date();
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        summary,
        content: sanitizedContent,
        coverImageId: coverImageId !== undefined ? (coverImageId || null) : undefined,
        coverImageUrl: coverImageUrl !== undefined ? (coverImageUrl || null) : undefined,
        categoryId,
        tags: Array.isArray(tags) ? tags : undefined,
        warningLevel,
        sourceId: sourceId !== undefined ? (sourceId || null) : undefined,
        sourceUrl: sourceUrl !== undefined ? (sourceUrl || null) : undefined,
        status,
        isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : undefined,
        publishedAt
      },
      include: {
        category: { select: { id: true, name: true } },
        author: { select: { id: true, name: true } }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Article updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// 9. PATCH /api/admin/articles/:id/status - Quick update status
export const updateArticleStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    let publishedAt = existingArticle.publishedAt;
    if (status === 'published' && !existingArticle.publishedAt) {
      publishedAt = new Date();
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        status,
        publishedAt
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true
      }
    });

    return res.status(200).json({
      success: true,
      message: `Article status updated to "${status}".`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// 10. DELETE /api/admin/articles/:id - Delete article
export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingArticle = await prisma.article.findUnique({
      where: { id }
    });

    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found.'
      });
    }

    await prisma.article.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Article deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
