import { SidebarProvider } from "../shadcn/sidebar";
import { AppSidebar } from "./app-sidebar";

export function Sidebar({
  setServicesWidgets,
  setRulesWidgets,
  setFilesWidgets,
  setConfigWidgets,
  setLoadPcapWidgets,
}: {
  setServicesWidgets: (visibility: boolean) => void;
  setRulesWidgets: (visibility: boolean) => void;
  setFilesWidgets: (visibility: boolean) => void;
  setConfigWidgets: (visibility: boolean) => void;
  setLoadPcapWidgets: (visibility: boolean) => void;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar
        setServicesWidgets={setServicesWidgets}
        setRulesWidgets={setRulesWidgets}
        setFilesWidgets={setFilesWidgets}
        setConfigWidgets={setConfigWidgets}
        setLoadPcapWidgets={setLoadPcapWidgets}
      />
    </SidebarProvider>
  );
}
