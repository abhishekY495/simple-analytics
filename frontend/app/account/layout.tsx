import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex items-center px-4 py-2 xl:hidden border-b sticky top-0 z-10 bg-background">
            <SidebarTrigger className="cursor-pointer" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2">
                <Image src="/app-icon.png" alt="logo" width={20} height={20} />
                <p className="font-semibold text-sm truncate">
                  Simple Analytics
                </p>
              </div>
            </div>
          </header>
          <div className="xl:p-8 p-5 px-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
