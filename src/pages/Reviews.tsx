import React, { useMemo, useState } from 'react';
import { StarIcon, CheckIcon, XIcon, Trash2Icon, MessageSquareIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState } from '../components/ui/Table';
import { ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { reviews as seed } from '../data/reviews';
import { shortDate } from '../utils/format';
import type { Review } from '../types';

export function Reviews() {
  const toast = useToast();
  const [items, setItems] = useState<Review[]>(seed);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All reviews');
  const [rating, setRating] = useState('All ratings');
  const [toDelete, setToDelete] = useState<Review | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      const matchQ = !q || r.product.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.text.toLowerCase().includes(q);
      const matchS = status === 'All reviews' || r.status === status;
      const matchR = rating === 'All ratings' || r.rating === Number(rating[0]);
      return matchQ && matchS && matchR;
    });
  }, [items, query, status, rating]);

  const avg = (items.reduce((s, r) => s + r.rating, 0) / Math.max(items.length, 1)).toFixed(1);
  const pending = items.filter((r) => r.status === 'Pending').length;

  const setStatusOf = (r: Review, next: Review['status']) => {
    setItems((list) => list.map((x) => x.id === r.id ? { ...x, status: next } : x));
    toast(next === 'Approved' ? 'success' : 'info', `Review ${next.toLowerCase()}`, `${r.customer}'s review on ${r.product}.`);
  };

  return (
    <>
      <PageHeader title="Reviews" subtitle={`${avg} average rating across ${items.length} reviews · ${pending} awaiting approval`} />

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput value={query} onChange={setQuery} placeholder="Search product, customer or review text…" className="min-w-[240px] flex-1" />
          <Select label="Approval status" value={status} onChange={setStatus} options={['All reviews', 'Pending', 'Approved', 'Rejected']} className="w-[170px]" />
          <Select label="Rating" value={rating} onChange={setRating} options={['All ratings', '5 stars', '4 stars', '3 stars', '2 stars', '1 star']} className="w-[150px]" />
        </div>

        {filtered.length === 0 ?
        <EmptyState
          icon={MessageSquareIcon}
          title="No reviews match this view"
          description="Once customers start reviewing your pieces, they'll appear here for moderation."
          action={<Button variant="secondary" onClick={() => {setQuery('');setStatus('All reviews');setRating('All ratings');}}>Clear filters</Button>} /> :


        <ul className="divide-y divide-line">
            {filtered.map((r) =>
          <li key={r.id} className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-start">
                <img src={r.productImage} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-ink">{r.product}</p>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                    <img src={r.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                    <span className="text-[13px] text-ink-70">{r.customer}</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) =>
                  <StarIcon key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-beige'}`} />
                  )}
                    </span>
                    <span className="text-[12px] text-ink-30">{shortDate(r.date)}</span>
                  </div>
                  <p className="mt-2.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-70">“{r.text}”</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button size="sm" variant="secondary" icon={CheckIcon} disabled={r.status === 'Approved'} onClick={() => setStatusOf(r, 'Approved')}>
                    Approve
                  </Button>
                  <Button size="sm" variant="secondary" icon={XIcon} disabled={r.status === 'Rejected'} onClick={() => setStatusOf(r, 'Rejected')}>
                    Reject
                  </Button>
                  <Button size="sm" variant="ghost" icon={Trash2Icon} onClick={() => setToDelete(r)} className="text-danger hover:bg-danger-tint">
                    Delete
                  </Button>
                </div>
              </li>
          )}
          </ul>
        }
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setItems((list) => list.filter((r) => r.id !== toDelete?.id));
          toast('success', 'Review deleted', 'The review was permanently removed.');
          setToDelete(null);
        }}
        title="Delete this review?"
        message="The review will be permanently removed from the product page and cannot be restored." />
      
    </>);

}