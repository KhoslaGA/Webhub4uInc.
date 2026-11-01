import ContactForm from "./ContactForm";
import { DEMO_SOURCES } from "@/lib/demoOptions.mjs";

// Direct email is the owner-selected lead channel until an automated provider is connected.
export default function DemoRequestForm({ source = "webhub4u.com/ai-receptionist" }) {
  return <ContactForm initialService="ai-receptionist" demo source={DEMO_SOURCES.includes(source) ? source : "webhub4u.com"} />;
}
