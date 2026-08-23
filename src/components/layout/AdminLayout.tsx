import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { ConfirmDialog } from '../ui/Modal';
import { useToast } from '../ui/Toast';

export function AdminLayout() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const toast = useToast();

  return (
    <div className="flex h-full w-full bg-canvas">
      <Sidebar onLogout={() => setConfirmLogout(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onLogout={() => setConfirmLogout(true)} />
        <main className="scroll-thin flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          toast('info', 'Signed out', 'You have been logged out of the Tagdiah admin.');
        }}
        title="Log out of Tagdiah Admin?"
        message="Any unsaved changes on this screen will be lost. You'll need to sign in again to manage the store."
        confirmLabel="Log out"
        destructive={false} />
      
    </div>);

}