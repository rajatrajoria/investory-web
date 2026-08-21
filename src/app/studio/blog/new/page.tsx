import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const metadata = { title: "New post" };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">New post</h1>
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
