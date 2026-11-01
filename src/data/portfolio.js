// Owned products; scope reviewed against the 2026-11-01 project evidence.
export const PORTFOLIO = [
  {
    slug: "rate-family",
    name: "RateFamily",
    category: "Web development · Brand systems · Technical SEO",
    status: "Public websites + V2 development",
    headline: "Four brands. A connected digital world.",
    description: "A Canadian finance and insurance network with distinct identities, content-rich websites and a shared V2 development platform. From the first navigation choice to the structure behind search, we build the experience and the foundations together.",
    scope: [
      { title: "Brand & experience", text: "Distinct identities and navigation for four audiences." },
      { title: "Content & search", text: "Guides, topic architecture, canonicals and sitemaps." },
      { title: "Platform engineering", text: "Reusable components and shared V2 API contracts." },
    ],
    highlights: ["TopRates.ca", "LifeRate.ca", "TermRates.ca", "HealthRate.ca"],
    image: "/projects/toprates-public-20261101.png",
    alt: "The public TopRates homepage, with Canadian finance guides, topic navigation and search.",
    caption: "TopRates public website · Captured 1 November 2026",
    imageLabel: "A look at the live experience",
    note: "TopRates is the education-led hub. The public websites and V2 development application have separate release paths.",
    linkLabel: "Explore the RateFamily case study",
    live: { href: "https://www.toprates.ca", label: "Visit TopRates.ca" },
  },
  {
    slug: "insurimple",
    name: "Insurimple",
    category: "Product design · Custom software · Workflow engineering",
    status: "In development · Demonstration data",
    headline: "Complex operations. One clearer working day.",
    description: "An insurance operations platform and broker management system, built around the work a team needs to get done. Connected records, follow-up queues and review steps turn a complex business process into a deliberate product experience.",
    scope: [
      { title: "Operator experience", text: "Contacts, opportunities, activities and follow-up." },
      { title: "Connected systems", text: "CRM workflows linked to policy and renewal records." },
      { title: "Business rules", text: "Access controls, traceable changes and human review." },
    ],
    highlights: ["CRM & activities", "Policy workflows", "Review & traceability"],
    image: "/projects/insurimple-demo-20261101.png",
    alt: "Insurimple's development activities screen showing a follow-up queue with synthetic demonstration records.",
    caption: "Actual development interface · Synthetic data · Captured 1 November 2026",
    imageLabel: "Inside the development build",
    note: "An owned product in development. The capture demonstrates the interface; live integrations and production validation are separate milestones.",
    linkLabel: "Explore the Insurimple case study",
  },
];

// Compact product cards; the case studies above retain the full project scope.
export const PORTFOLIO_ITEMS = [
  {
    "slug": "toprates",
    "name": "TopRates.ca",
    "category": "Finance & insurance hub",
    "description": "A content-rich starting point for Canadian financial decisions.",
    "status": "Public website · RateFamily",
    "caseStudy": "rate-family",
    "image": "/projects/toprates-public-20261101.png",
    "alt": "The public TopRates homepage, with Canadian finance guides, topic navigation and search.",
    "width": 1440,
    "height": 1000,
    "live": "https://www.toprates.ca"
  },
  {
    "slug": "liferate",
    "name": "LifeRate.ca",
    "category": "Life & critical illness",
    "description": "A distinct brand and a clear path through life insurance education.",
    "status": "Public website · RateFamily",
    "caseStudy": "rate-family",
    "image": "/projects/liferate-public-20261101.jpg",
    "alt": "LifeRate's public homepage with its life insurance message and illustrated beaver mascot.",
    "width": 1272,
    "height": 716,
    "live": "https://www.liferate.ca"
  },
  {
    "slug": "termrates",
    "name": "TermRates.ca",
    "category": "Mortgages & renewals",
    "description": "Mortgage education, comparison interfaces and practical calculators.",
    "status": "Public website · RateFamily",
    "caseStudy": "rate-family",
    "image": "/projects/termrates-public-20261101.jpg",
    "alt": "TermRates' public homepage showing its mortgage comparison interface; captured rates are illustrative.",
    "width": 1272,
    "height": 716,
    "live": "https://www.termrates.ca"
  },
  {
    "slug": "healthrate",
    "name": "HealthRate.ca",
    "category": "Health, travel & Super Visa",
    "description": "An approachable education site for newcomers, visitors and families.",
    "status": "Public website · RateFamily",
    "caseStudy": "rate-family",
    "image": "/projects/healthrate-public-20261101.jpg",
    "alt": "HealthRate's public homepage introducing health, travel and Super Visa education.",
    "width": 1272,
    "height": 716,
    "live": "https://www.healthrate.ca"
  },
  {
    "slug": "insurimple",
    "name": "Insurimple",
    "category": "Insurance operations software",
    "description": "Connected records and workflows for the work behind the policy.",
    "status": "In development · Demo data",
    "caseStudy": "insurimple",
    "image": "/projects/insurimple-demo-20261101.png",
    "alt": "Insurimple's development activities screen showing a follow-up queue with synthetic demonstration records.",
    "width": 1440,
    "height": 1000
  }
];
