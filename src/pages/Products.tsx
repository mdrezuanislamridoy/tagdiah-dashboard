import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PackageIcon,
  PencilIcon,
  Trash2Icon,
  CopyIcon,
  SlidersHorizontalIcon,
  StarIcon,
  UploadIcon } from
'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, Pagination, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { products as seed } from '../data/products';
import { categoryNames } from '../data/categories';
import { bdt, shortDate } from '../utils/format';
import type { Product } from '../types';

const PER_PAGE = 8;

export function Products() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>(seed);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  const filtered = useMemo(
    () =>
    items.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchC = category === 'All categories' || p.category === category;
      const matchS =
      status === 'All statuses' || (
      status === 'Low stock' ? p.stock > 0 && p.stock <= p.lowStockAt : p.status === status);
      return matchQ && matchC && matchS;
    }),
    [items, query, category, status]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allChecked = view.length > 0 && view.every((p) => selected.includes(p.id));

  const toggleAll = () =>
  setSelected(allChecked ? selected.filter((id) => !view.some((p) => p.id === id)) : [...new Set([...selected, ...view.map((p) => p.id)])]);

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const reset = () => {
    setQuery('');
    setCategory('All categories');
    setStatus('All statuses');
    setPage(1);
  };

  return (
    <>
      <PageHeader title="Products" subtitle={`${items.length} pieces across 3 collections`}>
        <Button variant="secondary" icon={UploadIcon} onClick={() => toast('info', 'Import started', 'Upload a CSV to bulk-create products.')}>
          Import CSV
        </Button>
        <Button icon={PlusIcon} onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput value={query} onChange={(v) => {setQuery(v);setPage(1);}} placeholder="Search by name or SKU…" className="min-w-[240px] flex-1" />
          <Select
            label="Category"
            value={category}
            onChange={(v) => {setCategory(v);setPage(1);}}
            options={['All categories', ...categoryNames]}
            className="w-[180px]" />
          
          <Select
            label="Status"
            value={status}
            onChange={(v) => {setStatus(v);setPage(1);}}
            options={['All statuses', 'Active', 'Draft', 'Out of Stock', 'Low stock']}
            className="w-[160px]" />
          
          <IconButton label="More filters" icon={SlidersHorizontalIcon} onClick={() => toast('info', 'Advanced filters', 'Filter by price band, vendor and tags.')} />
        </div>

        {selected.length > 0 ?
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-cream/70 px-5 py-3">
            <p className="text-[13px] font-medium text-ink">{selected.length} selected</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => {toast('success', 'Products published', `${selected.length} products are now active.`);setSelected([]);}}>
                Set active
              </Button>
              <Button size="sm" variant="secondary" onClick={() => {toast('success', 'Moved to draft', `${selected.length} products unpublished.`);setSelected([]);}}>
                Move to draft
              </Button>
              <Button size="sm" variant="secondary" icon={StarIcon} onClick={() => {toast('success', 'Marked as featured', 'These pieces will appear on the homepage.');setSelected([]);}}>
                Feature
              </Button>
              <Button size="sm" variant="danger" icon={Trash2Icon} onClick={() => setBulkDelete(true)}>
                Delete
              </Button>
            </div>
            <button onClick={() => setSelected([])} className="ml-auto text-[13px] text-ink-50 hover:text-ink">
              Clear selection
            </button>
          </div> :
        null}

        {filtered.length === 0 ?
        <EmptyState
          icon={PackageIcon}
          title="No products match these filters"
          description="Try a different search term, or clear the filters to see the full catalogue."
          action={
          <Button variant="secondary" onClick={reset}>
                Clear filters
              </Button>
          } /> :


        <>
            <TableShell>
              <thead>
                <tr>
                  <Th className="w-10">
                    <input
                    type="checkbox"
                    aria-label="Select all products"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-line text-ink accent-ink" />
                  
                  </Th>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {view.map((p) =>
              <Tr key={p.id}>
                    <Td>
                      <input
                    type="checkbox"
                    aria-label={`Select ${p.name}`}
                    checked={selected.includes(p.id)}
                    onChange={() => toggle(p.id)}
                    className="h-4 w-4 rounded border-line accent-ink" />
                  
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Link to={`/products/${p.id}/edit`} className="truncate font-medium text-ink hover:text-brown">
                              {p.name}
                            </Link>
                            {p.featured ? <StarIcon className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" /> : null}
                          </div>
                          <p className="text-[12px] text-ink-50">{p.sku}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-ink">{p.category}</p>
                      <p className="text-[12px] text-ink-50">{p.subcategory}</p>
                    </Td>
                    <Td>
                      {p.discountPrice ?
                  <div>
                          <span className="font-medium text-ink">{bdt(p.discountPrice)}</span>
                          <span className="ml-1.5 text-[12px] text-ink-30 line-through">{bdt(p.price)}</span>
                        </div> :

                  <span className="font-medium text-ink">{bdt(p.price)}</span>
                  }
                    </Td>
                    <Td>
                      <span
                    className={
                    p.stock === 0 ? 'font-medium text-danger' : p.stock <= p.lowStockAt ? 'font-medium text-gold' : 'text-ink'
                    }>
                    
                        {p.stock} units
                      </span>
                    </Td>
                    <Td>
                      <StatusPill status={p.status} />
                    </Td>
                    <Td className="whitespace-nowrap text-[13px]">{shortDate(p.updatedAt)}</Td>
                    <Td>
                      <div className="flex justify-end gap-1.5">
                        <IconButton label="Edit product" icon={PencilIcon} onClick={() => navigate(`/products/${p.id}/edit`)} />
                        <IconButton
                      label="Duplicate product"
                      icon={CopyIcon}
                      onClick={() => toast('success', 'Product duplicated', `A draft copy of ${p.name} was created.`)} />
                    
                        <IconButton label="Delete product" icon={Trash2Icon} onClick={() => setToDelete(p)} className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger" />
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

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          setItems((list) => list.filter((p) => p.id !== toDelete?.id));
          toast('success', 'Product deleted', `${toDelete?.name} was removed from the catalogue.`);
          setToDelete(null);
        }}
        title="Delete this product?"
        message={`${toDelete?.name ?? ''} will be removed from the storefront immediately. Past orders keep their record.`} />
      

      <ConfirmDialog
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        onConfirm={() => {
          setItems((list) => list.filter((p) => !selected.includes(p.id)));
          toast('success', 'Products deleted', `${selected.length} products removed.`);
          setSelected([]);
          setBulkDelete(false);
        }}
        title={`Delete ${selected.length} products?`}
        message="These products will be unlisted from the storefront right away. This cannot be undone." />
      
    </>);

}