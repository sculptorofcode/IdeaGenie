'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@civic/auth/react';
// Import toast for notifications - optional but helpful for debugging
import { toast } from 'sonner';

/**
 * A component that synchronizes the authenticated user with the database
 * This should be included in the root layout to ensure it runs on every page
 */
export default function UserSync() {
  const { user, isLoading } = useUser();
  const [synced, setSynced] = useState(false);
  useEffect(() => {
    // Only run this effect when user is loaded and not already synced
    if (!isLoading && user && !synced) {
      const syncUser = async () => {
        try {
          console.log('Attempting to sync user with database...');
          
          // Call our API endpoint to sync the user with the database
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            // Add credentials to ensure cookies are sent
            credentials: 'include'
          });          if (response.ok) {
            const data = await response.json();
            console.log('User synchronized with database successfully:', data);
            setSynced(true);
            
            // Show success toast (optional)
            if (typeof toast !== 'undefined') {
              toast.success('User data synchronized');
            }
          } else {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Failed to sync user with database:', errorData);
            
            // Show error toast (optional)
            if (typeof toast !== 'undefined') {
              toast.error(`User sync failed: ${errorData.error || errorData.details || 'Unknown error'}`, {
                description: 'Try refreshing the page or contact support if the issue persists',
                duration: 5000
              });
            }
          }
        } catch (error) {
          console.error('Exception when syncing user:', error);
        }
      };

      syncUser();
    } else {
      console.log('Not syncing user: isLoading=', isLoading, 'user=', !!user, 'synced=', synced);
    }
  }, [user, isLoading, synced]);

  // This is an invisible component, it doesn't render anything
  return null;
}
