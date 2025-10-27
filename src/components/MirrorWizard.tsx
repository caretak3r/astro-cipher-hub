import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Package, 
  Container, 
  FileCheck, 
  Shield, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Copy,
  Server,
  HardDrive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArtifactCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  source: string;
  items: { name: string; version: string; size: string }[];
}

const artifactCategories: ArtifactCategory[] = [
  {
    id: "helm",
    name: "Helm Charts",
    description: "Application deployment charts",
    icon: Package,
    source: "register.company.com",
    items: [
      { name: "app-backend-service", version: "2.4.1", size: "245 MB" },
      { name: "database-operator", version: "3.1.0", size: "128 MB" },
      { name: "monitoring-stack", version: "5.0.2", size: "892 MB" },
    ],
  },
  {
    id: "docker",
    name: "Docker Images",
    description: "Container images and layers",
    icon: Container,
    source: "proxy.company.com",
    items: [
      { name: "frontend-app", version: "1.8.3", size: "512 MB" },
      { name: "api-gateway", version: "4.2.0", size: "384 MB" },
      { name: "data-processor", version: "2.1.5", size: "675 MB" },
    ],
  },
  {
    id: "signatures",
    name: "Signatures",
    description: "Cosign artifact signatures",
    icon: Shield,
    source: "proxy.company.com",
    items: [
      { name: "signature-bundle-1", version: "latest", size: "2.4 MB" },
      { name: "signature-bundle-2", version: "latest", size: "1.8 MB" },
    ],
  },
  {
    id: "sboms",
    name: "SBOMs",
    description: "Software Bill of Materials",
    icon: FileCheck,
    source: "proxy.company.com",
    items: [
      { name: "sbom-collection-1", version: "latest", size: "12 MB" },
      { name: "sbom-collection-2", version: "latest", size: "8 MB" },
    ],
  },
];

const installMethods = [
  {
    id: "bundle",
    name: "Offline Bundle",
    description: "Download a complete archive ready for air-gapped installation",
    icon: HardDrive,
    command: "tar -xzf airgap-bundle.tar.gz && ./install.sh",
  },
  {
    id: "mirror",
    name: "Mirror Registry",
    description: "Sync to your internal registry using provided scripts",
    icon: Server,
    command: "mirror-registry.sh --source register.company.com --target your-registry.local",
  },
  {
    id: "manual",
    name: "Manual Download",
    description: "Download individual artifacts for custom deployment",
    icon: Download,
    command: "wget -i artifact-list.txt",
  },
];

export const MirrorWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [targetRegistry, setTargetRegistry] = useState("");
  const { toast } = useToast();

  const totalSteps = 4;

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast({
      title: "Copied to clipboard",
      description: "Command copied successfully",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your artifacts are being prepared for download",
    });
  };

  const selectedArtifacts = artifactCategories.filter(cat =>
    selectedCategories.includes(cat.id)
  );

  const totalSize = selectedArtifacts.reduce((total, cat) => {
    const catSize = cat.items.reduce((sum, item) => {
      const size = parseFloat(item.size);
      return sum + size;
    }, 0);
    return total + catSize;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step === currentStep
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step < currentStep ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-muted-foreground text-center">
                {step === 1 && "Select"}
                {step === 2 && "Configure"}
                {step === 3 && "Method"}
                {step === 4 && "Download"}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  step < currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && "Select Artifacts"}
            {currentStep === 2 && "Configure Sources"}
            {currentStep === 3 && "Installation Method"}
            {currentStep === 4 && "Review & Download"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && "Choose which artifacts you want to mirror for air-gapped deployment"}
            {currentStep === 2 && "Verify mirror source endpoints and configure target registry"}
            {currentStep === 3 && "Select your preferred installation method"}
            {currentStep === 4 && "Review your selections and download artifacts"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Select Artifacts */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artifactCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategories.includes(category.id);

                return (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => handleCategoryToggle(category.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-foreground">{category.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {category.items.length} items available
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Step 2: Configure Sources */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">Mirror Sources</h4>
                {selectedArtifacts.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div
                      key={category.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg"
                    >
                      <Icon className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground">{category.source}</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="target-registry">Target Registry (Optional)</Label>
                <Input
                  id="target-registry"
                  placeholder="your-registry.local"
                  value={targetRegistry}
                  onChange={(e) => setTargetRegistry(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Specify your internal registry if you plan to mirror artifacts
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Installation Method */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {installMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;

                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => setSelectedMethod(method.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-foreground">{method.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {method.description}
                          </p>
                          <div className="bg-muted p-3 rounded-md flex items-center gap-2">
                            <code className="text-sm flex-1 text-foreground">
                              {method.command}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyCommand(method.command);
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Step 4: Review & Download */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">Selected Artifacts</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedCategories.length} categories
                  </span>
                </div>
                <Separator />
                {selectedArtifacts.map((category) => (
                  <div key={category.id} className="flex justify-between items-center">
                    <span className="text-sm text-foreground">{category.name}</span>
                    <Badge variant="outline">{category.items.length} items</Badge>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-foreground">Total Size</span>
                  <span className="text-primary">{totalSize.toFixed(0)} MB</span>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Installation Method</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {installMethods.find((m) => m.id === selectedMethod)?.name || "Not selected"}
                </p>
              </div>

              {targetRegistry && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Target Registry</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{targetRegistry}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={
                  (currentStep === 1 && selectedCategories.length === 0) ||
                  (currentStep === 3 && !selectedMethod)
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleDownload}
                disabled={selectedCategories.length === 0 || !selectedMethod}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Bundle
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
