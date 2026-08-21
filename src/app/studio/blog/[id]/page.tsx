import { notFound } from "next/navigation";
import { getBlogPostById } from "@/lib/content";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const metadata = { title: "Edit post" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostById(Number(id));
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Edit post</h1>
      <div className="mt-6">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
