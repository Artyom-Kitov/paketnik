import { SidebarProvider } from "../shadcn/sidebar";
import { AppSidebar } from "./app-sidebar";

export function Sidebar({
  setCurrentWidget,
  currentWidget,
}: {
  setCurrentWidget: (widget: string) => void;
  currentWidget: string;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        setCurrentWidget={setCurrentWidget}
        currentWidget={currentWidget}
      />
    </SidebarProvider>
  );
}
