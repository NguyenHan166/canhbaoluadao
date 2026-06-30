import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';

export const getOverviewStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Article Status Counts
    const articlesByStatus = await prisma.article.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // 2. Scam Report Status Counts
    const reportsByStatus = await prisma.scamReport.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // 3. Platform Distribution
    const reportsByPlatform = await prisma.scamReport.groupBy({
      by: ['platform'],
      _count: { id: true }
    });

    // 4. Case Type Distribution (Top 5)
    const reportsByCaseType = await prisma.scamReport.groupBy({
      by: ['caseType'],
      _count: { id: true },
      orderBy: {
        _count: { id: 'desc' }
      },
      take: 5
    });

    // 5. Article Views Aggregated by Publication Date
    const articlesWithPublishDates = await prisma.article.findMany({
      where: {
        status: 'published',
        publishedAt: { not: null }
      },
      select: {
        publishedAt: true,
        views: true
      }
    });

    const viewsByPubDateMap: Record<string, number> = {};
    let totalViewsCount = 0;
    articlesWithPublishDates.forEach(art => {
      totalViewsCount += art.views;
      if (art.publishedAt) {
        const dateStr = art.publishedAt.toISOString().split('T')[0];
        viewsByPubDateMap[dateStr] = (viewsByPubDateMap[dateStr] || 0) + art.views;
      }
    });

    const viewsByPublicationDate = Object.entries(viewsByPubDateMap).map(([date, views]) => ({
      date,
      views
    })).sort((a, b) => a.date.localeCompare(b.date));

    // 6. Generate simulated 7-day view trend
    const last7DaysTrend: { date: string, views: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const baseViews = 100 + Math.floor(Math.random() * 150);
      last7DaysTrend.push({
        date: dateStr,
        views: baseViews
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        articles: {
          byStatus: articlesByStatus.map(item => ({ status: item.status, count: item._count.id })),
          total: articlesByStatus.reduce((acc, curr) => acc + curr._count.id, 0)
        },
        reports: {
          byStatus: reportsByStatus.map(item => ({ status: item.status, count: item._count.id })),
          total: reportsByStatus.reduce((acc, curr) => acc + curr._count.id, 0)
        },
        views: {
          total: totalViewsCount,
          byPublicationDate: viewsByPublicationDate,
          simulatedLast7DaysTrend: last7DaysTrend
        },
        platformDistribution: reportsByPlatform.map(item => ({ platform: item.platform, count: item._count.id })),
        topCaseTypes: reportsByCaseType.map(item => ({ caseType: item.caseType, count: item._count.id }))
      }
    });
  } catch (error) {
    next(error);
  }
};
