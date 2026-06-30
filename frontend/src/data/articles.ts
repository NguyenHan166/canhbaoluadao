/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article, ScamReport, SafetyTip } from '../types';

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'CẢNH BÁO: Kịch bản giả danh Cơ quan Công an gọi điện đe dọa, yêu cầu cài đặt ứng dụng Dịch vụ công giả mạo',
    slug: 'gia-danh-cong-an-cai-dat-dich-vu-cong-gia-mao',
    summary: 'Nhiều người dân bị chiếm đoạt toàn bộ tiền trong tài khoản ngân hàng sau khi nghe điện thoại từ người tự xưng là cán bộ công an phường, quận yêu cầu cập nhật định danh VNeID bằng cách tải ứng dụng qua link lạ.',
    category: 'canh-bao-lua-dao',
    categoryLabel: 'Cảnh báo lừa đảo',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80', // cybersecurity background
    author: 'Cục An toàn thông tin',
    date: '29 Th06, 2026',
    readTime: '5 phút đọc',
    views: 12450,
    isHero: true,
    warningLevel: 'critical',
    sourceName: 'Cổng thông tin Cục An toàn thông tin - Bộ TT&TT',
    sourceUrl: 'https://ais.gov.vn',
    quickSummaryPoints: [
      'Kẻ gian gọi điện tự xưng là Công an, yêu cầu hỗ trợ sửa thông tin định danh cấp độ 2 hoặc cập nhật dịch vụ công.',
      'Yêu cầu nạn nhân tải ứng dụng ".APK" giả mạo dịch vụ công qua link do chúng cung cấp.',
      'Khi cài ứng dụng, mã độc sẽ kiểm soát thiết bị, tự động chuyển toàn bộ tiền trong các app ngân hàng của nạn nhân.'
    ],
    tactics: [
      'Sử dụng số điện thoại rác hoặc đầu số giả mạo gọi điện tạo lòng tin.',
      'Đọc đúng thông tin cá nhân của nạn nhân (họ tên, số CCCD) thu thập từ các vụ lộ lọt dữ liệu để tăng mức độ uy tín.',
      'Dùng giọng điệu nghiêm nghị, hối thúc, đe dọa nếu không làm ngay sẽ bị khóa tài khoản hoặc xử phạt hành chính.'
    ],
    signs: [
      'Yêu cầu tải ứng dụng ngoài cửa hàng chính thức (không tải từ CH Play hay App Store mà bắt tải link trực tiếp .apk).',
      'Yêu cầu cấp quyền trợ năng (Accessibility Service) trên điện thoại Android.',
      'Cuộc gọi tự xưng cơ quan nhà nước nhưng lại làm việc qua Zalo, gửi link tải phần mềm qua tin nhắn chat.'
    ],
    prevention: [
      'Tuyệt đối không làm việc với cơ quan chức năng qua điện thoại. Cơ quan công an luôn mời làm việc bằng văn bản hoặc mời trực tiếp tại trụ sở.',
      'Không tải và cài đặt bất kỳ ứng dụng nào từ nguồn ngoài cửa hàng chính thức.',
      'Không cung cấp quyền trợ năng hoặc quyền quản lý thiết bị cho các app lạ.'
    ],
    content: '',
    whatToDoIfScammed: [
      'Lập tức ngắt kết nối mạng Internet (Wifi, 3G/4G) hoặc tắt nguồn điện thoại bị nhiễm mã độc để ngăn kẻ gian tiếp tục điều khiển từ xa.',
      'Dùng thiết bị an toàn khác liên hệ ngay hotline ngân hàng để yêu cầu khóa khẩn cấp tất cả tài khoản, dịch vụ ngân hàng điện tử.',
      'Trình báo sự việc ngay tới cơ quan Công an nơi gần nhất hoặc gửi báo cáo phản ánh lên trang Lá Chắn Số để được hỗ trợ cảnh báo cộng đồng.'
    ]
  },
  {
    id: 'art-2',
    title: 'Sập bẫy lừa đảo "Tuyển cộng tác viên việc nhẹ lương cao" chuyển tiền làm nhiệm vụ giật đơn hàng',
    slug: 'sap-bay-tuyen-cong-tac-vien-lam-nhiem-vu-shopee-tiki',
    summary: 'Chiêu trò tuyển cộng tác viên xử lý đơn hàng ảo cho các sàn thương mại điện tử lớn tiếp tục biến tướng, khiến hàng loạt nạn nhân mất từ vài chục triệu đến hàng tỷ đồng.',
    category: 'canh-bao-lua-dao',
    categoryLabel: 'Cảnh báo lừa đảo',
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', // shopping payment screen
    author: 'Hệ thống Cảnh báo Quốc gia',
    date: '28 Th06, 2026',
    readTime: '4 phút đọc',
    views: 8920,
    isSubHero: true,
    warningLevel: 'high',
    sourceName: 'Cơ quan Cảnh sát Điều tra',
    sourceUrl: '',
    quickSummaryPoints: [
      'Kẻ lừa đảo tuyển nhân viên làm việc tại nhà, hứa hẹn hoa hồng từ 10% - 20% mỗi đơn hàng.',
      'Vài đơn hàng đầu tiên giá trị nhỏ được hoàn tiền và hoa hồng đầy đủ để tạo lòng tin.',
      'Các đơn hàng sau có giá trị lớn hơn, kẻ lừa đảo đưa ra nhiều lý do (lỗi cú pháp, quá hạn) để giữ tiền và ép đóng thêm tiền để "rút hệ thống".'
    ],
    tactics: [
      'Chạy quảng cáo rầm rộ trên Facebook, TikTok với tiêu đề hấp dẫn như "mẹ bỉm sữa kiếm 300k/ngày", "việc nhẹ tại nhà".',
      'Đưa nạn nhân vào nhóm chat Telegram có sẵn hàng chục tài khoản "chim mồi" liên tục khoe ảnh nhận được tiền để tạo hiệu ứng tâm lý đám đông.',
      'Dùng hợp đồng cam kết giả mạo có đóng dấu đỏ của các sàn thương mại lớn.'
    ],
    signs: [
      'Yêu cầu người lao động phải chuyển tiền cá nhân để thanh toán đơn hàng trước rồi mới nhận hoàn tiền.',
      'Các tài khoản nhận tiền đều là tài khoản cá nhân, liên tục thay đổi sau mỗi lượt giao dịch.',
      'Hối thúc chuyển khoản nhanh để không bị hủy đơn hàng hoặc mất quyền nhận hoa hồng.'
    ],
    prevention: [
      'Không tham gia vào các nhóm tuyển dụng yêu cầu nạp tiền hoặc thanh toán đơn hàng trước.',
      'Tìm hiểu kỹ thông tin đơn vị tuyển dụng qua các kênh chính thức. Các sàn TMĐT lớn như Shopee, Lazada không bao giờ tuyển cộng tác viên theo hình thức này.',
      'Cảnh giác với những lời mời chào công việc có thu nhập quá cao so với mặt bằng chung mà không yêu cầu chuyên môn.'
    ],
    whatToDoIfScammed: [
      'Ngừng chuyển thêm tiền ngay lập tức dưới bất kỳ lý do gì. Kẻ lừa đảo sẽ tiếp tục vẽ ra các lỗi đóng thuế, phí bảo trì để bắt nạp thêm tiền.',
      'Sao lưu toàn bộ tin nhắn trò chuyện, số tài khoản nhận tiền, tên tài khoản Telegram của kẻ lừa đảo làm bằng chứng pháp lý.',
      'Nộp đơn tố giác tội phạm kèm theo chứng từ chuyển tiền tới Cơ quan công an gần nhất.'
    ]
  },
  {
    id: 'art-3',
    title: 'Thủ đoạn lừa đảo "Giả mạo nhân viên giao hàng - Shipper" yêu cầu chuyển khoản tiền ship rồi biến mất',
    slug: 'thu-doan-gia-mao-shipper-lua-giao-hang-cod',
    summary: 'Lợi dụng thói quen mua sắm online thường xuyên của người dân, kẻ gian theo dõi các buổi livestream bán hàng hoặc hack thông tin đơn hàng, đóng vai shipper gọi điện lừa đảo.',
    category: 'canh-bao-lua-dao',
    categoryLabel: 'Cảnh báo lừa đảo',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80', // delivery box
    author: 'Công an TP. Hà Nội',
    date: '27 Th06, 2026',
    readTime: '3 phút đọc',
    views: 7420,
    isSubHero: true,
    warningLevel: 'medium',
    sourceName: 'Cổng thông tin Công an Thành phố',
    quickSummaryPoints: [
      'Kẻ lừa đảo lấy thông tin địa chỉ, số điện thoại từ các bình luận mua hàng công khai trên mạng xã hội.',
      'Gọi điện xưng là shipper, báo có đơn hàng COD cần giao gấp nhưng do nạn nhân vắng nhà nên bảo chuyển khoản để gửi hàng cho bảo vệ hoặc hàng xóm.',
      'Sau khi nạn nhân chuyển khoản xong, chúng tắt máy chặn liên lạc hoặc gửi tiếp link giả mạo báo lỗi nhận tiền.'
    ],
    tactics: [
      'Chọn thời điểm giờ hành chính khi nạn nhân đang bận đi làm để gọi điện hối thúc.',
      'Đọc chính xác tên và địa chỉ của nạn nhân để lấy lòng tin tối đa.',
      'Sử dụng nhiều tài khoản ngân hàng rác để nhận các khoản tiền nhỏ từ 100.000đ đến vài triệu đồng từ hàng trăm người.'
    ],
    signs: [
      'Yêu cầu chuyển tiền thanh toán khi hàng chưa được giao trực tiếp vào tay hoặc chưa thấy hàng thực tế.',
      'Gọi điện dồn dập, giục giã và từ chối chụp ảnh kiện hàng gửi qua tin nhắn khi được yêu cầu.',
      'Gửi một đường link lạ bảo là "link xác nhận đã thanh toán" hoặc "link nhận voucher giảm giá giao hàng".'
    ],
    prevention: [
      'Luôn đối chiếu đơn hàng trên app mua sắm chính thức trước khi nhận cuộc gọi giao hàng.',
      'Chỉ chuyển khoản thanh toán khi trực tiếp nhìn thấy kiện hàng hoặc nhận hàng từ shipper quen thuộc.',
      'Hạn chế bình luận thông tin cá nhân (SĐT, địa chỉ) công khai dưới các bài đăng bán hàng trực tuyến.'
    ],
    whatToDoIfScammed: [
      'Liên hệ ngay với hotline của đơn vị vận chuyển chính thức (Giao Hàng Tiết Kiệm, VNPost, Viettel Post,...) để phản ánh đầu số lừa đảo.',
      'Cảnh báo cho người nhà, bảo vệ khu chung cư tuyệt đối không nhận hộ các đơn hàng chưa được xác nhận rõ ràng.',
      'Báo cáo số điện thoại nghi ngờ lên hệ thống để chúng tôi ghi nhận vào danh sách đen.'
    ]
  },
  {
    id: 'art-4',
    title: 'Cách thiết lập bảo mật 2 lớp (2FA) chống hack tài khoản Facebook, Zalo, Telegram hiệu quả 100%',
    slug: 'cach-thiet-lap-bao-mat-2-lop-chong-hack-tai-khoan',
    summary: 'Nếu chỉ sử dụng mật khẩu thông thường, tài khoản của bạn rất dễ bị chiếm đoạt qua các cuộc tấn công lừa đảo phishing hoặc lộ mật khẩu. Hãy thực hiện ngay 3 bước bảo vệ sau.',
    category: 'meo-huu-ich',
    categoryLabel: 'Mẹo hữu ích',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80', // lock mobile secure
    author: 'Chuyên gia Lá Chắn Số',
    date: '29 Th06, 2026',
    readTime: '6 phút đọc',
    views: 15820,
    quickSummaryPoints: [
      'Xác thực 2 lớp (2FA) yêu cầu một mã phụ dùng một lần khi đăng nhập thiết bị mới.',
      'Nên sử dụng ứng dụng tạo mã như Google Authenticator hoặc Microsoft Authenticator thay vì nhận SMS OTP thông thường.',
      'Cần lưu giữ kỹ các mã khôi phục dự phòng ở nơi an toàn.'
    ],
    content: '',
    tactics: [
      'Bài viết hướng dẫn chi tiết từng bước bằng hình ảnh dễ hiểu, phù hợp cho cả người lớn tuổi sử dụng điện thoại thông minh.'
    ],
    signs: [
      'Đăng nhập tài khoản thấy thông báo từ thiết bị lạ ở địa phương khác.',
      'Nhận được tin nhắn SMS chứa mã kích hoạt hoặc OTP dù bản thân không thực hiện thao tác đăng nhập.'
    ],
    prevention: [
      'Kích hoạt bảo mật 2 lớp trong phần Cài đặt > Bảo mật của mọi tài khoản MXH.',
      'Sử dụng ứng dụng Authenticator để tránh nguy cơ bị hack sim chiếm đoạt OTP.',
      'Thiết lập mã khóa màn hình ứng dụng (đặc biệt là Telegram và Zalo).'
    ],
    whatToDoIfScammed: [
      'Nếu tài khoản bị chiếm đoạt, nhanh chóng sử dụng tính năng "Quên mật khẩu" và dùng email khôi phục hoặc số điện thoại chính chủ để giật lại quyền truy cập.',
      'Đăng xuất khỏi tất cả các thiết bị khác trong phần cài đặt bảo mật.',
      'Cảnh báo ngay trên trang cá nhân hoặc gọi điện trực tiếp cho bạn bè, người thân để họ biết tài khoản đang bị hack, tránh việc kẻ gian giả mạo bạn đi vay tiền.'
    ]
  },
  {
    id: 'art-5',
    title: 'Cảnh giác bẫy cuộc gọi Deepface AI mạo danh người thân để vay tiền khẩn cấp',
    slug: 'canh-giac-bay-cuoc-goi-deepface-ai-mao-danh-nguoi-than',
    summary: 'Công nghệ trí tuệ nhân tạo Deepfake giờ đây có thể giả dạng giọng nói và khuôn mặt của người thân trong vài giây ngắn ngủi, đánh lừa nạn nhân chuyển tiền vì tai nạn hoặc việc khẩn.',
    category: 'kien-thuc',
    categoryLabel: 'Kiến thức số',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80', // futuristic robotics/AI
    author: 'Phòng An ninh mạng - Bộ Công an',
    date: '25 Th06, 2026',
    readTime: '5 phút đọc',
    views: 11040,
    quickSummaryPoints: [
      'Kẻ xấu sử dụng hình ảnh, video thu thập trên mạng xã hội để tạo ra video Deepfake giả dạng người thân.',
      'Thực hiện cuộc gọi video qua Messenger, Zalo với tín hiệu chập chờn, gián đoạn để lấp liếm lỗi đồ họa AI.',
      'Yêu cầu nạn nhân chuyển khoản gấp vào tài khoản lạ do tài khoản người thân đang lỗi hoặc bị khóa.'
    ],
    tactics: [
      'Tạo bối cảnh giả lập như đang ở bệnh viện, đồn công an hoặc sân bay cực kỳ ồn ào để tạo lý do cúp máy nhanh.',
      'Sử dụng các phần mềm nhân bản giọng nói dựa trên các đoạn ghi âm ngắn của người thân.'
    ],
    signs: [
      'Khuôn mặt trong cuộc gọi video có biểu cảm đơ cứng, cử động môi không khớp với lời nói.',
      'Ánh sáng trên khuôn mặt không tự nhiên, màu da loang lổ hoặc bị nhòe xung quanh viền tóc, cổ.',
      'Yêu cầu chuyển tiền vào một tài khoản ngân hàng không trùng tên với người thân.'
    ],
    prevention: [
      'Tạo một "mật khẩu gia đình" (một câu hỏi bảo mật riêng tư chỉ người trong nhà biết) để xác minh danh tính khi có cuộc gọi khẩn cấp vay tiền.',
      'Tắt cuộc gọi trực tiếp và chủ động gọi lại bằng số điện thoại di động thông thường, không gọi qua app chat mạng xã hội.',
      'Hạn chế chia sẻ các video quay cận mặt, clip ghi âm giọng nói chất lượng cao lên trang cá nhân ở chế độ công khai.'
    ],
    whatToDoIfScammed: [
      'Báo ngay cho người thân bị mạo danh để họ kiểm tra lại thiết bị và tài khoản xã hội của mình.',
      'Ghi âm hoặc quay phim màn hình cuộc gọi lừa đảo làm tài liệu nộp cho cơ quan an ninh.',
      'Liên hệ ngay với chi nhánh ngân hàng nhận tiền để yêu cầu hỗ trợ phong tỏa tài khoản lừa đảo nếu thực hiện chuyển khoản trong vòng vài phút đầu.'
    ]
  },
  {
    id: 'art-6',
    title: 'Học cách nhận biết Link Phishing (Liên kết giả mạo) trong 10 giây tránh mất mật khoản ngân hàng',
    slug: 'hoc-cach-nhan-biet-link-phishing-gia-mao-ngan-hang',
    summary: 'Chỉ một cú click chuột vào đường dẫn giả mạo có giao diện giống hệt ngân hàng có thể khiến bạn mất toàn bộ thông tin đăng nhập và mã khóa an toàn.',
    category: 'meo-huu-ich',
    categoryLabel: 'Mẹo hữu ích',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', // matrix code cybersecurity
    author: 'Hiệp hội An toàn thông tin VN (VNISA)',
    date: '24 Th06, 2026',
    readTime: '4 phút đọc',
    views: 14200,
    quickSummaryPoints: [
      'Kẻ gian đổi một vài ký tự trong tên miền chính thức để đánh lừa thị giác (ví dụ: vcb-nhan-qua.com thay vì vietcombank.com).',
      'Luôn kiểm tra kỹ giao thức kết nối HTTPS và biểu tượng ổ khóa an toàn trên trình duyệt.',
      'Không bao giờ click vào link gửi qua SMS quảng cáo không rõ nguồn gốc.'
    ],
    tactics: [
      'Gửi SMS brandname giả mạo chèn vào cùng luồng tin nhắn thật của ngân hàng.',
      'Thiết kế giao diện đăng nhập giả mạo giống 99.9% so với trang web thật để người dùng không mảy may nghi ngờ.'
    ],
    signs: [
      'Đường dẫn URL chứa nhiều ký tự lạ hoặc có đuôi tên miền bất thường như .cc, .top, .xyz, .site, .app.',
      'Trang web yêu cầu nhập thông tin nhạy cảm ngay lập tức (nhập mật khẩu kèm theo luôn cả mã OTP).'
    ],
    prevention: [
      'Sử dụng các trình duyệt hiện đại có tính năng cảnh báo an toàn cao như Chrome, Safari hoặc cài đặt các tiện ích mở rộng bảo vệ thông tin.',
      'Nhập trực tiếp địa chỉ trang web ngân hàng thay vì nhấn vào link được chia sẻ hoặc tìm kiếm trên Google.'
    ],
    whatToDoIfScammed: [
      'Nếu lỡ nhập mật khẩu vào trang giả mạo, hãy lập tức truy cập ứng dụng chính thức của ngân hàng và đổi mật khẩu ngay lập tức.',
      'Sử dụng tính năng khóa thẻ/khóa tài khoản tạm thời ngay trên ứng dụng ngân hàng di động.',
      'Theo dõi sát sao biến động số dư và thông báo khẩn cho đường dây nóng ngân hàng hỗ trợ xử lý.'
    ]
  },
  {
    id: 'art-7',
    title: 'Cổng thông tin an toàn số quốc gia chính thức đưa vào hoạt động công cụ tra cứu số tài khoản lừa đảo',
    slug: 'dua-vao-hoat-dong-cong-cu-tra-cuu-tai-khoan-lua-dao',
    summary: 'Nhằm siết chặt an toàn giao dịch trực tuyến, công cụ tra cứu công khai danh sách các số tài khoản ngân hàng từng bị phản ánh lừa đảo đã chính thức hoạt động.',
    category: 'an-ninh-mang',
    categoryLabel: 'An ninh mạng',
    thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80', // financial secure
    author: 'Ban Biên Tập Lá Chắn Số',
    date: '23 Th06, 2026',
    readTime: '3 phút đọc',
    views: 6150,
    quickSummaryPoints: [
      'Công cụ cho phép tra cứu miễn phí mọi số tài khoản trước khi thực hiện giao dịch mua bán.',
      'Dữ liệu được cập nhật liên tục từ báo cáo của người dân đã qua xác minh từ cơ quan chức năng.',
      'Góp phần đẩy lùi nạn mua bán tài khoản ngân hàng rác hiện nay.'
    ],
    content: '',
    prevention: [
      'Luôn có thói quen tra cứu số điện thoại và số tài khoản trước khi thực hiện giao dịch với người lạ trực tuyến.'
    ]
  },
  {
    id: 'art-8',
    title: 'Hơn 500 người cao tuổi tại địa phương được tuyên truyền, hướng dẫn kỹ năng phòng chống lừa đảo trên không gian mạng',
    slug: 'tuyen-truyen-ky-nang-phong-chong-lua-dao-cho-nguoi-cao-tuoi',
    summary: 'Chiến dịch phổ cập kỹ năng số và an toàn thông tin cộng đồng đã tổ chức các buổi tập huấn thực tế, giúp người cao tuổi dễ dàng nhận biết và cảnh giác trước các bẫy tâm lý phổ biến.',
    category: 'cong-dong',
    categoryLabel: 'Cộng đồng',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', // seniors learning technology/tablet
    author: 'Đoàn Thanh Niên Tuyên Truyền',
    date: '22 Th06, 2026',
    readTime: '4 phút đọc',
    views: 5200,
    quickSummaryPoints: [
      'Người cao tuổi là đối tượng trọng điểm của các nhóm lừa đảo qua điện thoại vì tâm lý dễ lo lắng, sợ hãi.',
      'Chương trình trực tiếp cầm tay chỉ việc hướng dẫn người cao tuổi bật bảo mật Zalo, chặn cuộc gọi từ số lạ.',
      'Phát hành cẩm nang in chữ lớn, hình ảnh sinh động gửi đến từng hộ gia đình.'
    ],
    content: '',
    prevention: [
      'Con cháu trong gia đình cần thường xuyên trò chuyện, chia sẻ các thông tin cảnh báo mới nhất cho ông bà, cha mẹ.',
      'Cài đặt chế độ lọc cuộc gọi rác và thiết lập mật khẩu ứng dụng an toàn cho người cao tuổi.'
    ]
  }
];

