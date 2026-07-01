import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db.js';
import { generateUniqueSlug } from '../../utils/slug.js';

// 1. POST /api/public/reports - Submit a report (anonymous or identified)
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      reporterName,
      contact,
      caseType,
      platform,
      suspectPhone,
      suspectUrl,
      suspectAccount,
      description,
      location,
      attachments
    } = req.body;

    const report = await prisma.scamReport.create({
      data: {
        reporterName: reporterName || null,
        contact: contact || null,
        caseType,
        platform,
        suspectPhone: suspectPhone || null,
        suspectUrl: suspectUrl || null,
        suspectAccount: suspectAccount || null,
        description,
        location: location || null,
        attachments: Array.isArray(attachments) ? attachments : [],
        status: 'pending'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// 2. GET /api/admin/reports - Get all reports (paginated, filtered, searched)
export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, status, riskLevel, location, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (status) {
      whereClause.status = String(status);
    }
    if (riskLevel) {
      whereClause.riskLevel = String(riskLevel);
    }
    if (location) {
      whereClause.location = String(location);
    }

    if (search) {
      const searchStr = String(search);
      whereClause.OR = [
        { reporterName: { contains: searchStr, mode: 'insensitive' } },
        { contact: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { suspectPhone: { contains: searchStr, mode: 'insensitive' } },
        { suspectUrl: { contains: searchStr, mode: 'insensitive' } },
        { suspectAccount: { contains: searchStr, mode: 'insensitive' } }
      ];
    }

    const [total, reports] = await Promise.all([
      prisma.scamReport.count({ where: whereClause }),
      prisma.scamReport.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: reports,
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

// 3. GET /api/admin/reports/:id - Get detail by ID
export const getReportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const report = await prisma.scamReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// 4. PATCH /api/admin/reports/:id/status - Update report status
export const updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await prisma.scamReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    const updated = await prisma.scamReport.update({
      where: { id },
      data: { status }
    });

    return res.status(200).json({
      success: true,
      message: `Report status updated to "${status}".`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// 5. PATCH /api/admin/reports/:id/risk-level - Update risk assessment level
export const updateReportRiskLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { riskLevel } = req.body;

    const report = await prisma.scamReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    const updated = await prisma.scamReport.update({
      where: { id },
      data: { riskLevel }
    });

    return res.status(200).json({
      success: true,
      message: `Report risk level set to "${riskLevel}".`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// 6. POST /api/admin/reports/:id/convert-to-article - Convert verified report to draft Article
export const convertToArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const report = await prisma.scamReport.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    // 1. Generate Title & Unique Slug
    const title = `[Cảnh báo] Lừa đảo ${report.caseType} trên ${report.platform}`;
    const slug = await generateUniqueSlug(title, 'article');

    // 2. Map Risk Level to warningLevel
    let warningLevel = 'warning';
    if (report.riskLevel) {
      const risk = report.riskLevel.toLowerCase();
      if (risk === 'critical') warningLevel = 'urgent';
      else if (risk === 'high') warningLevel = 'warning';
      else if (risk === 'medium') warningLevel = 'notice';
      else if (risk === 'low') warningLevel = 'normal';
    }

    // 3. Find standard category or fall back to any available category
    let category = await prisma.category.findFirst({
      where: {
        slug: { in: ['canh-bao-lua-dao', 'cong-dong'] }
      }
    });

    if (!category) {
      category = await prisma.category.findFirst();
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'No category exists in the system. Please create a category first.'
      });
    }

    // 4. Generate structured content details
    const content = `
<h3>Kịch Bản Lừa Đảo</h3>
<p><strong>Hình thức:</strong> ${report.caseType}</p>
<p><strong>Nền tảng thực hiện:</strong> ${report.platform}</p>
<p><strong>Đối tượng nghi vấn:</strong></p>
<ul>
  <li>Số điện thoại: ${report.suspectPhone || 'Chưa rõ'}</li>
  <li>Tài khoản ngân hàng/giao dịch: ${report.suspectAccount || 'Chưa rõ'}</li>
  <li>Đường dẫn/Website giả mạo: ${report.suspectUrl || 'Chưa rõ'}</li>
</ul>
<p><strong>Mô tả chi tiết sự việc:</strong></p>
<blockquote>${report.description}</blockquote>
<hr />
<h3>Khuyến Nghị Phòng Tránh & Gợi Ý An Toàn</h3>
<p>Để tránh rơi vào bẫy của các đối tượng lừa đảo, người dân cần nâng cao cảnh giác và thực hiện các biện pháp phòng ngừa sau:</p>
<ol>
  <li>Tuyệt đối không chuyển khoản, cung cấp thông tin cá nhân, mã OTP, mật khẩu tài khoản cho bất kỳ ai qua các kênh chat trực tuyến hoặc cuộc gọi tự xưng.</li>
  <li>Kiểm tra kỹ thông tin người gửi, đường dẫn (URL) trang web trước khi thực hiện thao tác đăng nhập hoặc khai báo thông tin.</li>
  <li>Liên hệ trực tiếp với cơ quan chức năng hoặc đơn vị cung cấp dịch vụ chính thức để xác minh thông tin nghi vấn.</li>
</ol>
    `;

    // 5. Generate tags array
    const cleanTag = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const tags = ['tin-bao', cleanTag(report.caseType), cleanTag(report.platform)];

    // 6. Create Article draft
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary: `Cảnh báo hành vi lừa đảo hình thức ${report.caseType} trên nền tảng ${report.platform} dựa trên phản ánh cộng đồng.`,
        content,
        contentType: 'html',
        categoryId: category.id,
        tags,
        warningLevel,
        status: 'draft',
        authorId: req.user!.id,
        isFeatured: false
      }
    });

    // 7. Update ScamReport status to converted
    await prisma.scamReport.update({
      where: { id: report.id },
      data: { status: 'converted' }
    });

    return res.status(200).json({
      success: true,
      message: 'Report successfully converted to draft article.',
      data: {
        articleId: article.id,
        articleSlug: article.slug,
        articleTitle: article.title
      }
    });
  } catch (error) {
    next(error);
  }
};

// 7. GET /api/public/reports - Get verified reports for public display
export const getPublicReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      status: 'verified'
    };

    if (search) {
      const searchStr = String(search);
      whereClause.OR = [
        { caseType: { contains: searchStr, mode: 'insensitive' } },
        { platform: { contains: searchStr, mode: 'insensitive' } },
        { description: { contains: searchStr, mode: 'insensitive' } },
        { suspectPhone: { contains: searchStr, mode: 'insensitive' } },
        { suspectUrl: { contains: searchStr, mode: 'insensitive' } },
        { suspectAccount: { contains: searchStr, mode: 'insensitive' } }
      ];
    }

    const [total, reports] = await Promise.all([
      prisma.scamReport.count({ where: whereClause }),
      prisma.scamReport.findMany({
        where: whereClause,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: reports,
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
