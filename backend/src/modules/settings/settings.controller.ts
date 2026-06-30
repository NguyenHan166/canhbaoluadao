import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';

export const getPublicSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.setting.findMany();
    return res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

export const updateSetting = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, value, type = 'string' } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Setting key and value are required.'
      });
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: String(value), type },
      create: { key, value: String(value), type }
    });

    return res.status(200).json({
      success: true,
      message: 'Setting saved successfully.',
      data: setting
    });
  } catch (error) {
    next(error);
  }
};
