"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeIcon, Settings2Icon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";

const navItems = [
  { href: "/account/websites", label: "Websites", icon: GlobeIcon },
  { href: "/account/settings", label: "Settings", icon: Settings2Icon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader className="flex flex-row items-center justify-between px-3 py-3 border-b">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
          <Image src="/app-icon.png" alt="logo" width={20} height={20} />
          <p className="font-semibold text-sm truncate">Simple Analytics</p>
        </div>
        <SidebarTrigger className="cursor-pointer" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href}
                    tooltip={label}
                  >
                    <Link href={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
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
