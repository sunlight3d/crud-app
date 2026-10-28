-- ========================================================
-- SUPABASE SEED DATA FOR CRUD APP
-- Dữ liệu fake mẫu phong phú về thiết bị công nghệ & khóa học
-- ========================================================

INSERT INTO public.products (name, category, price, stock, status, description, image_url)
VALUES
(
    'MacBook Pro 16" M3 Max',
    'Laptops',
    3499.00,
    12,
    'in_stock',
    'Chip M3 Max 16-core CPU, 40-core GPU, 36GB Unified Memory, 1TB SSD. Màn hình Liquid Retina XDR.',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60'
),
(
    'Dell XPS 15 OLED InfinityEdge',
    'Laptops',
    2199.00,
    4,
    'low_stock',
    'Intel Core i9-13900H, RTX 4070 8GB, 32GB RAM, 1TB SSD. Màn hình cảm ứng 3.5K OLED rực rỡ.',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60'
),
(
    'Khóa học Next.js 15 & Clean Architecture',
    'Đào tạo IT',
    199.00,
    50,
    'in_stock',
    'Khóa học thực chiến xây dựng ứng dụng Web quy mô lớn với Next.js, Clean Architecture, Supabase & Vercel.',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
),
(
    'LG UltraFine 27" 4K Nano IPS',
    'Màn hình',
    649.00,
    18,
    'in_stock',
    'Độ phân giải 3840x2160, DCI-P3 98%, HDR400, cổng kết nối USB-C 90W PD, chân đế Ergonomic xoay gập linh hoạt.',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60'
),
(
    'Bàn phím cơ Keychron Q1 Pro Wireless',
    'Phụ kiện',
    210.00,
    25,
    'in_stock',
    'Khung nhôm CNC nguyên khối, gasket mount, kết nối Bluetooth 5.1 & Type-C, hot-swap, QMK/VIA keymap.',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=60'
),
(
    'Chuột Logitech MX Master 3S',
    'Phụ kiện',
    119.00,
    3,
    'low_stock',
    'Cảm biến 8000 DPI Darkfield, con lăn MagSpeed tĩnh âm 90%, kết nối 3 thiết bị cùng lúc với Logitech Flow.',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=60'
),
(
    'Khóa học Vibe Coding & AI Agents',
    'Đào tạo IT',
    249.00,
    0,
    'out_of_stock',
    'Làm chủ kỹ thuật Vibe Coding, tương tác cùng LLMs, AI DevTools và triển khai Microservices siêu tốc.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60'
),
(
    'Tai nghe Sony WH-1000XM5',
    'Âm thanh',
    399.00,
    15,
    'in_stock',
    'Chống ồn đỉnh cao Auto NC Optimizer, 8 micro beamforming, pin 30 giờ, hỗ trợ Hi-Res Audio Wireless LDAC.',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60'
),
(
    'Server Edge AI Jetson Orin Nano',
    'Thiết bị AI',
    499.00,
    7,
    'in_stock',
    'Hiệu năng AI lên tới 40 TOPS, 8GB RAM 128-bit LPDDR5, kiến trúc Ampere phục vụ suy luận mô hình AI cục bộ.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60'
),
(
    'Ổ cứng SSD di động Samsung T9 2TB',
    'Lưu trữ',
    239.00,
    2,
    'low_stock',
    'Tốc độ đọc/ghi tuần tự lên đến 2,000 MB/s qua USB 3.2 Gen 2x2, chống va đập từ độ cao 3 mét, mã hóa phần cứng AES 256-bit.',
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=60'
),
(
    'Gói Cloud Supabase Pro Voucher 1 Year',
    'Dịch vụ Cloud',
    300.00,
    20,
    'in_stock',
    'Tài nguyên 8GB DB, 100GB Storage, 250,000 MAU, tự động backup hàng ngày, hỗ trợ dự án sản xuất lớn.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
),
(
    'Micro thu âm Shure MV7+ Podcast',
    'Âm thanh',
    299.00,
    9,
    'in_stock',
    'Micro dynamic chuyên nghiệp kép XLR & USB-C, tích hợp DSP khử ồn kỹ thuật số, dải LED RGB tùy chỉnh.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60'
);
