import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';

export const getHandbooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const filter: any = {};
    if (category) {
      filter.category = String(category);
    }
    const handbooks = await prisma.handbook.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
      success: true,
      data: handbooks
    });
  } catch (error) {
    next(error);
  }
};

export const createHandbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, title, summary, steps, difficulty, recommendFor } = req.body;
    const handbook = await prisma.handbook.create({
      data: {
        category,
        title,
        summary,
        steps: Array.isArray(steps) ? steps : [],
        difficulty,
        recommendFor
      }
    });
    return res.status(201).json({
      success: true,
      message: 'Handbook created successfully.',
      data: handbook
    });
  } catch (error) {
    next(error);
  }
};

export const updateHandbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { category, title, summary, steps, difficulty, recommendFor } = req.body;
    const existing = await prisma.handbook.findUnique({
      where: { id }
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Handbook not found.'
      });
    }
    const updated = await prisma.handbook.update({
      where: { id },
      data: {
        category,
        title,
        summary,
        steps: Array.isArray(steps) ? steps : undefined,
        difficulty,
        recommendFor
      }
    });
    return res.status(200).json({
      success: true,
      message: 'Handbook updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHandbook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const existing = await prisma.handbook.findUnique({
      where: { id }
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Handbook not found.'
      });
    }
    await prisma.handbook.delete({
      where: { id }
    });
    return res.status(200).json({
      success: true,
      message: 'Handbook deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
