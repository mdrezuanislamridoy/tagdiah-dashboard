import React, { useState } from 'react';
import { PlusIcon, PencilIcon, Trash2Icon, ImageIcon, CalendarDaysIcon } from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextInput } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState } from '../components/ui/Table';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { banners as seed } from '../data/marketing';
import { shortDate } from '../utils/format';
import type { Banner } from '../types';

export function Banners() {
  const toast = useToast();
  const [items, setItems] = useState<Banner[]>(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [toDelete, setToDelete] = useState<Banner | null>(null);
  const [draft, setDraft] = useState({ title: '', subtitle: '', placement: 'Homepage Hero', starts: '', ends: '' });
  const [error, setError] = useState('');

  const openNew = () => {
    setEditing(null);
    setDraft({ title: '', subtitle: '', placement: 'Homepage Hero', starts: '', ends: '' });
    setError('');
    setOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setDraft({ title: b.title, subtitle: b.subtitle, placement: b.placement, starts: b.starts, ends: b.ends });
    setError('');
    setOpen(true);
  };

  const save = () => {
    if (!draft.title.trim()) {
      setError('Give the campaign a title.');
      return;
    }
    const record: Banner = {
      id: editing?.id ?? `b-${Date.now()}`,
      title: draft.title,
      subtitle: draft.subtitle,
      image: editing?.image ?? seed[0].image,
      placement: draft.placement as Banner['placement'],
      starts: draft.starts || '2026-08-23',
      ends: draft.ends || '2026-09-30',
      status: editing?.status ?? 'Scheduled'
    };
    setItems((list) => editing ? list.map((b) => b.id === editing.id ? record : b) : [record, ...list]);
    toast('success', editing ? 'Banner updated' : 'Banner scheduled', `${record.title} · ${record.placement}.`);
    setOpen(false);
  };

  const live = items.filter((b) => b.status === 'Live');

  return (
    <>
      <PageHeader title="Banners & Promotions" subtitle={`${live.length} campaigns live on the storefront right now`}>
        <Button icon={PlusIcon} onClick={openNew}>
          New banner
        </Button>
      </PageHeader>

      {items.length === 0 ?
      <Card>
          <EmptyState
          icon={ImageIcon}
          title="No campaigns yet"
          description="Promotional banners drive seasonal collections on the homepage. Create your first one."
          action={<Button icon={PlusIcon} onClick={openNew}>New banner</Button>} />
        
        </Card> :

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((b) =>
        <Card key={b.id} className="flex flex-col overflow-hidden">
              <div className="relative h-40 shrink-0">
                <img src={b.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-ink/35" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <p className="font-display text-lg leading-tight text-white">{b.title}</p>
                  <p className="mt-0.5 text-[12.5px] text-white/80">{b.subtitle}</p>
                </div>
                <span className="absolute right-3 top-3">
                  <StatusPill status={b.status} className="bg-surface/95" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-[12px] font-medium uppercase tracking-wide text-ink-30">{b.placement}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-70">
                  <CalendarDaysIcon className="h-3.5 w-3.5 text-ink-30" />
                  {shortDate(b.starts)} — {shortDate(b.ends)}
                </p>
                <div className="mt-auto flex gap-2 pt-4">
                  <Button size="sm" variant="secondary" icon={PencilIcon} className="flex-1" onClick={() => openEdit(b)}>
                    Edit
                  </Button>
                  <IconButton
                label={`Delete ${b.title}`}
                icon={Trash2Icon}
                onClick={() => setToDelete(b)}
                className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger" />
              
                </div>
              </div>
            </Card>
        )}
        </div>
      }

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit banner' : 'New banner'}
        description="Banners appear on the storefront between their start and end dates."
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? 'Save banner' : 'Schedule banner'}</Button>
          </>
        }>
        
        <div className="space-y-4">
          <Field label="Campaign title" required error={error}>
            <TextInput value={draft.title} invalid={!!error} placeholder="Eid Home Refresh" onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <TextInput value={draft.subtitle} placeholder="Up to 25% off wall décor & porda" onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} />
          </Field>
          <Field label="Placement">
            <Select label="Placement" value={draft.placement} onChange={(v) => setDraft({ ...draft, placement: v })} options={['Homepage Hero', 'Category Strip', 'Popup']} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start date">
              <TextInput type="date" value={draft.starts} onChange={(e) => setDraft({ ...draft, starts: e.target.value })} />
            </Field>
            <Field label="End date">
              <TextInput type="date" value={draft.ends} onChange={(e) => setDraft({ ...draft, ends: e.target.value })} />
            </Field>
          </div>
          <Field label="Banner artwork" hint="Recommended 1600×600px for hero placement.">
            <button className="flex w-full flex-col items-center gap-1.5 rounded-xl border border-dashed border-beige bg-cream/40 px-4 py-7 text-ink-50 transition-colors duration-150 ease-out hover:border-brown-soft hover:text-brown">
              <ImageIcon className="h-5 w-5" />
              <span className="text-[13px] font-medium">Upload artwork</span>
              <span className="text-[11.5px] text-ink-30">JPG or PNG · max 3MB</span>
            </button>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setItems((list) => list.filter((b) => b.id !== toDelete?.id));
          toast('success', 'Banner deleted', `${toDelete?.title} was removed from the storefront.`);
          setToDelete(null);
        }}
        title="Delete this banner?"
        message={`${toDelete?.title ?? ''} will stop showing on the storefront immediately.`} />
      
    </>);

}