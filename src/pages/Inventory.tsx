import React, { useMemo, useState } from 'react';
import { RefreshCwIcon, PlusIcon, MinusIcon, AlertTriangleIcon, WarehouseIcon, HistoryIcon } from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, SearchInput, Select, TextArea, TextInput } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, RowSkeleton, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { products as seed } from '../data/products';
import { stockMovements } from '../data/analytics';
import { classNames } from '../utils/format';
import type { Product } from '../types';

const stockLabel = (p: Product) => p.stock === 0 ? 'Out of Stock' : p.stock <= p.lowStockAt ? 'Low Stock' : 'In Stock';

export function Inventory() {
  const toast = useToast();
  const [items, setItems] = useState<Product[]>(seed);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All stock');
  const [loading, setLoading] = useState(false);
  const [adjusting, setAdjusting] = useState<Product | null>(null);
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('Restock');
  const [note, setNote] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchF = filter === 'All stock' || stockLabel(p) === filter;
      return matchQ && matchF;
    });
  }, [items, query, filter]);

  const lowCount = items.filter((p) => p.stock > 0 && p.stock <= p.lowStockAt).length;
  const outCount = items.filter((p) => p.stock === 0).length;
  const totalUnits = items.reduce((s, p) => s + p.stock, 0);

  const sync = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast('success', 'Inventory synced', 'Stock levels updated from the Mirpur warehouse.');
    }, 1200);
  };

  const applyAdjustment = () => {
    if (!adjusting || delta === 0) {
      toast('error', 'Nothing to adjust', 'Enter a quantity above or below zero.');
      return;
    }
    setItems((list) =>
    list.map((p) => p.id === adjusting.id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
    );
    toast('success', 'Stock adjusted', `${adjusting.sku} ${delta > 0 ? '+' : ''}${delta} units · ${reason}.`);
    setAdjusting(null);
    setDelta(0);
    setNote('');
  };

  return (
    <>
      <PageHeader title="Inventory" subtitle={`${totalUnits.toLocaleString()} units in stock across ${items.length} SKUs`}>
        <Button variant="secondary" icon={RefreshCwIcon} onClick={sync} disabled={loading}>
          {loading ? 'Syncing…' : 'Sync stock'}
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
        { label: 'Healthy stock', value: items.length - lowCount - outCount, tone: 'text-sage', bg: 'bg-sage-tint' },
        { label: 'Low stock', value: lowCount, tone: 'text-gold', bg: 'bg-gold-tint' },
        { label: 'Out of stock', value: outCount, tone: 'text-danger', bg: 'bg-danger-tint' }].
        map((s) =>
        <div key={s.label} className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card">
            <span className={classNames('flex h-11 w-11 items-center justify-center rounded-xl', s.bg, s.tone)}>
              <AlertTriangleIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl leading-none text-ink">{s.value}</p>
              <p className="mt-1 text-[13px] text-ink-50">{s.label}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
            <SearchInput value={query} onChange={setQuery} placeholder="Search product or SKU…" className="min-w-[220px] flex-1" />
            <Select label="Stock status" value={filter} onChange={setFilter} options={['All stock', 'In Stock', 'Low Stock', 'Out of Stock']} className="w-[170px]" />
          </div>

          {filtered.length === 0 && !loading ?
          <EmptyState
            icon={WarehouseIcon}
            title="Nothing to show"
            description="No SKUs match this filter. Try another stock status or clear the search."
            action={<Button variant="secondary" onClick={() => {setQuery('');setFilter('All stock');}}>Clear filters</Button>} /> :


          <TableShell>
              <thead>
                <tr>
                  <Th>Product</Th>
                  <Th>SKU</Th>
                  <Th>Current stock</Th>
                  <Th>Reorder point</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Adjust</Th>
                </tr>
              </thead>
              <tbody>
                {loading ?
              Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} cols={6} />) :
              filtered.map((p) =>
              <Tr key={p.id}>
                        <Td>
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            <p className="min-w-0 truncate font-medium text-ink">{p.name}</p>
                          </div>
                        </Td>
                        <Td className="font-mono text-[12.5px]">{p.sku}</Td>
                        <Td>
                          <span
                    className={classNames(
                      'font-medium',
                      p.stock === 0 ? 'text-danger' : p.stock <= p.lowStockAt ? 'text-gold' : 'text-ink'
                    )}>
                    
                            {p.stock}
                          </span>
                        </Td>
                        <Td>{p.lowStockAt}</Td>
                        <Td>
                          <StatusPill status={stockLabel(p)} />
                        </Td>
                        <Td>
                          <div className="flex justify-end">
                            <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setAdjusting(p);
                        setDelta(0);
                        setReason('Restock');
                      }}>
                      
                              Adjust
                            </Button>
                          </div>
                        </Td>
                      </Tr>
              )}
              </tbody>
            </TableShell>
          }
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader title="Stock history" subtitle="Last 5 movements" />
          <ol className="divide-y divide-line">
            {stockMovements.map((m) =>
            <li key={m.id} className="flex gap-3 px-5 py-3.5">
                <span
                className={classNames(
                  'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                  m.change > 0 ? 'bg-sage-tint text-sage' : 'bg-danger-tint text-danger'
                )}>
                
                  {m.change > 0 ? <PlusIcon className="h-4 w-4" /> : <MinusIcon className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{m.product}</p>
                  <p className="truncate text-[12px] text-ink-50">
                    {m.change > 0 ? '+' : ''}
                    {m.change} units · {m.reason}
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink-30">
                    {m.by} · {m.at}
                  </p>
                </div>
              </li>
            )}
          </ol>
          <div className="border-t border-line p-4">
            <Button
              variant="secondary"
              icon={HistoryIcon}
              className="w-full"
              onClick={() => toast('info', 'Full history', 'Opening the complete stock ledger.')}>
              
              View full ledger
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={!!adjusting}
        onClose={() => setAdjusting(null)}
        title="Adjust stock"
        description={adjusting ? `${adjusting.name} · currently ${adjusting.stock} units` : ''}
        footer={
        <>
            <Button variant="secondary" onClick={() => setAdjusting(null)}>
              Cancel
            </Button>
            <Button onClick={applyAdjustment}>Apply adjustment</Button>
          </>
        }>
        
        <div className="space-y-4">
          <Field label="Quantity change" hint="Use a negative number to remove units.">
            <div className="flex items-center gap-2">
              <Button variant="secondary" icon={MinusIcon} onClick={() => setDelta((d) => d - 1)} aria-label="Decrease" />
              <TextInput type="number" value={delta} onChange={(e) => setDelta(Number(e.target.value))} className="text-center" />
              <Button variant="secondary" icon={PlusIcon} onClick={() => setDelta((d) => d + 1)} aria-label="Increase" />
            </div>
          </Field>
          <Field label="Reason">
            <Select label="Reason" value={reason} onChange={setReason} options={['Restock', 'Damaged', 'Returned to supplier', 'Stock count correction', 'Sample / gifting']} />
          </Field>
          <Field label="Note" hint="Optional. Visible in the stock ledger.">
            <TextArea rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
          {adjusting ?
          <p className="rounded-xl border border-line bg-cream/50 px-4 py-3 text-[13px] text-ink-70">
              New stock level:{' '}
              <span className="font-medium text-ink">{Math.max(0, adjusting.stock + delta)} units</span>
            </p> :
          null}
        </div>
      </Modal>
    </>);

}