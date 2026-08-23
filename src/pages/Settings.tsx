import React, { useState } from 'react';
import {
  StoreIcon,
  PhoneIcon,
  TruckIcon,
  CreditCardIcon,
  PercentIcon,
  BellIcon,
  UserIcon,
  ShieldIcon } from
'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, Select, TextArea, TextInput, Toggle } from '../components/ui/Fields';
import { useToast } from '../components/ui/Toast';
import { classNames } from '../utils/format';

const sections = [
{ id: 'store', label: 'Store information', icon: StoreIcon },
{ id: 'contact', label: 'Contact details', icon: PhoneIcon },
{ id: 'delivery', label: 'Delivery & shipping', icon: TruckIcon },
{ id: 'payment', label: 'Payment methods', icon: CreditCardIcon },
{ id: 'tax', label: 'Tax', icon: PercentIcon },
{ id: 'notifications', label: 'Notifications', icon: BellIcon },
{ id: 'profile', label: 'Admin profile', icon: UserIcon },
{ id: 'security', label: 'Password & security', icon: ShieldIcon }] as
const;

type SectionId = (typeof sections)[number]['id'];

export function Settings() {
  const toast = useToast();
  const [active, setActive] = useState<SectionId>('store');
  const [toggles, setToggles] = useState({
    orderEmail: true,
    lowStock: true,
    reviewAlert: false,
    marketing: true,
    twoFactor: false,
    codEnabled: true,
    bkash: true,
    card: true,
    taxInclusive: false
  });
  const flip = (k: keyof typeof toggles) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  const saved = () => toast('success', 'Settings saved', 'Your changes are live on the storefront.');

  return (
    <>
      <PageHeader title="Settings" subtitle="Configure how the Tagdiah store operates.">
        <Button variant="secondary">Discard</Button>
        <Button onClick={saved}>Save changes</Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <nav className="xl:col-span-3" aria-label="Settings sections">
          <Card className="p-2">
            <ul className="space-y-0.5">
              {sections.map((s) =>
              <li key={s.id}>
                  <button
                  onClick={() => setActive(s.id)}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={classNames(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-colors duration-150 ease-out',
                    active === s.id ? 'bg-cream font-medium text-ink' : 'text-ink-70 hover:bg-cream/60 hover:text-ink'
                  )}>
                  
                    <s.icon className={classNames('h-[18px] w-[18px]', active === s.id ? 'text-brown' : 'text-ink-50')} />
                    {s.label}
                  </button>
                </li>
              )}
            </ul>
          </Card>
        </nav>

        <div className="space-y-4 xl:col-span-9">
          {active === 'store' ?
          <Card>
              <CardHeader title="Store information" subtitle="Shown across the storefront and on invoices" />
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-4 rounded-xl border border-line bg-cream/40 p-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink font-display text-xl text-cream">T</span>
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">Store logo</p>
                    <p className="text-[12.5px] text-ink-50">Square PNG or SVG, at least 512×512px.</p>
                  </div>
                  <Button size="sm" variant="secondary" className="ml-auto">
                    Replace
                  </Button>
                </div>
                <Field label="Store name">
                  <TextInput defaultValue="Tagdiah Home Decor & Arts" />
                </Field>
                <Field label="Tagline">
                  <TextInput defaultValue="Handcrafted wall décor, porda and decorative arts" />
                </Field>
                <Field label="Store description">
                  <TextArea rows={4} defaultValue="Tagdiah curates handmade home décor from artisans across Bangladesh — canvas art, embroidered door curtains, ceramics and wood craft, made to warm up everyday spaces." />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Currency">
                    <Select label="Currency" value="BDT (৳)" onChange={() => undefined} options={['BDT (৳)', 'USD ($)']} />
                  </Field>
                  <Field label="Time zone">
                    <Select label="Time zone" value="Asia/Dhaka (GMT+6)" onChange={() => undefined} options={['Asia/Dhaka (GMT+6)', 'Asia/Kolkata (GMT+5:30)']} />
                  </Field>
                </div>
              </div>
            </Card> :
          null}

          {active === 'contact' ?
          <Card>
              <CardHeader title="Contact details" subtitle="Used for customer support and order notifications" />
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Support email">
                    <TextInput type="email" defaultValue="hello@tagdiah.com" />
                  </Field>
                  <Field label="Support hotline">
                    <TextInput defaultValue="+880 1700 000 100" />
                  </Field>
                </div>
                <Field label="WhatsApp number">
                  <TextInput defaultValue="+880 1700 000 101" />
                </Field>
                <Field label="Store address">
                  <TextArea rows={3} defaultValue={'Shop 14, Level 3, Mirpur Ceramic Market\nMirpur 2, Dhaka 1216, Bangladesh'} />
                </Field>
              </div>
            </Card> :
          null}

          {active === 'delivery' ?
          <Card>
              <CardHeader title="Delivery & shipping" subtitle="Zones, fees and free-delivery thresholds" />
              <div className="space-y-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Inside Dhaka fee (৳)">
                    <TextInput type="number" defaultValue={120} />
                  </Field>
                  <Field label="Outside Dhaka fee (৳)">
                    <TextInput type="number" defaultValue={150} />
                  </Field>
                </div>
                <Field label="Free delivery above (৳)" hint="Set to 0 to disable free delivery.">
                  <TextInput type="number" defaultValue={5000} />
                </Field>
                <Field label="Default courier">
                  <Select label="Default courier" value="Pathao Courier" onChange={() => undefined} options={['Pathao Courier', 'Steadfast', 'RedX', 'Sundarban']} />
                </Field>
                <Field label="Estimated delivery time">
                  <Select label="Estimated delivery time" value="2–4 business days" onChange={() => undefined} options={['1–2 business days', '2–4 business days', '3–7 business days']} />
                </Field>
              </div>
            </Card> :
          null}

          {active === 'payment' ?
          <Card>
              <CardHeader title="Payment methods" subtitle="Choose what customers can pay with at checkout" />
              <div className="divide-y divide-line">
                <div className="p-5">
                  <Toggle checked={toggles.codEnabled} onChange={() => flip('codEnabled')} label="Cash on delivery" description="Collect payment when the order is handed over." />
                </div>
                <div className="p-5">
                  <Toggle checked={toggles.bkash} onChange={() => flip('bkash')} label="Mobile wallets (bKash, Nagad)" description="Instant payment confirmation via merchant API." />
                </div>
                <div className="p-5">
                  <Toggle checked={toggles.card} onChange={() => flip('card')} label="Cards (Visa, Mastercard)" description="Processed through SSLCommerz." />
                </div>
                <div className="p-5">
                  <Field label="Merchant account ID">
                    <TextInput defaultValue="TAGDIAH-SSL-88214" />
                  </Field>
                </div>
              </div>
            </Card> :
          null}

          {active === 'tax' ?
          <Card>
              <CardHeader title="Tax settings" subtitle="VAT applied to orders at checkout" />
              <div className="space-y-4 p-5">
                <Field label="VAT rate (%)">
                  <TextInput type="number" defaultValue={7.5} />
                </Field>
                <Field label="Business VAT registration number">
                  <TextInput defaultValue="BIN 004312998-0201" />
                </Field>
                <div className="rounded-xl border border-line bg-cream/40 p-4">
                  <Toggle checked={toggles.taxInclusive} onChange={() => flip('taxInclusive')} label="Prices include VAT" description="Show tax-inclusive prices on the storefront." />
                </div>
              </div>
            </Card> :
          null}

          {active === 'notifications' ?
          <Card>
              <CardHeader title="Notification preferences" subtitle="What the admin team gets alerted about" />
              <div className="divide-y divide-line">
                <div className="p-5">
                  <Toggle checked={toggles.orderEmail} onChange={() => flip('orderEmail')} label="New order emails" description="Send an email each time an order is placed." />
                </div>
                <div className="p-5">
                  <Toggle checked={toggles.lowStock} onChange={() => flip('lowStock')} label="Low-stock alerts" description="Notify when a SKU drops to its reorder point." />
                </div>
                <div className="p-5">
                  <Toggle checked={toggles.reviewAlert} onChange={() => flip('reviewAlert')} label="Review moderation alerts" description="Ping when a new review needs approval." />
                </div>
                <div className="p-5">
                  <Toggle checked={toggles.marketing} onChange={() => flip('marketing')} label="Weekly performance digest" description="A Monday summary of sales and traffic." />
                </div>
              </div>
            </Card> :
          null}

          {active === 'profile' ?
          <Card>
              <CardHeader title="Admin profile" />
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/160?u=tagdiah-admin" alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">Shabnam Akter</p>
                    <p className="text-[12.5px] text-ink-50">Store Admin · full access</p>
                  </div>
                  <Button size="sm" variant="secondary" className="ml-auto">
                    Change photo
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full name">
                    <TextInput defaultValue="Shabnam Akter" />
                  </Field>
                  <Field label="Role">
                    <Select label="Role" value="Store Admin" onChange={() => undefined} options={['Store Admin', 'Manager', 'Support Agent']} />
                  </Field>
                </div>
                <Field label="Email">
                  <TextInput type="email" defaultValue="shabnam@tagdiah.com" />
                </Field>
              </div>
            </Card> :
          null}

          {active === 'security' ?
          <Card>
              <CardHeader title="Password & security" />
              <div className="space-y-4 p-5">
                <Field label="Current password">
                  <TextInput type="password" defaultValue="••••••••••" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="New password" hint="At least 10 characters with a number.">
                    <TextInput type="password" />
                  </Field>
                  <Field label="Confirm new password">
                    <TextInput type="password" />
                  </Field>
                </div>
                <div className="rounded-xl border border-line bg-cream/40 p-4">
                  <Toggle checked={toggles.twoFactor} onChange={() => flip('twoFactor')} label="Two-factor authentication" description="Require an SMS code when signing in from a new device." />
                </div>
                <div className="rounded-xl border border-danger/20 bg-danger-tint/60 p-4">
                  <p className="text-[13.5px] font-medium text-ink">Sign out of all devices</p>
                  <p className="mt-0.5 text-[12.5px] text-ink-70">Ends every active admin session except this one.</p>
                  <Button
                  size="sm"
                  variant="danger"
                  className="mt-3"
                  onClick={() => toast('success', 'Sessions ended', 'All other devices have been signed out.')}>
                  
                    Sign out everywhere
                  </Button>
                </div>
              </div>
            </Card> :
          null}
        </div>
      </div>
    </>);

}