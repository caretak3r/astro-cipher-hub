import { useState } from "react";
import { SentinelLayout } from "@/components/SentinelLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Play, 
  ChevronRight, 
  Package,
  ExternalLink,
  Filter
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Vulnerability {
  id: string;
  cveId: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "active" | "suppressed";
  affectedResources: { name: string; type: string }[];
  publishedDate: string;
}

const mockVulnerabilities: Vulnerability[] = [
  {
    id: "1",
    cveId: "CVE-2023-44487",
    description: "The HTTP/2 protocol allows a denial of service (server resource consumption) because request cancellation can reset many streams quickly...",
    severity: "critical",
    status: "active",
    affectedResources: [
      { name: "nginx-ingress", type: "Container" },
      { name: "http2", type: "Library" },
    ],
    publishedDate: "2023-10-10",
  },
  {
    id: "2",
    cveId: "CVE-2024-21626",
    description: "runc through 1.1.11 leaks internal file descriptors to the child process, allowing a malicious container to break out of the container and access the host...",
    severity: "critical",
    status: "active",
    affectedResources: [
      { name: "podinfo:6.4.0", type: "Container" },
      { name: "runc", type: "System" },
    ],
    publishedDate: "2024-01-31",
  },
  {
    id: "3",
    cveId: "CVE-2024-3094",
    description: "Malicious code was discovered in the upstream tarballs of xz, starting with version 5.6.0. Through a series of complex obfuscations, the liblzma build...",
    severity: "critical",
    status: "active",
    affectedResources: [
      { name: "podinfo:6.4.0", type: "Container" },
      { name: "xz", type: "Library" },
    ],
    publishedDate: "2024-03-29",
  },
  {
    id: "4",
    cveId: "CVE-2023-38545",
    description: "This flaw makes curl overflow a heap based buffer in the SOCKS5 proxy handshake.",
    severity: "high",
    status: "active",
    affectedResources: [
      { name: "redis:7.0", type: "Container" },
      { name: "curl", type: "Library" },
    ],
    publishedDate: "2023-10-11",
  },
  {
    id: "5",
    cveId: "CVE-2023-32681",
    description: "Requests is a HTTP library. Since Requests 2.3.0, Requests has been leaking Proxy-Authorization headers to destination servers when redirected...",
    severity: "medium",
    status: "suppressed",
    affectedResources: [
      { name: "podinfo:6.4.0", type: "Container" },
      { name: "requests", type: "Library" },
    ],
    publishedDate: "2023-05-26",
  },
];

const severityColors = {
  critical: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const severityBadgeColors = {
  critical: "bg-rose-600 text-white",
  high: "bg-orange-600 text-white",
  medium: "bg-yellow-600 text-black",
  low: "bg-blue-600 text-white",
};

export default function Vulnerabilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suppressed">("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const filteredVulns = mockVulnerabilities.filter((vuln) => {
    const matchesSearch = 
      vuln.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vuln.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vuln.status === statusFilter;
    const matchesSeverity = severityFilter === "all" || vuln.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const activeCount = mockVulnerabilities.filter(v => v.status === "active").length;
  const suppressedCount = mockVulnerabilities.filter(v => v.status === "suppressed").length;

  return (
    <SentinelLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Vulnerabilities</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Scan and manage vulnerabilities for this release
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input
                placeholder="Search for CVE..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-zinc-900 border-zinc-800 text-sm"
              />
            </div>
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-500">
              <Play className="w-4 h-4" />
              Run vulnerability scan
            </Button>
          </div>
        </div>

        {/* Stats & Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              {mockVulnerabilities.length} vulnerabilities
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter(statusFilter === "active" ? "all" : "active")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  statusFilter === "active"
                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                )}
              >
                Active {activeCount}
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === "suppressed" ? "all" : "suppressed")}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                  statusFilter === "suppressed"
                    ? "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600"
                )}
              >
                Suppressed {suppressedCount}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Severity:</span>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40 h-8 text-xs bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="All severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vulnerability List */}
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr,100px,200px,40px] gap-4 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <div>Vulnerability</div>
            <div>Severity</div>
            <div>Affected Resources</div>
            <div></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/50">
            {filteredVulns.map((vuln) => (
              <div
                key={vuln.id}
                className="grid grid-cols-[1fr,100px,200px,40px] gap-4 px-4 py-4 hover:bg-zinc-900/50 cursor-pointer transition-colors group"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{vuln.cveId}</span>
                    {vuln.status === "active" && (
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        Active
                      </Badge>
                    )}
                    {vuln.status === "suppressed" && (
                      <Badge variant="outline" className="text-[10px] bg-zinc-500/10 text-zinc-400 border-zinc-500/30">
                        Suppressed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{vuln.description}</p>
                </div>

                <div className="flex items-start">
                  <Badge className={cn("text-xs uppercase font-semibold", severityBadgeColors[vuln.severity])}>
                    {vuln.severity}
                  </Badge>
                </div>

                <div className="space-y-1">
                  {vuln.affectedResources.map((resource, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Package className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-300 truncate">{resource.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end">
                  <ChevronRight className="w-4 h-4 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredVulns.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            No vulnerabilities found matching your filters.
          </div>
        )}
      </div>
    </SentinelLayout>
  );
}
