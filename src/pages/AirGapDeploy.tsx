import { Link } from "react-router-dom";
import { SentinelLayout } from "@/components/SentinelLayout";
import { ChainOfTrustVisualization } from "@/components/ChainOfTrustVisualization";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShieldCheck,
  Layers,
  FileSignature,
  Bug,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileUp
} from "lucide-react";

const Index = () => {
  return (
    <SentinelLayout bundleName="defense-app-suite" bundleVersion="v2.4.0">
      <div className="p-6 space-y-6 max-w-6xl">
        {/* Page Header */}
        <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Package Overview</h1>
            <p className="text-zinc-400 text-sm">
              Analysis of air-gapped bundle{" "}
              <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                zarf-package-defense-app-v2.4.0.zst
              </span>
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 bg-zinc-900/50 border-zinc-800 border-l-4 border-l-emerald-500 hover:bg-zinc-800/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Compliance Score</p>
                <h3 className="text-2xl font-bold text-white mt-1">98%</h3>
              </div>
              <div className="p-2 bg-zinc-800 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">ADR-004 Compliant</div>
          </Card>

          <Link to="/airgap-deploy/artifacts">
            <Card className="p-4 bg-zinc-900/50 border-zinc-800 border-l-4 border-l-blue-500 hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Total Artifacts</p>
                  <h3 className="text-2xl font-bold text-white mt-1">12</h3>
                </div>
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Layers className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-3 text-xs text-zinc-500">8 Images, 4 Charts</div>
            </Card>
          </Link>

          <Card className="p-4 bg-zinc-900/50 border-zinc-800 border-l-4 border-l-purple-500 hover:bg-zinc-800/50 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-sm font-medium">Signatures</p>
                <h3 className="text-2xl font-bold text-white mt-1">100%</h3>
              </div>
              <div className="p-2 bg-zinc-800 rounded-lg">
                <FileSignature className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="mt-3 text-xs text-zinc-500">Cosign / Rekor Verified</div>
          </Card>

          <Link to="/airgap-deploy/vulnerabilities">
            <Card className="p-4 bg-zinc-900/50 border-zinc-800 border-l-4 border-l-rose-500 hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-400 text-sm font-medium">Critical CVEs</p>
                  <h3 className="text-2xl font-bold text-white mt-1">3</h3>
                </div>
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <Bug className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div className="mt-3 text-xs text-zinc-500">Needs Triage</div>
            </Card>
          </Link>
        </div>

        {/* Chain of Trust */}
        <ChainOfTrustVisualization />

        {/* Verification Log + Load Differential */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Log */}
          <Card className="col-span-2 p-5 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Verification Log</h3>
              <span className="text-xs text-zinc-500 font-mono">ID: 98a-17b-22c</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white text-sm">Bundle Checksum</div>
                  <div className="text-xs text-zinc-500">SHA256 hash matches manifest.</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-950/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white text-sm">Cosign Signature</div>
                  <div className="text-xs text-zinc-500">Verified against bundled public key (Offline Mode).</div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-rose-500/30 bg-rose-500/5">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-medium text-white text-sm">Vulnerability Scan</div>
                  <div className="text-xs text-zinc-500">2 Critical CVEs detected in 'podinfo' image.</div>
                </div>
                <Link to="/airgap-deploy/vulnerabilities">
                  <Button variant="outline" size="sm" className="text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10">
                    Review
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Load Differential */}
          <Card className="p-5 bg-zinc-900/50 border-zinc-800 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
              <FileUp className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">Load Differential</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Upload a differential patch bundle to update this deployment.
            </p>
            <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800">
              <Upload className="w-4 h-4 mr-2" />
              Select File...
            </Button>
          </Card>
        </div>
      </div>
    </SentinelLayout>
  );
};

export default Index;
