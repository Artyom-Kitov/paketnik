import {
  Server,
  Download,
  Settings,
  FileText,
  CheckSquare,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../shadcn/sidebar";
import { CustomSidebarTrigger } from "./sidebar-trigger";

let currentVisibilityFunction: (visibility: boolean) => void;
let currentWidgets: string = "";

export function AppSidebar({
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
  const items = [
    {
      title: "Services",
      setVisibilityFunction: setServicesWidgets,
      icon: Server,
    },
    {
      title: "Rules",
      setVisibilityFunction: setRulesWidgets,
      icon: CheckSquare,
    },
    {
      title: "Files",
      setVisibilityFunction: setFilesWidgets,
      icon: FileText,
    },
    {
      title: "Config",
      setVisibilityFunction: setConfigWidgets,
      icon: Settings,
    },
    {
      title: "Load PCAP",
      setVisibilityFunction: setLoadPcapWidgets,
      icon: Download,
    },
  ];
  return (
    <Sidebar side={"right"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="h-[60px] flex flex-row gap-2 items-center justify-center shrink-0">
                <CustomSidebarTrigger />
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="h-[60px]"
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    event.preventDefault();
                    if (currentWidgets == "") {
                      currentVisibilityFunction = item.setVisibilityFunction;
                      currentWidgets = item.title;
                      currentVisibilityFunction(true);
                    } else {
                      if (currentWidgets == item.title) {
                        currentVisibilityFunction(false);
                        currentWidgets = "";
                      } else {
                        currentVisibilityFunction(false);
                        currentVisibilityFunction = item.setVisibilityFunction;
                        currentWidgets = item.title;
                        currentVisibilityFunction(true);
                      }
                    }
                  }}
                >
                  <SidebarMenuButton asChild className="h-[60px]">
                    <div className="h-[60px]">
                      <a className="flex flex-row gap-2 items-center justify-center shrink-0">
                        <item.icon color="#E2E8F0" size={40} />
                        <span className="text-[#E2E8F0] font-medium cursor-default">
                          {item.title}
                        </span>
                      </a>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
