-- Investory web schema
-- Run once against a fresh database on GlobalHost:
--   mysql -u <user> -p <database> < schema.sql
-- All application queries are parameterized (mysql2 execute()) — this
-- schema itself doesn't grant anything beyond the app's own DB user needs.

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  totp_secret VARCHAR(64) NULL,
  totp_enabled TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin-uploaded images, stored as rows rather than disk files. At this
-- app's scale (a handful of site images: hero, advisor photo, testimonial
-- photos, blog covers) the database is a simpler and more reliable home
-- for them on shared hosting than a filesystem path — one less thing to
-- get shadowed, wiped, or made unwritable by a hosting environment this
-- app doesn't control. Served via /media/[id] with a long, immutable
-- cache lifetime: replacing an image always inserts a new row and a new
-- id, so a cached id never goes stale.
CREATE TABLE IF NOT EXISTS media (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  mime_type VARCHAR(60) NOT NULL,
  data LONGBLOB NOT NULL,
  width INT UNSIGNED NULL,
  height INT UNSIGNED NULL,
  size_bytes INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(40) NOT NULL DEFAULT 'sparkle',
  display_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  role_company VARCHAR(200) NULL,
  quote TEXT NOT NULL,
  photo_url VARCHAR(500) NULL,
  display_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(240) NOT NULL,
  excerpt VARCHAR(400) NULL,
  content MEDIUMTEXT NOT NULL,
  cover_image VARCHAR(500) NULL,
  meta_title VARCHAR(160) NULL,
  meta_description VARCHAR(200) NULL,
  tags VARCHAR(300) NULL,
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_published (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS form_submissions (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(40) NULL,
  message TEXT NOT NULL,
  ip_address VARCHAR(64) NULL,
  email_sent TINYINT(1) NOT NULL DEFAULT 0,
  read_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sliding-window rate limiter storage. `bucket_start` marks the start of
-- the current fixed window for (identifier, route); `count` increments
-- within that window. Old rows are pruned lazily by the limiter itself.
CREATE TABLE IF NOT EXISTS rate_limits (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  identifier VARCHAR(120) NOT NULL,
  route VARCHAR(80) NOT NULL,
  bucket_start DATETIME NOT NULL,
  count INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uniq_identifier_route_bucket (identifier, route, bucket_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tracks failed admin login attempts for exponential lockout, keyed by IP.
CREATE TABLE IF NOT EXISTS login_attempts (
  identifier VARCHAR(120) PRIMARY KEY,
  failed_count INT UNSIGNED NOT NULL DEFAULT 0,
  locked_until DATETIME NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data: the 8 real client testimonials, preserved verbatim from the
-- original site. Update photo_url later from the admin panel if desired.
INSERT INTO testimonials (name, role_company, quote, display_order) VALUES
('Sneha', 'Our First Client, Freelance Research Analyst, Kharagpur, WB', 'Investory has been an incredible partner since day one — the very first client to trust this journey, and that trust has only grown stronger with time.', 1),
('Nitin', 'KPMG Global Services, Pune, Maharashtra', 'I am delighted to have the opportunity to work with Investory as my financial advisor. They provide excellent advice on managing my cash flows and planning for the future well-being. With their extensive knowledge of the market, they are able to equip me with the necessary information to make the best decisions for my financial well-being. I highly recommend Investory to anyone in need of wealth management services.', 2),
('Mayank', 'RM, ARWL, Gurgaon, Haryana', 'Many advisors show you the dreams of compounding your wealth, but here is one (Raman) who makes that compounding come true for your wealth. You would meet many advisors who just tell you to invest in this or that financial product, but here is one who will manage your portfolio as if he is managing his own and that gives me immense trust on him as a wealth manager.', 3),
('Manila', 'Business Operations Analyst, Tech Mahindra, Noida', 'I met Raman at my MBA institute and have always known him as someone who was highly passionate and enthusiastic about investments, trading and financial planning. As a fresher in the corporate world, I was incognizant of investments, tax savings and effective money management, and I couldn''t have chosen anyone better than Raman. He has been handling my portfolio for over a year now, providing sound financial advice and guidance every step of the way.', 4),
('Ranjan', 'Self Employed, Balasore, Odisha', 'I am incredibly satisfied with the holistic wealth management services provided by Raman at Investory. His expertise, personalized approach, and attention to even the minutest of detail have significantly enhanced my portfolio. The level of professionalism and commitment to my financial well-being is truly commendable.', 5),
('Anamika', 'CRM, BW Associates, Gurgaon', 'From a skeptic to a believer — exceeded my expectations. Doubtful at first, but partnering with Investory proved to be a game-changer for my investments. Impressive service and remarkable portfolio growth.', 6),
('Yesu', 'Self Employed, Kharagpur, WB', 'I consider myself lucky that I came across Raman Khandelwal as my advisor. Thanks to him, my portfolio seems to be getting greener and stronger with time, and I will soon be financially free.', 7),
('Gaurav', 'Self Employed, Siliguri, WB', 'Raman is not only my friend but also my wealth manager who has helped me a lot with my investment plans. He explains why he is choosing a particular strategy in a way that even someone with no financial background can understand. He keeps me informed about market fluctuations and is always available whenever I need him.', 8)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed data: the real services offered
INSERT INTO services (title, description, icon, display_order) VALUES
('Financial Planning', 'Manage your finances and achieve your short-term and long-term goals — covering budgeting, saving, investing, and every other pillar of personal finance.', 'compass', 1),
('Long-Term Wealth Maximization', 'A focus on sustainable, long-term success over short-term profits — building value over time rather than chasing quick gains.', 'trending-up', 2),
('Retirement Planning', 'A well-thought-out plan for your retirement years, so you have the financial resources and security to enjoy a comfortable retirement.', 'sunrise', 3),
('Financial Independence', 'Accumulate the wealth and assets needed to cover your living expenses and maintain your desired lifestyle without depending on active employment.', 'shield-check', 4),
('Tax Optimization', 'Strategic investment choices that minimize tax impact and increase your post-tax returns.', 'calculator', 5),
('Risk Management', 'A balance between risk and return — maximizing wealth within a risk tolerance you are actually comfortable with, never taking excessive risks.', 'scale', 6)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed data: global site copy (editable from the admin panel afterwards)
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Investory'),
('tagline', 'Wealth management built on trust, not templates'),
('hero_headline', 'Your money deserves a plan, not a guess.'),
('hero_subtext', 'Investory is an Odisha-based wealth management practice helping individuals and families turn income into lasting financial security — through financial planning, retirement strategy, and long-term investing built around your life, not a product catalogue.'),
('about_text', 'Investory was founded in 2019 to simplify the complexities of finance for retail investors who deserve the same quality of advice as institutional clients. We work with corporate and non-corporate professionals, pre-retired and retired individuals, HNIs and UHNIs, and business owners across India — starting every relationship by understanding your vision for your future before recommending a single product.'),
('founded_year', '2019'),
('families_served', '11'),
('contact_email', 'ramankhandelwal@investory.co.in'),
('contact_phone', '+91 9437692692'),
('contact_hours', '10:00 AM – 4:00 PM'),
('contact_location', 'Odisha, India'),
('advisor_name', 'Raman Khandelwal')
ON DUPLICATE KEY UPDATE setting_key = VALUES(setting_key);
