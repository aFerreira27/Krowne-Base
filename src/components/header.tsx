
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Package, BarChart2, PanelLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/products', label: 'Products', icon: Package },
  { href: '/status', label: 'Status', icon: BarChart2 },
  { href: '/documentation', label: 'Documentation', icon: FileText },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-transparent bg-background px-4 md:px-6">
      <nav className="hidden items-end gap-6 text-lg font-medium md:flex md:flex-row md:items-end md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base mr-4 py-2">
            <Image
              src="/images/krowne_logo.png"
              alt="Krowne Logo"
              width={100} // Adjust width as needed
              height={32} // Adjust height as needed
              className="w-auto h-8"
            />
          <span className="sr-only">Krowne Home</span>
        </Link>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
                "flex items-center gap-2 transition-colors hover:text-foreground pb-1",
                pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4 py-2">
                <Image
                  src="/images/krowne_logo.png"
                  alt="Krowne Logo"
                  width={100} // Adjust width as needed
                  height={32} // Adjust height as needed
                  className="w-auto h-8"
                />
              <span className="sr-only">Krowne Home</span>
            </Link>
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-4 transition-colors hover:text-foreground",
                    pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
