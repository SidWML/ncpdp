'use client';
import { useSidebarVersion } from '@/lib/sidebar-context';
import { Sidebar } from './Sidebar';
import { SidebarV2 } from './SidebarV2';

export function SidebarSwitch() {
  const { version } = useSidebarVersion();
  return version === 'v2' ? <SidebarV2/> : <Sidebar/>;
}
