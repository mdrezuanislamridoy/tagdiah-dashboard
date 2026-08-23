import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { UsersIcon, EyeIcon, DownloadIcon, MailIcon } from 'lucide-react';
import { Card, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput, Select } from '../components/ui/Fields';
import { StatusPill } from '../components/ui/StatusPill';
import { EmptyState, Pagination, TableShell, Td, Th, Tr } from '../components/ui/Table';
import { useToast } from '../components/ui/Toast';
import { customers } from '../data/customers';
import { bdt, shortDate } from '../utils/format';

const PER_PAGE = 8;

export function Customers() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All customers');
  const [sort, setSort] = useState('Highest spend');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = customers.filter((c) => {
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      const matchS = status === 'All customers' || c.status === status;
      return matchQ && matchS;
    });
    return [...list].sort((a, b) =>
    sort === 'Highest spend' ? b.spent - a.spent : sort === 'Most orders' ? b.orders - a.orders : b.joined.localeCompare(a.joined)
    );
  }, [query, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalSpend = customers.reduce((s, c) => s + c.spent, 0);

  return (
    <>
      <PageHeader title="Customers" subtitle={`${customers.length} registered shoppers · ${bdt(totalSpend, true)} lifetime value`}>
        <Button variant="secondary" icon={MailIcon} onClick={() => toast('info', 'Campaign draft created', 'Compose an email to your active customers.')}>
          Email customers
        </Button>
        <Button variant="secondary" icon={DownloadIcon} onClick={() => toast('success', 'Export ready', 'Customer list exported as CSV.')}>
          Export
        </Button>
      </PageHeader>

      <Card>
        <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-4">
          <SearchInput value={query} onChange={(v) => {setQuery(v);setPage(1);}} placeholder="Search name, email or phone…" className="min-w-[240px] flex-1" />
          <Select label="Customer status" value={status} onChange={setStatus} options={['All customers', 'Active', 'New', 'Blocked']} className="w-[170px]" />
          <Select label="Sort" value={sort} onChange={setSort} options={['Highest spend', 'Most orders', 'Newest first']} className="w-[170px]" />
        </div>

        {filtered.length === 0 ?
        <EmptyState
          icon={UsersIcon}
          title="No customers found"
          description="No one matches this search. Try a different name, email or phone number."
          action={<Button variant="secondary" onClick={() => {setQuery('');setStatus('All customers');}}>Clear filters</Button>} /> :


        <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Contact</Th>
                  <Th>City</Th>
                  <Th>Orders</Th>
                  <Th>Total spent</Th>
                  <Th>Registered</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {view.map((c) =>
              <Tr key={c.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <img src={c.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <Link to={`/customers/${c.id}`} className="font-medium text-ink hover:text-brown">
                          {c.name}
                        </Link>
                      </div>
                    </Td>
                    <Td>
                      <p className="text-[13px] text-ink">{c.email}</p>
                      <p className="text-[12px] text-ink-50">{c.phone}</p>
                    </Td>
                    <Td>{c.city}</Td>
                    <Td className="text-ink">{c.orders}</Td>
                    <Td className="font-medium text-ink">{bdt(c.spent)}</Td>
                    <Td className="whitespace-nowrap text-[13px]">{shortDate(c.joined)}</Td>
                    <Td>
                      <StatusPill status={c.status} />
                    </Td>
                    <Td>
                      <div className="flex justify-end">
                        <Link
                      to={`/customers/${c.id}`}
                      aria-label={`View ${c.name}`}
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