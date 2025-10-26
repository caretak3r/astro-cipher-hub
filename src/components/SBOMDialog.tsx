import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package, Shield, AlertTriangle } from "lucide-react";

interface SBOMDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifact: {
    name: string;
    version: string;
  };
}

const mockSBOMData = {
  format: "CycloneDX",
  version: "1.5",
  timestamp: "2025-01-15T10:30:00Z",
  components: [
    {
      name: "alpine",
      version: "3.18.0",
      type: "library",
      licenses: ["MIT"],
      vulnerabilities: 0,
    },
    {
      name: "nginx",
      version: "1.25.3",
      type: "application",
      licenses: ["BSD-2-Clause"],
      vulnerabilities: 1,
      severity: "medium",
    },
    {
      name: "openssl",
      version: "3.0.10",
      type: "library",
      licenses: ["Apache-2.0"],
      vulnerabilities: 0,
    },
    {
      name: "curl",
      version: "8.4.0",
      type: "library",
      licenses: ["MIT"],
      vulnerabilities: 2,
      severity: "low",
    },
  ],
  dependencies: 47,
  totalVulnerabilities: 3,
};

export function SBOMDialog({ open, onOpenChange, artifact }: SBOMDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="w-5 h-5 text-primary" />
            SBOM Details - {artifact.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Software Bill of Materials for version {artifact.version}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {/* SBOM Metadata */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                Format: {mockSBOMData.format}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Version: {mockSBOMData.version}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {mockSBOMData.dependencies} dependencies
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  mockSBOMData.totalVulnerabilities === 0
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }`}
              >
                {mockSBOMData.totalVulnerabilities} vulnerabilities
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Components List */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Components
            </h3>

            {mockSBOMData.components.map((component, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-card-foreground">
                      {component.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Version {component.version}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {component.type}
                    </Badge>
                    {component.vulnerabilities > 0 && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          component.severity === "medium"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {component.vulnerabilities}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {component.licenses.map((license, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {license}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Generation Info */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Generated: {new Date(mockSBOMData.timestamp).toLocaleString()}</p>
            <p>Tool: Syft v0.97.0</p>
            <p>
              Hash: a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
