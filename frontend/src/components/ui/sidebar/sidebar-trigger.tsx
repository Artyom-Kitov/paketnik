import { useSidebar, SidebarMenuButton } from "../shadcn/sidebar";
import { AlignJustify } from "lucide-react";

export function CustomSidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  const item = {
    title: "",
    url: "#",
    icon: AlignJustify,
  };

  return (
    <SidebarMenuButton asChild className="h-[60px]" onClick={toggleSidebar}>
      <div className="h-[60px]">
        <a
          href={item.url}
          className="flex flex-row gap-2 items-center justify-center shrink-0"
        >
          <item.icon color="#E2E8F0" size={40} />
          <span className="text-[#E2E8F0] font-medium">{item.title}</span>
        </a>
      </div>
    </SidebarMenuButton>
  );
  return <button onClick={toggleSidebar}>Toggle Sidebar</button>;
}
