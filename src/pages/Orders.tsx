import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, EyeIcon, DownloadIcon, ArrowUpDownIcon, PrinterIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, Pagination, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { orders, orderStatuses } from '../data/orders';
import { bdt, shortDate, classNames } from '../utils/format';

const PER_PAGE = 8;

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'] as const;

export function Orders() {
  const toast = useToast();
  const [tab, setTab] = useState<(typeof tabs)[number]>('All');
  const [query, setQuery] = useState('');
  const [payment, setPayment] = useState('All payments');
  const [sort, setSort] = useState('Newest first');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = orders.filter((o) => {
      const matchTab = tab === 'All' || o.status === tab;
      const matchQ = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.phone.includes(q);
      const matchP = payment === 'All payments' || o.payment === payment;
      return matchTab && matchQ && matchP;
    });
    return [...list].sort((a, b) =>
    sort === 'Newest first' ?
    b.date.localeCompare(a.date) :
    sort === 'Oldest first' ?
    a.date.localeCompare(b.date) :
    b.total - a.total
    );
  }, [tab, query, payment, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const counts = orderStatuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <>
      <PageHeader title="Orders" subtitle={`${orders.length} orders · ${counts.Pending ?? 0} awaiting confirmation`}>
        <Button variant="secondary" icon={PrinterIcon} onClick={() => toast('info', 'Preparing labels', 'Shipping labels for today’s orders are being generated.')}>
          Print labels
        </Button>
        <Button variant="secondary" icon={DownloadIcon} onClick={() => toast('success', 'Export ready', 'Orders exported as CSV.')}>
          Export
        </Button>
      </PageHeader>

      <Card>
        <div className="scroll-thin flex gap-1 overflow-x-auto border-b border-line px-3 pt-3">
          {tabs.map((t) =>
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className={classNames(
              'relative whitespace-nowrap rounded-t-lg px-3.5 py-2.5 text-[13px] transition-colors duration-150 ease-out',
              tab === t ? 'font-medium text-ink' : 'text-ink-50 hover:text-ink'
            )}>
            
              {t}
              {t !== 'All' ? <span className="ml-1.5 text-ink-30">{counts[t] ?? 0}</span> : null}
              {tab === t ? <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-terracotta" /> : null}
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="Search order ID, customer or phone…"
            className="min-w-[240px] flex-1" />
          
          <Select label="Payment" value={payment} onChange={setPayment} options={['All payments', 'Paid', 'Unpaid', 'COD', 'Refunded']} className="w-[170px]" />
          <Select label="Sort" value={sort} onChange={setSort} options={['Newest first', 'Oldest first', 'Highest value']} className="w-[170px]" />
          <IconButton label="Toggle sort direction" icon={ArrowUpDownIcon} onClick={() => setSort(sort === 'Newest first' ? 'Oldest first' : 'Newest first')} />
        </div>

        {filtered.length === 0 ?
        <EmptyState
          icon={ShoppingBagIcon}
          title="No orders here yet"
          description="Nothing matches this view. Try another status tab or clear the search."
          action={
          <Button
            variant="secondary"
            onClick={() => {
              setTab('All');
              setQuery('');
              setPayment('All payments');
            }}>
            
                Reset filters
              </Button>
          } /> :


        <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Order</Th>
                  <Th>Customer</Th>
                  <Th>Date</Th>
                  <Th>Products</Th>
                  <Th>Total</Th>
                  <Th>Payment</Th>
                  <Th>Order status</Th>
                  <Th>Delivery</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {view.map((o) =>
              <Tr key={o.id}>
                    <Td>
                      <Link to={`/orders/${o.id}`} className="font-medium text-ink hover:text-brown">
                        {o.id}
                      </Link>
                    </Td>
                    <Td>
                      <p className="font-medium text-ink">{o.customer}</p>
                      <p className="text-[12px] text-ink-50">{o.phone}</p>
                    </Td>
                    <Td className="whitespace-nowrap text-[13px]">{shortDate(o.date)}</Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {o.items.slice(0, 3).map((it) =>
                      <img key={it.productId} src={it.image} alt="" className="h-8 w-8 rounded-lg border-2 border-surface object-cover" />
                      )}
                        </div>
                        <span className="text-[12.5px] text-ink-50">
                          {o.items.reduce((s, i) => s + i.qty, 0)} items
                        </span>
                      </div>
                    </Td>
                    <Td className="font-medium text-ink">{bdt(o.total)}</Td>
                    <Td>
                      <StatusPill status={o.payment} />
                    </Td>
                    <Td>
                      <StatusPill status={o.status} />
                    </Td>
                    <Td>
                      <p className="text-[13px] text-ink">{o.courier}</p>
                      <p className="text-[12px] text-ink-50">{o.tracking}</p>
                    </Td>
                    <Td>
                      <div className="flex justify-end">
                        <Link
                      to={`/orders/${o.id}`}
                      aria-label={`View ${o.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-70 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink">
                      
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </Td>
                  </Tr>
              )}
              </tbody>
            </TableShell>
            <Pagination page={page} pages={pages} total={filtered.length} onPage={setPage} />
          </>
        }
      </Card>
    </>);

}