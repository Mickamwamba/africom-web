"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

interface Category { id: string; name: string }

interface EventFormData {
  id?: string;
  title: string;
  slug: string;
  type: "event" | "training";
  category_id: string;
  description: string;
  start_at: string;
  end_at: string;
  location: string;
  is_online: boolean;
  is_free: boolean;
  price: string;
  cover_image_url: string | null;
  status: "draft" | "published";
}

interface EventFormProps {
  categories: Category[];
  initialData?: Partial<EventFormData>;
  mode: "create" | "edit";
}

const EMPTY_FORM: EventFormData = {
  title: "", slug: "", type: "event", category_id: "",
  description: "", start_at: "", end_at: "", location: "",
  is_online: false, is_free: true, price: "", cover_image_url: null, status: "draft",
};

export default function EventForm({ categories, initialData, mode }: EventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<EventFormData>({ ...EMPTY_FORM, ...initialData });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialData?.description ?? "",
    editorProps: {
      attributes: { class: "tiptap-content p-4 min-h-[220px] focus:outline-none" },
    },
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  // Auto-generate slug from title (only in create mode)
  useEffect(() => {
    if (mode === "create" && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(form.title) }));
    }
  }, [form.title, mode]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setImageError(null);
    if (!file) return;
    const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED.includes(file.type)) {
      setImageError("Only JPEG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be 5MB or smaller.");
      return;
    }
    setImageFile(file);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.slug.trim()) errs.slug = "Slug is required.";
    if (!form.start_at) errs.start_at = "Start date is required.";
    if (!form.end_at) errs.end_at = "End date is required.";
    if (form.start_at && form.end_at && form.end_at <= form.start_at)
      errs.end_at = "End date must be after start date.";
    if (!form.location.trim() && !form.is_online) errs.location = "Location is required for in-person events.";
    if (!form.is_free && !form.price) errs.price = "Price is required for paid events.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(status: "draft" | "published") {
    if (!validate()) return;
    setServerError(null);
    startTransition(async () => {
      try {
        const supabase = createClient();
        let cover_image_url = form.cover_image_url;

        if (imageFile) {
          const ext = imageFile.name.split(".").pop();
          const path = `${form.id ?? Date.now()}/cover.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("event-covers")
            .upload(path, imageFile, { upsert: true });
          if (uploadError) {
            setServerError("Image upload failed: " + uploadError.message);
            return;
          }
          const { data: urlData } = supabase.storage.from("event-covers").getPublicUrl(path);
          cover_image_url = urlData.publicUrl;
        }

        const payload = {
          title: form.title.trim(),
          slug: form.slug.trim(),
          type: form.type,
          category_id: form.category_id || null,
          description: form.description,
          start_at: form.start_at,
          end_at: form.end_at,
          location: form.location.trim(),
          is_online: form.is_online,
          is_free: form.is_free,
          price: form.is_free ? null : parseFloat(form.price) || null,
          cover_image_url,
          status,
        };

        let dbError;
        if (mode === "create") {
          ({ error: dbError } = await supabase.from("events").insert(payload));
        } else {
          ({ error: dbError } = await supabase.from("events").update(payload).eq("id", form.id!));
        }

        if (dbError) {
          setServerError(dbError.message);
          return;
        }

        router.push("/admin/events");
        router.refresh();
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    });
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6 max-w-2xl">
      {/* Title */}
      <Field label="Title" required error={errors.title}>
        <input name="title" type="text" value={form.title} onChange={handleChange}
          className={inputClass(!!errors.title)} placeholder="Event title" />
      </Field>

      {/* Slug */}
      <Field label="URL Slug" required error={errors.slug}>
        <input name="slug" type="text" value={form.slug} onChange={handleChange}
          className={inputClass(!!errors.slug)} placeholder="event-url-slug" />
        <p className="mt-1 text-xs text-gray-500">URL: /events/{form.slug || "…"}</p>
      </Field>

      {/* Type + Category */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Type" required error={errors.type}>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass(false)}>
            <option value="event">Event</option>
            <option value="training">Training</option>
          </select>
        </Field>
        <Field label="Category" error={errors.category_id}>
          <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass(false)}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Start Date & Time" required error={errors.start_at}>
          <input name="start_at" type="datetime-local" value={form.start_at} onChange={handleChange}
            className={inputClass(!!errors.start_at)} />
        </Field>
        <Field label="End Date & Time" required error={errors.end_at}>
          <input name="end_at" type="datetime-local" value={form.end_at} onChange={handleChange}
            className={inputClass(!!errors.end_at)} />
        </Field>
      </div>

      {/* Location */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <input type="checkbox" name="is_online" checked={form.is_online} onChange={handleChange}
            className="rounded border-gray-300 text-brand-earth-brown" />
          Online / Virtual event
        </label>
        <Field label={form.is_online ? "Online Link (optional)" : "Location"} error={errors.location}>
          <input name="location" type="text" value={form.location} onChange={handleChange}
            className={inputClass(!!errors.location)}
            placeholder={form.is_online ? "https://zoom.us/j/…" : "Nairobi, Kenya"} />
        </Field>
      </div>

      {/* Pricing */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <input type="checkbox" name="is_free" checked={form.is_free} onChange={handleChange}
            className="rounded border-gray-300 text-brand-earth-brown" />
          Free event
        </label>
        {!form.is_free && (
          <Field label="Price (USD)" required error={errors.price}>
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange}
              className={inputClass(!!errors.price)} placeholder="0.00" />
          </Field>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <div className="rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-brand-earth-brown">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Cover Image */}
      <Field label="Cover Image" error={imageError ?? undefined}>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-earth-brown file:text-white hover:file:opacity-90" />
        {form.cover_image_url && !imageFile && (
          <p className="mt-1 text-xs text-gray-500">Current: <a href={form.cover_image_url} target="_blank" rel="noopener noreferrer" className="underline">View image</a></p>
        )}
        <p className="mt-1 text-xs text-gray-500">Max 5MB. JPEG, PNG, or WebP.</p>
      </Field>

      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{serverError}</div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => handleSubmit("draft")} disabled={isPending}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Save as Draft
        </button>
        <button type="button" onClick={() => handleSubmit("published")} disabled={isPending}
          className="rounded-lg bg-brand-earth-brown px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
          {isPending ? "Saving…" : "Publish"}
        </button>
        <button type="button" onClick={() => router.back()}
          className="ml-auto text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
      </div>
    </form>
  );
}

function ToolbarButton({
  onClick, active, title, children,
}: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-brand-earth-brown text-white"
          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-gray-300 mx-0.5 self-center" />;
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  return (
    <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
      {/* Text style */}
      <ToolbarButton title="Bold (Ctrl+B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Italic (Ctrl+I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Underline (Ctrl+U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
      </ToolbarButton>

      <Divider />

      {/* Headings */}
      <ToolbarButton title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <span className="text-xs font-bold leading-none px-0.5">H1</span>
      </ToolbarButton>
      <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <span className="text-xs font-bold leading-none px-0.5">H2</span>
      </ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <span className="text-xs font-bold leading-none px-0.5">H3</span>
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 10h2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" stroke="currentColor" strokeWidth="1.5"/></svg>
      </ToolbarButton>

      <Divider />

      {/* Blockquote + Code */}
      <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Horizontal rule" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>
      </ToolbarButton>

      <Divider />

      {/* Undo / Redo */}
      <ToolbarButton title="Undo (Ctrl+Z)" active={false} onClick={() => editor.chain().focus().undo().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
      </ToolbarButton>
      <ToolbarButton title="Redo (Ctrl+Y)" active={false} onClick={() => editor.chain().focus().redo().run()}>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"/></svg>
      </ToolbarButton>
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