export const MOCK_REPORTS: ScamReport[] = [
  {
    id: 'rep-1',
    userId: 'goog_han',
    ticketId: 'LCS-582914',
    statusMessage: 'Đã hoàn tất kiểm chứng và xác minh. Số điện thoại giả mạo (0948.112.334) đã được gửi báo cáo lên Cục Viễn thông - Bộ TT&TT để đưa vào danh sách đen ngăn chặn.',
    reporterName: 'Nguyễn Văn Hân',
    reporterContact: 'nvhan166@gmail.com',
    scamType: 'Giả mạo cơ quan Công an',
    platform: 'call',
    targetInfo: '0948.112.334 (Tự xưng Đại úy Lê Tuấn Anh)',
    description: 'Đối tượng gọi điện bảo tôi liên quan đến đường dây mua bán ma túy và rửa tiền xuyên quốc gia. Đọc đúng số CCCD của tôi và yêu cầu tôi tải app "Cổng dịch vụ công Bộ Công an" qua link ".apk" để khai báo tài sản. Tôi sinh nghi nên tắt máy gọi điện thoại lên phường xác minh thì biết là lừa đảo.',
    location: 'Quận 1, TP. Hồ Chí Minh',
    createdAt: '29 Th06, 2026 - 11:24',
    status: 'verified',
    likesCount: 142,
    commentsCount: 28
  },
  {
    id: 'rep-2',
    ticketId: 'LCS-192834',
    statusMessage: 'Hồ sơ đang điều tra phối hợp lực lượng An ninh mạng. Cục An toàn thông tin đã gửi yêu cầu gỡ bỏ fanpage giả mạo đến Meta (Facebook) để ngăn chặn phát tán quảng cáo lừa đảo.',
    reporterName: 'Trần Thị M.',
    reporterContact: 't***m@gmail.com',
    scamType: 'Tuyển CTV giật đơn hàng Shopee',
    platform: 'facebook',
    targetInfo: 'Fanpage tuyển dụng "Cơ Hội Việc Làm Tại Nhà 24h"',
    description: 'Tôi nhấn vào quảng cáo và được đưa vào một nhóm Telegram. Ban đầu làm nhiệm vụ nạp 100k, 200k được rút cả gốc lẫn lãi 10%. Đến nhiệm vụ thứ 4 nạp 5 triệu, họ bảo lỗi cú pháp không rút được, ép phải nạp thêm 15 triệu để mở khóa. Biết bị lừa tôi đòi lại thì bị kích ra khỏi nhóm.',
    location: 'Huyện Gia Lâm, Hà Nội',
    createdAt: '29 Th06, 2026 - 09:15',
    status: 'verified',
    likesCount: 98,
    commentsCount: 45
  },
  {
    id: 'rep-3',
    userId: 'goog_han',
    ticketId: 'LCS-374829',
    statusMessage: 'Đã chuyển tiếp thông tin tài khoản ngân hàng thụ hưởng lừa đảo đến Hiệp hội Ngân hàng Việt Nam để phối hợp rà soát, phong tỏa tài khoản đáng ngờ trên toàn hệ thống.',
    reporterName: 'Nguyễn Văn Hân',
    reporterContact: 'nvhan166@gmail.com',
    scamType: 'Giả mạo Shipper giao hàng COD',
    platform: 'call',
    targetInfo: '0812.990.221 (Shipper ảo)',
    description: 'Tự xưng là shipper Giao Hàng Tiết Kiệm, đọc đúng địa chỉ nhà và bảo có đơn hàng 320.000đ cần nhận hộ. Do tôi đi làm nên bảo chuyển khoản để gửi bảo vệ. Chuyển khoản xong tôi nhắn tin cho bảo vệ hỏi thì bảo vệ nói không thấy ai giao. Gọi lại số shipper thì đã thuê bao chặn số.',
    location: 'Quận Ngũ Hành Sơn, Đà Nẵng',
    createdAt: '28 Th06, 2026 - 16:40',
    status: 'verified',
    likesCount: 56,
    commentsCount: 12
  },
  {
    id: 'rep-4',
    ticketId: 'LCS-901844',
    statusMessage: 'Hệ thống đã cập nhật cảnh báo nguy hiểm đối với website này. Đã gửi đề xuất chặn DNS khẩn cấp tới Trung tâm Internet Việt Nam (VNNIC) để ngắt hoàn toàn truy cập.',
    reporterName: 'Ẩn danh',
    scamType: 'Website đầu tư tài chính giả mạo',
    platform: 'website',
    targetInfo: 'http://dv-crypto-invest-gold.top',
    description: 'Trang web kêu gọi đầu tư sinh lời 30% mỗi ngày qua việc mua bán vàng ảo. Giao diện cực kỳ sơ sài, nạp tiền vào nhanh nhưng khi rút thì hệ thống luôn báo lỗi bảo trì hệ thống và bắt nộp phí xác minh 20% giá trị tài khoản. Mọi người tuyệt đối tránh xa link này.',
    location: 'Cộng đồng mạng',
    createdAt: '28 Th06, 2026 - 10:05',
    status: 'attention',
    likesCount: 78,
    commentsCount: 19
  },
  {
    id: 'rep-5',
    ticketId: 'LCS-221094',
    statusMessage: 'Đang tiến hành rà soát các tài khoản tương tự trên nền tảng Zalo. Khuyến nghị người dùng bật tính năng xác thực hai lớp (2FA) để tránh bị chiếm quyền kiểm soát.',
    reporterName: 'Phạm Minh T.',
    reporterContact: '097****889',
    scamType: 'Mạo danh người thân nhắn tin mượn tiền',
    platform: 'zalo',
    targetInfo: 'Tài khoản Zalo "Hương Giang" (nhái avatar em gái tôi)',
    description: 'Đối tượng tạo tài khoản Zalo y hệt em gái tôi từ hình ảnh đến tên hiển thị, sau đó nhắn tin bảo điện thoại bị hư không gọi được, nhờ tôi chuyển khoản gấp 3 triệu đóng tiền học cho con vì đang bận họp. Tôi gọi điện thoại sim thường trực tiếp cho em gái thì em bảo đang ở cơ quan không nhắn gì cả.',
    location: 'TP. Biên Hòa, Đồng Nai',
    createdAt: '27 Th06, 2026 - 14:12',
    status: 'verified',
    likesCount: 110,
    commentsCount: 34
  },
  {
    id: 'rep-6',
    ticketId: 'LCS-648102',
    statusMessage: 'Đang rà soát và kiểm tra kỹ thuật đầu số điện thoại phát tán cuộc gọi rác để xử lý theo Nghị định 91/2020/NĐ-CP về phòng chống tin nhắn rác, thư điện tử rác, cuộc gọi rác.',
    reporterName: 'Nguyễn Thu T.',
    scamType: 'Cuộc gọi thông báo "Khóa sim sau 2 tiếng"',
    platform: 'call',
    targetInfo: '0901.884.223 (Băng ghi âm tự động)',
    description: 'Một số điện thoại di động gọi đến bật băng ghi âm tự động nói số thuê bao của tôi sẽ bị khóa sau 2 giờ vì vi phạm thông tin thuê bao, yêu cầu bấm phím 9 để gặp cán bộ xử lý. Tôi bấm thử thì nghe tiếng người đòi hỏi cung cấp số CCCD, tài khoản để hỗ trợ mở khóa. Biết lừa đảo nên tôi cúp máy.',
    location: 'Quận Ninh Kiều, Cần Thơ',
    createdAt: '27 Th06, 2026 - 08:30',
    status: 'pending',
    likesCount: 24,
    commentsCount: 5
  }
];

