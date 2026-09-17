import { notFound } from "next/navigation";
import { LabExperience } from "@/components/sections/lab/LabExperience";
import { LAB_EXPERIMENTS } from "@/lib/data/lab-experiments";

export function generateStaticParams() {
  return LAB_EXPERIMENTS.map(({ slug }) => ({ slug }));
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!LAB_EXPERIMENTS.some((experiment) => experiment.slug === slug)) notFound();
  return <LabExperience slug={slug} />;
}
