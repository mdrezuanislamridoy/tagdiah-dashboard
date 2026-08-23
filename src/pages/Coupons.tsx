import React, { useState } from 'react';
import { PlusIcon, CopyIcon, PencilIcon, Trash2Icon, TicketPercentIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextInput, Toggle } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { ConfirmDialog, Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { coupons as seed } from '../data/marketing';
import { bdt, shortDate } from '../utils/format';
import type { Coupon } from '../types';

const blank = { code: '', type: 'Percentage', amount: '', minOrder: '', expires: '', limit: '', active: true };

export function Coupons() {
  const toast = useToast();
  const [items, setItems] = useState<Coupon[]>(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [draft, setDraft] = useState(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toDelete, setToDelete] = useState<Coupon | null>(null);
  const [filter, setFilter] = useState('All coupons');

  const filtered = items.filter((c) => filter === 'All coupons' || c.status === filter);

  const openNew = () => {
    setEditing(null);
    setDraft(blank);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setDraft({
      code: c.code,
      type: c.type,
      amount: String(c.amount),
      minOrder: String(c.minOrder),
      expires: c.expires,
      limit: String(c.limit),
      active: c.status === 'Active'
    });
    setErrors({});
    setOpen(true);
  };

  const save = () => {
    const e: Record<string, string> = {};
    if (!draft.code.trim()) e.code = 'Coupon code is required.';
    if (draft.type !== 'Free Delivery' && !Number(draft.amount)) e.amount = 'Enter a discount value.';
    if (!draft.expires) e.expires = 'Pick an expiry date.';
    setErrors(e);
    if (Object.keys(e).length) {
      toast('error', 'Coupon not saved', 'Fill in the highlighted fields.');
      return;
    }
    const record: Coupon = {
      id: editing?.id ?? `co-${Date.now()}`,
      code: draft.code.toUpperCase(),
      type: draft.type as Coupon['type'],
      amount: Number(draft.amount) || 0,
      minOrder: Number(draft.minOrder) || 0,
      expires: draft.expires,
      limit: Number(draft.limit) || 0,
      used: editing?.used ?? 0,
      status: draft.active ? 'Active' : 'Inactive'
    };
    setItems((list) => editing ? list.map((c) => c.id === editing.id ? record : c) : [record, ...list]);
    toast('success', editing ? 'Coupon updated' : 'Coupon created', `${record.code} is ${draft.active ? 'live' : 'saved as inactive'}.`);
    setOpen(false);
  };

  const describe = (c: Coupon) =>
  c.type === 'Percentage' ? `${c.amount}% off` : c.type === 'Fixed' ? `${bdt(c.amount)} off` : 'Free delivery';

  return (
    <>
      <PageHeader title="Coupons & Discounts" subtitle={`${items.filter((c) => c.status === 'Active').length} active codes running right now`}>
        <Select label="Filter coupons" value={filter} onChange={setFilter} options={['All coupons', 'Active', 'Scheduled', 'Expired', 'Inactive']} className="w-[170px]" />
        <Button icon={PlusIcon} onClick={openNew}>
          Create coupon
        </Button>
      </PageHeader>

      <Card>
        {filtered.length === 0 ?
        <EmptyState
          icon={TicketPercentIcon}
          title="No coupons in this view"
          description="Create a code to run a seasonal offer or reward repeat customers."
          action={<Button icon={PlusIcon} onClick={openNew}>Create coupon</Button>} /> :


        <TableShell>
            <thead>
              <tr>
                <Th>Code</Th>
                <Th>Discount</Th>
                <Th>Minimum order</Th>
                <Th>Usage</Th>
                <Th>Expires</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
              const pct = c.limit ? Math.min(100, Math.round(c.used / c.limit * 100)) : 0;
              return (
                <Tr key={c.id}>
                    <Td>
                      <span className="rounded-md border border-dashed border-beige bg-cream px-2.5 py-1 font-mono text-[13px] font-medium tracking-wide text-ink">
                        {c.code}
                      </span>
                    </Td>
                    <Td className="font-medium text-ink">{describe(c)}</Td>
                    <Td>{c.minOrder ? bdt(c.minOrder) : 'No minimum'}</Td>
                    <Td>
                      <div className="w-36">
                        <div className="flex justify-between text-[12px] text-ink-50">
                          <span>
                            {c.used} / {c.limit}
                          </span>
                          <span>{pct}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-beige">
                          <div className="h-full rounded-full bg-brown" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap text-[13px]">{shortDate(c.expires)}</Td>
                    <Td>
                      <StatusPill status={c.status} />
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        <IconButton label={`Copy ${c.code}`} icon={CopyIcon} onClick={() => toast('success', 'Code copied', `${c.code} is on your clipboard.`)} />
                        <IconButton label={`Edit ${c.code}`} icon={PencilIcon} onClick={() => openEdit(c)} />
                        <IconButton
                        label={`Delete ${c.code}`}
                        icon={Trash2Icon}
                        onClick={() => setToDelete(c)}
                        className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger" />
                      
                      </div>
                    </Td>
                  </Tr>);

            })}
            </tbody>
          </TableShell>
        }
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? `Edit ${editing.code}` : 'Create coupon'}
        description="Codes apply at checkout once the minimum order value is met."
        footer={
        <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>{editing ? 'Save coupon' : 'Create coupon'}</Button>
          </>
        }>
        
        <div className="space-y-4">
          <Field label="Coupon code" required error={errors.code}>
            <TextInput
              value={draft.code}
              invalid={!!errors.code}
              placeholder="EIDDECOR"
              className="font-mono uppercase tracking-wide"
              onChange={(e) => setDraft({ ...draft, code: e.target.value })} />
            
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Discount type">
              <Select label="Discount type" value={draft.type} onChange={(v) => setDraft({ ...draft, type: v })} options={['Percentage', 'Fixed', 'Free Delivery']} />
            </Field>
            <Field label={draft.type === 'Percentage' ? 'Discount (%)' : 'Discount (৳)'} error={errors.amount}>
              <TextInput
                type="number"
                invalid={!!errors.amount}
                disabled={draft.type === 'Free Delivery'}
                value={draft.amount}
                onChange={(e) => setDraft({ ...draft, amount: e.target.value })} />
              
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Minimum order value (৳)">
              <TextInput type="number" value={draft.minOrder} onChange={(e) => setDraft({ ...draft, minOrder: e.target.value })} />
            </Field>
            <Field label="Usage limit" hint="Total times this code can be redeemed.">
              <TextInput type="number" value={draft.limit} onChange={(e) => setDraft({ ...draft, limit: e.target.value })} />
            </Field>
          </div>
          <Field label="Expiration date" required error={errors.expires}>
            <TextInput type="date" invalid={!!errors.expires} value={draft.expires} onChange={(e) => setDraft({ ...draft, expires: e.target.value })} />
          </Field>
          <div className="rounded-xl border border-line bg-cream/40 p-4">
            <Toggle checked={draft.active} onChange={(v) => setDraft({ ...draft, active: v })} label="Activate immediately" description="Customers can use this code as soon as it is saved." />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setItems((list) => list.filter((c) => c.id !== toDelete?.id));
          toast('success', 'Coupon deleted', `${toDelete?.code} can no longer be redeemed.`);
          setToDelete(null);
        }}
        title="Delete this coupon?"
        message={`${toDelete?.code ?? ''} has been used ${toDelete?.used ?? 0} times. Deleting it stops all future redemptions.`} />
      
    </>);

}