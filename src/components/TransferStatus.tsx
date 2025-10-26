import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRightLeft, CheckCircle, Clock, HardDrive } from "lucide-react";

const transferData = {
  lastSync: "2 hours ago",
  status: "completed",
  totalArtifacts: 24,
  transferredToday: 3,
  pendingValidation: 0,
  transferMethod: "Secure Bastion",
  nextScheduled: "In 6 hours",
};

export function TransferStatus() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ArrowRightLeft className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Air-Gap Transfer Status</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Last Sync Status */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-6 h-6 text-success" />
            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
              {transferData.status}
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Last Synchronization</h3>
          <p className="text-2xl font-bold text-card-foreground mb-1">{transferData.lastSync}</p>
          <p className="text-xs text-muted-foreground">
            {transferData.transferredToday} artifacts transferred today
          </p>
        </Card>

        {/* Transfer Method */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="w-6 h-6 text-primary" />
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Transfer Method</h3>
          <p className="text-lg font-semibold text-card-foreground mb-1">
            {transferData.transferMethod}
          </p>
          <p className="text-xs text-muted-foreground">
            Hardware-based data diode
          </p>
        </Card>

        {/* Next Scheduled Transfer */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-6 h-6 text-primary" />
            <Badge variant="outline" className="text-xs">
              Scheduled
            </Badge>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Next Transfer</h3>
          <p className="text-lg font-semibold text-card-foreground mb-1">
            {transferData.nextScheduled}
          </p>
          <p className="text-xs text-muted-foreground">
            Automated sync enabled
          </p>
        </Card>
      </div>

      {/* Validation Progress */}
      {transferData.pendingValidation > 0 && (
        <Card className="p-4 bg-card border-border mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground">
              Validating Transfers
            </span>
            <span className="text-xs text-muted-foreground">
              {transferData.pendingValidation} pending
            </span>
          </div>
          <Progress value={75} className="h-2" />
        </Card>
      )}
    </div>
  );
}
