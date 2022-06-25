import { useState, createContext, ReactNode } from 'react';

type SidebarContext = {
  sidebarToggle: boolean;
  toggleSidebar: () => void;
  closeSidebar: (value: boolean) => void;
};

export const SidebarContext = createContext<SidebarContext>(
  {} as SidebarContext
);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const closeSidebar = (value: boolean) => {
    setSidebarToggle(value);
  };

  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};