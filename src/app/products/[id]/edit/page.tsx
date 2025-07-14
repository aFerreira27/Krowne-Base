'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getProductById } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Trash } from 'lucide-react';

const specSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

const docSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
});

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specifications: z.array(specSchema),
  documentation: z.array(docSchema),
});

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = getProductById(id);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      description: product?.description || '',
      specifications: product?.specifications || [],
      documentation: product?.documentation || [],
    },
  });
  
  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: "specifications"
  });

  const { fields: docFields, append: appendDoc, remove: removeDoc } = useFieldArray({
    control: form.control,
    name: "documentation"
  });


  if (!product) {
    notFound();
  }

  function onSubmit(values: z.infer<typeof productSchema>) {
    console.log('Updated product data:', values);
    toast({
      title: "Product Updated",
      description: `${values.name} has been saved successfully. PDF spec sheet regeneration initiated.`,
    });
    router.push(`/products/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
          <CardDescription>Modify the details for {product.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Royal Series 42 Wall Cabinet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="KR19-W42R-10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Product description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                {specFields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end mb-4 p-4 border rounded-md">
                        <FormField
                            control={form.control}
                            name={`specifications.${index}.key`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Key</FormLabel>
                                    <FormControl><Input {...field} placeholder="Material" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`specifications.${index}.value`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Value</FormLabel>
                                    <FormControl><Input {...field} placeholder="Stainless Steel" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeSpec(index)}><Trash className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendSpec({ key: '', value: '' })}>Add Specification</Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Documentation</h3>
                {docFields.map((field, index) => (
                    <div key={field.id} className="flex gap-4 items-end mb-4 p-4 border rounded-md">
                        <FormField
                            control={form.control}
                            name={`documentation.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="Spec Sheet" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`documentation.${index}.url`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>URL</FormLabel>
                                    <FormControl><Input {...field} placeholder="https://example.com/doc.pdf" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeDoc(index)}><Trash className="h-4 w-4" /></Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendDoc({ name: '', url: '' })}>Add Document</Button>
              </div>


              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
