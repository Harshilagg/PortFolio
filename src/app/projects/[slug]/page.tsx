import { notFound } from "next/navigation";
import Link from "next/link";
import { PROJECTS } from "@/lib/data";
import { ProjectDetailClient } from "@/app/projects/[slug]/client";
import type { Metadata } from "next";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: { params: Params }): Promise<Metadata> {
  const { slug } = await props.params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} — Harshil Aggarwal`,
    description: project.tagline,
  };
}

export default async function ProjectPage(props: { params: Params }) {
  const { slug } = await props.params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? PROJECTS[currentIndex - 1] : null;
  const next = currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : null;

  return <ProjectDetailClient project={project} prev={prev} next={next} />;
}
