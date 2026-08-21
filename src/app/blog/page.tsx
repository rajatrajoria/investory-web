import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container, Eyebrow, SectionHeading } from "@/components/ui";
import { listBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description: "Notes on financial planning, retirement strategy, and building wealth with intention.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso.replace(" ", "T") + "Z").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const posts = await listBlogPosts({ publishedOnly: true });

  return (
    <>
      <section className="border-b border-rule">
        <Container className="py-16 sm:py-24">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="mt-4 max-w-2xl text-balance font-display text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.1] text-ink">
            Notes on planning, patience, and building real wealth
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          {posts.length === 0 ? (
            <SectionHeading
              title="New articles are on the way."
              lede="We're building out this section — check back soon, or book a conversation in the meantime."
            />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-rule bg-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  {post.cover_image ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
                      <Image
                        src={post.cover_image}
                        alt=""
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-soft to-accent-soft" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <time className="font-mono text-[12px] text-ink-faint" dateTime={post.published_at ?? undefined}>
                      {formatDate(post.published_at)}
                    </time>
                    <h2 className="mt-2 font-display text-[18px] font-semibold leading-snug text-ink">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 text-[14px] leading-relaxed text-ink-muted line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
