
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Download, Edit, FileText } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = getProductById(id);
  const { addProduct } = useRecentlyViewed();

  useEffect(() => {
    if (product) {
      addProduct(product.id);
    }
  }, [product, addProduct]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <Badge variant="secondary">{product.sku}</Badge>
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

      <div className="grid md:grid-cols-2 gap-8">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((src, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="p-0">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <Image
                        src={src}
                        alt={`${product.name} image ${index + 1}`}
                        fill
                        className="object-cover"
                        data-ai-hint="product photo"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.images.length > 1 && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="specs">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="docs">Documentation</TabsTrigger>
              </TabsList>
              <TabsContent value="specs" className="mt-4">
                <Table>
                  <TableBody>
                    {product.specifications.map((spec) => (
                      <TableRow key={spec.key}>
                        <TableCell className="font-medium">{spec.key}</TableCell>
                        <TableCell>{spec.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="docs" className="mt-4">
                <div className="space-y-2">
                  {product.documentation.map((doc) => (
                    <a
                      key={doc.name}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-md border hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span>{doc.name}</span>
                      </div>
                      <Download className="h-5 w-5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {product.images.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold font-headline mb-4">Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {product.images.map((src, index) => (
              <div key={index} className="aspect-square relative overflow-hidden rounded-lg border">
                <Image
                  src={src}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-cover"
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
