import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ImagePlusIcon, PlusIcon, Trash2Icon, XIcon, Loader2, Sparkles, Flame } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextArea, TextInput, Toggle } from '../components/ui/Fields';
import { useToast } from '../components/ui/Toast';
import { api } from '../utils/api';
import type { Variation } from '../types';

export function ProductForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(mode === 'edit');
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    categoryId: '',
    price: 0,
    compareAt: undefined as number | undefined,
    stock: 20,
    lowStockAt: 5,
    status: 'Active',
    featured: false,
    bestSeller: false,
    newArrival: false,
    badge: '',
    description: '',
    story: '',
    seoTitle: '',
    seoDescription: '',
    variations: [] as Variation[],
  });

  const [gallery, setGallery] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  // Load Categories and Product Data (if editing)
  const initData = useCallback(async () => {
    try {
      if (mode === 'edit') setLoading(true);
      const [catsRes, prodRes] = await Promise.allSettled([
        api.get<any[]>('/categories'),
        mode === 'edit' && id ? api.get<any>(`/products/${id}`) : Promise.resolve(null),
      ]);

      if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
        setCategories(catsRes.value.map((c) => ({ id: c.id, name: c.name, slug: c.slug })));
      }

      if (prodRes.status === 'fulfilled' && prodRes.value) {
        const p = prodRes.value;
        let images: string[] = [];
        try {
          if (typeof p.images === 'string') images = JSON.parse(p.images);
          else if (Array.isArray(p.images)) images = p.images;
        } catch {
          images = p.images ? [p.images] : [];
        }

        setForm({
          name: p.name || '',
          slug: p.slug || '',
          sku: p.sku || '',
          categoryId: p.categoryId || (p.category ? p.category.id : ''),
          price: p.price || 0,
          compareAt: p.compareAt || undefined,
          stock: p.stock ?? 0,
          lowStockAt: p.lowStockAt ?? 5,
          status: p.status || 'Active',
          featured: !!p.featured,
          bestSeller: !!p.bestSeller || p.badge === 'Best Seller',
          newArrival: !!p.newArrival || p.badge === 'New Arrival',
          badge: p.badge || '',
          description: p.description || '',
          story: p.story || '',
          seoTitle: p.seoTitle || '',
          seoDescription: p.seoDescription || '',
          variations: p.variations || [],
        });
        setGallery(images);
      }
    } catch (err: any) {
      toast('error', 'Error loading data', err?.message || 'Could not fetch details.');
    } finally {
      setLoading(false);
    }
  }, [mode, id, toast]);

  useEffect(() => {
    initData();
  }, [initData]);

  const categoryNames = categories.map((c) => c.name);
  const selectedCategoryName =
    categories.find((c) => c.id === form.categoryId)?.name ||
    (categories.length > 0 ? categories[0].name : 'Curtains');

  const onCategoryChange = (catName: string) => {
    const found = categories.find((c) => c.name === catName);
    if (found) {
      set('categoryId', found.id);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required.';
    if (!form.sku.trim()) e.sku = 'SKU is required for inventory tracking.';
    if (!form.price || form.price <= 0) e.price = 'Enter a price greater than zero.';
    if (form.compareAt && form.compareAt <= form.price) {
      e.compareAt = 'Regular price must be greater than sale price.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (publish: boolean) => {
    if (!validate()) {
      toast('error', 'Check the highlighted fields', 'A few required details are missing.');
      return;
    }

    try {
      setSubmitting(true);
      const finalImages = gallery.length > 0 ? gallery : ['/bs-curtain.jpg'];
      const slug =
        form.slug.trim() ||
        form.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      // Determine categoryId fallback
      let categoryId = form.categoryId;
      if (!categoryId && categories.length > 0) {
        categoryId = categories[0].id;
      }

      // Determine badge
      let badge = form.badge.trim();
      if (form.bestSeller && !badge) badge = 'Best Seller';
      if (form.newArrival && !badge) badge = 'New Arrival';

      const payload = {
        name: form.name.trim(),
        slug,
        sku: form.sku.trim(),
        price: Number(form.price),
        compareAt: form.compareAt ? Number(form.compareAt) : undefined,
        stock: Number(form.stock),
        lowStockAt: Number(form.lowStockAt),
        status: publish ? 'Active' : form.status,
        featured: form.featured,
        bestSeller: form.bestSeller,
        newArrival: form.newArrival,
        badge: badge || undefined,
        categoryId: categoryId || undefined,
        images: JSON.stringify(finalImages),
        description: form.description.trim() || undefined,
        story: form.story.trim() || undefined,
        seoTitle: form.seoTitle.trim() || undefined,
        seoDescription: form.seoDescription.trim() || undefined,
      };

      if (mode === 'create') {
        await api.post('/products', payload);
        toast('success', 'Product published', `${form.name} was successfully created in the database.`);
      } else if (mode === 'edit' && id) {
        await api.put(`/products/${id}`, payload);
        toast('success', 'Product updated', `${form.name} was saved to the database.`);
      }

      navigate('/products');
    } catch (err: any) {
      toast('error', 'Failed to save product', err?.message || 'Database error.');
    } finally {
      setSubmitting(false);
    }
  };

  const addImageToGallery = () => {
    if (!newImageUrl.trim()) return;
    setGallery((g) => [...g, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const addVariation = () => {
    const v: Variation = { id: `v-${Date.now()}`, type: 'Size', value: '', stock: 0, priceDelta: 0 };
    set('variations', [...form.variations, v]);
  };

  const updateVariation = (vid: string, patch: Partial<Variation>) =>
    set('variations', form.variations.map((v) => (v.id === vid ? { ...v, ...patch } : v)));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-ink-50">
        <Loader2 className="h-9 w-9 animate-spin text-ink-30 mb-3" />
        <p className="text-sm font-medium">Loading product details from database...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link to="/products" className="mb-2 inline-flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-brown">
            <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to products
          </Link>
          <h1 className="font-display text-2xl leading-tight text-ink">
            {mode === 'create' ? 'Add product' : form.name}
          </h1>
          <p className="mt-1 text-sm text-ink-50">
            {mode === 'create' ? 'List a new piece in the live Tagdiah database catalogue.' : `SKU ${form.sku}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/products')} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => submit(false)} disabled={submitting}>
            Save as draft
          </Button>
          <Button onClick={() => submit(true)} disabled={submitting}>
            {submitting ? 'Saving...' : mode === 'create' ? 'Publish product' : 'Save changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <Card>
            <CardHeader title="Product details" />
            <div className="space-y-4 p-5">
              <Field label="Product name" required error={errors.name}>
                <TextInput
                  value={form.name}
                  invalid={!!errors.name}
                  placeholder="e.g. Premium Embroidery Curtain"
                  onChange={(e) => set('name', e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category" required>
                  <Select
                    label="Category"
                    value={selectedCategoryName}
                    onChange={onCategoryChange}
                    options={categoryNames.length > 0 ? categoryNames : ['Curtains', 'Bedding', 'Home Decor', 'Wall Decor', 'Kitchen & Dining']}
                  />
                </Field>
                <Field label="URL Slug (Optional)" hint="Auto-generated if left empty">
                  <TextInput
                    placeholder="e.g. premium-embroidery-curtain"
                    value={form.slug}
                    onChange={(e) => set('slug', e.target.value)}
                  />
                </Field>
              </div>

              <Field label="Description" hint="Describe materials, dimensions and craft details. Shown on product detail page.">
                <TextArea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
              </Field>

              <Field label="Artisan Story / Origin" hint="Generational craft details and workshop notes.">
                <TextArea rows={2} value={form.story} onChange={(e) => set('story', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Media" subtitle="First image is used as the catalogue thumbnail" />
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.map((src, i) => (
                  <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line bg-cream">
                    <img src={src} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-medium text-white">
                        Cover
                      </span>
                    )}
                    <button
                      onClick={() => setGallery((g) => g.filter((_, x) => x !== i))}
                      aria-label={`Remove image ${i + 1}`}
                      className="absolute right-2 top-2 rounded-full bg-surface/90 p-1 text-ink-70 opacity-0 transition-opacity duration-150 ease-out hover:text-danger group-hover:opacity-100"
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <TextInput
                  placeholder="Enter image URL or path (e.g. /bs-curtain.jpg or https://...)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" icon={ImagePlusIcon} onClick={addImageToGallery}>
                  Add Image
                </Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Variations"
              subtitle="Offer this piece in multiple sizes or colours"
              action={
                <Button size="sm" variant="secondary" icon={PlusIcon} onClick={addVariation}>
                  Add variation
                </Button>
              }
            />
            <div className="p-5">
              {form.variations.length === 0 ? (
                <p className="rounded-xl border border-dashed border-beige bg-cream/40 px-4 py-6 text-center text-[13px] text-ink-50">
                  No variations yet. The product will sell as a single option.
                </p>
              ) : (
                <ul className="space-y-3">
                  {form.variations.map((v) => (
                    <li key={v.id} className="grid grid-cols-1 gap-3 rounded-xl border border-line p-3 sm:grid-cols-[120px_1fr_110px_130px_auto]">
                      <Select label="Variation type" value={v.type} onChange={(t) => updateVariation(v.id, { type: t as Variation['type'] })} options={['Size', 'Color']} />
                      <TextInput placeholder="e.g. 7ft / 8ft or Cream" value={v.value} onChange={(e) => updateVariation(v.id, { value: e.target.value })} />
                      <TextInput type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariation(v.id, { stock: Number(e.target.value) })} />
                      <TextInput type="number" placeholder="+ Price" value={v.priceDelta} onChange={(e) => updateVariation(v.id, { priceDelta: Number(e.target.value) })} />
                      <IconButton
                        label="Remove variation"
                        icon={Trash2Icon}
                        onClick={() => set('variations', form.variations.filter((x) => x.id !== v.id))}
                        className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader title="Pricing" />
            <div className="space-y-4 p-5">
              <Field label="Selling Price (৳)" required error={errors.price}>
                <TextInput
                  type="number"
                  invalid={!!errors.price}
                  value={form.price}
                  onChange={(e) => set('price', Number(e.target.value))}
                />
              </Field>
              <Field label="Regular Price / Strikethrough (৳)" error={errors.compareAt} hint="Shown crossed-out next to selling price.">
                <TextInput
                  type="number"
                  invalid={!!errors.compareAt}
                  value={form.compareAt ?? ''}
                  onChange={(e) => set('compareAt', e.target.value ? Number(e.target.value) : undefined)}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Inventory" />
            <div className="space-y-4 p-5">
              <Field label="SKU" required error={errors.sku}>
                <TextInput invalid={!!errors.sku} placeholder="TGD-CR-0001" value={form.sku} onChange={(e) => set('sku', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Quantity">
                  <TextInput type="number" value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} />
                </Field>
                <Field label="Low-stock alert">
                  <TextInput type="number" value={form.lowStockAt} onChange={(e) => set('lowStockAt', Number(e.target.value))} />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Storefront Promotion Badges" subtitle="Controls where this item displays on the homepage" />
            <div className="space-y-5 p-5">
              <Toggle
                checked={form.bestSeller}
                onChange={(v) => set('bestSeller', v)}
                label="Best Seller"
                description="Feature in the 5-item Best Sellers homepage rail."
              />

              <Toggle
                checked={form.newArrival}
                onChange={(v) => set('newArrival', v)}
                label="New Arrival"
                description="Feature in the 5-item New Arrivals homepage rail."
              />

              <Toggle
                checked={form.featured}
                onChange={(v) => set('featured', v)}
                label="Featured Rail"
                description="Feature with golden star badge."
              />

              <Field label="Custom Badge Text (Optional)" hint="e.g. 'Limited Edition' or 'Handmade'">
                <TextInput value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="e.g. Best Seller" />
              </Field>

              <Field label="Status">
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(v) => set('status', v)}
                  options={['Active', 'Draft', 'Out of Stock']}
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}