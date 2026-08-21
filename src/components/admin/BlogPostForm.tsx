"use client";

import { useActionState } from "react";
import { saveBlogPostAction } from "@/lib/actions/content";
import type { BlogPost } from "@/lib/content";
import { ImageUpload } from "./ImageUpload";
import { AdminField, AdminInput, AdminTextarea, AdminSelect, AdminSubmit, AdminError } from "./fields";

export function BlogPostForm({ post }: { post?: BlogPost }) {
  const action = saveBlogPostAction.bind(null, post?.id ?? null);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <AdminField label="Title" htmlFor="title">
        <AdminInput id="title" name="title" required defaultValue={post?.title} maxLength={240} />
      </AdminField>

      <AdminField label="URL slug" htmlFor="slug" hint="Lowercase letters, numbers, hyphens only. Leave blank to generate from the title.">
        <AdminInput id="slug" name="slug" defaultValue={post?.slug} maxLength={200} />
      </AdminField>

      <AdminField label="Excerpt" htmlFor="excerpt" hint="Shown on the blog listing page and used as the default meta description.">
        <AdminTextarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} maxLength={400} />
      </AdminField>

      <ImageUpload name="cover_image" defaultValue={post?.cover_image} label="Cover image (optional)" />

      <AdminField label="Content" htmlFor="content" hint="Markdown supported: **bold**, *italic*, ## headings, [links](url), lists, images.">
        <AdminTextarea id="content" name="content" required rows={16} defaultValue={post?.content} className="font-mono text-[13.5px]" />
      </AdminField>

      <div className="grid gap-5 sm:grid-cols-2">
        <AdminField label="Meta title" htmlFor="meta_title" hint="Optional, defaults to the title.">
          <AdminInput id="meta_title" name="meta_title" defaultValue={post?.meta_title ?? ""} maxLength={160} />
        </AdminField>
        <AdminField label="Tags" htmlFor="tags" hint="Comma-separated">
          <AdminInput id="tags" name="tags" defaultValue={post?.tags ?? ""} maxLength={300} />
        </AdminField>
      </div>

      <AdminField label="Meta description" htmlFor="meta_description" hint="Optional, defaults to the excerpt.">
        <AdminTextarea id="meta_description" name="meta_description" rows={2} defaultValue={post?.meta_description ?? ""} maxLength={200} />
      </AdminField>

      <AdminField label="Status" htmlFor="status">
        <AdminSelect id="status" name="status" defaultValue={post?.status || "draft"}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </AdminSelect>
      </AdminField>

      <AdminError message={state?.error} />
      <AdminSubmit pending={pending}>{post ? "Save changes" : "Create post"}</AdminSubmit>
    </form>
  );
}
