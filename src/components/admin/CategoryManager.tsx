"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

interface Category { id: string; name: string }

interface CategoryManagerProps {
  initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setError(null);
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from("categories")
      .insert({ name })
      .select("id, name")
      .single();
    if (dbError) {
      setError(dbError.message.includes("unique") ? "A category with that name already exists." : dbError.message);
      return;
    }
    setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  }

  async function handleRename(id: string) {
    const name = editName.trim();
    if (!name) return;
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)).sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditId(null);
  }

  async function handleDelete(id: string) {
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("categories").delete().eq("id", id);
    if (dbError) {
      setError(
        dbError.message.includes("foreign key") || dbError.message.includes("restrict")
          ? "This category is used by one or more events and cannot be deleted."
          : dbError.message
      );
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>

        {/* Add */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && startTransition(() => { void handleAdd(); })}
            placeholder="New category name"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
          />
          <button
            onClick={() => startTransition(() => { void handleAdd(); })}
            disabled={isPending || !newName.trim()}
            className="rounded-lg bg-brand-earth-brown px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            Add
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* List */}
        {categories.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No categories yet. Add one above.</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-4 py-3">
                {editId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && startTransition(() => { void handleRename(cat.id); })}
                      className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
                      autoFocus
                    />
                    <button
                      onClick={() => startTransition(() => { void handleRename(cat.id); })}
                      className="text-sm font-medium text-green-600 hover:text-green-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-sm text-gray-400 hover:text-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-gray-800">{cat.name}</span>
                    <button
                      onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => startTransition(() => { void handleDelete(cat.id); })}
                      className="text-sm text-red-500 hover:text-red-700"
                      title="Delete category"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
