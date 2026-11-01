/**
 * GTA city data for /locations/[city]. Phase 1 = these 12 cities (D1 Sprint 2).
 *
 * Anti-doorway standard (D3 §5): every `intro` is genuinely unique — real
 * neighbourhoods and local business character, NOT one paragraph with the city
 * swapped. metaDescription + faqs are hand-written per city. Stagger publishing
 * 2–3/week rather than shipping all 12 the same day.
 */
export const LOCATIONS = [
  {
    slug: "brampton",
    name: "Brampton",
    lat: 43.7315,
    lng: -79.7624,
    neighbourhoods: ["Bramalea", "Springdale", "Mount Pleasant", "Heart Lake", "Castlemore", "Downtown / Four Corners"],
    metaDescription:
      "Websites, local SEO, and AI receptionists for Brampton businesses — from Bramalea to Mount Pleasant. Based right here in Brampton, serving the GTA.",
    intro: [
      "Webhub4U is based right here in Brampton, so the local market isn't an abstraction to us — it's our own backyard. From the trades and trucking outfits out by the 410 and Steeles, to the clinics and independent shops across Bramalea, Springdale and Mount Pleasant, to the family businesses around the Four Corners downtown, Brampton runs on busy operators who are doing the work, not sitting by the phone. That's exactly the gap our AI receptionist closes.",
      "Brampton is one of the youngest, fastest-growing cities in Canada, and it's fiercely competitive for local trades, home services and health practices. A dated website and a Google profile nobody's touched in two years won't win the customer in Castlemore or Heart Lake who's choosing between you and three others on their phone. We build fast, modern sites that rank, set up the AI tools that support after-hours enquiries, and run the local SEO that gets Brampton businesses into the map pack — the same playbook we use to rank ourselves.",
    ],
    faqs: [
      {
        q: "Do you meet Brampton businesses in person?",
        a: "Yes — we're based in Brampton and happy to meet at your shop or job site anywhere in the city, from Bramalea to Mount Pleasant. Most of the build happens remotely, but you always deal with the person actually doing the work.",
      },
      {
        q: "Can you get my Brampton business onto Google Maps?",
        a: "That's the heart of our local-SEO work: a fully optimized Google Business Profile, a Brampton-specific landing page, a reviews strategy, and local citations — the levers that move you into the map pack for 'near me' and 'in Brampton' searches.",
      },
      {
        q: "What does a website cost for a Brampton small business?",
        a: "Sites start at $997, and most Brampton trades and clinics land between $997 and $2,500 depending on pages and features — with pricing published up front, not quoted as a downtown-agency surprise.",
      },
    ],
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    lat: 43.589,
    lng: -79.6441,
    neighbourhoods: ["Port Credit", "Streetsville", "City Centre / Square One", "Meadowvale", "Cooksville", "Lorne Park"],
    metaDescription:
      "Web design, local SEO, and AI receptionists for Mississauga businesses — from Port Credit boutiques to Meadowvale trades and Square One offices.",
    intro: [
      "Mississauga is really two business worlds in one city, and a good website has to speak to both. There's the corporate side — the offices and professional firms clustered around Square One and the City Centre, and the industrial-strength operators out in the Heartland and Meadowvale business parks. And there's the main-street side — the boutiques, cafés and clinics that give Port Credit and Streetsville their village feel. Webhub4U builds for the specific customer each of those businesses is trying to reach.",
      "For a trades or home-services company covering Cooksville, Malton or Lorne Park, the game is being the one who answers when the call comes in — which is where our AI receptionist and missed-call text-back earn their keep. For a Port Credit restaurant or a professional practice near the lake, it's a site that looks as polished as the neighbourhood and a Google profile that actually pulls in reviews. We handle the whole stack: the build, the AI, and the local SEO that gets you found across Mississauga.",
    ],
    faqs: [
      {
        q: "Can you help a Port Credit or Streetsville storefront specifically?",
        a: "Yes — those village high streets live and die on foot traffic and reviews, so we focus on a fast, photo-forward site and a Google Business Profile that turns walk-bys and searches into bookings.",
      },
      {
        q: "Do you rank Mississauga businesses for 'near me' searches?",
        a: "That's proximity-driven, so it's won through Google Business Profile strength plus a Mississauga landing page and steady reviews — exactly the local-SEO package we run.",
      },
      {
        q: "I run a service business across Mississauga — will an AI receptionist work?",
        a: "It's ideal for that. When you're driving between Meadowvale and Lorne Park, the AI answers, texts back missed calls, and books the job so you're not losing leads to voicemail.",
      },
    ],
  },
  {
    slug: "toronto",
    name: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
    neighbourhoods: ["Financial District", "Liberty Village", "Leslieville", "The Danforth", "Kensington", "Queen West"],
    metaDescription:
      "AI receptionists, local SEO, and web design for Toronto small businesses — neighbourhood-focused, from Leslieville to Liberty Village and the Danforth.",
    intro: [
      "Toronto is a city of neighbourhoods, and that's exactly how we approach it. Trying to rank for 'web design Toronto' as a head term is a multi-year war against national agencies — and we'll tell you that straight. What's winnable, and what actually brings you customers, is the local search happening at the neighbourhood level: the clinic on the Danforth, the studio in Leslieville, the trades company serving Liberty Village and Queen West, the professional firm in the Financial District that needs to look the part.",
      "For those businesses, the fundamentals do the heavy lifting: a fast, genuinely modern website, a Google Business Profile tuned to your neighbourhood, and the AI tools that make sure a downtown lead never hits voicemail. Toronto customers decide in seconds on their phones, so we build for speed and conversion first, then layer on the local SEO and reviews engine that get you surfacing for the searches your neighbours are actually typing.",
    ],
    faqs: [
      {
        q: "Can you get me ranking for 'web design Toronto'?",
        a: "Honestly, the Toronto head term is a 2–3 year fight against national players — anyone promising it fast is lying. We target neighbourhood and long-tail searches (your area + your service) that convert faster and bring real local customers.",
      },
      {
        q: "Do you work with restaurants and shops in the downtown core?",
        a: "Yes — for hospitality and retail we lean into a photo-forward site, online booking or ordering, and a Google profile that stacks up reviews, since that's what wins the neighbourhood search.",
      },
      {
        q: "Is an AI receptionist worth it for a busy Toronto business?",
        a: "Very much so — downtown callers won't leave a voicemail, they'll call the next result. The AI answers instantly and books the appointment, so you keep the lead you already paid to earn.",
      },
    ],
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    lat: 43.8361,
    lng: -79.4983,
    neighbourhoods: ["Woodbridge", "Maple", "Kleinburg", "Thornhill", "Concord", "Vaughan Metropolitan Centre"],
    metaDescription:
      "Web design, AI receptionists, and local SEO for Vaughan businesses — Woodbridge, Maple, Concord, and the growing Vaughan Metropolitan Centre.",
    intro: [
      "Vaughan is builder country. From the construction, contracting and home-services companies rooted in Woodbridge and Concord, to the trades and suppliers that power the region's relentless development, this is a city where a huge share of business is done by referral and by phone — and where a missed call is a missed job worth real money. That's the first thing we fix for Vaughan clients: an AI receptionist and missed-call text-back so no lead slips through while you're on site.",
      "The city is also changing fast, with the Vaughan Metropolitan Centre turning into a genuine downtown and new professional practices, clinics and shops opening across Maple, Thornhill and Kleinburg. For them, credibility online is everything — a polished, quick website and a Google profile that reflects the quality of the work. We handle both sides of Vaughan: the trades that need to support after-hours enquiries, and the newer businesses that need to look established from day one.",
    ],
    faqs: [
      {
        q: "I run a contracting business out of Woodbridge — how does this help?",
        a: "Contractors lose the most to missed calls. Our AI receptionist answers in your company name, texts back anyone you miss, and books the estimate — so a lead calling from a job site in Vaughan doesn't just call the next contractor.",
      },
      {
        q: "Can you build a site that matches high-end Kleinburg or Thornhill clients?",
        a: "Absolutely — for businesses serving those areas we design for a premium feel and load speed, because a dated or slow site quietly costs you the higher-value jobs.",
      },
      {
        q: "Do you do local SEO for Vaughan specifically?",
        a: "Yes — a Vaughan landing page, Google Business Profile optimization, and reviews strategy aimed at Woodbridge, Maple and Concord searches, which are far more winnable than broad GTA terms.",
      },
    ],
  },
  {
    slug: "markham",
    name: "Markham",
    lat: 43.8561,
    lng: -79.337,
    neighbourhoods: ["Unionville", "Markham Village", "Cornell", "Milliken", "Cathedraltown", "Berczy"],
    metaDescription:
      "AI tools, web design, and local SEO for Markham businesses — from historic Unionville to the tech corridor. Modern sites that rank and convert.",
    intro: [
      "Markham calls itself Canada's high-tech capital for good reason — the corridor along the 404 and 407 is dense with technology firms, and the surrounding community is full of sophisticated, competitive small businesses that expect things done properly. That sets a high bar for anyone's online presence, and it's a bar we build to. Professional practices, clinics and service businesses across Unionville, Markham Village and Milliken aren't impressed by a cheap template — they need a site that's genuinely fast, well-built, and trustworthy.",
      "It's also a city with deep, established business communities and a customer base that researches carefully before it buys. That makes reviews, a complete Google Business Profile, and clear, credible content decisive. We give Markham businesses the full picture: a modern website that holds up next to the tech-corridor standard, AI receptionist and chat tools that respond the instant a lead arrives, and the local SEO that surfaces you for Markham searches instead of leaving you buried under national directories.",
    ],
    faqs: [
      {
        q: "My customers research everything before they call — how does that change things?",
        a: "It makes trust signals decisive. We prioritize a fast, professional site, a fully built Google Business Profile, and a steady stream of reviews, because in Markham the buyer has usually vetted you online before they ever reach out.",
      },
      {
        q: "Can you add an AI chatbot as well as a receptionist?",
        a: "Yes — a website chat assistant trained on your business answers questions and captures leads 24/7, which suits Markham's research-first customers who want answers before they commit to a call.",
      },
      {
        q: "Do you serve historic Unionville businesses?",
        a: "We do — for Unionville's boutiques, restaurants and practices we focus on a visually strong site and a review-driven Google profile that matches the area's premium, established character.",
      },
    ],
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    lat: 43.7764,
    lng: -79.2318,
    neighbourhoods: ["Agincourt", "Guildwood", "Malvern", "Scarborough Village", "The Bluffs", "Milliken"],
    metaDescription:
      "Web design, AI receptionists, and local SEO for Scarborough businesses — Agincourt to the Bluffs. Diverse, hard-working small businesses, done right.",
    intro: [
      "Scarborough is one of the most diverse business communities anywhere, and its small businesses are the definition of hard-working: the family restaurants and grocers, the trades and auto shops, the clinics and salons spread from Agincourt to Malvern to Guildwood. These are operators who compete on service and word of mouth, and who often don't have a minute to spare for their website or Google profile — which is precisely why the right tools matter so much here.",
      "For a Scarborough business, the fastest wins are usually the simplest: make sure every call gets answered or texted back, and make sure you actually show up when a neighbour searches. Our AI receptionist and missed-call text-back handle the first; a proper Google Business Profile, real reviews, and a Scarborough landing page handle the second. And because so much of Scarborough's business runs on mobile search, we build sites that load fast and convert on a phone — not desktop-first designs that fall apart on the device your customers actually use.",
    ],
    faqs: [
      {
        q: "My business runs mostly on word of mouth — do I even need this?",
        a: "Word of mouth is great until it dries up. A website and Google profile turn each referral into something searchable and repeatable, and missed-call text-back makes sure the referred customer who calls while you're busy doesn't just move on.",
      },
      {
        q: "Do you support businesses that serve customers in multiple languages?",
        a: "Yes — Scarborough is deeply multilingual, and we can build multi-language pages and set the AI tools to greet callers appropriately for the community you serve.",
      },
      {
        q: "Can you help a restaurant or shop in Agincourt get more customers?",
        a: "For food and retail we focus on a photo-forward, fast site, online ordering or booking where it fits, and a review-rich Google profile — the things that decide a local, mobile search in Scarborough.",
      },
    ],
  },
  {
    slug: "etobicoke",
    name: "Etobicoke",
    lat: 43.6205,
    lng: -79.5132,
    neighbourhoods: ["The Kingsway", "Mimico", "Long Branch", "Humber Bay Shores", "Islington Village", "Alderwood"],
    metaDescription:
      "AI receptionists, web design, and local SEO for Etobicoke businesses — from The Kingsway to Humber Bay Shores. Sites built to rank and convert.",
    intro: [
      "Etobicoke blends established, affluent neighbourhoods with a fast-growing waterfront, and its businesses reflect that mix. Along The Kingsway and through Islington Village you'll find long-standing professional practices, clinics and boutique retail that serve a discerning, higher-value clientele. Down toward Mimico, Long Branch and the Humber Bay Shores condos, there's a wave of newer restaurants, services and trades chasing a rapidly expanding local population. Both need to be found online, and both need to look the part.",
      "For the established Kingsway practice, we build the kind of clean, credible site and review-backed Google profile that reassures a careful customer. For the newer Humber Bay or Mimico business, we focus on getting visible fast and improving enquiry handling — AI receptionist, missed-call text-back, and a Google Business Profile tuned to the neighbourhood. Etobicoke customers are close enough to downtown to have options, so speed, polish and responsiveness are what keep the work here instead of drifting into the city.",
    ],
    faqs: [
      {
        q: "I have an established practice on The Kingsway — my site is just dated.",
        a: "That's a common and very fixable problem. We rebuild it fast and modern, keep everything you've earned in search, and refresh your Google profile so your online presence finally matches the reputation you've built.",
      },
      {
        q: "Do you work with the newer Humber Bay Shores businesses?",
        a: "Yes — for new waterfront businesses the priority is getting visible quickly and capturing every lead, so we pair a fast launch with AI receptionist and missed-call text-back from day one.",
      },
      {
        q: "Can you help me compete with downtown options?",
        a: "That's exactly the Etobicoke challenge. A quick, polished site plus instant call response keeps local customers choosing you instead of scrolling toward a downtown alternative.",
      },
    ],
  },
  {
    slug: "north-york",
    name: "North York",
    lat: 43.7615,
    lng: -79.4111,
    neighbourhoods: ["Willowdale", "Don Mills", "North York Centre", "Bayview Village", "Downsview", "Newtonbrook"],
    metaDescription:
      "Web design, AI receptionists, and local SEO for North York businesses — the Yonge corridor from Willowdale to North York Centre. Fast, modern, found.",
    intro: [
      "North York packs an enormous amount of business into the Yonge corridor. Willowdale and North York Centre are dense with clinics, dental and medical practices, professional firms and service businesses, all competing for the same stream of local searches. Around Don Mills and Bayview Village, retail and lifestyle businesses court a well-off customer base. It's a market where being on page two of Google effectively means being invisible, because there are simply too many nearby options for a customer to scroll past you.",
      "That density is why the fundamentals win here. A fast, professional site earns the click; a fully optimized Google Business Profile with steady reviews earns the map-pack spot; and AI receptionist plus chat tools make sure the lead who finds you gets an instant response instead of a voicemail. For North York's many health and professional practices in particular, we set the AI up carefully with guardrails so it books appointments and answers common questions without ever overstepping — turning your busiest phone lines into booked calendar slots.",
    ],
    faqs: [
      {
        q: "I run a clinic in Willowdale — can the AI handle patient calls?",
        a: "Yes, with strict guardrails. It answers common questions, books appointments into your calendar, and passes anything sensitive straight to your team — so your front desk stops drowning in calls without losing the personal touch.",
      },
      {
        q: "There are dozens of businesses like mine nearby. How do I stand out?",
        a: "In a dense market it comes down to a fast site, a stronger Google Business Profile, and more recent reviews than the practice next door — the specific signals that decide the North York map pack.",
      },
      {
        q: "Do you target the Yonge-corridor searches specifically?",
        a: "We do — a North York landing page and local SEO aimed at Willowdale and North York Centre searches, which convert far better than broad Toronto terms.",
      },
    ],
  },
  {
    slug: "richmond-hill",
    name: "Richmond Hill",
    lat: 43.8828,
    lng: -79.4403,
    neighbourhoods: ["Oak Ridges", "Bayview Glen", "Mill Pond", "Yonge & Major Mackenzie", "Jefferson", "Observatory"],
    metaDescription:
      "AI receptionists, web design, and local SEO for Richmond Hill businesses — Oak Ridges to Mill Pond. Polished sites and profiles that win local search.",
    intro: [
      "Richmond Hill is affluent, established and quality-conscious, and its business landscape follows suit: professional services, health and wellness practices, and boutique retail concentrated along the Yonge corridor and through neighbourhoods like Mill Pond, Bayview Glen and Oak Ridges. Customers here do their homework and expect a polished experience, which means a cut-rate website or a neglected Google profile actively works against you — it signals the wrong thing to exactly the customer you want.",
      "So for Richmond Hill businesses we build for credibility and conversion in equal measure: a fast, refined site that reflects the quality of your work, a Google Business Profile that stacks up genuine reviews, and AI tools that respond to enquiries the moment they land. For the many practices and consultancies here that run on booked appointments, the AI receptionist is a quiet workhorse — it captures the after-hours enquiry, answers the routine question, and fills the calendar slot, so you convert more of the leads your reputation is already generating.",
    ],
    faqs: [
      {
        q: "My customers expect a premium experience — can you match that online?",
        a: "That's our focus for Richmond Hill: a refined, fast site and a review-rich Google profile that reassure a discerning customer, because here a weak online presence quietly costs you the higher-value work.",
      },
      {
        q: "I run on appointments — how does the AI receptionist fit?",
        a: "It's built for appointment businesses. It answers enquiries day or night, handles routine questions, and books straight into your calendar, so more of your reputation-driven leads actually convert.",
      },
      {
        q: "Do you do local SEO for Richmond Hill?",
        a: "Yes — a Richmond Hill landing page, Google Business Profile optimization, and a reviews strategy targeting Oak Ridges, Mill Pond and the Yonge-corridor searches your customers use.",
      },
    ],
  },
  {
    slug: "oakville",
    name: "Oakville",
    lat: 43.4675,
    lng: -79.6877,
    neighbourhoods: ["Bronte", "Kerr Village", "Downtown / Lakeshore", "Glen Abbey", "Clearview", "Old Oakville"],
    metaDescription:
      "Web design, AI receptionists, and local SEO for Oakville businesses — Bronte to downtown Lakeshore. Premium sites for a premium market.",
    intro: [
      "Oakville is one of the most affluent markets in the country, and it shows in the businesses that serve it: upscale boutiques and restaurants around downtown Lakeshore and Bronte, high-end home-services and trades working on Glen Abbey and Old Oakville properties, and professional and wellness practices catering to a customer who expects the best. In a market like this, your online presence isn't a formality — it's a direct signal of whether you belong in the conversation.",
      "That's why we build to a premium standard for Oakville clients. A beautifully designed, genuinely fast website that matches the quality of the neighbourhood; a Google Business Profile that turns Oakville's review-driven word of mouth into search visibility; and AI receptionist and text-back tools that make sure a high-value enquiry has a clear follow-up path. For a trades or home-services company especially, a single Oakville project can be worth a great deal — which makes catching every call the difference between a strong month and a missed one.",
    ],
    faqs: [
      {
        q: "The jobs here are high-value — is a missed call really a big deal?",
        a: "In Oakville, more than most places. A single missed enquiry can be a large project lost to a competitor, so AI receptionist and missed-call text-back tend to pay for themselves with one saved job.",
      },
      {
        q: "Can you design something that fits an upscale Oakville brand?",
        a: "Yes — for the downtown Lakeshore and Bronte market we design for a refined, premium feel and fast performance, because a generic template undersells you to exactly the customer you want.",
      },
      {
        q: "Do you handle Oakville local SEO and reviews?",
        a: "We do — an Oakville landing page, Google Business Profile optimization, and a steady reviews engine, since this is a market where word of mouth and search reputation carry real weight.",
      },
    ],
  },
  {
    slug: "burlington",
    name: "Burlington",
    lat: 43.3255,
    lng: -79.799,
    neighbourhoods: ["Aldershot", "Downtown / Brant Street", "Alton Village", "Roseland", "The Orchard", "Tyandaga"],
    metaDescription:
      "AI receptionists, web design, and local SEO for Burlington businesses — downtown Brant Street to Alton Village. Modern sites that get you found.",
    intro: [
      "Burlington has quietly become one of the most desirable places in the country to live and run a business, and its commercial landscape reflects that: a vibrant downtown along Brant Street and the waterfront, established neighbourhoods like Roseland and Aldershot, and fast-growing communities up in Alton Village. The businesses here — independent shops and restaurants, trades and home services, professional and wellness practices — serve a loyal, engaged local customer who genuinely shops local when they can find you.",
      "The catch is being found. Burlington customers turn to Google and their phones first, so the businesses that win are the ones with a fast, modern site and a Google Business Profile that actually surfaces in local search. We handle that end to end, and add the AI receptionist and missed-call text-back that keep a lead from slipping away while you're busy. For a growing Alton Village service business or an established Brant Street shop alike, the goal is the same: show up when a Burlington neighbour searches, and never leave them talking to a voicemail.",
    ],
    faqs: [
      {
        q: "Burlington shoppers love to shop local — how do I get in front of them?",
        a: "By owning local search. A fast site plus a well-optimized Google Business Profile with recent reviews puts you in the map pack when a Burlington neighbour searches your service — which is where that local loyalty turns into customers.",
      },
      {
        q: "I'm a growing service business in Alton Village — where do I start?",
        a: "Start with improving enquiry handling: AI receptionist and missed-call text-back on your existing number, paired with a Burlington landing page so you show up as the area fills in around you.",
      },
      {
        q: "Do you work with downtown Brant Street businesses?",
        a: "Yes — for downtown shops and restaurants we focus on a photo-forward, fast site and a review-rich Google profile, the combination that wins foot traffic and local search on the waterfront strip.",
      },
    ],
  },
  {
    slug: "milton",
    name: "Milton",
    lat: 43.5183,
    lng: -79.8774,
    neighbourhoods: ["Old Milton / Main Street", "Hawthorne Village", "Willmott", "Scott", "Coates", "Dempsey"],
    metaDescription:
      "Web design, AI receptionists, and local SEO for Milton businesses — one of Canada's fastest-growing towns. Get found as your customer base explodes.",
    intro: [
      "Milton has been one of the fastest-growing communities in Canada for years, and that growth defines the opportunity here. Whole new neighbourhoods — Hawthorne Village, Willmott, Scott, Coates — have filled in with young families who need everything: trades and home services, clinics and dentists, tutors, gyms, restaurants and shops. The businesses that plant a flag online early, while the town is still forming its habits about who to call, are the ones that lock in that demand for years.",
      "Against a historic Main Street core that anchors Old Milton's identity, this is a market where being findable is more than half the battle — a huge share of your future customers are literally still moving in. We help Milton businesses get out ahead of it: a fast, modern website and a Google Business Profile built to capture the flood of 'near me' searches, plus AI receptionist and missed-call text-back so that a brand-new neighbour who calls actually reaches you. In a town growing this quickly, every answered call is a customer relationship that can last decades.",
    ],
    faqs: [
      {
        q: "Milton is growing so fast — why does that matter for my business?",
        a: "Because habits are still forming. New residents are deciding right now who their plumber, dentist or restaurant is — being the findable, responsive option early means you capture customers who stay for years.",
      },
      {
        q: "There are new families moving in constantly — how do I reach them?",
        a: "Own the 'near me' search with a Milton landing page and an optimized Google Business Profile, and make sure the call connects — AI receptionist and text-back so a new neighbour who reaches out actually gets you.",
      },
      {
        q: "Do you work with businesses near historic Main Street?",
        a: "Yes — for Old Milton's Main Street shops and services we build a fast, character-appropriate site and a review-driven Google profile that balances the town's heritage feel with modern findability.",
      },
    ],
  },
];

export const CITY_SLUGS = LOCATIONS.map((c) => c.slug);
export const getCity = (slug) => LOCATIONS.find((c) => c.slug === slug);

/** Cities that border/relate to a given city, for internal linking (2 siblings). */
export function siblingCities(slug, count = 2) {
  const i = CITY_SLUGS.indexOf(slug);
  if (i === -1) return LOCATIONS.slice(0, count);
  const out = [];
  for (let k = 1; out.length < count && k < LOCATIONS.length; k++) {
    out.push(LOCATIONS[(i + k) % LOCATIONS.length]);
  }
  return out;
}
