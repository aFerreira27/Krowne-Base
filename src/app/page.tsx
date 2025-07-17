
import { HomeSearch } from '@/components/home-search';
import { RecentlyViewedSection } from '@/components/recently-viewed-section';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-4 md:gap-6 lg:gap-8">
      <section className="relative h-[40vh] min-h-[150px] w-full flex items-center justify-center rounded-lg bg-card overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative z-10 flex flex-col items-center justify-end gap-4 text-center px-4 pb-8">
        <div className="flex items-center gap-x-2">
          <Image
            src="/images/krowneLogo.svg" alt="Krowne"
            width={160}
            height={50}
            className="h-16 w-auto md:h-20"
            priority

          />
          <h1 className="font-headline text-2xl md:text-2xl lg:text-2xl font-bold tracking-tighter ml-[-12px] self-center bg-sky-500 text-white rounded-lg px-1 py-.5">
            Base
          </h1>
        </div>
 <p className="max-w-xl text-base md:text-lg text-muted-foreground">
            Your central source for product information
          </p>
          <div className="w-full max-w-lg mt-4">
            <HomeSearch />
          </div>
        </div>
      </section>
      
      <hr className="my-8" /> {/* Added horizontal line */}

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
