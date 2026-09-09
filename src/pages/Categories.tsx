import React, { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, ChevronRightIcon, LayersIcon, Loader2 } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextArea, TextInput } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { api } from '../utils/api';
import type { Category } from '../types';

export function Categories() {
  const toast = useToast();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [draft, setDraft] = useState({
    name: '',
    tagline: '',
    slug: '',
    parent: 'None (top level)',
    status: 'Active',
    description: '',
    image: '/cat-decor.jpg',
  });
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<any[]>('/categories');
      if (Array.isArray(data)) {
        const mapped: Category[] = data.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          tagline: c.tagline || '',
          image: c.image || '/cat-decor.jpg',
          parent: null,
          products: c._count?.products || c.products?.length || 0,
          status: (c.status || 'Active') as Category['status'],
          description: c.description || '',
        }));
        setItems(mapped);
      }
    } catch (err: any) {
      toast('error', 'Failed to load categories', err?.message || 'Could not fetch from backend.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const parents = items.filter((c) => !c.parent);

  const openNew = () => {
    setEditing(null);
    setDraft({
      name: '',
      tagline: '',
      slug: '',
      parent: 'None (top level)',
      status: 'Active',
      description: '',
      image: '/cat-decor.jpg',
    });
    setError('');
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setDraft({
      name: c.name,
      tagline: (c as any).tagline || '',
      slug: (c as any).slug || '',
      parent: c.parent ?? 'None (top level)',
      status: c.status,
      description: c.description,
      image: c.image,
    });
    setError('');
    setOpen(true);
  };

  const save = async () => {
    if (!draft.name.trim()) {
      setError('Category name is required.');
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await api.put(`/categories/${editing.id}`, {
          name: draft.name.trim(),
          tagline: draft.tagline.trim() || undefined,
          description: draft.description.trim() || undefined,
          image: draft.image || undefined,
          status: draft.status,
        });
        toast('success', 'Category updated', `${draft.name} was saved to the database.`);
      } else {
        const slug =
          draft.slug.trim() ||
          draft.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        await api.post('/categories', {
          name: draft.name.trim(),
          slug,
          tagline: draft.tagline.trim() || undefined,
          description: draft.description.trim() || undefined,
          image: draft.image || '/cat-decor.jpg',
          status: draft.status,
        });
        toast('success', 'Category created', `${draft.name} is now live in the database.`);
      }

      setOpen(false);
      await loadCategories();
    } catch (err: any) {
      toast('error', 'Failed to save category', err?.message || 'Database error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/categories/${toDelete.id}`);
      toast('success', 'Category deleted', `${toDelete.name} was removed from the database.`);
      setToDelete(null);
      await loadCategories();
    } catch (err: any) {
      toast('error', 'Failed to delete category', err?.message || 'Could not delete category.');
    }
  };

  return (
    <>
      <PageHeader title="Categories" subtitle="Organise the catalogue into collections and categories dynamically from backend database.">
        <Button icon={PlusIcon} onClick={openNew}>
          Add category
        </Button>
      </PageHeader>

      {loading ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-ink-50">
            <Loader2 className="h-8 w-8 animate-spin text-ink-30 mb-3" />
            <p className="text-sm font-medium">Connecting to backend database...</p>
          </div>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState
            icon={LayersIcon}
            title="No categories yet"
            description="Create your first collection to start grouping products for the storefront."
            action={<Button icon={PlusIcon} onClick={openNew}>Add category</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {parents.map((parent) => {
            const children = items.filter((c) => c.parent === parent.name);
            return (
              <Card key={parent.id}>
                <div className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4">
                  <img src={parent.image} alt="" className="h-14 w-14 rounded-xl object-cover bg-cream" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-[17px] text-ink">{parent.name}</h2>
                      <span className="text-[11px] font-mono bg-cream px-2 py-0.5 rounded text-ink-50">/{parent.slug || parent.name.toLowerCase()}</span>
                      <StatusPill status={parent.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-ink-50">{parent.description || parent.tagline || 'No description provided.'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-ink">{parent.products}</p>
                    <p className="text-[12px] text-ink-50">products</p>
                  </div>
                  <div className="flex gap-1.5">
                    <IconButton label={`Edit ${parent.name}`} icon={PencilIcon} onClick={() => openEdit(parent)} />
                    <IconButton
                      label={`Delete ${parent.name}`}
                      icon={Trash2Icon}
                      onClick={() => setToDelete(parent)}
                      className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger"
                    />
                  </div>
                </div>

                {children.length > 0 && (
                  <ul className="divide-y divide-line">
                    {children.map((c) => (
                      <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                        <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-30" />
                        <img src={c.image} alt="" className="h-9 w-9 rounded-lg object-cover bg-cream" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-medium text-ink">{c.name}</p>
                          <p className="truncate text-[12px] text-ink-50">{c.description}</p>
                        </div>
                        <span className="text-[13px] text-ink-50">{c.products} products</span>
                        <StatusPill status={c.status} />
                        <div className="flex gap-1.5">
                          <IconButton label={`Edit ${c.name}`} icon={PencilIcon} onClick={() => openEdit(c)} />
                          <IconButton
                            label={`Delete ${c.name}`}
                            icon={Trash2Icon}
                            onClick={() => setToDelete(c)}
                            className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit category' : 'Add category'}
        description="Categories drive storefront navigation and filtering."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save changes' : 'Create category'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Category name" required error={error}>
            <TextInput
              value={draft.name}
              invalid={!!error}
              placeholder="e.g. Curtains or Luxury Rugs"
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          
          <div className="grid grid-cols-2 gap-4">
            <Field label="URL Slug (Optional)" hint="Auto-generated if left empty">
              <TextInput
                value={draft.slug}
                placeholder="e.g. luxury-rugs"
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              />
            </Field>
            <Field label="Status">
              <Select
                label="Status"
                value={draft.status}
                onChange={(v) => setDraft({ ...draft, status: v })}
                options={['Active', 'Hidden']}
              />
            </Field>
          </div>

          <Field label="Tagline / Short Note" hint="Brief subline shown beneath category title">
            <TextInput
              value={draft.tagline}
              placeholder="e.g. Elegant curtains for every room"
              onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
            />
          </Field>

          <Field label="Description" hint="Shown on the collection page header.">
            <TextArea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </Field>

          <Field label="Image URL" hint="Image path (e.g. /cat-curtains.jpg or https://...)">
            <TextInput
              value={draft.image}
              placeholder="/cat-curtains.jpg"
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this category?"
        message={`${toDelete?.name ?? ''} holds ${toDelete?.products ?? 0} products. They will become uncategorised until reassigned.`}
      />
    </>
  );
}