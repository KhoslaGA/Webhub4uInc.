export const CONTACT_SERVICES = [
  { value: "web-development", label: "Web development" },
  { value: "seo", label: "SEO & local search" },
  { value: "custom-software-development", label: "Custom software" },
  { value: "ai-receptionist", label: "AI receptionist" },
  { value: "ai-chatbot", label: "AI chatbot" },
  { value: "automation", label: "Business automation" },
  { value: "not-sure", label: "Not sure yet" },
];
export const BUDGETS = ["Not decided yet", "Under C$2,500", "C$2,500–5,000", "C$5,000–10,000", "C$10,000–25,000", "C$25,000+"];
export const TIMINGS = ["Exploring options", "Within a month", "1–3 months", "3–6 months", "Later than 6 months"];
export const contactService = (value) => CONTACT_SERVICES.find((service) => service.value === value);
