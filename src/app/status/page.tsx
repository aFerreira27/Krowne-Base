import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusList } from '@/components/status-list';

export default function StatusPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Database Sync Status</CardTitle>
          <CardDescription>
            Synchronization status of product information across company databases.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <StatusList />
        </CardContent>
      </Card>
    </div>
  );
}