export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: 'tip-1',
    title: 'Quy tắc 3 Không phòng tránh 99% vụ lừa đảo mạng',
    icon: 'ShieldAlert',
    summary: 'Áp dụng quy tắc vàng này giúp bạn bảo vệ an toàn cho bản thân và gia đình trước mọi cuộc gọi hay tin nhắn bất thường.',
    points: [
      'KHÔNG chuyển tiền cho bất kỳ ai tự xưng là cơ quan công an, tòa án, viện kiểm sát qua điện thoại.',
      'KHÔNG cung cấp mật khẩu, mã OTP, mã xác nhận hoặc thông tin đăng nhập ngân hàng cho bất kỳ đường link lạ nào.',
      'KHÔNG cài đặt ứng dụng không rõ nguồn gốc nằm ngoài kho ứng dụng chính chủ App Store và CH Play.'
    ]
  },
  {
    id: 'tip-2',
    title: 'Cách kiểm tra Website / Đường link an toàn',
    icon: 'Link',
    summary: 'Trước khi click vào đường dẫn nhận được từ tin nhắn SMS, Facebook hoặc email, hãy rèn luyện thói quen tự kiểm tra nhanh.',
    points: [
      'Quan sát kỹ tên miền (domain): Kẻ xấu thường dùng tên miền gần giống như vietcombank-gift.com thay vì vietcombank.com.vn.',
      'Kiểm tra chứng chỉ bảo mật: Địa chỉ web phải bắt đầu bằng "https://" và có biểu tượng hình chiếc khóa ở thanh địa chỉ.',
      'Sử dụng công cụ kiểm tra nhanh của Lá Chắn Số để đối chiếu với cơ sở dữ liệu các website lừa đảo đã bị ghi nhận.'
    ]
  },
  {
    id: 'tip-3',
    title: 'Cách xử lý khẩn cấp khi nghi ngờ bị lừa mất tiền',
    icon: 'Zap',
    summary: 'Hành động nhanh trong 5-15 phút đầu tiên quyết định khả năng ngăn chặn thiệt hại tài chính của bạn.',
    points: [
      'Liên hệ NGAY hotline ngân hàng của bạn, yêu cầu KHÓA TẠM THỜI dịch vụ Internet Banking và thẻ tín dụng.',
      'Đổi mật khẩu ngay lập tức ở thiết bị an toàn khác nếu bạn lỡ nhập mật khẩu vào trang web nghi vấn.',
      'Nếu cài đặt app độc hại, ngắt kết nối mạng ngay lập tức và khôi phục cài đặt gốc của điện thoại.'
    ]
  }
];

