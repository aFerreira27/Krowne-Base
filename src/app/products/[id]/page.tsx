import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Download, FileText, ShieldCheck } from 'lucide-react';
import { RecentlyViewedUpdater } from '@/components/recently-viewed-updater';
import type { Product } from '@/lib/types';
import { getProductById } from '@/lib/products';
import { ProductActions } from '@/components/product-actions';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await getProductById(id);
    return product;
  } catch (error) {
    console.error("Failed to fetch product for detail page:", error);
    return null;
  }
}


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params; // Await the params object
  const { id } = awaitedParams; // Destructure from the awaited object
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
       <RecentlyViewedUpdater productId={id} />
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <Badge variant="secondary" className="bg-sky-500 text-black hover:bg-sky-500/80">{product.sku}</Badge>
            {product.series && <Badge variant="outline" className="bg-gray-200 text-black">{product.series}</Badge>}
            {product.tags?.map(tag => (
              <Badge key={tag} variant="outline" className="bg-gray-400 text-black">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline mt-2">{product.name}</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-3xl">{product.description}</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2 mt-4 md:mt-0">
          <ProductActions product={product} />
        </div>
      </div>

      <Carousel className="w-full relative">
        <CarouselContent>
          {product.images?.length > 0 ? product.images?.map((src, index) => (
            <CarouselItem key={index}>
              <div className="aspect-video relative overflow-hidden rounded-lg border bg-background">
                <Image
                  src={src}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-contain"
                  data-ai-hint="product photo"
                />
              </div>
            </CarouselItem>
          )) : (
             <CarouselItem>
              <div className="aspect-video relative overflow-hidden rounded-lg border bg-background flex items-center justify-center">
                 <span className="text-muted-foreground">No Images</span>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>
        {product.images?.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      {product.standard_features && (
        <Card>
          <CardHeader>
            <CardTitle>Standard Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
              {product.standard_features}
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
            {product.documentation.map((doc, index) => (
              <a
                key={index}
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
            {product.compliance.map((c, index) => (
              <div key={index} className="flex items-center p-3 rounded-md border">
                <ShieldCheck className="h-5 w-5 mr-3 text-muted-foreground" />
                <span>{c.name}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {product.images?.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {product.images.map((src, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg border bg-background">
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
