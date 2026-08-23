import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PrinterIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  CreditCardIcon,
  TruckIcon,
  CheckIcon,
  UserIcon } from
'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { orders, orderStatuses } from '../data/orders';
import { bdt, shortDate, classNames } from '../utils/format';
import type { OrderStatus } from '../types';

export function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const order = orders.find((o) => o.id === id);
  const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'Pending');
  const [cancelOpen, setCancelOpen] = useState(false);

  if (!order) {
    return (
      <Card>
        <EmptyState
          icon={UserIcon}
          title="Order not found"
          description="This order may have been deleted or the link is out of date."
          action={
          <Link to="/orders">
              <Button variant="secondary">Back to orders</Button>
            </Link>
          } />
        
      </Card>);

  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/orders" className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-brown">
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to orders
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl leading-tight text-ink">{order.id}</h1>
            <StatusPill status={status} />
            <StatusPill status={order.payment} />
          </div>
          <p className="mt-1 text-sm text-ink-50">
            Placed {shortDate(order.date)} · {order.items.reduce((s, i) => s + i.qty, 0)} items · {order.method}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            label="Update order status"
            value={status}
            onChange={(v) => {
              setStatus(v as OrderStatus);
              toast('success', 'Order updated', `${order.id} is now marked as ${v}.`);
            }}
            options={orderStatuses}
            className="w-[170px]" />
          
          <Button variant="secondary" icon={PrinterIcon} onClick={() => toast('info', 'Invoice sent to printer', `Invoice for ${order.id}.`)}>
            Print invoice
          </Button>
          <Button variant="danger" onClick={() => setCancelOpen(true)}>
            Cancel order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <Card>
            <CardHeader title="Ordered products" subtitle={`${order.items.length} line items`} />
            <ul className="divide-y divide-line">
              {order.items.map((it) =>
              <li key={it.productId + it.variant} className="flex items-center gap-4 px-5 py-4">
                  <img src={it.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{it.name}</p>
                    <p className="text-[12.5px] text-ink-50">
                      {it.variant} · {bdt(it.price)} each
                    </p>
                  </div>
                  <span className="text-[13px] text-ink-50">× {it.qty}</span>
                  <span className="w-24 text-right text-sm font-medium text-ink">{bdt(it.price * it.qty)}</span>
                </li>
              )}
            </ul>
            <dl className="space-y-2 border-t border-line bg-cream/40 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-50">Subtotal</dt>
                <dd className="text-ink">{bdt(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-50">Delivery fee</dt>
                <dd className="text-ink">{order.delivery === 0 ? 'Free' : bdt(order.delivery)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-50">Discount</dt>
                <dd className="text-sage">−{bdt(order.discount)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5">
                <dt className="font-medium text-ink">Total</dt>
                <dd className="font-display text-lg text-ink">{bdt(order.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader title="Order timeline" subtitle="Every status change is logged automatically" />
            <ol className="p-5">
              {order.timeline.map((t, i, arr) =>
              <li key={t.label} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < arr.length - 1 ?
                <span className={classNames('absolute left-[13px] top-7 h-full w-px', t.done ? 'bg-brown/30' : 'bg-line')} /> :
                null}
                  <span
                  className={classNames(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                    t.done ? 'border-brown bg-brown text-white' : 'border-line bg-surface text-ink-30'
                  )}>
                  
                    {t.done ? <CheckIcon className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className={classNames('text-sm font-medium', t.done ? 'text-ink' : 'text-ink-30')}>{t.label}</p>
                    <p className="text-[12.5px] text-ink-50">
                      {t.at}
                      {t.note ? ` · ${t.note}` : ''}
                    </p>
                  </div>
                </li>
              )}
            </ol>
          </Card>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader
              title="Customer"
              action={
              <Link to={`/customers/${order.customerId}`} className="text-[13px] font-medium text-brown hover:underline">
                  View profile
                </Link>
              } />
            
            <div className="space-y-3 p-5 text-[13px]">
              <p className="flex items-center gap-2.5 text-ink">
                <UserIcon className="h-4 w-4 text-ink-30" /> {order.customer}
              </p>
              <p className="flex items-center gap-2.5 text-ink-70">
                <MailIcon className="h-4 w-4 text-ink-30" /> {order.email}
              </p>
              <p className="flex items-center gap-2.5 text-ink-70">
                <PhoneIcon className="h-4 w-4 text-ink-30" /> {order.phone}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Delivery address" />
            <div className="p-5">
              <p className="flex gap-2.5 text-[13px] leading-relaxed text-ink-70">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-30" />
                <span>
                  {order.customer}
                  <br />
                  {order.address}
                  <br />
                  {order.city}, Bangladesh
                </span>
              </p>
              <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-line bg-cream/40 px-3.5 py-3">
                <TruckIcon className="h-4 w-4 text-brown" />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{order.courier}</p>
                  <p className="text-[12px] text-ink-50">Tracking {order.tracking}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Payment" />
            <div className="p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cream text-brown">
                  <CreditCardIcon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-ink">{order.method}</p>
                  <p className="text-[12px] text-ink-50">Payment status: {order.payment}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => toast('success', 'Payment marked as paid', `${order.id} settled manually.`)}>
                  
                  Mark as paid
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => toast('info', 'Refund initiated', `Refund of ${bdt(order.total)} is processing.`)}>
                  
                  Refund
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {
          setStatus('Cancelled');
          setCancelOpen(false);
          toast('success', 'Order cancelled', `${order.id} was cancelled and stock restored.`);
        }}
        title="Cancel this order?"
        message={`${order.id} will be cancelled, reserved stock returned to inventory, and the customer notified by SMS.`}
        confirmLabel="Cancel order" />
      
    </>);

}