import { useState } from "react";
import { SentinelLayout } from "@/components/SentinelLayout";
import { ArtifactInspectorDrawer } from "@/components/ArtifactInspectorDrawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Package,
  Container,
  FileCode,
  Settings,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface Artifact {
  id: string;
  name: string;
  ref: string;
  type: "helm" | "container" | "system";
  digest: string;
  size: string;
  signed: boolean;
  vulnerabilities: number;
}

const mockArtifacts: Artifact[] = [
  {
    id: "1",
    name: "podinfo",
    ref: "ghcr.io/stefanprodan/podinfo:6.4.0",
    type: "helm",
    digest: "sha256:7fa1e8a2b13c...",
    size: "45.2 MB",
    signed: true,
    vulnerabilities: 2,
  },
  {
    id: "2",
    name: "postgres-db",
    ref: "docker.io/library/postgres:15.3-alpine",
    type: "container",
    digest: "sha256:8bc4d9e3f21a...",
    size: "82.1 MB",
    signed: true,
    vulnerabilities: 0,
  },
  {
    id: "3",
    name: "redis-cache",
    ref: "docker.io/library/redis:7.0-alpine",
    type: "container",
    digest: "sha256:3de5f8c7a90b...",
    size: "28.4 MB",
    signed: true,
    vulnerabilities: 1,
  },
  {
    id: "4",
    name: "zarf-agent",
    ref: "ghcr.io/defenseunicorns/zarf-agent:v0.31.0",
    type: "system",
    digest: "sha256:9af2c1d8e74f...",
    size: "52.8 MB",
    signed: true,
    vulnerabilities: 0,
  },
  {
    id: "5",
    name: "nginx-ingress",
    ref: "registry.k8s.io/ingress-nginx/controller:v1.9.0",
    type: "container",
    digest: "sha256:2bc8d3f5e21c...",
    size: "112.5 MB",
    signed: true,
    vulnerabilities: 1,
  },
];

const typeIcons = {
  helm: FileCode,
  container: Container,
  system: Settings,
};

const typeLabels = {
  helm: "Helm Chart",
  container: "Container",
  system: "System",
};

export default function ArtifactExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredArtifacts = mockArtifacts.filter(
    (artifact) =>
      artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.ref.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArtifactClick = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setDrawerOpen(true);
  };

  return (
    <SentinelLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Artifact Explorer</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Inspect and verify artifacts in this bundle
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-900 border-zinc-800 text-sm"
            />
          </div>
        </div>

        {/* Artifact Table */}
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr,120px,140px,100px] gap-4 px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <span>Component / Image</span>
            </div>
            <div>Type</div>
            <div>Digest</div>
            <div>Status</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-zinc-800/50">
            {filteredArtifacts.map((artifact) => {
              const TypeIcon = typeIcons[artifact.type];
              return (
                <div
                  key={artifact.id}
                  onClick={() => handleArtifactClick(artifact)}
                  className="grid grid-cols-[1fr,120px,140px,100px] gap-4 px-4 py-4 hover:bg-zinc-900/50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                      <TypeIcon className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{artifact.name}</div>
                      <div className="text-xs text-zinc-500 font-mono truncate">{artifact.ref}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-zinc-400">{typeLabels[artifact.type]}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-mono text-zinc-500">{artifact.digest}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {artifact.signed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                    {artifact.vulnerabilities > 0 && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        {artifact.vulnerabilities} CVE
                      </Badge>
                    )}
                    <ChevronRight className="w-4 h-4 text-zinc-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Artifact Inspector Drawer */}
      <ArtifactInspectorDrawer
        artifact={selectedArtifact}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </SentinelLayout>
  );
}
