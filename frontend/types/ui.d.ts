import { FC, ReactNode, ComponentPropsWithoutRef } from 'react';

// Declare types for ui components
declare module '@/components/ui/progress' {
  export interface ProgressProps extends ComponentPropsWithoutRef<'div'> {
    value?: number;
  }
  
  export const Progress: FC<ProgressProps>;
}

// Extend other UI components as needed
