import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container, JsonLd } from "@/components/ui";
import { getBlogPostBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso.replace(" ", "T") + "Z").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "published") return {};

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || post.status !== "published") notFound();

  const html = renderMarkdown(post.content);
  const siteUrl = process.env.SITE_URL || "https://www.investory.co.in";

  return (
    <article className="py-16 sm:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: post.cover_image ? [post.cover_image] : undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: { "@type": "Person", name: "Investory" },
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
        }}
      />
      <Container className="max-w-3xl">
        <time className="font-mono text-[12px] text-ink-faint" dateTime={post.published_at ?? undefined}>
          {formatDate(post.published_at)}
        </time>
        <h1 className="mt-3 text-balance font-display text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-[1.15] text-ink">
          {post.title}
        </h1>
        {post.cover_image && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface-2">
            <Image src={post.cover_image} alt="" fill className="object-cover" priority />
          </div>
        )}
        <div
          className="prose-content mt-10"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Container>
    </article>
  );
}
