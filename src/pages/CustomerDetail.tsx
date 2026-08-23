import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MailIcon, PhoneIcon, MapPinIcon, ShoppingBagIcon, BanIcon, UsersIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { ConfirmDialog } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { customers } from '../data/customers';
import { orders } from '../data/orders';
import { bdt, shortDate } from '../utils/format';

export function CustomerDetail() {
  const { id } = useParams();
  const toast = useToast();
  const customer = customers.find((c) => c.id === id);
  const [blockOpen, setBlockOpen] = useState(false);

  if (!customer) {
    return (
      <Card>
        <EmptyState
          icon={UsersIcon}
          title="Customer not found"
          description="This profile may have been removed."
          action={
          <Link to="/customers">
              <Button variant="secondary">Back to customers</Button>
            </Link>
          } />
        
      </Card>);

  }

  const history = orders.filter((o) => o.customerId === customer.id);
  const aov = customer.orders ? Math.round(customer.spent / customer.orders) : 0;

  return (
    <>
      <Link to="/customers" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-brown">
        <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to customers
      </Link>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-4">
          <Card>
            <div className="flex flex-col items-center p-6 text-center">
              <img src={customer.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
              <h1 className="mt-3 font-display text-xl text-ink">{customer.name}</h1>
              <p className="mt-0.5 text-[13px] text-ink-50">Customer since {shortDate(customer.joined)}</p>
              <div className="mt-3">
                <StatusPill status={customer.status} />
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-line border-t border-line text-center">
              <div className="px-2 py-3.5">
                <p className="font-display text-lg text-ink">{customer.orders}</p>
                <p className="text-[11.5px] text-ink-50">Orders</p>
              </div>
              <div className="px-2 py-3.5">
                <p className="font-display text-lg text-ink">{bdt(customer.spent, true)}</p>
                <p className="text-[11.5px] text-ink-50">Spent</p>
              </div>
              <div className="px-2 py-3.5">
                <p className="font-display text-lg text-ink">{bdt(aov, true)}</p>
                <p className="text-[11.5px] text-ink-50">Avg. order</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Contact" />
            <div className="space-y-3 p-5 text-[13px]">
              <p className="flex items-center gap-2.5 text-ink-70">
                <MailIcon className="h-4 w-4 text-ink-30" /> {customer.email}
              </p>
              <p className="flex items-center gap-2.5 text-ink-70">
                <PhoneIcon className="h-4 w-4 text-ink-30" /> {customer.phone}
              </p>
              <p className="flex items-center gap-2.5 text-ink-70">
                <MapPinIcon className="h-4 w-4 text-ink-30" /> {customer.city}, Bangladesh
              </p>
            </div>
            <div className="flex gap-2 border-t border-line p-4">
              <Button size="sm" variant="secondary" className="flex-1" onClick={() => toast('info', 'Compose message', `Email drafted to ${customer.name}.`)}>
                Send email
              </Button>
              <Button size="sm" variant="secondary" icon={BanIcon} onClick={() => setBlockOpen(true)}>
                Block
              </Button>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-8">
          <Card>
            <CardHeader title="Order history" subtitle={`${history.length} orders on record`} />
            {history.length === 0 ?
            <EmptyState
              icon={ShoppingBagIcon}
              title="No orders yet"
              description="This customer has registered but hasn't placed an order. Consider sending a welcome coupon."
              action={
              <Link to="/coupons">
                    <Button variant="secondary">Create coupon</Button>
                  </Link>
              } /> :


            <ul className="divide-y divide-line">
                {history.map((o) =>
              <li key={o.id}>
                    <Link to={`/orders/${o.id}`} className="flex flex-wrap items-center gap-4 px-5 py-4 transition-colors duration-150 ease-out hover:bg-cream/50">
                      <div className="flex -space-x-2">
                        {o.items.slice(0, 3).map((it) =>
                    <img key={it.productId} src={it.image} alt="" className="h-10 w-10 rounded-lg border-2 border-surface object-cover" />
                    )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">{o.id}</p>
                        <p className="text-[12.5px] text-ink-50">
                          {shortDate(o.date)} · {o.items.reduce((s, i) => s + i.qty, 0)} items · {o.method}
                        </p>
                      </div>
                      <StatusPill status={o.status} />
                      <p className="w-24 text-right text-sm font-medium text-ink">{bdt(o.total)}</p>
                    </Link>
                  </li>
              )}
              </ul>
            }
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={() => {
          setBlockOpen(false);
          toast('success', 'Customer blocked', `${customer.name} can no longer place orders.`);
        }}
        title="Block this customer?"
        message={`${customer.name} will be prevented from placing new orders. Existing orders are unaffected.`}
        confirmLabel="Block customer" />
      
    </>);

}