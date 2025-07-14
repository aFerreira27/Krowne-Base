
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const databases = [
  { name: 'Salespad', inSync: true },
  { name: 'Pimly', inSync: true },
  { name: 'AutoQuotes', inSync: false },
  { name: 'Krowne.com', inSync: true },
];

export function StatusList() {
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    setLastChecked(new Date());
  }, []);

  const handleRefresh = () => {
    setIsChecking(true);
    setTimeout(() => {
      setLastChecked(new Date());
      setIsChecking(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Last checked: {lastChecked ? lastChecked.toLocaleString() : 'Loading...'}
        </p>
        <Button onClick={handleRefresh} disabled={isChecking} size="sm" variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="border rounded-lg">
        {databases.map((db, index) => (
          <div key={db.name} className={`flex items-center justify-between p-4 ${index < databases.length - 1 ? 'border-b' : ''}`}>
            <p className="font-medium">{db.name}</p>
            {db.inSync ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>In Sync</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>Out of Sync</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
