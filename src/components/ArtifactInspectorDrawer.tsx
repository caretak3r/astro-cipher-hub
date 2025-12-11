import { useState } from "react";
import { X, Download, Package, Clock, HardDrive, Cpu, FileType, Copy, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Artifact {
  id: string;
  name: string;
  ref: string;
  type: string;
  digest: string;
  size: string;
  signed: boolean;
  vulnerabilities: number;
}

interface ArtifactInspectorDrawerProps {
  artifact: Artifact | null;
  isOpen: boolean;
  onClose: () => void;
}

const mockSbomPackages = [
  { name: "alpine-baselayout", version: "3.2.0-r22", license: "GPL-2.0" },
  { name: "busybox", version: "1.35.0-r17", license: "GPL-2.0" },
  { name: "ssl_client", version: "1.35.0-r17", license: "GPL-2.0" },
  { name: "zlib", version: "1.2.12-r3", license: "Zlib" },
  { name: "openssl", version: "3.0.8-r0", license: "Apache-2.0" },
  { name: "ca-certificates", version: "20230506-r0", license: "MPL-2.0" },
  { name: "libcrypto3", version: "3.0.8-r0", license: "Apache-2.0" },
  { name: "libssl3", version: "3.0.8-r0", license: "Apache-2.0" },
];

const mockManifest = {
  schemaVersion: 2,
  mediaType: "application/vnd.docker.distribution.manifest.v2+json",
  config: {
    mediaType: "application/vnd.docker.container.image.v1+json",
    size: 7023,
    digest: "sha256:7fa1e8a2b13c..."
  },
  layers: [
    {
      mediaType: "application/vnd.docker.image.rootfs.diff.tar.gzip",
      size: 32654,
      digest: "sha256:..."
    },
    {
      mediaType: "application/vnd.docker.image.rootfs.diff.tar.gzip",
      size: 16724,
      digest: "sha256:..."
    }
  ]
};

const mockSignature = {
  certificate: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...",
  issuer: "Sigstore.dev",
  subject: "github-actions[bot]",
  rekorId: "294820934820..."
};

export const ArtifactInspectorDrawer = ({ artifact, isOpen, onClose }: ArtifactInspectorDrawerProps) => {
  const { toast } = useToast();
  const [sbomFilter, setSbomFilter] = useState("");

  if (!artifact) return null;

  const filteredPackages = mockSbomPackages.filter(pkg =>
    pkg.name.toLowerCase().includes(sbomFilter.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-[560px] bg-zinc-900 border-l border-zinc-700 shadow-2xl z-50 flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 bg-zinc-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white truncate">{artifact.ref.split('/').pop()}</h2>
              <p className="text-xs text-zinc-500 font-mono truncate">{artifact.digest}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-zinc-800 rounded-none">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 px-4 py-3 text-xs font-medium"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="sbom"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 px-4 py-3 text-xs font-medium"
            >
              SBOM
            </TabsTrigger>
            <TabsTrigger
              value="signature"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 px-4 py-3 text-xs font-medium"
            >
              Signature
            </TabsTrigger>
            <TabsTrigger
              value="manifest"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-500 data-[state=active]:bg-transparent data-[state=active]:text-emerald-400 px-4 py-3 text-xs font-medium"
            >
              Manifest
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Artifact Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Artifact Metadata</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                      <span className="text-sm text-zinc-400">Created</span>
                      <span className="text-sm text-white font-mono">2025-12-01 16:45:00 UTC</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                      <span className="text-sm text-zinc-400">Size</span>
                      <span className="text-sm text-white">{artifact.size}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                      <span className="text-sm text-zinc-400">Platform</span>
                      <span className="text-sm text-white">linux/amd64</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                      <span className="text-sm text-zinc-400">Media Type</span>
                      <span className="text-xs text-zinc-300 font-mono truncate ml-4">application/vnd.docker.distribution.manifest.v2+json</span>
                    </div>
                  </div>
                </div>

                {/* Layer Composition */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Layer Composition</h3>
                  <div className="h-3 rounded-full overflow-hidden flex bg-zinc-800">
                    <div className="bg-emerald-500 h-full" style={{ width: "45%" }} title="Base OS" />
                    <div className="bg-blue-500 h-full" style={{ width: "30%" }} title="Dependencies" />
                    <div className="bg-purple-500 h-full" style={{ width: "25%" }} title="Application" />
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-zinc-400">Base OS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-zinc-400">Deps</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-zinc-400">App</span>
                    </div>
                  </div>
                </div>

                {/* Build History */}
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Build History</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-sm text-white">Image Pushed to Registry</div>
                        <div className="text-xs text-zinc-500">07:47 UTC</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-sm text-white">Scan Complete (Trivy)</div>
                        <div className="text-xs text-zinc-500">10:11:32 UTC</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <div className="text-sm text-white">Signed with Cosign</div>
                        <div className="text-xs text-zinc-500">10:11:34 UTC</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* SBOM Tab */}
          <TabsContent value="sbom" className="flex-1 m-0 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <Input
                placeholder="Filter packages..."
                value={sbomFilter}
                onChange={(e) => setSbomFilter(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-sm"
              />
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
                      <th className="pb-3 font-medium">Package</th>
                      <th className="pb-3 font-medium">Version</th>
                      <th className="pb-3 font-medium">License</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {filteredPackages.map((pkg, idx) => (
                      <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-3 text-white font-mono">{pkg.name}</td>
                        <td className="py-3 text-zinc-400 font-mono">{pkg.version}</td>
                        <td className="py-3 text-zinc-500">{pkg.license}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Signature Tab */}
          <TabsContent value="signature" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Certificate */}
                <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm">
                  <div className="text-emerald-400">-----BEGIN CERTIFICATE-----</div>
                  <div className="text-zinc-400 break-all my-2">{mockSignature.certificate}</div>
                  <div className="text-emerald-400">-----END CERTIFICATE-----</div>
                </div>

                {/* Signature Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Issuer</span>
                    <span className="text-sm text-white font-mono">{mockSignature.issuer}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Subject</span>
                    <span className="text-sm text-white font-mono">{mockSignature.subject}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-800">
                    <span className="text-sm text-zinc-400">Rekor ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-mono">{mockSignature.rekorId}</span>
                      <button
                        onClick={() => copyToClipboard(mockSignature.rekorId)}
                        className="text-zinc-500 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Manifest Tab */}
          <TabsContent value="manifest" className="flex-1 m-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <pre className="rounded-lg bg-zinc-950 border border-zinc-800 p-4 text-sm font-mono overflow-x-auto">
                  <code>
                    {JSON.stringify(mockManifest, null, 2)
                      .split('\n')
                      .map((line, i) => {
                        const colored = line
                          .replace(/"([^"]+)":/g, '<span class="text-indigo-400">"$1"</span>:')
                          .replace(/: "([^"]+)"/g, ': <span class="text-emerald-400">"$1"</span>')
                          .replace(/: (\d+)/g, ': <span class="text-rose-400">$1</span>');
                        return (
                          <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />
                        );
                      })}
                  </code>
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
