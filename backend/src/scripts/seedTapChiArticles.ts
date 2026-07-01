import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting TapChiAnNinhMang articles seeding...');

  // 1. Get the admin author
  const author = await prisma.user.findFirst({
    where: { role: 'super_admin' }
  });

  if (!author) {
    console.error('Error: No super_admin user found to assign as author. Run core seed first.');
    process.exit(1);
  }

  // 2. Find or create the Source
  let source = await prisma.source.findFirst({
    where: { name: 'Tạp chí An ninh mạng' }
  });

  if (!source) {
    source = await prisma.source.create({
      data: {
        name: 'Tạp chí An ninh mạng',
        type: 'Báo chí',
        website: 'https://tapchianninhmang.vn',
        description: 'Tuyên truyền, phổ biến chủ trương đường lối của Đảng, chính sách pháp luật của Nhà nước về an ninh mạng; thông tin khoa học, công nghệ, nghiệp vụ về bảo vệ an ninh mạng.',
        trustStatus: 'verified'
      }
    });
    console.log('Created source: Tạp chí An ninh mạng');
  }

  // 3. Find categories
  const catCanhBao = await prisma.category.findUnique({ where: { slug: 'canh-bao-lua-dao' } });
  const catAnNinh = await prisma.category.findUnique({ where: { slug: 'an-ninh-mang' } });

  if (!catCanhBao || !catAnNinh) {
    console.error('Error: Categories "canh-bao-lua-dao" or "an-ninh-mang" not found. Run core seed first.');
    process.exit(1);
  }

  // 4. Articles details from tapchianninhmang.vn
  const articlesToSeed = [
    {
      title: 'Giả mạo thông báo VETC, ePass để chiếm đoạt tài khoản',
      slug: 'gia-mao-thong-bao-vetc-epass-de-chiem-doat-tai-khoan',
      summary: 'Lợi dụng sự phổ biến của các dịch vụ thu phí không dừng VETC và ePass, các đối tượng lừa đảo đã phát tán tin nhắn giả mạo nhằm dẫn dụ người dùng truy cập website giả, cung cấp thông tin ngân hàng và mã xác thực nhằm chiếm đoạt tài sản.',
      categoryId: catCanhBao.id,
      warningLevel: 'warning',
      tags: ['vetc', 'epass', 'tin nhắn giả mạo', 'phishing'],
      sourceUrl: 'https://tapchianninhmang.vn/gia-mao-thong-bao-vetc-epass-de-chiem-doat-tai-khoan',
      isHero: true,
      isFeatured: true,
      content: `
        <p>Trong thời gian gần đây, tình trạng giả mạo tin nhắn thông báo thu phí không dừng để lừa đảo chiếm đoạt tài sản tiếp tục diễn biến phức tạp, gây thiệt hại cho nhiều người dân. Các đối tượng lợi dụng sự phổ biến của dịch vụ thu phí tự động không dừng như VETC, ePass để thực hiện hành vi đánh cắp thông tin tài khoản ngân hàng và chiếm đoạt tiền của nạn nhân.</p>
        
        <h3>Thao túng tâm lý bằng tin nhắn giả mạo</h3>
        <p>Người dân thường nhận được tin nhắn SMS với nội dung thông báo tài khoản giao thông bị khóa, thiếu số dư hoặc phát sinh khoản phí cần thanh toán khẩn cấp. Đáng chú ý, các tin nhắn này có thể hiển thị tên thương hiệu tương tự các đơn vị cung cấp dịch vụ chính thức, khiến người dùng dễ nhầm tưởng là thông báo thật.</p>
        <p>Theo phân tích từ các chuyên gia an ninh mạng, tội phạm mạng đã tinh vi thao túng tâm lý người dân bằng cách tạo ra các tình huống bất ngờ, buộc người điều khiển phương tiện phải hành động ngay lập tức dưới áp lực sợ bị gián đoạn hành trình hoặc bị phạt hành chính.</p>
        
        <h3>Quy trình chiếm đoạt chuyên nghiệp</h3>
        <p>Sau khi thiết lòng tin ban đầu, đối tượng yêu cầu người dùng truy cập vào các đường link lạ để “xác minh”, “nạp tiền” hoặc “thanh toán phí”. Quy trình chiếm đoạt của các nhóm tội phạm công nghệ cao được thực hiện qua các bước bài bản:</p>
        <ul>
          <li><strong>Giăng bẫy giao diện trực quan:</strong> Các website giả mạo được thiết kế với giao diện gần giống trang chính thức của dịch vụ thu phí không dừng nhằm tạo sự tin tưởng.</li>
          <li><strong>Đánh cắp thông tin bảo mật:</strong> Tại đây, nạn nhân bị yêu cầu nhập thông tin tài khoản ngân hàng, thông tin thẻ, mật khẩu, mã OTP hoặc cài đặt ứng dụng không rõ nguồn gốc.</li>
          <li><strong>Rút cạn tiền trong tài khoản:</strong> Khi có được thông tin bảo mật, các đối tượng nhanh chóng thực hiện các giao dịch nhằm chiếm đoạt tiền trong tài khoản ngân hàng của nạn nhân.</li>
        </ul>

        <h3>Quy tắc “3 không” để phòng tránh rủi ro</h3>
        <p>Chuyên gia An ninh mạng khuyến nghị người dân áp dụng quy tắc "3 không" sau đây:</p>
        <ol>
          <li><strong>Không nhấn link lạ:</strong> Tuyệt đối không truy cập các đường link được gửi qua SMS, Zalo, Messenger hoặc email không rõ nguồn gốc.</li>
          <li><strong>Không cung cấp thông tin bảo mật:</strong> Không chia sẻ mật khẩu, mã OTP, thông tin thẻ ngân hàng hoặc thông tin đăng nhập cho bất kỳ cá nhân, tổ chức nào.</li>
          <li><strong>Không sử dụng kênh giao dịch không chính thức:</strong> Chỉ kiểm tra tài khoản và thực hiện nạp tiền thông qua ứng dụng chính thức hoặc các kênh thanh toán uy tín của đơn vị cung cấp dịch vụ.</li>
        </ol>
      `
    },
    {
      title: 'Đặt phòng khách sạn bằng mã QR, người phụ nữ sập bẫy lừa đảo',
      slug: 'dat-phong-khach-san-bang-ma-qr-nguoi-phu-nu-sap-bay-lua-dao',
      summary: 'Khi đặt phòng khách sạn tại đặc khu Côn Đảo (TPHCM), một người phụ nữ đã bị các đối tượng lừa đảo trực tuyến dẫn dụ quét mã QR trên ứng dụng MoMo, chiếm đoạt gần 50 triệu đồng.',
      categoryId: catCanhBao.id,
      warningLevel: 'urgent',
      tags: ['mã qr', 'momo', 'đặt phòng khách sạn', 'lừa đảo'],
      sourceUrl: 'https://tapchianninhmang.vn/dat-phong-khach-san-bang-ma-qr-nguoi-phu-nu-sap-bay-lua-dao',
      isHero: false,
      isFeatured: true,
      isSubHero: true,
      content: `
        <p>Sự việc xảy ra khi một người phụ nữ liên hệ đặt phòng khách sạn tại Côn Đảo thông qua một trang mạng xã hội. Các đối tượng lừa đảo đóng vai nhân viên tư vấn nhiệt tình, sau đó gửi một mã QR và đề xuất nạn nhân thực hiện quét mã thông qua ứng dụng ví điện tử MoMo để hoàn tất thủ tục giữ chỗ và nhận ưu đãi giảm giá.</p>
        <p>Tuy nhiên, sau khi thực hiện thao tác quét mã QR theo chỉ dẫn, thay vì hiển thị hóa đơn thanh toán thông thường, mã QR này thực chất là một liên kết ủy quyền thanh toán tự động hoặc kết nối tài khoản. Chỉ trong vài phút, toàn bộ số tiền gần 50 triệu đồng trong tài khoản ngân hàng liên kết với ví của nạn nhân đã bị trừ sạch.</p>
        
        <h3>Chiêu thức lừa đảo tinh vi bằng mã QR</h3>
        <p>Theo chuyên gia bảo mật, mã QR bản chất chỉ là đường link rút gọn hiển thị dưới dạng hình ảnh. Kẻ gian thường lợi dụng việc người dùng khó nhận biết nội dung ẩn sau mã QR bằng mắt thường để thực hiện các thủ đoạn:</p>
        <ul>
          <li>Giả mạo mã QR thanh toán của cửa hàng, khách sạn hoặc nhà xe.</li>
          <li>Gửi mã QR chứa mã độc để cài đặt âm thầm lên điện thoại của nạn nhân.</li>
          <li>Dẫn dụ quét mã QR đăng nhập tài khoản Zalo, Telegram nhằm chiếm quyền điều khiển.</li>
        </ul>

        <h3>Khuyến cáo phòng ngừa</h3>
        <p>Người dân cần đặc biệt cảnh giác khi giao dịch bằng mã QR:</p>
        <ul>
          <li>Luôn xác thực lại thông tin tài khoản thụ hưởng trước khi bấm xác nhận chuyển tiền.</li>
          <li>Không quét các mã QR nhận từ người lạ hoặc qua tin nhắn không rõ nguồn gốc.</li>
          <li>Chỉ thực hiện thanh toán qua các cổng thanh toán chính thức đã được tích hợp sẵn trên website hoặc ứng dụng chính thống của đơn vị dịch vụ.</li>
        </ul>
      `
    },
    {
      title: 'Cảnh giác thủ đoạn lừa đảo qua loa báo tiền, mã QR và máy Smart POS',
      slug: 'canh-giac-thu-doan-lua-dao-qua-loa-bao-tien-ma-qr-va-may-smart-pos',
      summary: 'Sự phổ biến của thanh toán không dùng tiền mặt đang bị các đối tượng lừa đảo lợi dụng để tạo giao dịch giả, giả âm thanh báo nhận tiền và giả màn hình chuyển khoản thành công.',
      categoryId: catCanhBao.id,
      warningLevel: 'warning',
      tags: ['loa báo tiền', 'smart pos', 'mã qr', 'thanh toán điện tử'],
      sourceUrl: 'https://tapchianninhmang.vn/canh-giac-thu-doan-lua-dao-qua-loa-bao-tien-ma-qr-va-may-smart-pos',
      isHero: false,
      isFeatured: false,
      isSubHero: true,
      content: `
        <p>Sự phổ biến của thanh toán không dùng tiền mặt đang bị các đối tượng lừa đảo lợi dụng triệt để. Tại các cửa hàng kinh doanh, kẻ gian đã chế tạo các thiết bị giả âm thanh loa báo tiền, hoặc cố ý dán đè mã QR của mình lên mã QR thật của cửa hàng để chiếm đoạt tiền thanh toán từ khách.</p>
        <p>Ngoài ra, một thủ đoạn phổ biến khác là đối tượng tạo biên lai chuyển khoản giả bằng các ứng dụng hoặc website tạo hóa đơn giao dịch ngân hàng giả mạo (Fake Bill). Sau khi mua hàng, chúng đưa màn hình chuyển khoản thành công cho chủ cửa hàng xem nhằm qua mắt nhanh chóng rồi rời đi.</p>

        <h3>Cách phòng tránh dành cho các chủ hộ kinh doanh</h3>
        <ul>
          <li><strong>Xác thực tài khoản ngay lập tức:</strong> Luôn kiểm tra biến động số dư trên ứng dụng ngân hàng của chính mình, không tin vào hình ảnh biên lai do khách cung cấp.</li>
          <li><strong>Bảo vệ mã QR tại quầy:</strong> Đặt mã QR thanh toán tại vị trí dễ quan sát, có màng bảo vệ hoặc kiểm tra thường xuyên xem có bị dán đè hay không.</li>
          <li><strong>Sử dụng loa báo tiền chính chủ:</strong> Chỉ sử dụng thiết bị phát âm thanh báo tiền do ngân hàng hoặc đơn vị trung gian thanh toán uy tín cung cấp và được liên kết trực tiếp với tài khoản nhận tiền.</li>
        </ul>
      `
    },
    {
      title: 'Mạo danh phần mềm bảo mật uy tín để chiếm đoạt tài sản',
      slug: 'canh-giac-thu-doan-mao-danh-cong-ty-bao-mat-de-chiem-doat-tai-san',
      summary: 'Nhiều thương hiệu bảo mật uy tín như Kaspersky, Norton, McAfee bị giả mạo để cài mã độc, chiếm quyền thiết bị và đánh cắp tài khoản ngân hàng người dùng.',
      categoryId: catCanhBao.id,
      warningLevel: 'warning',
      tags: ['kaspersky', 'norton', 'phần mềm độc hại', 'chiếm đoạt'],
      sourceUrl: 'https://tapchianninhmang.vn/canh-giac-thu-doan-mao-danh-cong-ty-bao-mat-de-chiem-doat-tai-san',
      isHero: false,
      isFeatured: false,
      content: `
        <p>Lợi dụng tâm lý muốn bảo vệ máy tính và điện thoại của người dùng, tội phạm mạng đã xây dựng các trang web giả mạo những thương hiệu bảo mật nổi tiếng thế giới như Kaspersky, McAfee, Norton. Khi người dùng tải về phần mềm diệt virus từ các trang web giả này, họ thực chất đang cài đặt các phần mềm độc hại (malware) hoặc mã độc gián điệp.</p>
        <p>Sau khi được kích hoạt, mã độc này âm thầm ghi lại thao tác bàn phím (keylogger), đánh cắp mật khẩu đăng nhập, cookie trình duyệt và mã xác thực ngân hàng rồi gửi về máy chủ của kẻ tấn công.</p>

        <h3>Cách tải phần mềm an toàn</h3>
        <ul>
          <li>Chỉ tải ứng dụng và phần mềm từ trang chủ chính thức của nhà sản xuất (ví dụ: kaspersky.com, norton.com).</li>
          <li>Đối với điện thoại di động, chỉ tải app thông qua Google Play Store hoặc Apple App Store chính thống.</li>
          <li>Cảnh giác với các email quảng cáo tặng key bản quyền miễn phí kèm tệp đính kèm .exe hoặc .dmg.</li>
        </ul>
      `
    },
    {
      title: 'Báo động tình trạng lộ lọt dữ liệu cá nhân trên không gian mạng',
      slug: 'bao-dong-tinh-trang-lo-lot-du-lieu-ca-nhan-tren-khong-gian-mang',
      summary: 'Vụ án "hợp đồng kỳ nghỉ" không chỉ thiệt hại về số tiền chiếm đoạt được từ các nạn nhân mà còn gióng lên hồi chuông cảnh báo về tình trạng lộ lọt, mua bán dữ liệu cá nhân trên không gian mạng.',
      categoryId: catAnNinh.id,
      warningLevel: 'notice',
      tags: ['lộ lọt dữ liệu', 'dữ liệu cá nhân', 'an ninh thông tin'],
      sourceUrl: 'https://tapchianninhmang.vn/bao-dong-tinh-trang-lo-lot-du-lieu-ca-nhan-tren-khong-gian-mang',
      isHero: false,
      isFeatured: true,
      content: `
        <p>Vấn nạn mua bán và lộ lọt dữ liệu cá nhân đang ngày càng trở nên nhức nhối tại Việt Nam. Nhiều vụ án lừa đảo chiếm đoạt tài sản quy mô lớn cho thấy, các đối tượng phạm tội có thể dễ dàng mua lại danh sách hàng nghìn số điện thoại, họ tên, email, nghề nghiệp và thu nhập của người dân từ thị trường chợ đen.</p>
        <p>Dữ liệu này bị thu thập từ các hành vi hack hệ thống của doanh nghiệp, do nhân viên nội bộ bán ra ngoài, hoặc do chính người dân thiếu cảnh giác khi đăng ký thông tin trên các website khuyến mãi ảo hoặc tờ khai không rõ nguồn gốc.</p>

        <h3>Biện pháp bảo vệ dữ liệu cá nhân</h3>
        <ul>
          <li>Hạn chế chia sẻ thông tin cá nhân như số điện thoại, CCCD lên mạng xã hội hoặc các trang web lạ.</li>
          <li>Sử dụng các mật khẩu mạnh và kích hoạt bảo mật hai lớp (2FA) cho toàn bộ tài khoản mạng xã hội cũng như hòm thư điện tử cá nhân.</li>
          <li>Không đồng ý cung cấp quyền truy cập danh bạ, vị trí cho các ứng dụng di động nếu không thật sự cần thiết cho tính năng cốt lõi của app.</li>
        </ul>
      `
    },
    {
      title: 'Làn sóng lừa đảo công nghệ cao bùng phát mạnh mẽ',
      slug: 'lan-song-lua-djao-cong-nghe-cao-bung-phat-dip-he',
      summary: 'Dịp hè, nhiều chiêu trò lừa đảo công nghệ cao bùng phát, từ giả mạo tuyển dụng, du lịch giá rẻ đến các khóa học kỹ năng ảo để chiếm đoạt tài sản.',
      categoryId: catCanhBao.id,
      warningLevel: 'warning',
      tags: ['lừa đảo công nghệ cao', 'du lịch giá rẻ', 'tuyển dụng giả'],
      sourceUrl: 'https://tapchianninhmang.vn/lan-song-lua-djao-cong-nghe-cao-bung-phat-dip-he',
      isHero: false,
      isFeatured: false,
      content: `
        <p>Cơ quan an ninh mạng cảnh báo về làn sóng lừa đảo công nghệ cao nhắm vào các gia đình và người lao động. Phổ biến nhất là chiêu trò quảng cáo combo du lịch giá rẻ cực sốc, sau đó yêu cầu khách chuyển khoản đặt cọc rồi cắt liên lạc.</p>
        <p>Kế đến là các chương trình khóa học hè, "Trại hè quân đội" hoặc khóa tu học giả mạo Fanpage của các chùa lớn hay đơn vị quân đội để yêu cầu nộp học phí và mua trang phục tập thể. Ngoài ra, việc lừa đảo tuyển dụng cộng tác viên xử lý đơn hàng online tại nhà vẫn tiếp tục tìm kiếm nạn nhân mới.</p>

        <h3>Lời khuyên phòng tránh</h3>
        <ul>
          <li>Chỉ giao dịch du lịch với các công ty lữ hành uy tín, có giấy phép hoạt động và địa chỉ văn phòng rõ ràng.</li>
          <li>Xác minh trực tiếp với các đơn vị tổ chức khóa học qua số hotline chính thức trước khi chuyển học phí.</li>
          <li>Tuyệt đối không tham gia các công việc yêu cầu phải tự bỏ tiền mua hàng trước để nhận lại hoa hồng.</li>
        </ul>
      `
    }
  ];

  // 5. Upsert articles using Prisma
  for (const art of articlesToSeed) {
    const dataObj = {
      title: art.title,
      summary: art.summary,
      content: art.content.trim(),
      contentType: 'html',
      categoryId: art.categoryId,
      tags: art.tags,
      warningLevel: art.warningLevel,
      sourceId: source.id,
      sourceUrl: art.sourceUrl,
      authorId: author.id,
      status: 'published',
      isHero: art.isHero || false,
      isSubHero: art.isSubHero || false,
      isFeatured: art.isFeatured || false,
      showOnHome: true,
      publishedAt: new Date()
    };

    const seeded = await prisma.article.upsert({
      where: { slug: art.slug },
      update: dataObj,
      create: {
        slug: art.slug,
        ...dataObj
      }
    });

    console.log(`Seeded/Updated article: ${seeded.title} (${seeded.slug})`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
