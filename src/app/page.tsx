import { HomeSearch } from '@/components/home-search';
import { RecentlyViewedSection } from '@/components/recently-viewed-section';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 md:gap-12">
      <section className="relative h-[40vh] min-h-[300px] w-full flex items-center justify-center rounded-lg bg-card overflow-hidden border">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="relative z-10 flex flex-col items-center gap-4 text-center px-4">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tighter">
            Krowne Product Hub
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Your central source for product information.
          </p>
          <div className="w-full max-w-lg mt-4">
            <HomeSearch />
          </div>
        </div>
      </section>
      
      <RecentlyViewedSection />
    </div>
  );
}
