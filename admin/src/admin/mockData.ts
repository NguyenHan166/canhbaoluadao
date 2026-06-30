import { Category } from '../types';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'docx';
  size: string;
  createdAt: string;
  uploadedBy: string;
  folder: string;
  altText?: string;
  caption?: string;
}

export interface NewsSource {
  id: string;
  name: string;
  type: 'government' | 'press' | 'bank' | 'security' | 'other';
  website: string;
  description: string;
  trustedStatus: 'verified' | 'normal' | 'unverified';
  logoUrl?: string;
  notes?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'reviewer' | 'reporter_manager' | 'viewer';
  status: 'active' | 'suspended';
  avatarUrl?: string;
  permissions: string[];
}

export interface WebsiteSettings {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    zalo: string;
  };
  footerContent: string;
  privacyPolicy: string;
  termsOfUse: string;
  disclaimer: string;
  seoTitleDefault: string;
  seoDescriptionDefault: string;
}

export const INITIAL_MEDIA_FILES: MediaFile[] = [
  {
    id: 'm-1',
    name: 'canh_bao_vneid_gia_mao.png',
    url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '1.2 MB',
    createdAt: '2026-06-25',
    uploadedBy: 'nvhan166@gmail.com',
    folder: '/uploads/articles/2026/06',
    altText: 'Cảnh báo dịch vụ công VNeID giả mạo',
    caption: 'Giao diện ứng dụng dịch vụ công giả mạo để lấy cắp thông tin người dân'
  },
  {
    id: 'm-2',
    name: 'lua_dao_tuyen_ctv.jpg',
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '850 KB',
    createdAt: '2026-06-28',
    uploadedBy: 'nvhan166@gmail.com',
    folder: '/uploads/articles/2026/06',
    altText: 'Chiêu trò tuyển cộng tác viên Shopee lừa đảo',
    caption: 'Ảnh chụp màn hình nhóm Telegram lừa đảo làm nhiệm vụ Shopee'
  },
  {
    id: 'm-3',
    name: 'gia_mao_shipper_cod.jpg',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '430 KB',
    createdAt: '2026-06-29',
    uploadedBy: 'nvhan166@gmail.com',
    folder: '/uploads/scam-alerts',
    altText: 'Giả danh shipper giao hàng lừa tiền ship',
    caption: 'Shipper giả mạo gọi điện yêu cầu chuyển khoản tiền đơn hàng COD'
  },
  {
    id: 'm-4',
    name: 'huong_dan_an_toan_so.pdf',
    url: '#',
    type: 'pdf',
    size: '4.5 MB',
    createdAt: '2026-06-12',
    uploadedBy: 'nvhan166@gmail.com',
    folder: '/uploads/documents',
    altText: 'Cẩm nang an toàn số cho người dân',
    caption: 'Tài liệu hướng dẫn bảo mật thông tin cá nhân cơ bản'
  },
  {
    id: 'm-5',
    name: 'banner_la_chan_so_hero.png',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    type: 'image',
    size: '2.1 MB',
    createdAt: '2026-06-01',
    uploadedBy: 'nvhan166@gmail.com',
    folder: '/uploads/banners',
    altText: 'Banner chính Lá Chắn Số',
    caption: 'Banner trang chủ của hệ thống cổng thông tin Lá Chắn Số'
  }
];

