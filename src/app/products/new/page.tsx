
'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Trash, Plus } from 'lucide-react';
import Image from 'next/image';

const imageSchema = z.object({
  url: z.string().url('Must be a valid URL'),
});

const specSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

const complianceSchema = z.object({
  name: z.string().min(1, 'Compliance name is required'),
});

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  images: z.array(imageSchema),
  specifications: z.array(specSchema),
  compliance: z.array(complianceSchema),
});

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      images: [{ url: 'https://placehold.co/600x400.png' }],
      specifications: [{ key: 'Material', value: '18 Gauge Stainless Steel' }],
      compliance: [{ name: 'NSF Certified' }],
    },
  });
  
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const { fields: specFields, append: appendSpec, remove: removeSpec } = useFieldArray({
    control: form.control,
    name: "specifications"
  });

  const { fields: complianceFields, append: appendCompliance, remove: removeCompliance } = useFieldArray({
    control: form.control,
    name: "compliance"
  });

  const watchedImages = form.watch('images');

  function onSubmit(values: z.infer<typeof productSchema>) {
    // Here you would typically handle the creation of the new product,
    // e.g., by calling an API or updating your data source.
    console.log('New product data:', values);
    toast({
      title: "Product Created",
      description: `${values.name} has been added to the database.`,
    });
    // For now, we just redirect. In a real app, you might get an ID back
    // and redirect to the new product's page, e.g., /products/new-id
    router.push(`/products`); 
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Fill out the form below to add a new product to the database.</CardDescription>
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
                        <Input placeholder="e.g., Royal Series 84 Work Table" {...field} />
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
                        <Input placeholder="e.g., KR22-T84S" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Product Photos</h3>
                <div className="space-y-4">
                  {imageFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start p-4 border rounded-md">
                          <div className="flex-1 space-y-4">
                            <FormField
                                control={form.control}
                                name={`images.${index}.url`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl><Input {...field} placeholder="https://example.com/photo.png" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {watchedImages?.[index]?.url && (
                                <div className="relative aspect-video rounded-md overflow-hidden border">
                                    <Image 
                                        src={watchedImages[index].url}
                                        alt="Product image preview"
                                        fill
                                        className="object-cover"
                                        data-ai-hint="product photo"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                        onLoad={(e) => e.currentTarget.style.display = 'block'}
                                    />
                                </div>
                            )}
                          </div>
                          <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)} className="mt-8"><Trash className="h-4 w-4" /></Button>
                      </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={() => appendImage({ url: '' })} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Photo
                </Button>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a detailed product description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                <div className="space-y-4">
                  {specFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start p-4 border rounded-md">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`specifications.${index}.key`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Key</FormLabel>
                                        <FormControl><Input {...field} placeholder="e.g., Width" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`specifications.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl><Input {...field} placeholder='e.g., 84"' /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                          </div>
                          <Button type="button" variant="destructive" size="icon" onClick={() => removeSpec(index)} className="mt-8"><Trash className="h-4 w-4" /></Button>
                      </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={() => appendSpec({ key: '', value: '' })} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Specification
                </Button>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Compliance</h3>
                <div className="space-y-4">
                  {complianceFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-start p-4 border rounded-md">
                         <div className="flex-1">
                            <FormField
                                control={form.control}
                                name={`compliance.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Certification</FormLabel>
                                        <FormControl><Input {...field} placeholder="e.g., NSF Certified" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                          </div>
                          <Button type="button" variant="destructive" size="icon" onClick={() => removeCompliance(index)} className="mt-8"><Trash className="h-4 w-4" /></Button>
                      </div>
                  ))}
                </div>
                <Button type="button" variant="outline" onClick={() => appendCompliance({ name: '' })} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Compliance
                </Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit">Create Product</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
