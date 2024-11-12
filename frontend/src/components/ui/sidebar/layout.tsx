import { SidebarProvider } from "../shadcn/sidebar";
import { AppSidebar } from "./app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        "--sidebar-width": "242px",
        "--sidebar-background": "	215.3, 19.3%, 34.5%",
      }}
    >
      <AppSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
}
