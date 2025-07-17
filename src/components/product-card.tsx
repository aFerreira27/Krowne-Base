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
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x400.png';
  const imageHint = product.images && product.images.length > 0 ? "product photo" : "placeholder";

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="h-full flex flex-col transition-all duration-200 group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader>
          <div className="aspect-video relative w-full overflow-hidden rounded-md bg-muted">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardTitle className="text-lg font-headline">{product.name}</CardTitle>
          <CardDescription className="mt-2 line-clamp-2">{product.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-1">
          <Badge variant="outline" className="bg-sky-100 text-sky-800 border-sky-200">{product.sku}</Badge>
          {product.series && product.series !== '-' && <Badge variant="secondary">{product.series}</Badge>}
          {product.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
