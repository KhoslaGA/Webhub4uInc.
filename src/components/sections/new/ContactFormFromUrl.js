"use client";
import { useSearchParams } from "next/navigation";
import ContactForm from "./ContactForm";

export default function ContactFormFromUrl() {
  const searchParams = useSearchParams();
  const service = searchParams.get("service") || "not-sure";
  return <ContactForm key={service} initialService={service} />;
}
