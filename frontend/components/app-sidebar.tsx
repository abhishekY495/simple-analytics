"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlobeIcon, Settings2Icon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/account/websites", label: "Websites", icon: GlobeIcon },
  { href: "/account/settings", label: "Settings", icon: Settings2Icon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center justify-between px-3 py-3 border-b group-data-[collapsible=icon]:justify-center">
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
                    className="rounded text-[15px] h-11 px-4 -tracking-normal data-[active=true]:bg-neutral-200 data-[active=true]:dark:bg-neutral-800 data-[active=false]:dark:hover:bg-neutral-800/60 data-[active=true]:font-semibold"
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

      <SidebarFooter className="flex items-center justify-center">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
