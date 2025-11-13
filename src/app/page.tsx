import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to finished reports list (worklist)
  redirect('/worklist');
}
