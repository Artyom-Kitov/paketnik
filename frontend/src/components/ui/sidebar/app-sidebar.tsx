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

export function AppSidebar({
  setCurrentWidget,
  currentWidget,
}: {
  setCurrentWidget: (widget: string) => void;
  currentWidget: string;
}) {
  const items = [
    {
      title: "Services",
      icon: Server,
    },
    {
      title: "Rules",
      icon: CheckSquare,
    },
    {
      title: "Files",
      icon: FileText,
    },
    {
      title: "Config",
      icon: Settings,
    },
    {
      title: "Load PCAP",
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
                  onClick={() => {
                    if (currentWidget === item.title) {
                      setCurrentWidget("");
                    } else {
                      setCurrentWidget(item.title);
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
