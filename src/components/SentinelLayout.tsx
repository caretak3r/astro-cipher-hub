import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import {
  LayoutDashboard,
  Package,
  Bug,
  ShieldCheck,
  Shield,
  Fingerprint,
  Terminal,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";

interface SentinelLayoutProps {
  children: React.ReactNode;
  bundleName?: string;
  bundleVersion?: string;
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, to: "/airgap-deploy" },
  { id: "artifacts", label: "Artifact Explorer", icon: Package, to: "/airgap-deploy/artifacts" },
  { id: "vulnerabilities", label: "Vulnerabilities", icon: Bug, to: "/airgap-deploy/vulnerabilities", badge: 3 },
  { id: "compliance", label: "Compliance", icon: ShieldCheck, to: "/airgap-deploy/compliance" },
];

export const SentinelLayout = ({ 
  children, 
  bundleName = "defense-app-suite",
  bundleVersion = "v2.4.0"
}: SentinelLayoutProps) => {
  const location = useLocation();
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const currentPath = location.pathname;

  return (
    <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link to="/airgap-deploy" className="flex items-center gap-2 text-emerald-400">
            <Shield className="w-7 h-7" />
            <span className="text-lg font-bold tracking-tight text-white">
              SENTINEL
              <span className="text-[10px] font-normal text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded ml-2 border border-zinc-700">
                AIR-GAP
              </span>
            </span>
          </Link>
          <div className="h-5 w-px bg-zinc-800 mx-2" />
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Package className="w-4 h-4" />
            <span className="font-mono">{bundleName} {bundleVersion}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            SYSTEM SECURE
          </div>

          <button
            onClick={() => setTerminalOpen(!terminalOpen)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
            title="Toggle Terminal"
          >
            <Terminal className="w-5 h-5" />
          </button>

          <ThemeToggle />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold ring-2 ring-zinc-800 hover:ring-zinc-600 transition-all"
            >
              OP
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-zinc-900 border border-zinc-800 shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-zinc-800">
                    <p className="text-sm text-white font-medium">Operator</p>
                    <p className="text-xs text-zinc-500 truncate">operator@defensenet.local</p>
                  </div>
                  <div className="py-1 border-t border-zinc-800">
                    <button className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-zinc-800 flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
          <nav className="p-3 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.to || 
                (item.to !== "/airgap-deploy" && currentPath.startsWith(item.to));
              
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-zinc-500")} />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bundle Fingerprint */}
          <div className="p-3 border-t border-zinc-800">
            <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-zinc-500 font-mono uppercase">Bundle Fingerprint</span>
                <Fingerprint className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-[10px] text-zinc-400 font-mono break-all leading-tight">
                sha256:7f9c2ba4e8d3...
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full">
            {children}
          </ScrollArea>
        </main>
      </div>

      {/* Terminal Panel */}
      <div
        className={cn(
          "absolute bottom-0 left-56 right-0 h-64 bg-zinc-900 border-t border-zinc-700 shadow-2xl z-30 flex flex-col font-mono text-sm transition-transform duration-300",
          terminalOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div
          className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700 transition-colors"
          onClick={() => setTerminalOpen(!terminalOpen)}
        >
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="w-4 h-4" />
            <span>Console Output</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-zinc-400 transition-transform", terminalOpen && "rotate-180")} />
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-1 text-zinc-300 text-xs">
            <p className="text-zinc-500">[INFO] Sentinel Air-Gap Inspector initialized</p>
            <p className="text-emerald-400">[OK] Bundle checksum verified</p>
            <p className="text-emerald-400">[OK] Cosign signatures validated</p>
            <p className="text-yellow-400">[WARN] 3 vulnerabilities detected in bundle</p>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
