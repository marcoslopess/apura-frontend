"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({
  sidebar,
  header,
  children,
  className,
}: {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // dentro do AppShell, componente client
  useEffect(() => {
    let id = localStorage.getItem("visitanteId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("visitanteId", id);
    }
    fetch("/backend/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitanteId: id, pagina: window.location.pathname }),
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-normal ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto p-4">{sidebar}</div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex min-h-14 flex-wrap items-center gap-4 border-b bg-card/80 backdrop-blur-md px-4 sm:px-6 py-2">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">{header}</div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className={cn("p-4 sm:p-6 lg:p-8", className)}>{children}</main>
      </div>
    </div>
  );
}
