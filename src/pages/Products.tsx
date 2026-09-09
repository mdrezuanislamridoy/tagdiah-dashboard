import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  PackageIcon,
  PencilIcon,
  Trash2Icon,
  SlidersHorizontalIcon,
  StarIcon,
  UploadIcon,
  Loader2,
  Sparkles,
  Flame,
} from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, Pagination, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { ConfirmDialog } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { api } from '../utils/api';
import { bdt, shortDate } from '../utils/format';
import type { Product } from '../types';

const PER_PAGE = 8;

export function Products() {
  const toast = useToast();
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [status, setStatus] = useState('All statuses');
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [bulkDelete, setBulkDelete] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodsData, catsData] = await Promise.allSettled([
        api.get<any[]>('/products'),
        api.get<any[]>('/categories'),
      ]);

      if (catsData.status === 'fulfilled' && Array.isArray(catsData.value)) {
        setCategories(catsData.value.map((c) => ({ id: c.id, name: c.name, slug: c.slug })));
      }

      if (prodsData.status === 'fulfilled' && Array.isArray(prodsData.value)) {
        const mapped: Product[] = prodsData.value.map((p) => {
          let image = '/bs-curtain.jpg';
          try {
            if (typeof p.images === 'string') {
              const parsed = JSON.parse(p.images);
              if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
            } else if (Array.isArray(p.images) && p.images.length > 0) {
              image = p.images[0];
            }
          } catch {}

          return {
            id: p.id,
            sku: p.sku,
            name: p.name,
            slug: p.slug,
            price: p.price,
            discountPrice: p.compareAt ? p.price : undefined,
            compareAt: p.compareAt,
            stock: p.stock ?? 0,
            lowStockAt: p.lowStockAt ?? 5,
            status: (p.status || 'Active') as Product['status'],
            category: p.category?.name || 'Curtains',
            subcategory: p.category?.slug || '',
            image,
            featured: !!p.featured,
            bestSeller: !!p.bestSeller || p.badge === 'Best Seller',
            newArrival: !!p.newArrival || p.badge === 'New Arrival',
            updatedAt: p.updatedAt ? p.updatedAt.split('T')[0] : '2026-09-09',
            description: p.description || '',
            story: p.story || '',
            material: 'Natural',
            origin: 'Bangladesh',
            daysToMake: 3,
            artisan: 'Tagdiah Studio',
            dimensions: 'Standard',
            tags: [],
            variations: [],
            rating: 5,
            reviewsCount: 0,
          };
        });
        setItems(mapped);
      }
    } catch (err: any) {
      toast('error', 'Failed to load products', err?.message || 'Could not fetch from database.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categoryOptions = useMemo(() => {
    return ['All categories', ...categories.map((c) => c.name)];
  }, [categories]);

  const filtered = useMemo(
    () =>
      items.filter((p) => {
        const q = query.trim().toLowerCase();
        const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
        const matchC = category === 'All categories' || p.category === category;
        const matchS =
          status === 'All statuses' ||
          (status === 'Low stock'
            ? p.stock > 0 && p.stock <= p.lowStockAt
            : status === 'Best Sellers'
            ? p.bestSeller
            : status === 'New Arrivals'
            ? p.newArrival
            : p.status === status);
        return matchQ && matchC && matchS;
      }),
    [items, query, category, status]
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allChecked = view.length > 0 && view.every((p) => selected.includes(p.id));

  const toggleAll = () =>
    setSelected(
      allChecked
        ? selected.filter((id) => !view.some((p) => p.id === id))
        : [...new Set([...selected, ...view.map((p) => p.id)])]
    );

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const reset = () => {
    setQuery('');
    setCategory('All categories');
    setStatus('All statuses');
    setPage(1);
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await api.delete(`/products/${toDelete.id}`);
      toast('success', 'Product deleted', `${toDelete.name} was removed from the database.`);
      setToDelete(null);
      await loadData();
    } catch (err: any) {
      toast('error', 'Failed to delete product', err?.message || 'Could not delete product.');
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selected.map((id) => api.delete(`/products/${id}`)));
      toast('success', 'Products deleted', `${selected.length} products removed from database.`);
      setSelected([]);
      setBulkDelete(false);
      await loadData();
    } catch (err: any) {
      toast('error', 'Bulk delete failed', err?.message || 'Some products could not be deleted.');
    }
  };

  return (
    <>
      <PageHeader title="Products" subtitle={`${items.length} pieces loaded dynamically from backend database`}>
        <Button variant="secondary" icon={UploadIcon} onClick={() => toast('info', 'Database Synced', 'All products are connected live to PostgreSQL.')}>
          Sync DB
        </Button>
        <Button icon={PlusIcon} onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="Search by name or SKU…"
            className="min-w-[240px] flex-1"
          />
          <Select
            label="Category"
            value={category}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            options={categoryOptions}
            className="w-[180px]"
          />
          <Select
            label="Status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={['All statuses', 'Active', 'Draft', 'Out of Stock', 'Low stock', 'Best Sellers', 'New Arrivals']}
            className="w-[160px]"
          />
          <IconButton
            label="Refresh"
            icon={SlidersHorizontalIcon}
            onClick={loadData}
          />
        </div>

        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 border-b border-line bg-cream/70 px-5 py-3">
            <p className="text-[13px] font-medium text-ink">{selected.length} selected</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="danger" icon={Trash2Icon} onClick={() => setBulkDelete(true)}>
                Delete Selected
              </Button>
            </div>
            <button onClick={() => setSelected([])} className="ml-auto text-[13px] text-ink-50 hover:text-ink">
              Clear selection
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-50">
            <Loader2 className="h-8 w-8 animate-spin text-ink-30 mb-3" />
            <p className="text-sm font-medium">Fetching catalogue from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={PackageIcon}
            title="No products match these filters"
            description="Try a different search term, or clear the filters to see the full catalogue."
            action={
              <Button variant="secondary" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        ) : (
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
                      className="h-4 w-4 rounded border-line text-ink accent-ink"
                    />
                  </Th>
                  <Th>Product</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Badges</Th>
                  <Th>Stock</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {view.map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${p.name}`}
                        checked={selected.includes(p.id)}
                        onChange={() => toggle(p.id)}
                        className="h-4 w-4 rounded border-line accent-ink"
                      />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="h-11 w-11 rounded-lg object-cover bg-cream" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Link to={`/products/${p.id}/edit`} className="truncate font-medium text-ink hover:text-brown">
                              {p.name}
                            </Link>
                            {p.featured && <StarIcon className="h-3.5 w-3.5 shrink-0 fill-gold text-gold" />}
                          </div>
                          <p className="text-[12px] text-ink-50">{p.sku}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-ink">{p.category}</p>
                    </Td>
                    <Td>
                      {p.compareAt ? (
                        <div>
                          <span className="font-medium text-ink">{bdt(p.price)}</span>
                          <span className="ml-1.5 text-[12px] text-ink-30 line-through">{bdt(p.compareAt)}</span>
                        </div>
                      ) : (
                        <span className="font-medium text-ink">{bdt(p.price)}</span>
                      )}
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {p.bestSeller && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[10px] font-semibold">
                            <Flame className="w-2.5 h-2.5" /> Best Seller
                          </span>
                        )}
                        {p.newArrival && (
                          <span className="inline-flex items-center gap-0.5 rounded bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-semibold">
                            <Sparkles className="w-2.5 h-2.5" /> New
                          </span>
                        )}
                        {!p.bestSeller && !p.newArrival && (
                          <span className="text-[11px] text-ink-40">—</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <span
                        className={
                          p.stock === 0
                            ? 'font-medium text-danger'
                            : p.stock <= p.lowStockAt
                            ? 'font-medium text-gold'
                            : 'text-ink'
                        }
                      >
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
                          label="Delete product"
                          icon={Trash2Icon}
                          onClick={() => setToDelete(p)}
                          className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={page} pages={pages} total={filtered.length} onPage={setPage} />
          </>
        )}
      </Card>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete this product?"
        message={`${toDelete?.name ?? ''} will be permanently removed from the database and storefront.`}
      />

      <ConfirmDialog
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        onConfirm={confirmBulkDelete}
        title={`Delete ${selected.length} products?`}
        message="These products will be removed from the database right away. This cannot be undone."
      />
    </>
  );
}