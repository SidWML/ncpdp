import './v2.css';
import { SidebarV3 } from '@/components/v2/SidebarV3';

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--v2-bg)' }}>
      <SidebarV3/>
      <div style={{
        marginLeft: 'var(--sidebar-w, 220px)',
        width: 'calc(100vw - var(--sidebar-w, 220px))',
        transition: 'all .2s ease', minWidth: 0,
      }}>
        {children}
      </div>
    </div>
  );
}