export const INITIAL_NEWS_SOURCES: NewsSource[] = [
  {
    id: 'src-1',
    name: 'Cục An toàn thông tin - Bộ TT&TT',
    type: 'government',
    website: 'https://ais.gov.vn',
    description: 'Cơ quan quản lý nhà nước về an toàn thông tin mạng tại Việt Nam, đầu mối phát ngôn cảnh báo quốc gia.',
    trustedStatus: 'verified',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Ưu tiên lấy thông tin làm nguồn chính thức'
  },
  {
    id: 'src-2',
    name: 'Bộ Công An - Cổng thông tin điện tử',
    type: 'government',
    website: 'https://mps.gov.vn',
    description: 'Cung cấp tin tức chính thống về phòng chống tội phạm công nghệ cao và các vụ án lừa đảo đã triệt phá.',
    trustedStatus: 'verified',
    logoUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Tin tức án sự và thủ đoạn tinh vi'
  },
  {
    id: 'src-3',
    name: 'Trung tâm Giám sát an toàn không gian mạng quốc gia (NCSC)',
    type: 'government',
    website: 'https://khonggianmang.vn',
    description: 'Hệ thống kỹ thuật giám sát thông tin mạng, cảnh báo mã độc, IP độc hại, tên miền lừa đảo.',
    trustedStatus: 'verified',
    logoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=150&h=150&q=80',
    notes: 'Thông tin kỹ thuật, tên miền giả mạo'
  },
  {
    id: 'src-4',
    name: 'Báo điện tử VnExpress',
    type: 'press',
    website: 'https://vnexpress.net',
    description: 'Trang báo điện tử có lượng truy cập lớn nhất Việt Nam, đưa tin nhanh về đời sống, pháp luật.',
    trustedStatus: 'normal',
    logoUrl: '',
    notes: 'Tham khảo tin nhanh'
  },
  {
    id: 'src-5',
    name: 'Hiệp hội An toàn thông tin Việt Nam (VNISA)',
    type: 'security',
    website: 'https://vnisa.org.vn',
    description: 'Tổ chức xã hội nghề nghiệp phi lợi nhuận thúc đẩy phát triển an toàn thông tin.',
    trustedStatus: 'normal',
    logoUrl: '',
    notes: 'Cẩm nang đào tạo kỹ năng số'
  }
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'u-1',
    name: 'Nguyễn Văn Hân',
    email: 'nvhan166@gmail.com',
    role: 'super_admin',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=nvhan',
    permissions: ['all']
  },
  {
    id: 'u-2',
    name: 'Lê Minh Tuấn',
    email: 'tuanlm@lanchanso.gov.vn',
    role: 'editor',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tuanlm',
    permissions: ['create_post', 'edit_post', 'manage_media']
  },
  {
    id: 'u-3',
    name: 'Trần Thị Mai',
    email: 'maitt@lanchanso.gov.vn',
    role: 'reviewer',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=maitt',
    permissions: ['edit_post', 'publish_post', 'view_reports']
  },
  {
    id: 'u-4',
    name: 'Hoàng Xuân Bách',
    email: 'bachhx@lanchanso.gov.vn',
    role: 'reporter_manager',
    status: 'active',
    avatarUrl: 'https://api.dicebear.com/7.x/adventurer/svg?seed=bachhx',
    permissions: ['view_reports', 'verify_reports', 'create_post']
  }
];

export const INITIAL_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'Lá Chắn Số',
  logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=60&h=60&q=80',
  faviconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=32&h=32&q=80',
  description: 'Cổng thông tin Quốc gia về An ninh mạng, Cảnh báo lừa đảo trực tuyến và Cẩm nang An toàn số cho người dân Việt Nam.',
  contactEmail: 'lienhe@lanchanso.gov.vn',
  contactPhone: '1900.566.566',
  socialLinks: {
    facebook: 'https://facebook.com/lanchanso.gov',
    youtube: 'https://youtube.com/c/lanchanso.gov',
    zalo: 'https://zalo.me/lanchanso.gov'
  },
  footerContent: '© 2026 Lá Chắn Số - Hệ thống cảnh báo & cổng thông tin an ninh mạng phi lợi nhuận hỗ trợ bảo vệ công dân trên môi trường số. Vận hành bởi Ban Chỉ đạo An toàn Thông tin Quốc gia.',
  privacyPolicy: 'Chính sách bảo mật thông tin cá nhân khi người dân gửi báo cáo tin nhắn, số điện thoại hoặc tên miền lừa đảo. Cam kết bảo mật danh tính tuyệt đối.',
  termsOfUse: 'Điều khoản sử dụng hệ thống tra cứu nhanh, gửi báo cáo và chia sẻ kiến thức cộng đồng.',
  disclaimer: 'Thông tin cảnh báo trên trang được tổng hợp từ nguồn chính thống và báo cáo của người dân đã qua xác minh kỹ thuật. Chúng tôi miễn trừ mọi trách nhiệm pháp lý phát sinh từ việc sử dụng thông tin sai mục đích.',
  seoTitleDefault: 'Lá Chắn Số - Phòng chống lừa đảo trực tuyến và An toàn thông tin mạng',
  seoDescriptionDefault: 'Cổng thông tin hỗ trợ người dân tra cứu số điện thoại lừa đảo, tài khoản ngân hàng lừa đảo, tên miền giả mạo và học các kỹ năng tự bảo vệ mình trên không gian mạng.'
};
