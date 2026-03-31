'use client';
import React, { createContext, useContext, useState } from 'react';

type SidebarVersion = 'v1' | 'v2';

const SidebarCtx = createContext<{
  version: SidebarVersion;
  toggle: () => void;
}>({ version: 'v1', toggle: () => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState<SidebarVersion>('v1');
  const toggle = () => setVersion(v => v === 'v1' ? 'v2' : 'v1');
  return <SidebarCtx.Provider value={{ version, toggle }}>{children}</SidebarCtx.Provider>;
}

export function useSidebarVersion() {
  return useContext(SidebarCtx);
}
