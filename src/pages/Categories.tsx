import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, ChevronRightIcon, LayersIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextArea, TextInput } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { categories as seed, categoryNames } from '../data/categories';
import type { Category } from '../types';

export function Categories() {
  const toast = useToast();
  const [items, setItems] = useState<Category[]>(seed);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [draft, setDraft] = useState({ name: '', parent: 'None (top level)', status: 'Active', description: '' });
  const [error, setError] = useState('');

  const parents = items.filter((c) => !c.parent);

  const openNew = () => {
    setEditing(null);
    setDraft({ name: '', parent: 'None (top level)', status: 'Active', description: '' });
    setError('');
    setOpen(true);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setDraft({ name: c.name, parent: c.parent ?? 'None (top level)', status: c.status, description: c.description });
    setError('');
    setOpen(true);
  };

  const save = () => {
    if (!draft.name.trim()) {
      setError('Category name is required.');
      return;
    }
    if (editing) {
      setItems((list) =>
      list.map((c) =>
      c.id === editing.id ?
      { ...c, name: draft.name, parent: draft.parent === 'None (top level)' ? null : draft.parent, status: draft.status as Category['status'], description: draft.description } :
      c
      )
      );
      toast('success', 'Category updated', `${draft.name} was saved.`);
    } else {
      setItems((list) => [
      ...list,
      {
        id: `c-${Date.now()}`,
        name: draft.name,
        image: seed[0].image,
        parent: draft.parent === 'None (top level)' ? null : draft.parent,
        products: 0,
        status: draft.status as Category['status'],
        description: draft.description
      }]
      );
      toast('success', 'Category created', `${draft.name} is ready for products.`);
    }
    setOpen(false);
  };

  return (
    <>
      <PageHeader title="Categories" subtitle="Organise the catalogue into collections and subcategories.">
        <Button icon={PlusIcon} onClick={openNew}>
          Add category
        </Button>
      </PageHeader>

      {items.length === 0 ?
      <Card>
          <EmptyState
          icon={LayersIcon}
          title="No categories yet"
          description="Create your first collection to start grouping products for the storefront."
          action={<Button icon={PlusIcon} onClick={openNew}>Add category</Button>} />
        
        </Card> :

      <div className="space-y-4">
          {parents.map((parent) => {
          const children = items.filter((c) => c.parent === parent.name);
          return (
            <Card key={parent.id}>
                <div className="flex flex-wrap items-center gap-4 border-b border-line px-5 py-4">
                  <img src={parent.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-[17px] text-ink">{parent.name}</h2>
                      <StatusPill status={parent.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-ink-50">{parent.description}</p>
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
                    className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger" />
                  
                  </div>
                </div>

                {children.length === 0 ?
              <p className="px-5 py-4 text-[13px] text-ink-50">No subcategories under this collection.</p> :

              <ul className="divide-y divide-line">
                    {children.map((c) =>
                <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                        <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-30" />
                        <img src={c.image} alt="" className="h-9 w-9 rounded-lg object-cover" />
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
                      className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger" />
                    
                        </div>
                      </li>
                )}
                  </ul>
              }
              </Card>);

        })}
        </div>
      }

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit category' : 'Add category'}
        description="Categories drive storefront navigation and filtering."
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? 'Save changes' : 'Create category'}</Button>
          </>
        }>
        
        <div className="space-y-4">
          <Field label="Category name" required error={error}>
            <TextInput
              value={draft.name}
              invalid={!!error}
              placeholder="e.g. Embroidered Porda"
              onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Parent category">
              <Select
                label="Parent category"
                value={draft.parent}
                onChange={(v) => setDraft({ ...draft, parent: v })}
                options={['None (top level)', ...categoryNames]} />
              
            </Field>
            <Field label="Status">
              <Select label="Status" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v })} options={['Active', 'Hidden']} />
            </Field>
          </div>
          <Field label="Description" hint="Shown on the collection page header.">
            <TextArea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>
          <Field label="Category image">
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-beige bg-cream/40 px-4 py-4">
              <img src={editing?.image ?? seed[0].image} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div>
                <p className="text-[13px] font-medium text-ink">Replace image</p>
                <p className="text-[12px] text-ink-50">Square JPG or PNG, at least 600×600px.</p>
              </div>
              <Button size="sm" variant="secondary" className="ml-auto">
                Upload
              </Button>
            </div>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setItems((list) => list.filter((c) => c.id !== toDelete?.id && c.parent !== toDelete?.name));
          toast('success', 'Category deleted', `${toDelete?.name} and its subcategories were removed.`);
          setToDelete(null);
        }}
        title="Delete this category?"
        message={`${toDelete?.name ?? ''} holds ${toDelete?.products ?? 0} products. They will become uncategorised until reassigned.`} />
      
    </>);

}