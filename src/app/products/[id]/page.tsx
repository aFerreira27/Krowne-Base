
'use client';

import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '@/lib/products';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Download, Edit, FileText, ShieldCheck } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = getProductById(id as string);
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (product && id) {
      addProduct(id);
    }
  }, [id, addProduct, product]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{product.sku}</Badge>
            {product.series && <Badge variant="outline">{product.series}</Badge>}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">{product.name}</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl">{product.description}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Spec Sheet
          </Button>
          <Link href={`/products/${product.id}/edit`} passHref>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <Carousel className="w-full relative">
        <CarouselContent>
          {product.images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video relative overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={src}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-contain"
                  data-ai-hint="product photo"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {product.images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>

      {product.standardFeatures && (
        <Card>
          <CardHeader>
            <CardTitle>Standard Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {product.standardFeatures}
            </div>
          </CardContent>
        </Card>
      )}

      {product.specifications && product.specifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Key</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.specifications.map((spec) => (
                  <TableRow key={spec.key}>
                    <TableCell className="font-medium">{spec.key}</TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {product.documentation && product.documentation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {product.documentation.map((doc) => (
              <a
                key={doc.type}
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span>{doc.type}</span>
                </div>
                <Download className="h-5 w-5 text-muted-foreground" />
              </a>
            ))}
          </CardContent>
        </Card>
      )}

      {product.compliance && product.compliance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance & Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {product.compliance.map((c) => (
              <div key={c.name} className="flex items-center p-3 rounded-md border">
                <ShieldCheck className="h-5 w-5 mr-3 text-muted-foreground" />
                <span>{c.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {product.images.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {product.images.map((src, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
                <Image
                  src={src}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-contain"
                  data-ai-hint="product photo"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
