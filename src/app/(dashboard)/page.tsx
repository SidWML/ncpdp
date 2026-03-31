// This file intentionally resolves to "/" — the real dashboard is in app/page.tsx.
// Next.js will detect a conflict at build time; to avoid it, this file must
// redirect to a unique path or be removed. We redirect to avoid the conflict.
import { redirect } from 'next/navigation';
export default function DashboardGroupRoot() {
  redirect('/');
}
