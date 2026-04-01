import './v3.css';
import { Sidebar } from '@/components/v3/SidebarV3';

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--v3-bg)' }}>
      <Sidebar/>
      <div style={{
        marginLeft: 'var(--sidebar-w, 230px)',
        width: 'calc(100vw - var(--sidebar-w, 230px))',
        transition: 'all .2s ease', minWidth: 0,
      }}>
        {children}
      </div>
    </div>
  );
}
