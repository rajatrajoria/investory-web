import Link from "next/link";
import { listBlogPosts } from "@/lib/content";
import { deleteBlogPostAction } from "@/lib/actions/content";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata = { title: "Blog" };

export default async function AdminBlogPage() {
  const posts = await listBlogPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">Blog</h1>
        <Link
          href="/studio/blog/new"
          className="rounded-full bg-brand px-4 py-2 text-[13.5px] font-semibold text-brand-ink"
        >
          + New post
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-rule bg-surface">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-surface-2 text-[12px] uppercase tracking-wide text-ink-faint">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Slug</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-rule">
            {posts.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3.5 font-medium text-ink">{p.title}</td>
                <td className="px-5 py-3.5 font-mono text-[12.5px] text-ink-faint">/{p.slug}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
                      p.status === "published" ? "bg-success-soft text-success" : "bg-surface-2 text-ink-faint"
                    }`}
                  >
                    {p.status === "published" ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/studio/blog/${p.id}`} className="text-[13px] font-medium text-brand hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deleteBlogPostAction.bind(null, p.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-ink-faint">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
