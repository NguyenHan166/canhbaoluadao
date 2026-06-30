import { PrismaClient, User, Category, Source } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Super Admin
  const adminEmail = 'nvhan166@gmail.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  let adminUser: User;
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('nvhan1662003', 10);
    adminUser = await prisma.user.create({
      data: {
        name: 'Nguyen Van Han',
        email: adminEmail,
        passwordHash,
        role: 'super_admin',
        status: 'active'
      }
    });
    console.log(`Created Super Admin: ${adminEmail}`);
  } else {
    adminUser = existingAdmin;
    console.log(`Super Admin already exists: ${adminEmail}`);
  }

  // 2. Create Categories
  const categoriesData = [
    { name: 'Cảnh báo lừa đảo', slug: 'canh-bao-lua-dao', description: 'Các bài viết cảnh báo thủ đoạn lừa đảo trực tuyến mới nhất', icon: 'ShieldAlert', color: '#EF4444', sortOrder: 1 },
    { name: 'An ninh mạng', slug: 'an-ninh-mang', description: 'Tin tức, phân tích tình hình an toàn thông tin mạng', icon: 'Globe', color: '#3B82F6', sortOrder: 2 },
    { name: 'Kiến thức an toàn số', slug: 'kien-thuc', description: 'Giải thích thuật ngữ, định nghĩa về an toàn thông tin', icon: 'BookOpen', color: '#10B981', sortOrder: 3 },
    { name: 'Kỹ năng & Mẹo', slug: 'meo-huu-ich', description: 'Các hướng dẫn thực hành tự bảo vệ tài khoản, thiết bị', icon: 'CheckSquare', color: '#F59E0B', sortOrder: 4 },
    { name: 'Báo cáo cộng đồng', slug: 'cong-dong', description: 'Thông tin nghi vấn lừa đảo do người dân phản ánh đã được xác minh', icon: 'Users', color: '#8B5CF6', sortOrder: 5 }
  ];

  const categories: Category[] = [];
  for (const cat of categoriesData) {
    const existingCat = await prisma.category.findUnique({
      where: { slug: cat.slug }
    });

    if (!existingCat) {
      const createdCat = await prisma.category.create({ data: cat });
      categories.push(createdCat);
      console.log(`Created Category: ${cat.name}`);
    } else {
      categories.push(existingCat);
      console.log(`Category already exists: ${cat.name}`);
    }
  }

  // 3. Create Sample Source
  let sampleSource: Source | null = await prisma.source.findFirst({
    where: { name: 'Cổng thông tin Cục An toàn thông tin' }
  });

  if (!sampleSource) {
    sampleSource = await prisma.source.create({
      data: {
        name: 'Cổng thông tin Cục An toàn thông tin',
        type: 'Chính thống',
        website: 'https://ais.gov.vn',
        description: 'Cơ quan quản lý nhà nước về an toàn thông tin trực thuộc Bộ TT&TT',
        trustStatus: 'verified'
      }
    });
    console.log('Created sample Source');
  }

  // 4. Create Sample Articles
  const catAlert = categories.find(c => c.slug === 'canh-bao-lua-dao');
  if (catAlert) {
    const articleCount = await prisma.article.count({
      where: { categoryId: catAlert.id }
    });

    if (articleCount === 0) {
      await prisma.article.create({
        data: {
          title: 'Cảnh báo cuộc gọi lừa đảo mạo danh cơ quan công an kích hoạt VNeID',
          slug: 'canh-bao-cuoc-goi-lua-dao-mao-danh-cong-an-vneid',
          summary: 'Kẻ gian gọi điện tự xưng là cán bộ công an phường/quận yêu cầu người dân cài đặt ứng dụng VNeID giả mạo nhằm chiếm đoạt tài khoản ngân hàng.',
          content: '<p>Cục An toàn thông tin đưa ra cảnh báo khẩn cấp về thủ đoạn mạo danh công an hướng dẫn cài đặt ứng dụng dịch vụ công giả mạo...</p>',
          contentType: 'html',
          categoryId: catAlert.id,
          tags: ['lua dao', 'vneid', 'mao danh'],
          warningLevel: 'warning',
          sourceId: sampleSource ? sampleSource.id : null,
          sourceUrl: 'https://ais.gov.vn/canh-bao/vneid-mao-danh',
          authorId: adminUser.id,
          status: 'published',
          isFeatured: true
        }
      });
      console.log('Created sample Article');
    }
  }

  // 5. Create Sample Scam Reports
  const reportCount = await prisma.scamReport.count();
  if (reportCount === 0) {
    await prisma.scamReport.createMany({
      data: [
        {
          reporterName: 'Nguyễn Văn A',
          contact: '0987654321',
          caseType: 'Lừa đảo tài chính',
          platform: 'Zalo',
          suspectPhone: '0912345678',
          suspectAccount: '1903xxx Techcombank',
          description: 'Đối tượng nhắn tin mạo danh ngân hàng gửi link giả mạo yêu cầu nhập OTP nhận quà khuyến mãi Tết.',
          location: 'Hà Nội',
          attachments: [],
          status: 'pending',
          riskLevel: 'medium'
        },
        {
          reporterName: 'Trần Thị B',
          contact: 'tranb@gmail.com',
          caseType: 'Mạo danh người thân',
          platform: 'Facebook Messenger',
          suspectUrl: 'https://facebook.com/hacker.profile.123',
          description: 'Hacker chiếm đoạt tài khoản Facebook của con gái tôi rồi nhắn tin mượn 20 triệu đồng chuyển khoản gấp.',
          location: 'TP. Hồ Chí Minh',
          attachments: [],
          status: 'checking',
          riskLevel: 'high'
        }
      ]
    });
    console.log('Created sample Scam Reports');
  }

  // 6. Create Default Settings
  const settingsData = [
    { key: 'site_name', value: 'Lá Chắn Số', type: 'string' },
    { key: 'support_hotline', value: '1900 xxxx', type: 'string' },
    { key: 'support_email', value: 'contact@lanchanso.vn', type: 'string' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean' }
  ];

  for (const set of settingsData) {
    const existingSet = await prisma.setting.findUnique({
      where: { key: set.key }
    });

    if (!existingSet) {
      await prisma.setting.create({ data: set });
      console.log(`Created Setting: ${set.key}`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
