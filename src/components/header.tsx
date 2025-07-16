
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button'; 
import { Package, BarChart2, PanelLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/products', label: 'Products', icon: Package },
  { href: '/status', label: 'Status', icon: BarChart2 },
  { href: '/documentation', label: 'Documentation', icon: FileText },
];

export function Header() {
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn("sticky top-0 z-30 flex h-16 items-center justify-between bg-background px-4 md:px-6", isAtTop ? "border-transparent" : "border-b")}>
      <div className="flex items-center gap-2">
        {pathname !== '/' && (
          <Link href="/products" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Image
              src="/images/krowneLogo.svg"
              alt="Krowne"
              width={160}
              height={32}
              className="w-auto h-12"
              priority
            />
          <span className="sr-only">Krowne Home</span>
        </Link>
        )}
      </div>
      <nav className="hidden md:flex absolute inset-x-0 justify-center items-center">
        <div className="flex items-center gap-5 text-sm lg:gap-6 w-full justify-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("flex items-center justify-center gap-2 transition-colors hover:text-foreground", pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground")}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        </div>
      </nav>

      <div className="flex items-center gap-2 md:hidden">
        <Sheet>
            <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
            </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                {pathname !== '/' && (
                  <Link href="/" className="flex items-center justify-center gap-2 text-lg font-semibold mb-4 py-2">
                    <Image
                      src="/images/krowneLogo.svg"
                      alt="Krowne"
                      height={32}
                      className="w-auto h-8"
                      priority
                    />
                    <span className="sr-only">Krowne Home</span>
                </Link>
                )}
                {navItems.map((item) => (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "flex items-center justify-center gap-4 transition-colors hover:text-foreground",
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
      </div>
    </header>
  );
}