export const SCAM_STATISTICS = {
  totalReportsThisWeek: 1840,
  verifiedScamsCount: 542,
  topTargetPlatforms: [
    { name: 'Mạng xã hội (FB, Zalo, Tiktok)', count: 820, percent: 45, color: 'bg-blue-600' },
    { name: 'Cuộc gọi điện thoại trực tiếp', count: 580, percent: 32, color: 'bg-teal-600' },
    { name: 'Tin nhắn SMS (Brandname giả)', count: 240, percent: 13, color: 'bg-amber-600' },
    { name: 'Website lừa đảo trực tuyến', count: 200, percent: 10, color: 'bg-rose-600' }
  ],
  topScamTypes: [
    { name: 'Giả danh Cơ quan chức năng', count: 420, trend: 'up' },
    { name: 'Tuyển CTV "Việc nhẹ lương cao"', count: 380, trend: 'up' },
    { name: 'Lừa đảo Shipper COD ảo', count: 310, trend: 'stable' },
    { name: 'Lừa đảo Đầu tư Tài chính sinh lời', count: 290, trend: 'up' },
    { name: 'Đánh cắp tài khoản (Mượn tiền hộ)', count: 240, trend: 'down' },
    { name: 'Lừa đảo nợ cước viễn thông/phạt nguội', count: 200, trend: 'down' }
  ],
  localTrends: [
    { region: 'Hà Nội', activeAlerts: 18, riskLevel: 'Cao' },
    { region: 'TP. Hồ Chí Minh', activeAlerts: 24, riskLevel: 'Cao' },
    { region: 'Đà Nẵng', activeAlerts: 7, riskLevel: 'Trung bình' },
    { region: 'Đồng Nai', activeAlerts: 9, riskLevel: 'Cao' },
    { region: 'Cần Thơ', activeAlerts: 6, riskLevel: 'Trung bình' }
  ]
};
