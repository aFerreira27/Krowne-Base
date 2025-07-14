
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
import { Trash, Plus, Upload } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { addProduct } from '@/lib/products';
import { seriesOptions, docTypeOptions } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const imageSchema = z.object({
  url: z.string().url('Must be a valid URL or Data URI'),
});

const specSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
});

const docSchema = z.object({
  type: z.enum(docTypeOptions),
  url: z.string().url('Must be a valid URL or Data URI'),
});

const complianceSchema = z.object({
  name: z.string().min(1, 'Compliance name is required'),
});

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(1, 'SKU is required'),
  series: z.enum(seriesOptions),
  description: z.string().optional(),
  standardFeatures: z.string().optional(),
  images: z.array(imageSchema).min(1, "At least one image is required"),
  specifications: z.array(specSchema),
  documentation: z.array(docSchema),
  compliance: z.array(complianceSchema),
});

// Helper to check for a valid URL or Data URI
const isValidUrl = (url: string) => {
  if (!url) return false;
  if (url.startsWith('data:')) return true;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};


export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const docFileInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);


  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      series: 'Silver',
      description: '',
      standardFeatures: '',
      images: [],
      specifications: [],
      documentation: [],
      compliance: [],
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

  const { fields: docFields, append: appendDoc, remove: removeDoc, update: updateDoc } = useFieldArray({
    control: form.control,
    name: "documentation"
  });

  const { fields: complianceFields, append: appendCompliance, remove: removeCompliance } = useFieldArray({
    control: form.control,
    name: "compliance"
  });

  const watchedImages = form.watch('images');
  
  const processImageFiles = (files: File[]) => {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          appendImage({ url: reader.result });
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: `Could not read the file: ${file.name}`,
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocFileSelect = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          updateDoc(index, { ...form.getValues(`documentation.${index}`), url: reader.result });
        }
      };
      reader.onerror = () => {
        toast({
          variant: 'destructive',
          title: 'File Read Error',
          description: `Could not read the file: ${file.name}`,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

    if (files.length > 0) {
      processImageFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file => file.type.startsWith('image/'));
     if (files.length > 0) {
      processImageFiles(files);
    }
  };
  
  const onDropZoneClick = () => {
    fileInputRef.current?.click();
  };


  function onSubmit(values: z.infer<typeof productSchema>) {
    const productData = {
      ...values,
      description: values.description || '', // Provide empty string if undefined
    };
    addProduct(productData);
    toast({
      title: "Product Created",
      description: `${values.name} has been added to the database.`,
    });
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
                <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="series"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Series</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a series" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {seriesOptions.map(option => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Product Photos</h3>
                <Card>
                  <CardContent className="p-4 space-y-4">
                     <div
                      onClick={onDropZoneClick}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer",
                        isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/50"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground pointer-events-none">
                        <Upload className="h-8 w-8" />
                        <p className="font-medium">
                          {isDragging ? 'Drop images here' : 'Drag & drop images, or click to select files'}
                        </p>
                        <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="images"
                      render={() => (
                        <FormItem>
                          {imageFields.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                              {imageFields.map((field, index) => (
                                <div key={field.id} className="group relative aspect-square">
                                  {isValidUrl(watchedImages?.[index]?.url) ? (
                                    <Image
                                      src={watchedImages[index].url}
                                      alt={`Product image preview ${index + 1}`}
                                      fill
                                      className="object-cover rounded-md border"
                                      data-ai-hint="product photo"
                                    />
                                  ) : (
                                     <div className="w-full h-full bg-muted rounded-md border flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">Invalid URL</span>
                                     </div>
                                  )}
                                   <button
                                      type="button"
                                      onClick={() => removeImage(index)}
                                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash className="h-3 w-3" />
                                    </button>
                                </div>
                              ))}
                            </div>
                          )}
                           <FormMessage />
                        </FormItem>
                      )}
                     />
                  </CardContent>
                </Card>
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

              <FormField
                control={form.control}
                name="standardFeatures"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Features</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List the standard features of the product..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-4">Specifications</h3>
                <div className="border rounded-md p-4 space-y-4">
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <Label>Key</Label>
                    <Label>Value</Label>
                    <div/>
                  </div>
                  {specFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`specifications.${index}.key`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Key</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Width" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                          control={form.control}
                          name={`specifications.${index}.value`}
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="sr-only">Value</FormLabel>
                                  <FormControl>
                                  <Input {...field} placeholder='e.g., 84"' />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeSpec(index)}
                          className="self-start"
                      >
                          <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendSpec({ key: '', value: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Specification
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Documentation</h3>
                <div className="border rounded-md p-4 space-y-4">
                   <div className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <Label>Document Type</Label>
                    <Label>File</Label>
                    <div/>
                  </div>
                  {docFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-start">
                       <FormField
                        control={form.control}
                        name={`documentation.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Document Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {docTypeOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => docFileInputRefs.current[index]?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                         <FormField
                          control={form.control}
                          name={`documentation.${index}.url`}
                          render={() => (
                            <FormItem>
                                <FormLabel className="sr-only">File</FormLabel>
                                <FormControl>
                                <input
                                  type="file"
                                  ref={el => {
                                    docFileInputRefs.current[index] = el;
                                  }}
                                  className="hidden"
                                  onChange={(e) => handleDocFileSelect(e, index)}
                                />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeDoc(index)}
                          className="self-start"
                      >
                          <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendDoc({ type: 'Other', url: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Document
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Compliance</h3>
                <div className="border rounded-md p-4 space-y-4">
                   <div className="grid grid-cols-[1fr_auto] gap-4 items-end">
                    <Label>Certification</Label>
                    <div/>
                   </div>
                  {complianceFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                      <FormField
                        control={form.control}
                        name={`compliance.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="sr-only">Certification</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., NSF Certified" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeCompliance(index)}
                        className="self-start"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                   <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendCompliance({ name: '' })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Compliance
                  </Button>
                </div>
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
