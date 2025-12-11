import { SentinelLayout } from "@/components/SentinelLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  FileText,
  Clock,
} from "lucide-react";

interface ComplianceCheck {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "warning";
  category: string;
}

const complianceChecks: ComplianceCheck[] = [
  {
    id: "1",
    name: "All images are signed",
    description: "Every container image has a valid Cosign signature",
    status: "pass",
    category: "Signatures",
  },
  {
    id: "2",
    name: "SBOM attached to all artifacts",
    description: "Software Bill of Materials is present for all components",
    status: "pass",
    category: "SBOM",
  },
  {
    id: "3",
    name: "No critical vulnerabilities",
    description: "Bundle contains no critical severity CVEs",
    status: "fail",
    category: "Vulnerabilities",
  },
  {
    id: "4",
    name: "Provenance attestations present",
    description: "Build provenance is available for all artifacts",
    status: "pass",
    category: "Provenance",
  },
  {
    id: "5",
    name: "Bundle checksum verified",
    description: "SHA256 checksum matches expected value",
    status: "pass",
    category: "Integrity",
  },
  {
    id: "6",
    name: "No high severity vulnerabilities",
    description: "Bundle contains no high severity CVEs",
    status: "warning",
    category: "Vulnerabilities",
  },
  {
    id: "7",
    name: "Images from approved registries",
    description: "All images originate from approved container registries",
    status: "pass",
    category: "Supply Chain",
  },
  {
    id: "8",
    name: "Helm charts validated",
    description: "All Helm charts pass schema validation",
    status: "pass",
    category: "Validation",
  },
];

const statusIcons = {
  pass: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
  fail: <XCircle className="w-5 h-5 text-rose-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
};

const statusColors = {
  pass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  fail: "bg-rose-500/10 border-rose-500/30 text-rose-400",
  warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
};

export default function Compliance() {
  const passCount = complianceChecks.filter((c) => c.status === "pass").length;
  const failCount = complianceChecks.filter((c) => c.status === "fail").length;
  const warningCount = complianceChecks.filter((c) => c.status === "warning").length;
  const totalCount = complianceChecks.length;
  const score = Math.round((passCount / totalCount) * 100);

  return (
    <SentinelLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Compliance</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Policy compliance status for this bundle
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="w-4 h-4" />
            Last checked: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="col-span-2 p-6 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * score) / 100}
                    className={score >= 80 ? "text-emerald-500" : score >= 50 ? "text-yellow-500" : "text-rose-500"}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{score}%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Compliance Score</h3>
                <p className="text-sm text-zinc-400">
                  {passCount} of {totalCount} checks passing
                </p>
                <div className="flex gap-3 mt-3">
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {passCount} Passed
                  </Badge>
                  <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">
                    {failCount} Failed
                  </Badge>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    {warningCount} Warnings
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Policy</p>
                <p className="text-lg font-semibold text-white">ADR-004</p>
                <p className="text-xs text-zinc-500 mt-1">Air-Gap Security</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-zinc-900/50 border-zinc-800">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-zinc-800 rounded-lg">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Framework</p>
                <p className="text-lg font-semibold text-white">SLSA L3</p>
                <p className="text-xs text-zinc-500 mt-1">Supply Chain</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Compliance Checks */}
        <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-sm font-semibold text-white">Compliance Checks</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {complianceChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center gap-4 px-4 py-4 hover:bg-zinc-800/30 transition-colors"
              >
                {statusIcons[check.status]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{check.name}</span>
                    <Badge variant="outline" className="text-[10px] text-zinc-500 border-zinc-700">
                      {check.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{check.description}</p>
                </div>
                <Badge className={statusColors[check.status]}>
                  {check.status === "pass" ? "PASS" : check.status === "fail" ? "FAIL" : "WARN"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </SentinelLayout>
  );
}
