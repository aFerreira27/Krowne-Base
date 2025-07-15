
'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash, Loader2 } from 'lucide-react';
import { clearProducts } from '@/lib/products-client';

export function ClearButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearProducts = async () => {
    setIsClearing(true);
    try {
      await clearProducts();
      toast({
        title: 'Table Cleared',
        description: 'All products have been successfully deleted from the table.',
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isClearing}>
           {isClearing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
           ) : (
            <Trash className="mr-2 h-4 w-4" />
           )}
          Clear Table
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all product entries from the database. The table structure will remain.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearProducts}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
