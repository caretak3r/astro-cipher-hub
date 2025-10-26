import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Shield, FileCheck, Lock } from "lucide-react";

const securityMetrics = [
  {
    label: "Vulnerability Status",
    critical: 0,
    high: 2,
    medium: 5,
    low: 8,
    total: 15,
  },
  {
    label: "Signature Verification",
    verified: 24,
    total: 24,
    percentage: 100,
  },
  {
    label: "SBOM Compliance",
    compliant: 24,
    total: 24,
    percentage: 100,
  },
  {
    label: "Policy Violations",
    count: 0,
    status: "compliant",
  },
];

export function SecurityDashboard() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Security Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Vulnerability Status */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-6 h-6 text-warning" />
            <Badge variant="outline" className="text-xs">
              {securityMetrics[0].total} issues
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Vulnerability Status
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Critical: {securityMetrics[0].critical}</span>
              <span className="text-muted-foreground">High: {securityMetrics[0].high}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Medium: {securityMetrics[0].medium}</span>
              <span className="text-muted-foreground">Low: {securityMetrics[0].low}</span>
            </div>
          </div>
        </Card>

        {/* Signature Verification */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <Lock className="w-6 h-6 text-success" />
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              {securityMetrics[1].percentage}%
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Signature Verification
          </h3>
          <div className="space-y-2">
            <Progress value={securityMetrics[1].percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {securityMetrics[1].verified}/{securityMetrics[1].total} artifacts verified
            </p>
          </div>
        </Card>

        {/* SBOM Compliance */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <FileCheck className="w-6 h-6 text-success" />
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              {securityMetrics[2].percentage}%
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            SBOM Compliance
          </h3>
          <div className="space-y-2">
            <Progress value={securityMetrics[2].percentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {securityMetrics[2].compliant}/{securityMetrics[2].total} artifacts compliant
            </p>
          </div>
        </Card>

        {/* Policy Violations */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-6 h-6 text-success" />
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              Compliant
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Policy Violations
          </h3>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-card-foreground">
              {securityMetrics[3].count}
            </p>
            <p className="text-xs text-success">
              All policies enforced
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
