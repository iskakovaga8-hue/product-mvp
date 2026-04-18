import DiagnosticWizard from "@/components/diagnostic/DiagnosticWizard";
import { TOTAL_STEPS } from "../../../data/questions";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ step: string }>;
}

export default async function DiagnosticStepPage({ params }: Props) {
  const { step: stepStr } = await params;
  const step = parseInt(stepStr, 10);

  if (isNaN(step) || step < 1 || step > TOTAL_STEPS) {
    redirect("/diagnostic/1");
  }

  return <DiagnosticWizard step={step} />;
}
