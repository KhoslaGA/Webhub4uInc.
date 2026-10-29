import { notFound } from "next/navigation";
import ServiceDetail from "@/components/sections/new/ServiceDetail";
import { SERVICE_PAGES, getServicePage, servicePath } from "@/data/servicePages";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((service) => ({ id: service.slug }));
}

export function generateMetadata({ params }) {
  const service = getServicePage(params.id);
  if (!service) notFound();
  return { title: service.title, description: service.description, alternates: { canonical: servicePath(service) }, openGraph: { title: service.title, description: service.description, url: servicePath(service), type: "website" } };
}

export default function ServicePage({ params }) {
  const service = getServicePage(params.id);
  if (!service) notFound();
  return <ServiceDetail service={service} />;
}
