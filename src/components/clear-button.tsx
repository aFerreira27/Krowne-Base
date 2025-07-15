
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash, Loader2 } from 'lucide-react';
import { clearProducts } from '@/lib/products-client';

export function ClearButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [isClearing, setIsClearing] = useState(false);
  const [password, setPassword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClearProducts = async () => {
    if (!password) {
      toast({
        variant: 'destructive',
        title: 'Password Required',
        description: 'You must enter the password to proceed.',
      });
      return;
    }

    setIsClearing(true);
    try {
      await clearProducts(password);
      toast({
        title: 'Table Cleared',
        description: 'All products have been successfully deleted from the table.',
      });
      router.refresh();
      setDialogOpen(false); // Close dialog on success
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: (error as Error).message,
      });
    } finally {
      setIsClearing(false);
      setPassword(''); // Clear password field
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setPassword('');
      setIsClearing(false);
    }
    setDialogOpen(isOpen);
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={onOpenChange}>
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
            This action cannot be undone. This will permanently delete all product entries. Please enter the database password to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
                id="password"
                type="password"
                placeholder="Enter password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isClearing}
            />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearProducts} disabled={!password || isClearing}>
            {isClearing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
