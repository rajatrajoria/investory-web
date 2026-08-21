"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  createService,
  updateService,
  deleteService,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  updateSiteSettings,
  markSubmissionRead,
} from "@/lib/content";
import { serviceSchema, testimonialSchema, blogPostSchema, slugify } from "@/lib/validation";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/studio/login");
  return session;
}

function revalidatePublicPages() {
  for (const path of ["/", "/about", "/services", "/testimonials", "/blog"]) {
    revalidatePath(path);
  }
}

export type FormState = { error?: string } | undefined;

// ---------- Services ----------

export async function saveServiceAction(
  id: number | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();

  const parsed = serviceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    image_url: formData.get("image_url"),
    display_order: formData.get("display_order"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (id) {
    await updateService(id, parsed.data);
  } else {
    await createService(parsed.data);
  }

  revalidatePublicPages();
  redirect("/studio/services");
}

export async function deleteServiceAction(id: number): Promise<void> {
  await requireSession();
  await deleteService(id);
  revalidatePublicPages();
  redirect("/studio/services");
}

// ---------- Testimonials ----------

export async function saveTestimonialAction(
  id: number | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();

  const parsed = testimonialSchema.safeParse({
    name: formData.get("name"),
    role_company: formData.get("role_company"),
    quote: formData.get("quote"),
    photo_url: formData.get("photo_url"),
    display_order: formData.get("display_order"),
    published: formData.get("published") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  if (id) {
    await updateTestimonial(id, parsed.data);
  } else {
    await createTestimonial(parsed.data);
  }

  revalidatePublicPages();
  redirect("/studio/testimonials");
}

export async function deleteTestimonialAction(id: number): Promise<void> {
  await requireSession();
  await deleteTestimonial(id);
  revalidatePublicPages();
  redirect("/studio/testimonials");
}

// ---------- Blog posts ----------

export async function saveBlogPostAction(
  id: number | null,
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireSession();

  const rawSlug = String(formData.get("slug") || "");
  const status = formData.get("status") === "published" ? "published" : "draft";

  const parsed = blogPostSchema.safeParse({
    slug: rawSlug ? slugify(rawSlug) : slugify(String(formData.get("title") || "")),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    cover_image: formData.get("cover_image"),
    meta_title: formData.get("meta_title"),
    meta_description: formData.get("meta_description"),
    tags: formData.get("tags"),
    status,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const publishedAt =
    status === "published" ? new Date().toISOString().slice(0, 19).replace("T", " ") : null;

  try {
    if (id) {
      await updateBlogPost(id, { ...parsed.data, published_at: publishedAt });
    } else {
      await createBlogPost({ ...parsed.data, published_at: publishedAt });
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("Duplicate entry")) {
      return { error: "That URL slug is already in use by another post." };
    }
    throw err;
  }

  revalidatePublicPages();
  redirect("/studio/blog");
}

export async function deleteBlogPostAction(id: number): Promise<void> {
  await requireSession();
  await deleteBlogPost(id);
  revalidatePublicPages();
  redirect("/studio/blog");
}

// ---------- Site settings ----------

export type SettingsFormState = { error?: string; success?: boolean } | undefined;

export async function saveSiteSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireSession();

  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }

  await updateSiteSettings(values);
  revalidatePublicPages();
  return { success: true };
}

// ---------- Submissions ----------

export async function markSubmissionReadAction(id: number): Promise<void> {
  await requireSession();
  await markSubmissionRead(id);
  revalidatePath("/studio/submissions");
}
