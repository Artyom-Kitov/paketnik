import {
  Server,
  Download,
  Settings,
  FileText,
  CheckSquare,
  AlignJustify,
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

const items = [
  {
    title: "",
    url: "#",
    icon: AlignJustify,
  },
  {
    title: "Services",
    url: "#",
    icon: Server,
  },
  {
    title: "Rules",
    url: "#",
    icon: CheckSquare,
  },
  {
    title: "Files",
    url: "#",
    icon: FileText,
  },
  {
    title: "Config",
    url: "#",
    icon: Settings,
  },
  {
    title: "Load PCAP",
    url: "#",
    icon: Download,
  },
];

export function AppSidebar() {
  return (
    <Sidebar side={"right"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-[60px]">
                  <SidebarMenuButton asChild className="h-[60px]">
                    <div className="h-[60px]">
                      <a
                        href={item.url}
                        className="flex flex-row gap-2 items-center justify-center shrink-0"
                      >
                        <item.icon color="#E2E8F0" size={40} />
                        <span className="text-[#E2E8F0] font-medium">
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
