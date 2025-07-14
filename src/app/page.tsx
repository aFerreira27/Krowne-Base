import { HomeSearch } from '@/components/home-search';
import { RecentlyViewedSection } from '@/components/recently-viewed-section';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center rounded-lg bg-card overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
        <div className="flex items-center gap-x-2">
          <Image
            src="https://krowne.com/images/Logo.svg"
            alt="Krowne Logo"
            width={240}
            height={80}
            className="w-auto h-20 md:h-16"
            priority
          />
          <h1 className="font-headline text-4xl md:text-4xl font-bold tracking-tighter">
            Product Hub
          </h1>
        </div>
          <p className="max-w-xl text-lg text-muted-foreground">
            Your central source for product information
          </p>
          <div className="w-full max-w-lg mt-4">
            <HomeSearch />
          </div>
        </div>
      </section>

      <div className="flex justify-center">
        <Link href="/products/new" passHref>
          <div className="flex flex-col items-center gap-2 cursor-pointer group">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full transition-all group-hover:scale-105 group-hover:shadow-md"
            >
              <Plus className="h-8 w-8" />
            </Button>
            <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              Add New Product
            </span>
          </div>
        </Link>
      </div>

      <RecentlyViewedSection />
    </div>
  );
}
