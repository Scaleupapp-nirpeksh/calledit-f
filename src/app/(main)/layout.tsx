import { AuthGuard } from "@/components/layout/auth-guard";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarNav />
      <div className="min-h-screen pb-16 lg:pb-0 lg:pl-55">
        {children}
      </div>
      <BottomNav />
    </AuthGuard>
  );
}
