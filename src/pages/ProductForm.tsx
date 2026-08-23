import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ImagePlusIcon, PlusIcon, Trash2Icon, XIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button, IconButton } from '../components/ui/Button';
import { Field, Select, TextArea, TextInput, Toggle } from '../components/ui/Fields';
import { useToast } from '../components/ui/Toast';
import { products, emptyProduct, IMG } from '../data/products';
import { categories, categoryNames } from '../data/categories';
import type { Product, Variation } from '../types';

export function ProductForm({ mode }: {mode: 'create' | 'edit';}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const source = mode === 'edit' ? products.find((p) => p.id === id) ?? emptyProduct : emptyProduct;

  const [form, setForm] = useState<Product>({ ...source });
  const [gallery, setGallery] = useState<string[]>(
    mode === 'edit' ? [source.image, IMG.macrame, IMG.vase] : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof Product,>(key: K, value: Product[K]) => setForm((f) => ({ ...f, [key]: value }));

  const subcategories = categories.
  filter((c) => c.parent === form.category).
  map((c) => c.name);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required.';
    if (!form.sku.trim()) e.sku = 'SKU is required for inventory tracking.';
    if (!form.price || form.price <= 0) e.price = 'Enter a price greater than zero.';
    if (form.discountPrice && form.discountPrice >= form.price) e.discountPrice = 'Discount price must be below the regular price.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (publish: boolean) => {
    if (!validate()) {
      toast('error', 'Check the highlighted fields', 'A few required details are missing.');
      return;
    }
    toast('success', publish ? 'Product published' : 'Draft saved', `${form.name} was saved successfully.`);
    navigate('/products');
  };

  const addVariation = () => {
    const v: Variation = { id: `v-${Date.now()}`, type: 'Size', value: '', stock: 0, priceDelta: 0 };
    set('variations', [...form.variations, v]);
  };

  const updateVariation = (vid: string, patch: Partial<Variation>) =>
  set('variations', form.variations.map((v) => v.id === vid ? { ...v, ...patch } : v));

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
            {mode === 'create' ? 'List a new piece in the Tagdiah catalogue.' : `SKU ${form.sku} · last updated ${form.updatedAt}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/products')}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={() => submit(false)}>
            Save as draft
          </Button>
          <Button onClick={() => submit(true)}>{mode === 'create' ? 'Publish product' : 'Save changes'}</Button>
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
                  placeholder="e.g. Zari Embroidered Door Porda — Pair"
                  onChange={(e) => set('name', e.target.value)} />
                
              </Field>
              <Field label="Description" hint="Describe materials, dimensions and craft details. Shown on the product page.">
                <TextArea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Category" required>
                  <Select label="Category" value={form.category} onChange={(v) => set('category', v)} options={categoryNames} />
                </Field>
                <Field label="Subcategory">
                  <Select
                    label="Subcategory"
                    value={form.subcategory || subcategories[0] || ''}
                    onChange={(v) => set('subcategory', v)}
                    options={subcategories.length ? subcategories : ['—']} />
                  
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Media" subtitle="First image is used as the catalogue thumbnail" />
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {gallery.map((src, i) =>
                <div key={src + i} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
                    <img src={src} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
                    {i === 0 ?
                  <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-medium text-white">
                        Cover
                      </span> :
                  null}
                    <button
                    onClick={() => setGallery((g) => g.filter((_, x) => x !== i))}
                    aria-label={`Remove image ${i + 1}`}
                    className="absolute right-2 top-2 rounded-full bg-surface/90 p-1 text-ink-70 opacity-0 transition-opacity duration-150 ease-out hover:text-danger group-hover:opacity-100">
                    
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <button
                  onClick={() => setGallery((g) => [...g, IMG.curtain])}
                  className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-beige bg-cream/50 text-ink-50 transition-colors duration-150 ease-out hover:border-brown-soft hover:text-brown">
                  
                  <ImagePlusIcon className="h-5 w-5" />
                  <span className="text-[12px] font-medium">Upload image</span>
                  <span className="text-[11px] text-ink-30">JPG or PNG · max 5MB</span>
                </button>
              </div>
              {gallery.length === 0 ?
              <p className="mt-3 text-[12.5px] text-ink-50">No images yet — add at least one before publishing.</p> :
              null}
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
              } />
            
            <div className="p-5">
              {form.variations.length === 0 ?
              <p className="rounded-xl border border-dashed border-beige bg-cream/40 px-4 py-6 text-center text-[13px] text-ink-50">
                  No variations yet. The product will sell as a single option.
                </p> :

              <ul className="space-y-3">
                  {form.variations.map((v) =>
                <li key={v.id} className="grid grid-cols-1 gap-3 rounded-xl border border-line p-3 sm:grid-cols-[120px_1fr_110px_130px_auto]">
                      <Select label="Variation type" value={v.type} onChange={(t) => updateVariation(v.id, { type: t as Variation['type'] })} options={['Size', 'Color']} />
                      <TextInput placeholder="e.g. 24 × 36 in" value={v.value} onChange={(e) => updateVariation(v.id, { value: e.target.value })} />
                      <TextInput type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariation(v.id, { stock: Number(e.target.value) })} />
                      <TextInput type="number" placeholder="+ Price" value={v.priceDelta} onChange={(e) => updateVariation(v.id, { priceDelta: Number(e.target.value) })} />
                      <IconButton
                    label="Remove variation"
                    icon={Trash2Icon}
                    onClick={() => set('variations', form.variations.filter((x) => x.id !== v.id))}
                    className="hover:border-danger/30 hover:bg-danger-tint hover:text-danger" />
                  
                    </li>
                )}
                </ul>
              }
            </div>
          </Card>

          <Card>
            <CardHeader title="Search engine listing" subtitle="How this product appears on Google" />
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-line bg-cream/40 p-4">
                <p className="truncate text-[13px] text-sage">tagdiah.com › {form.category.toLowerCase().replace(/\s+/g, '-')}</p>
                <p className="mt-0.5 truncate text-[15px] text-brown">{form.seoTitle || form.name || 'Product title'}</p>
                <p className="mt-0.5 line-clamp-2 text-[12.5px] text-ink-50">
                  {form.seoDescription || form.description || 'Add a meta description to control this snippet.'}
                </p>
              </div>
              <Field label="Meta title" hint={`${(form.seoTitle || '').length}/60 characters`}>
                <TextInput value={form.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
              </Field>
              <Field label="Meta description" hint={`${(form.seoDescription || '').length}/160 characters`}>
                <TextArea rows={3} value={form.seoDescription} onChange={(e) => set('seoDescription', e.target.value)} />
              </Field>
            </div>
          </Card>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Card>
            <CardHeader title="Pricing" />
            <div className="space-y-4 p-5">
              <Field label="Regular price (৳)" required error={errors.price}>
                <TextInput
                  type="number"
                  invalid={!!errors.price}
                  value={form.price}
                  onChange={(e) => set('price', Number(e.target.value))} />
                
              </Field>
              <Field label="Discount price (৳)" error={errors.discountPrice} hint="Leave empty to sell at the regular price.">
                <TextInput
                  type="number"
                  invalid={!!errors.discountPrice}
                  value={form.discountPrice ?? ''}
                  onChange={(e) => set('discountPrice', e.target.value ? Number(e.target.value) : undefined)} />
                
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Inventory" />
            <div className="space-y-4 p-5">
              <Field label="SKU" required error={errors.sku}>
                <TextInput invalid={!!errors.sku} placeholder="TGD-XX-0000" value={form.sku} onChange={(e) => set('sku', e.target.value)} />
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
            <CardHeader title="Visibility" />
            <div className="space-y-5 p-5">
              <Field label="Status">
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(v) => set('status', v as Product['status'])}
                  options={['Active', 'Draft', 'Out of Stock']} />
                
              </Field>
              <Toggle
                checked={form.featured}
                onChange={(v) => set('featured', v)}
                label="Featured product"
                description="Show on the homepage featured rail." />
              
            </div>
          </Card>
        </div>
      </div>
    </>);

}