"use client";

import * as React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { MainView } from "@/components/brand-pilot/main-view";
import {
  initialPrograms,
  initialBrands,
  initialProgramTypes,
} from "@/lib/data";
import {
  LayoutDashboard,
  Building2,
  Trophy,
  CircleUser,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const BrandDetailView = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold">Brand Detail</h2>
      <p className="text-muted-foreground">Brand details will be displayed here.</p>
    </div>
  </div>
);

const AchievementView = () => (
  <div className="flex h-full items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold">Achievement</h2>
      <p className="text-muted-foreground">Achievements will be displayed here.</p>
    </div>
  </div>
);

export default function Home() {
  const [activeView, setActiveView] = React.useState("dashboard");

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <MainView
            initialPrograms={initialPrograms}
            initialBrands={initialBrands}
            initialProgramTypes={initialProgramTypes}
          />
        );
      case "brand-detail":
        return <BrandDetailView />;
      case "achievement":
        return <AchievementView />;
      default:
        return (
          <MainView
            initialPrograms={initialPrograms}
            initialBrands={initialBrands}
            initialProgramTypes={initialProgramTypes}
          />
        );
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold text-foreground">
              BrandPilot
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("dashboard")}
                isActive={activeView === "dashboard"}
                tooltip="Dashboard"
              >
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("brand-detail")}
                isActive={activeView === "brand-detail"}
                tooltip="Brand Detail"
              >
                <Building2 />
                <span>Brand Detail</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView("achievement")}
                isActive={activeView === "achievement"}
                tooltip="Achievement"
              >
                <Trophy />
                <span>Achievement</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                 <CircleUser />
                 <span className="group-data-[collapsible=icon]:hidden">My Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {renderContent()}
      </SidebarInset>
    </SidebarProvider>
  );
}
