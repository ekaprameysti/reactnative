import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define the Visitor type
export interface Visitor {
  id: string;
  name: string;
  city: string;
  beach: string;
  date: string;
}

// Define the shape of the context
interface VisitorContextType {
  visitors: Visitor[];
  addVisitor: (visitor: Omit<Visitor, 'id'>) => void;
}

// 2. Create the VisitorContext with a default value
const VisitorContext = createContext<VisitorContextType | undefined>(undefined);

// 4. Export a VisitorProvider component
interface VisitorProviderProps {
  children: ReactNode;
}

export const VisitorProvider = ({ children }: VisitorProviderProps) => {
  // 3. Initialize with dummy data
  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: '1', name: 'Ahmad Subarjo', city: 'Yogyakarta', beach: 'Pantai Parangtritis', date: '2025-12-01' },
    { id: '2', name: 'Budi Santoso', city: 'Sleman', beach: 'Pantai Parangkusumo', date: '2025-12-02' },
    { id: '3', name: 'Citra Lestari', city: 'Bantul', beach: 'Pantai Depok', date: '2025-12-03' },
  ]);

  const addVisitor = (visitorData: Omit<Visitor, 'id'>) => {
    const newVisitor: Visitor = {
      id: Math.random().toString(36).substr(2, 9), // Simple unique ID
      ...visitorData,
    };
    setVisitors(prevVisitors => [newVisitor, ...prevVisitors]);
  };

  return (
    <VisitorContext.Provider value={{ visitors, addVisitor }}>
      {children}
    </VisitorContext.Provider>
  );
};

// 5. Export a custom hook for easy access
export const useVisitor = () => {
  const context = useContext(VisitorContext);
  if (context === undefined) {
    throw new Error('useVisitor must be used within a VisitorProvider');
  }
  return context;
};