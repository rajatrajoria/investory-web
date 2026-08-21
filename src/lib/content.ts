import { execute, query, queryOne } from "./db";

export type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  published: number;
};

export type Testimonial = {
  id: number;
  name: string;
  role_company: string | null;
  quote: string;
  photo_url: string | null;
  display_order: number;
  published: number;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FormSubmission = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  ip_address: string | null;
  email_sent: number;
  read_at: string | null;
  created_at: string;
};

// ---------- Site settings ----------

const SETTINGS_DEFAULTS: Record<string, string> = {
  site_name: "Investory",
  tagline: "Wealth management built on trust, not templates",
  hero_headline: "Your money deserves a plan, not a guess.",
  hero_subtext:
    "Investory is an Odisha-based wealth management practice helping individuals and families turn income into lasting financial security.",
  about_text: "",
  founded_year: "2019",
  families_served: "11",
  contact_email: "ramankhandelwal@investory.co.in",
  contact_phone: "+91 9437692692",
  contact_hours: "10:00 AM – 4:00 PM",
  contact_location: "Odisha, India",
  advisor_name: "Raman Khandelwal",
  hero_image_url: "",
  advisor_photo_url: "",
};

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await query<{ setting_key: string; setting_value: string }>(
    `SELECT setting_key, setting_value FROM site_settings`
  );
  const settings = { ...SETTINGS_DEFAULTS };
  for (const row of rows) settings[row.setting_key] = row.setting_value;
  return settings;
}

export async function updateSiteSettings(
  values: Record<string, string>
): Promise<void> {
  const entries = Object.entries(values);
  for (const [key, value] of entries) {
    await execute(
      `INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [key, value, value]
    );
  }
}

// ---------- Services ----------

export async function listServices(opts: { publishedOnly?: boolean } = {}): Promise<Service[]> {
  const where = opts.publishedOnly ? "WHERE published = 1" : "";
  return query<Service>(
    `SELECT * FROM services ${where} ORDER BY display_order ASC, id ASC`
  );
}

export async function getService(id: number): Promise<Service | null> {
  return queryOne<Service>(`SELECT * FROM services WHERE id = ?`, [id]);
}

type ServiceInput = Omit<Service, "id" | "published"> & { published: boolean | number };

export async function createService(data: ServiceInput): Promise<number> {
  const result = await execute(
    `INSERT INTO services (title, description, icon, display_order, published) VALUES (?, ?, ?, ?, ?)`,
    [data.title, data.description, data.icon, data.display_order, data.published ? 1 : 0]
  );
  return result.insertId;
}

export async function updateService(id: number, data: ServiceInput): Promise<void> {
  await execute(
    `UPDATE services SET title = ?, description = ?, icon = ?, display_order = ?, published = ? WHERE id = ?`,
    [data.title, data.description, data.icon, data.display_order, data.published ? 1 : 0, id]
  );
}

export async function deleteService(id: number): Promise<void> {
  await execute(`DELETE FROM services WHERE id = ?`, [id]);
}

// ---------- Testimonials ----------

export async function listTestimonials(
  opts: { publishedOnly?: boolean } = {}
): Promise<Testimonial[]> {
  const where = opts.publishedOnly ? "WHERE published = 1" : "";
  return query<Testimonial>(
    `SELECT * FROM testimonials ${where} ORDER BY display_order ASC, id ASC`
  );
}

export async function getTestimonial(id: number): Promise<Testimonial | null> {
  return queryOne<Testimonial>(`SELECT * FROM testimonials WHERE id = ?`, [id]);
}

type TestimonialInput = {
  name: string;
  role_company?: string | null;
  quote: string;
  photo_url?: string | null;
  display_order: number;
  published: boolean | number;
};

export async function createTestimonial(
  data: TestimonialInput
): Promise<number> {
  const result = await execute(
    `INSERT INTO testimonials (name, role_company, quote, photo_url, display_order, published) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.role_company || null,
      data.quote,
      data.photo_url || null,
      data.display_order,
      data.published ? 1 : 0,
    ]
  );
  return result.insertId;
}

export async function updateTestimonial(
  id: number,
  data: TestimonialInput
): Promise<void> {
  await execute(
    `UPDATE testimonials SET name = ?, role_company = ?, quote = ?, photo_url = ?, display_order = ?, published = ? WHERE id = ?`,
    [
      data.name,
      data.role_company || null,
      data.quote,
      data.photo_url || null,
      data.display_order,
      data.published ? 1 : 0,
      id,
    ]
  );
}

export async function deleteTestimonial(id: number): Promise<void> {
  await execute(`DELETE FROM testimonials WHERE id = ?`, [id]);
}

// ---------- Blog posts ----------

export async function listBlogPosts(
  opts: { publishedOnly?: boolean; limit?: number } = {}
): Promise<BlogPost[]> {
  const where = opts.publishedOnly ? "WHERE status = 'published'" : "";
  const limit = opts.limit ? `LIMIT ${Number(opts.limit)}` : "";
  return query<BlogPost>(
    `SELECT * FROM blog_posts ${where} ORDER BY published_at DESC, created_at DESC ${limit}`
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return queryOne<BlogPost>(`SELECT * FROM blog_posts WHERE slug = ?`, [slug]);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  return queryOne<BlogPost>(`SELECT * FROM blog_posts WHERE id = ?`, [id]);
}

type BlogPostInput = {
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  tags?: string | null;
  status: "draft" | "published";
  published_at: string | null;
};

export async function createBlogPost(data: BlogPostInput): Promise<number> {
  const result = await execute(
    `INSERT INTO blog_posts
      (slug, title, excerpt, content, cover_image, meta_title, meta_description, tags, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.slug,
      data.title,
      data.excerpt || null,
      data.content,
      data.cover_image || null,
      data.meta_title || null,
      data.meta_description || null,
      data.tags || null,
      data.status,
      data.published_at,
    ]
  );
  return result.insertId;
}

export async function updateBlogPost(id: number, data: BlogPostInput): Promise<void> {
  await execute(
    `UPDATE blog_posts SET
      slug = ?, title = ?, excerpt = ?, content = ?, cover_image = ?,
      meta_title = ?, meta_description = ?, tags = ?, status = ?, published_at = ?
     WHERE id = ?`,
    [
      data.slug,
      data.title,
      data.excerpt || null,
      data.content,
      data.cover_image || null,
      data.meta_title || null,
      data.meta_description || null,
      data.tags || null,
      data.status,
      data.published_at,
      id,
    ]
  );
}

export async function deleteBlogPost(id: number): Promise<void> {
  await execute(`DELETE FROM blog_posts WHERE id = ?`, [id]);
}

// ---------- Form submissions ----------

export async function createFormSubmission(data: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  ip_address: string | null;
  email_sent: boolean;
}): Promise<number> {
  const result = await execute(
    `INSERT INTO form_submissions (name, email, phone, message, ip_address, email_sent) VALUES (?, ?, ?, ?, ?, ?)`,
    [data.name, data.email, data.phone, data.message, data.ip_address, data.email_sent ? 1 : 0]
  );
  return result.insertId;
}

export async function listFormSubmissions(): Promise<FormSubmission[]> {
  return query<FormSubmission>(`SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT 200`);
}

export async function markSubmissionRead(id: number): Promise<void> {
  await execute(`UPDATE form_submissions SET read_at = NOW() WHERE id = ? AND read_at IS NULL`, [id]);
}
