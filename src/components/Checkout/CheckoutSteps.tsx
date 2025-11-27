interface Step {
  number: number;
  title: string;
}

interface CheckoutStepsProps {
  currentStep: number;
  steps: Step[];
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      {/* Progress bar */}
      <div className="relative mb-8">
        {/* Background line */}
        <div className="absolute top-4 left-0 w-full h-[2px] bg-rose-gold/20" />
        {/* Progress line */}
        <div
          className="absolute top-4 left-0 h-[2px] bg-rose-gold transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center"
            >
              {/* Step circle */}
              <div
                className={`relative w-8 h-8 flex items-center justify-center transition-all duration-300 ${
                  step.number < currentStep
                    ? "bg-rose-gold"
                    : step.number === currentStep
                    ? "bg-charcoal"
                    : "bg-cream border-2 border-rose-gold/30"
                }`}
              >
                {step.number < currentStep ? (
                  <svg
                    className="w-4 h-4 text-warm-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span
                    className={`text-sm font-secondary ${
                      step.number === currentStep
                        ? "text-warm-white"
                        : "text-charcoal/50"
                    }`}
                  >
                    {step.number}
                  </span>
                )}

                {/* Diamond accent for current step */}
                {step.number === currentStep && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-rose-gold diamond-shape" />
                )}
              </div>

              {/* Step title */}
              <span
                className={`mt-3 text-sm font-secondary transition-colors duration-300 ${
                  step.number <= currentStep
                    ? "text-charcoal"
                    : "text-charcoal/40"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
