export interface Step {
  Key: string,
  Title: string,
  NextButtonTitle:string
}

export interface StepState {
  currentStep: Step;
  allSteps: Step[];
  stepIndex: number;
}
