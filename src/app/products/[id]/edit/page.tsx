
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { updateProduct } from '@/lib/products-client';
import { getProductById } from '@/lib/products-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Trash, Plus, Upload, Loader2, X, ChevronsUpDown } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { seriesOptions, docTypeOptions, Product, allTags, complianceGroups } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

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
  standard_features: z.string().nullable().optional(),
  images: z.array(imageSchema).optional(),
  specifications: z.array(specSchema),
  documentation: z.array(docSchema),
  compliance: z.array(complianceSchema),
  tags: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

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

function EditProductForm({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const docFileInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      series: product?.series || 'Silver',
      description: product?.description || '',
      standard_features: product?.standard_features || '',
      images: product?.images?.map(url => ({ url })) || [],
      specifications: product?.specifications || [],
      documentation: product?.documentation || [],
      compliance: product?.compliance || [],
      tags: product?.tags || [],
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
  const watchedTags = form.watch('tags') || [];
  const watchedCompliance = form.watch('compliance') || [];
  const watchedComplianceNames = useMemo(() => watchedCompliance.map(c => c.name), [watchedCompliance]);

  const availableTags = useMemo(() => {
    return allTags.filter(tag => !watchedTags.includes(tag));
  }, [watchedTags]);


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

  const handleTagToggle = (tag: string, isChecked: boolean) => {
    const currentTags = form.getValues('tags') || [];
    if (isChecked) {
      form.setValue('tags', [...currentTags, tag]);
    } else {
      form.setValue('tags', currentTags.filter(t => t !== tag));
    }
  };
  
  const handleComplianceToggle = (name: string, isChecked: boolean) => {
    if (isChecked) {
      appendCompliance({ name });
    } else {
      const indexToRemove = watchedCompliance.findIndex(c => c.name === name);
      if (indexToRemove > -1) {
        removeCompliance(indexToRemove);
      }
    }
  };


  const handleTagSelect = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tag)) {
        form.setValue('tags', [...currentTags, tag]);
    }
    setTagPopoverOpen(false);
  };

  const handleRemoveTag = (indexToRemove: number) => {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', currentTags.filter((_, index) => index !== indexToRemove));
  };

  async function onSubmit(values: ProductFormData) {
    if (product) {
      setIsSubmitting(true);
      try {
        const updatedValues: Partial<Product> = {
            ...values,
            images: values.images?.map(img => img.url),
            tags: values.tags || [],
        }
        await updateProduct(product.id, updatedValues);
        toast({
          title: "Product Updated",
          description: `${values.name} has been saved successfully.`,
        });
        router.push(`/products/${product.id}`);
        router.refresh();
      } catch (error) {
         toast({
          variant: 'destructive',
          title: "Error updating product",
          description: (error as Error).message,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
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

            <div className="grid md:grid-cols-2 gap-6">
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
              <div>
                <Label>Tags</Label>
                <div className="border rounded-md p-4 mt-2 space-y-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    {watchedTags.map((tag, index) => (
                        <Badge key={`${tag}-${index}`} variant="secondary" className="pl-2 pr-1 py-1 text-sm">
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(index)} className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5">
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove tag</span>
                            </button>
                        </Badge>
                    ))}
                    <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Input
                                placeholder="Add a tag..."
                                className="w-40 h-8"
                                onFocus={() => setTagPopoverOpen(true)}
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Find tag..." />
                                <CommandList>
                                    <CommandEmpty>No tags found.</CommandEmpty>
                                    <CommandGroup>
                                        {availableTags.map((tag) => (
                                            <CommandItem
                                                key={tag}
                                                value={tag}
                                                onSelect={() => handleTagSelect(tag)}
                                            >
                                                {tag}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="icon" className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80">
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Add Tags</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 p-1">
                                {allTags.map((tag) => (
                                    <div key={tag} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`tag-${tag}`}
                                            checked={watchedTags.includes(tag)}
                                            onCheckedChange={(checked) => handleTagToggle(tag, !!checked)}
                                        />
                                        <label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            {tag}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </DialogContent>
                    </Dialog>
                  </div>
                  <FormField
                      control={form.control}
                      name="tags"
                      render={() => (
                          <FormItem>
                              <FormMessage/>
                          </FormItem>
                      )}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
              <FormField
                control={form.control}
                name="standard_features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard Features</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List the standard features of the product..." {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
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
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">File</FormLabel>
                                <FormControl>
                                <input
                                  type="file"
                                  ref={el => docFileInputRefs.current[index] = el}
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
                  {complianceFields.length > 0 && (
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
                      {complianceFields.map((field, index) => (
                        <div key={field.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                           <span className="text-sm">{field.name}</span>
                           <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCompliance(index)}
                            className="h-6 w-6"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Compliance
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Select Compliance Certifications</DialogTitle>
                        <DialogDescription>
                          Select all applicable standards for this product.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto p-1">
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                          {Object.entries(complianceGroups).map(([groupName, standards]) => (
                            <div key={groupName} className="space-y-2 break-inside-avoid">
                              <h4 className="font-semibold text-foreground">{groupName}</h4>
                              <div className="space-y-2 pl-2">
                                {standards.map((standard) => (
                                  <div key={standard} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`compliance-${standard.replace(/[^a-zA-Z0-9]/g, '-')}`}
                                      checked={watchedComplianceNames.includes(standard)}
                                      onCheckedChange={(checked) => handleComplianceToggle(standard, !!checked)}
                                    />
                                    <label
                                      htmlFor={`compliance-${standard.replace(/[^a-zA-Z0-9]/g, '-')}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {standard}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

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
                                    <div className="w-full h-full bg-background rounded-md border flex items-center justify-center">
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

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function EditPageSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-8">
           <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-40 w-full" />
            </div>
             <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function EditProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getProductById(id)
        .then(data => {
          if (data) {
            setProduct(data);
          } else {
            notFound();
          }
        })
        .catch(() => notFound())
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <EditPageSkeleton />;
  }

  if (!product) {
    // This will be caught by notFound() in useEffect, but as a fallback
    return notFound();
  }

  return (
    <div className="w-full">
      <EditProductForm product={product} />
    </div>
  );
}
