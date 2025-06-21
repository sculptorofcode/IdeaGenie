// PipelineContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLatestMindMapData } from '../utils/mindMapHelper';

interface PipelineContextType {
  loading: boolean;
  error: string | null;
  pipelineData: any | null;
  userId: string;
}

const PipelineContext = createContext<PipelineContextType>({
  loading: true,
  error: null,
  pipelineData: null,
  userId: 'demo-user-123' // Default demo user ID
});

export const usePipelineContext = () => useContext(PipelineContext);

interface PipelineProviderProps {
  children: ReactNode;
  userId?: string;
}

export const PipelineProvider: React.FC<PipelineProviderProps> = ({ 
  children, 
  userId = 'demo-user-123' // Default demo user ID for testing
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipelineData, setPipelineData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getLatestMindMapData(userId);
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch pipeline data');
        }
        
        setPipelineData(data.data);
      } catch (err) {
        console.error('Error fetching pipeline data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <PipelineContext.Provider value={{ loading, error, pipelineData, userId }}>
      {children}
    </PipelineContext.Provider>
  );
};

export default PipelineContext;
