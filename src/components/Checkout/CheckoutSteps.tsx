import { Progress } from "@/components/ui/progress";

interface Step {
  number: number;
  title: string;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <Progress value={progress} className="w-full h-2 mb-4 " />
      <div className="flex justify-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex flex-col items-center ${
              step.number <= currentStep ? "" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                step.number <= currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {step.number}
            </div>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
