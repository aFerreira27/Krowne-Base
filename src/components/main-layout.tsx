
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, Package, BarChart2 } from 'lucide-react';
import { ClientOnly } from './client-only';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/status', label: 'DB Status', icon: BarChart2 },
];

function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-center p-2">
            <Image
              src="https://cdn.ckitchen.com/img/brands/464b22b9-5162-4709-b5a4-c672841b2307/krowne-logo-250618mftv5w.png"
              alt="Krowne Logo"
              width={120}
              height={40}
              className="w-auto h-8 group-data-[collapsible=icon]:hidden"
            />
             <Image
              src="https://cdn.ckitchen.com/img/brands/464b22b9-5162-4709-b5a4-c672841b2307/krowne-logo-250618mftv5w.png"
              alt="Krowne Logo"
              width={40}
              height={40}
              className="w-auto h-8 hidden group-data-[collapsible=icon]:block"
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


export function MainLayout({ children }: { children: React.ReactNode }) {
  return <ClientOnly><Layout>{children}</Layout></ClientOnly>;
}
