// Route group layout — sidebar and buddy are provided by the root layout.
// This file exists only to scope the (dashboard) group; no additional wrapping needed.
export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
