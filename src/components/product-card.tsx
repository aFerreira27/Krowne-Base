import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader>
          <div className="aspect-video relative w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="product photo"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2">{product.description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Badge variant="secondary">{product.sku}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
