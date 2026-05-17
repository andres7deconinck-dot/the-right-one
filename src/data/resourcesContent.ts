// Localized content for the Resources page + homepage Rights/Tips section.
// Languages: en (default), nl, fr.

export type ResourcesContent = {
  meta: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
  };
  sections: {
    quickTips: { title: string; subtitle: string };
    rightsBenefits: { title: string; subtitle: string };
    rightsByCountry: { title: string; subtitle: string; disclaimer: string };
    usefulSites: { title: string; subtitle: string };
    didYouKnow: { title: string; subtitle: string };
    cta: { title: string; subtitle: string; cards: string; countries: string };
  };
  labels: {
    financial: string;
    legal: string;
    source: string;
  };
  homeHighlight: {
    badge: string;
    title: string;
    subtitle: string;
    seeAll: string;
    rights: { emoji: string; title: string; text: string; tag: string; tagColor: string }[];
    facts: { number: string; label: string }[];
  };
  quickTips: { emoji: string; title: string; text: string }[];
  baggageTips: {
    title: string;
    badge: string;
    content: string;
    airlines?: { name: string; note: string }[];
    links?: { name: string; url: string }[];
  }[];
  countryRights: {
    flag: string;
    country: string;
    benefit: string;
    legal: string;
    link: { name: string; url: string };
  }[];
  usefulSites: {
    category: string;
    sites: { name: string; url: string; desc: string }[];
  }[];
  didYouKnow: { fact: string; source: string }[];
};

// ====== ENGLISH ======
const en: ResourcesContent = {
  meta: {
    title: "Helpful Tips & Links for People with Celiac Disease | GlutenGo",
    description: "Everything you need to know as a celiac traveler: extra baggage rights, tax benefits, useful websites, insurance and travel tips.",
    keywords: "celiac travel tips, extra baggage celiac, autoimmune compensation, gluten-free travel tips, celiac rights flight",
    ogTitle: "Helpful Tips & Links for People with Celiac Disease",
    ogDescription: "Extra baggage, tax benefits, useful sites and travel tips for people with celiac disease.",
  },
  hero: {
    badge: "Helpful information",
    title: "Everything you need to know",
    subtitle: "Useful websites, travel rights, tax benefits, tips and facts for celiac travelers.",
  },
  sections: {
    quickTips: { title: "Travel know-how & tips", subtitle: "Practical knowledge for the road" },
    rightsBenefits: { title: "Rights & compensation", subtitle: "Extra baggage, tax benefits and insurance" },
    rightsByCountry: {
      title: "Rights & compensation per country",
      subtitle: "What can you claim where? Compensation, tax deductions and legal protection worldwide",
      disclaimer: "⚠️ Regulations change regularly. Always confirm via the official source or your national celiac association.",
    },
    usefulSites: { title: "Useful websites", subtitle: "Trusted sources for celiac disease and gluten-free travel" },
    didYouKnow: { title: "Did you know…", subtitle: "Interesting facts about celiac disease and gluten-free life" },
    cta: {
      title: "Ready for your trip?",
      subtitle: "Generate your gluten-free translation card, find restaurants and browse our country guides — all in one app.",
      cards: "Create a translation card",
      countries: "Browse country guides",
    },
  },
  labels: { financial: "💰 Financial", legal: "⚖️ Legal", source: "Source" },
  homeHighlight: {
    badge: "Rights & tips",
    title: "Rights you probably didn't know about",
    subtitle: "As a celiac patient you have more options than you think. From free extra baggage to tax benefits.",
    seeAll: "See all tips, rights and useful links",
    rights: [
      { emoji: "🧳", title: "Free extra baggage", text: "Most European airlines allow celiac patients extra baggage for medical food. Request it at check-in with a doctor's certificate.", tag: "Airlines", tagColor: "bg-blue-100 text-blue-700" },
      { emoji: "💶", title: "Tax benefit", text: "Many countries let you recoup part of the extra cost of gluten-free products via your tax return. Keep receipts and ask your doctor for a diagnosis letter.", tag: "Financial", tagColor: "bg-emerald-100 text-emerald-700" },
      { emoji: "✈️", title: "Medical meal on board", text: "Order a free GFML (Gluten Free Meal) with your flight booking. Available on Brussels Airlines, KLM, Lufthansa and many more at no extra cost.", tag: "Meals", tagColor: "bg-amber-100 text-amber-700" },
      { emoji: "📄", title: "Medical certificate", text: "An English-language doctor's letter opens doors: extra baggage, special meals and smoother customs when carrying large quantities of gluten-free food.", tag: "Document", tagColor: "bg-purple-100 text-purple-700" },
    ],
    facts: [
      { number: "1 in 100", label: "people has celiac disease, but only 1 in 4 is officially diagnosed" },
      { number: "30+", label: "countries with GlutenGo emergency phrases available, fully offline" },
      { number: "€6 bn", label: "size of the global gluten-free market — still growing every year" },
    ],
  },
  quickTips: [
    { emoji: "✈️", title: "Always book a special meal", text: "Most airlines let you book a GFML (Gluten Free Meal) 24-72h before departure via your reservation. Free, and safer than the standard meal." },
    { emoji: "🏨", title: "Always call your hotel ahead", text: "Call rather than email. Ask explicitly if breakfast can be gluten-free and if a separate toaster/work surface is available. Confirm the day before arrival." },
    { emoji: "🛒", title: "Find a local supermarket on day 1", text: "Locate the nearest supermarket on arrival and stock up on gluten-free basics. Rice cakes, fruit, nuts and yogurt save many emergencies." },
    { emoji: "📱", title: "Download offline maps", text: "Download Google Maps offline for your destination. Search 'gluten free' or 'celiac' — many restaurants tag themselves. No Wi-Fi needed." },
    { emoji: "🌿", title: "Countries with naturally gluten-free cuisines", text: "Japan (rice, fish), Mexico (corn tortillas), India (rice, lentils, dal), Thailand (rice, tamari noodles) and Ethiopia (teff injera) are often naturally gluten-free. Always check soy sauce and marinades." },
    { emoji: "🚨", title: "Build an emergency plan", text: "Know the nearest hospital, how to say 'allergic reaction' in the local language, and always carry an emergency snack. GlutenGo's Emergency Phrases help you say the right thing." },
    { emoji: "🍷", title: "Alcohol and beer: watch out", text: "Wine and most spirits (whisky, potato vodka) are usually safe. Regular beer contains gluten. Choose gluten-free beer or cider. Some liqueurs can be problematic." },
    { emoji: "💊", title: "Bring your own enzymes", text: "Gluten-digestive enzymes (such as GluteGuard or AN-PEP) don't fully protect, but can help with small accidental contamination. Ask your doctor first." },
    { emoji: "🌐", title: "Learn the local word for 'wheat'", text: "Wheat = blé (FR), Weizen (DE), grano/frumento (IT), trigo (ES/PT), コムギ komugi (JA), ข้าวสาลี khao sali (TH). Know the word and you can read menus yourself." },
    { emoji: "📋", title: "Keep a food diary while traveling", text: "Note what you ate and where. If you react, you can trace the cause much faster — useful for yourself and your doctor." },
  ],
  baggageTips: [
    {
      title: "Medical food = free extra baggage",
      badge: "Airlines",
      content: `Many airlines allow you to carry gluten-free food as a medical necessity on top of normal baggage limits. Ask at check-in or via the airline's customer service.

Helpful proof: a doctor's note or diagnosis letter (preferably in English) plus the AOECS gluten-free license numbers of your products.`,
      airlines: [
        { name: "Brussels Airlines", note: "Request 'medical meal' at booking + notify at check-in." },
        { name: "Lufthansa", note: "Free gluten-free meal on order; extra medical food in hand luggage allowed with a certificate." },
        { name: "KLM", note: "Special Meals option 'Gluten Intolerant Meal' (GFML) at booking." },
        { name: "Ryanair / EasyJet", note: "No special meals, but bringing your own food on board is always allowed." },
      ],
    },
    {
      title: "Financial compensation worldwide",
      badge: "Financial",
      content: "Many countries provide financial compensation for the extra cost of gluten-free food — rules vary per country and you always need an official diagnosis. See the table below for an overview per country.",
      links: [{ name: "AOECS — overview per country", url: "https://aoecs.eu" }],
    },
    {
      title: "Travel insurance for celiac disease",
      badge: "Insurance",
      content: `Standard travel insurance doesn't always cover celiac-related incidents. Always ask explicitly whether you are covered for hospitalisation due to gluten contamination abroad, cancellation due to medical complications, and repatriation.

Always declare celiac disease when buying insurance. Providers that handle this well include Europ Assistance, Allianz Travel and AXA Travel.`,
      links: [],
    },
    {
      title: "Medical certificate: always carry one",
      badge: "Document",
      content: `A doctor's letter in English (and ideally also in the local language) is your best travel document. It helps with special airline meals, extra baggage space for medical food, customs when carrying large quantities of gluten-free food, and medical help abroad.

Ask your GP for a letter with your diagnosis, the date, the severity of the condition (celiac disease is an autoimmune disease) and a confirmation that a gluten-free diet is medically necessary.`,
      links: [],
    },
  ],
  countryRights: [
    { flag: "🇧🇪", country: "Belgium", benefit: "Tax deduction for extra GF food costs as medical expenses via FOD Finance. Coeliakie België publishes the yearly flat-rate amounts.", legal: "Allergen information mandatory in hospitality (EU 1169/2011).", link: { name: "Coeliakie België", url: "https://www.coeliakie.be" } },
    { flag: "🇳🇱", country: "Netherlands", benefit: "Specific healthcare cost deduction (dietary costs) via the tax office, fixed yearly amount (~€900) with official diagnosis.", legal: "Mandatory allergen labelling in restaurants (EU law).", link: { name: "NCV Tax info", url: "https://www.glutenvrij.nl/belasting" } },
    { flag: "🇮🇹", country: "Italy", benefit: "Monthly state allowance (€56-140 depending on age/gender) via the National Health Service for certified GF products in pharmacies.", legal: "Celiac disease legally recognised as a social disease (Law 123/2005). School canteens & hospitals must offer GF meals.", link: { name: "AIC Italy", url: "https://www.celiachia.it" } },
    { flag: "🇬🇧", country: "United Kingdom", benefit: "GF bread and mix on NHS prescription (varies by region — England limited, Scotland/Wales/NI broader).", legal: "Allergen law (Natasha's Law 2021): all pre-packed food in shops must show every ingredient. Strict hospitality requirements.", link: { name: "Coeliac UK", url: "https://www.coeliac.org.uk" } },
    { flag: "🇩🇪", country: "Germany", benefit: "No direct allowance, but extra GF costs deductible as 'außergewöhnliche Belastungen' at the Finanzamt with a doctor's certificate.", legal: "Schwerbehindertenausweis (disability card, GdB 20) possible with celiac disease — gives tax benefits.", link: { name: "DZG Germany", url: "https://www.dzg-online.de" } },
    { flag: "🇫🇷", country: "France", benefit: "Partial reimbursement of GF products via Sécurité Sociale (~€33-46/month) on prescription, only for products with an ACS code.", legal: "Allergens mandatory on restaurant menus (2015 decree).", link: { name: "AFDIAG France", url: "https://www.afdiag.fr" } },
    { flag: "🇪🇸", country: "Spain", benefit: "No national allowance, but some autonomous regions (Navarra, Castilla-La Mancha, Extremadura) give an annual subsidy of €600-1500.", legal: "Allergen information mandatory in hospitality.", link: { name: "FACE Spain", url: "https://celiacos.org" } },
    { flag: "🇺🇸", country: "United States", benefit: "Extra cost of GF food deductible as 'medical expense' on IRS Form 1040 Schedule A (only the difference vs. regular food, > 7.5% AGI).", legal: "ADA (Americans with Disabilities Act): celiac disease recognised as a disability. Schools/colleges/employers must provide GF accommodations. FDA rule: 'gluten-free' = <20 ppm.", link: { name: "Celiac Disease Foundation", url: "https://celiac.org/gluten-free-living/federal-benefits/tax-deduction-guide-for-gluten-free-diet" } },
    { flag: "🇨🇦", country: "Canada", benefit: "Extra cost of GF food deductible as Medical Expense Tax Credit (METC) on federal tax return with a doctor's certificate.", legal: "Health Canada: 'gluten-free' label = <20 ppm. Federal allergen law applies.", link: { name: "Canadian Celiac Association", url: "https://www.celiac.ca" } },
    { flag: "🇦🇺", country: "Australia", benefit: "No direct allowance, but extra GF costs may fall under NDIS in case of severe additional disabilities.", legal: "Strictest GF standard worldwide: <3 ppm for 'gluten free' label (FSANZ). Allergen law applies.", link: { name: "Coeliac Australia", url: "https://www.coeliac.org.au" } },
  ],
  usefulSites: [
    {
      category: "Celiac organisations",
      sites: [
        { name: "Coeliakie België", url: "https://www.coeliakie.be", desc: "Official Belgian celiac organisation, product lists, recipes and news." },
        { name: "Nederlandse Coeliakie Vereniging", url: "https://www.glutenvrij.nl", desc: "NCV: recognition, allowances and travel info for the Netherlands." },
        { name: "Coeliac UK", url: "https://www.coeliac.org.uk", desc: "Largest celiac organisation in the world. Free travel cards available to download." },
        { name: "Celiac Disease Foundation", url: "https://celiac.org", desc: "Scientific updates, diet advice and travel resources." },
        { name: "Association of European Coeliac Societies", url: "https://aoecs.eu", desc: "AOECS coordinates the European licensing system for gluten-free products." },
      ],
    },
    {
      category: "Travel & food",
      sites: [
        { name: "Find Me Gluten Free", url: "https://www.findmeglutenfree.com", desc: "User reviews of gluten-free restaurants worldwide." },
        { name: "Gluten Free Passport", url: "https://glutenfreepassport.com", desc: "Travel cards and country fact sheets in multiple languages." },
        { name: "Triumph Dining", url: "https://www.triumphdining.com", desc: "Gluten-free travel cards for 80+ countries — paid, but high quality." },
        { name: "iEatOut Gluten Free", url: "https://www.ieatout.com.au", desc: "App and website for restaurants with gluten-free options." },
        { name: "AllergyEats", url: "https://www.allergyeats.com", desc: "US-focused allergy-friendly restaurant finder with user reviews." },
      ],
    },
    {
      category: "Science & health",
      sites: [
        { name: "Beyond Celiac", url: "https://www.beyondceliac.org", desc: "Scientific research, clinical trials and patient advocacy." },
        { name: "University of Chicago Celiac Center", url: "https://www.cureceliacdisease.org", desc: "Medical knowledge centre with free patient brochures." },
        { name: "Celiac.com", url: "https://www.celiac.com", desc: "Forum, news and product updates. One of the oldest sources online." },
      ],
    },
  ],
  didYouKnow: [
    { fact: "1 in 100 people has celiac disease, but only 1 in 4 is officially diagnosed.", source: "Beyond Celiac" },
    { fact: "The gluten-free market was worth over €6 billion worldwide in 2023, and grows 9% per year.", source: "Statista" },
    { fact: "Finnish and Italian children have the highest celiac prevalence in the world.", source: "European Journal of Gastroenterology" },
    { fact: "A gluten-free diet must be followed for life. Even without symptoms, the intestinal villi only recover after 1-2 years.", source: "Celiac Disease Foundation" },
    { fact: "Oats are naturally gluten-free but are almost always contaminated during harvest or processing. Always choose certified GF oats.", source: "Coeliakie België" },
    { fact: "In Italy, every officially diagnosed celiac patient receives a monthly state allowance for gluten-free food.", source: "Italian Ministry of Health" },
    { fact: "Many airlines serve gluten-free special meals before other passengers, so you can be sure the right plate ends up in front of you.", source: "Coeliac UK" },
    { fact: "Celiac disease is the only autoimmune disease where the environmental trigger (gluten) is fully known and avoidable.", source: "NIH" },
  ],
};

// ====== DUTCH ======
const nl: ResourcesContent = {
  meta: {
    title: "Handige Tips & Links voor Coeliakiepatiënten | GlutenGo",
    description: "Alles wat je moet weten als coeliakiepatiënt op reis: extra bagage rechten, belastingvoordelen, handige websites, verzekeringen en reistips.",
    keywords: "coeliakie reistips, extra bagage coeliakie, auto-immuunziekte vergoeding, glutenvrij reizen tips, coeliakie rechten vliegtuig",
    ogTitle: "Handige Tips & Links voor Coeliakiepatiënten",
    ogDescription: "Extra bagage, belastingvoordelen, handige sites en reistips voor coeliakiepatiënten.",
  },
  hero: {
    badge: "Handige informatie",
    title: "Alles wat je moet weten",
    subtitle: "Handige websites, reisrechten, belastingvoordelen, tips en weetjes voor coeliakiepatiënten die reizen.",
  },
  sections: {
    quickTips: { title: "Reisweetjes & tips", subtitle: "Praktische kennis voor onderweg" },
    rightsBenefits: { title: "Rechten & vergoedingen", subtitle: "Extra bagage, belastingvoordelen en verzekering" },
    rightsByCountry: {
      title: "Rechten & vergoedingen per land",
      subtitle: "Wat krijg je waar? Vergoedingen, fiscale aftrek en wettelijke bescherming wereldwijd",
      disclaimer: "⚠️ Regelgeving verandert regelmatig. Bevestig altijd via de officiële bron of de coeliakie-vereniging van je land.",
    },
    usefulSites: { title: "Handige websites", subtitle: "Betrouwbare bronnen voor coeliakie en glutenvrij reizen" },
    didYouKnow: { title: "Wist je dat…", subtitle: "Interessante feiten over coeliakie en glutenvrij leven" },
    cta: {
      title: "Klaar voor je reis?",
      subtitle: "Genereer je glutenvrij vertaalkaart, zoek restaurants en bekijk onze landengidsen, alles in één app.",
      cards: "Maak een vertaalkaart",
      countries: "Landengidsen bekijken",
    },
  },
  labels: { financial: "💰 Financieel", legal: "⚖️ Wettelijk", source: "Bron" },
  homeHighlight: {
    badge: "Rechten en tips",
    title: "Rechten die je waarschijnlijk nog niet kent",
    subtitle: "Als coeliakiepatiënt heb je meer mogelijkheden dan je denkt. Van gratis extra bagage tot belastingvoordelen.",
    seeAll: "Bekijk alle tips, rechten en handige links",
    rights: [
      { emoji: "🧳", title: "Gratis extra bagage", text: "Bij de meeste Europese luchtvaartmaatschappijen heb je als coeliakiepatiënt recht op extra bagage voor medisch voedsel. Vraag dit aan bij het inchecken met een doktersattest.", tag: "Luchtvaart", tagColor: "bg-blue-100 text-blue-700" },
      { emoji: "💶", title: "Belastingvoordeel", text: "In België en Nederland kun je de meerkosten van glutenvrije producten gedeeltelijk recupereren via de belastingen. Houd je aankoopbonnen bij en vraag je arts om een diagnosebevestiging.", tag: "Financieel", tagColor: "bg-emerald-100 text-emerald-700" },
      { emoji: "✈️", title: "Medische maaltijd aan boord", text: "Bestel gratis een GFML (Gluten Free Meal) bij je vluchtboeking. Dit is beschikbaar bij Brussels Airlines, KLM, Lufthansa en vele anderen, zonder extra kost.", tag: "Maaltijden", tagColor: "bg-amber-100 text-amber-700" },
      { emoji: "📄", title: "Medisch attest", text: "Een Engelstalig doktersattest opent deuren: extra bagageruimte, speciale maaltijden, en begrip bij douane wanneer je grote hoeveelheden glutenvrij voedsel meeneemt.", tag: "Document", tagColor: "bg-purple-100 text-purple-700" },
    ],
    facts: [
      { number: "1 op 100", label: "mensen heeft coeliakie, maar slechts 1 op 4 is officieel gediagnosticeerd" },
      { number: "30+", label: "landen waar GlutenGo noodformuleringen beschikbaar heeft, volledig offline" },
      { number: "€6 mrd", label: "groot is de glutenvrije markt wereldwijd en groeit nog steeds jaarlijks" },
    ],
  },
  quickTips: [
    { emoji: "✈️", title: "Bestel altijd een speciale maaltijd", text: "Bij de meeste luchtvaartmaatschappijen kun je 24-72u voor vertrek een GFML (Gluten Free Meal) bestellen via je boeking. Gratis, en veiliger dan de standaardmaaltijd." },
    { emoji: "🏨", title: "Bel je hotel altijd op voorhand", text: "Bel liever dan mail. Vraag expliciet of het ontbijt glutenvrij kan, en of er een aparte broodrooster of werkoppervlak is. Bevestig de dag voor aankomst." },
    { emoji: "🛒", title: "Zoek een lokale supermarkt op dag 1", text: "Vind direct bij aankomst de dichtstbijzijnde supermarkt en sla glutenvrije basisproducten in. Rijstwafels, fruit, noten en yoghurt redden menige noodsituatie." },
    { emoji: "📱", title: "Download offline kaarten", text: "Download Google Maps offline voor je bestemming. Zoek op 'gluten free' of 'coeliac' in de stad, veel restaurants taggen zichzelf. Geen wifi nodig." },
    { emoji: "🌿", title: "Landen met van nature glutenvrije keukens", text: "Japan (rijst, vis), Mexico (maïstortillas), India (rijst, linzen, dal), Thailand (rijst, noodles met tamari) en Ethiopië (teff-injera) zijn van nature veelal glutenvrij. Vraag wel altijd naar sojasaus en marinades." },
    { emoji: "🚨", title: "Stel een noodplan op", text: "Ken het dichtstbijzijnde ziekenhuis, weet hoe je 'allergische reactie' zegt in de lokale taal, en heb altijd een noodsnack bij. GlutenGo's Emergency Phrases helpen je het juiste te zeggen." },
    { emoji: "🍷", title: "Alcohol en bier: let op", text: "Wijn en sterke drank (whisky, vodka op aardappel) zijn vaak veilig. Gewoon bier bevat gluten. Kies glutenvrij bier of cider. Sommige amandellikeur en speciale dranken kunnen ook problematisch zijn." },
    { emoji: "💊", title: "Neem je eigen enzymen mee", text: "Gluten-digestieve enzymen (zoals GluteGuard of AN-PEP-enzymen) beschermen niet volledig, maar kunnen bij kleine besmettingen helpen als back-up. Raadpleeg eerst je arts." },
    { emoji: "🌐", title: "Leer de lokale taal voor 'tarwe'", text: "Tarwe heet: wheat (EN), blé (FR), Weizen (DE), grano/frumento (IT), trigo (ES/PT), コムギ komugi (JA), ข้าวสาลี khao sali (TH). Ken het woord, dan kun je menukaarten zelf lezen." },
    { emoji: "📋", title: "Eetdagboek bijhouden op reis", text: "Noteer wat je gegeten hebt en waar. Bij een reactie kun je zo veel sneller achterhalen wat de oorzaak was, handig voor jezelf en voor je arts." },
  ],
  baggageTips: [
    {
      title: "Medisch voedsel = gratis extra bagage",
      badge: "Luchtvaart",
      content: `Veel luchtvaartmaatschappijen staan toe dat je glutenvrij voedsel meeneemt als medische noodzaak, bovenop de normale bagagelimieten. Vraag dit aan bij het inchecken of via de klantenservice van de luchtvaartmaatschappij.

Bewijs dat helpt: een doktersattest of diagnosebrief van je arts (bij voorkeur in het Engels), samen met de AOECS glutenvrij licentienummers van je producten.`,
      airlines: [
        { name: "Brussels Airlines", note: "Vraag 'medical meal' bij boeking + melding bij check-in." },
        { name: "Lufthansa", note: "Glutenvrije maaltijd gratis bestellen, extra medisch voedsel in handbagage toegestaan met attest." },
        { name: "KLM", note: "Special Meals optie 'Gluten Intolerant Meal' (GFML) bij boeking." },
        { name: "Ryanair / EasyJet", note: "Geen speciale maaltijden, maar eigen eten aan boord altijd toegestaan." },
      ],
    },
    {
      title: "Financiële tegemoetkoming wereldwijd",
      badge: "Financieel",
      content: "Veel landen voorzien een financiële compensatie voor de meerkosten van glutenvrij eten — de regeling verschilt per land en je hebt overal een officiële diagnose nodig. Zie de tabel hieronder voor een overzicht per land.",
      links: [{ name: "AOECS — overzicht per land", url: "https://aoecs.eu" }],
    },
    {
      title: "Verzekering voor coeliakie op reis",
      badge: "Verzekering",
      content: `Standaard reisverzekeringen dekken niet altijd coeliakie-gerelateerde incidenten. Vraag altijd expliciet of je gedekt bent voor ziekenhuisopname door glutenbesmetting in het buitenland, annulering door medische complicaties en repatriëring.

Meld coeliakie altijd bij het afsluiten van een verzekering. Verzekeraars die hier goed mee omgaan zijn onder meer Europ Assistance, Allianz Travel en AXA Travel.`,
      links: [],
    },
    {
      title: "Medisch attest: altijd meenemen",
      badge: "Document",
      content: `Een doktersattest in het Engels (en liefst ook in de lokale taal) is je beste reisdocument. Het helpt bij toegang tot speciale vliegtuigmaaltijden, extra bagageruimte voor medisch voedsel, douane bij grote hoeveelheden glutenvrij voedsel en medische hulp in het buitenland.

Vraag je huisarts om een brief met je diagnose, de datum, de ernst van de aandoening (coeliakie is een auto-immuunziekte) en een bevestiging dat een glutenvrij dieet medisch noodzakelijk is.`,
      links: [],
    },
  ],
  countryRights: [
    { flag: "🇧🇪", country: "België", benefit: "Belastingaftrek meerkosten GF-voeding als ziekte-uitgaven via FOD Financiën. Coeliakie België publiceert jaarlijks de forfaitaire bedragen.", legal: "Allergeneninformatie verplicht in horeca (EU 1169/2011).", link: { name: "Coeliakie België", url: "https://www.coeliakie.be" } },
    { flag: "🇳🇱", country: "Nederland", benefit: "Specifieke zorgkosten-aftrek (dieetkosten) via Belastingdienst, jaarlijks vast bedrag (~€900) bij officiële diagnose.", legal: "Verplichte allergenenetikettering in restaurants (EU-wet).", link: { name: "NCV Belastinginfo", url: "https://www.glutenvrij.nl/belasting" } },
    { flag: "🇮🇹", country: "Italië", benefit: "Maandelijkse staatsvergoeding (€56-140 afhankelijk van leeftijd/geslacht) via Servizio Sanitario Nazionale voor gecertificeerde GF-producten in apotheek.", legal: "Coeliakie wettelijk erkend als sociale ziekte (Wet 123/2005). Schoolkantines & ziekenhuizen moeten GF-maaltijden aanbieden.", link: { name: "AIC Italië", url: "https://www.celiachia.it" } },
    { flag: "🇬🇧", country: "Verenigd Koninkrijk", benefit: "GF-brood en mix op NHS-voorschrift (varieert per regio — Engeland beperkt, Schotland/Wales/NI ruimer).", legal: "Allergenenwet (Natasha's Law 2021): álle voorverpakt eten in winkels moet alle ingrediënten tonen. Strenge horeca-verplichtingen.", link: { name: "Coeliac UK", url: "https://www.coeliac.org.uk" } },
    { flag: "🇩🇪", country: "Duitsland", benefit: "Geen directe vergoeding, maar GF-meerkosten aftrekbaar als 'außergewöhnliche Belastungen' bij Finanzamt met dokterscertificaat.", legal: "Schwerbehindertenausweis (gehandicaptenkaart, GdB 20) mogelijk bij coeliakie — geeft fiscale voordelen.", link: { name: "DZG Duitsland", url: "https://www.dzg-online.de" } },
    { flag: "🇫🇷", country: "Frankrijk", benefit: "Gedeeltelijke terugbetaling GF-producten via Sécurité Sociale (~€33-46/maand) op voorschrift, alleen voor producten met ACS-code.", legal: "Allergenen verplicht op restaurantmenu's (decreet 2015).", link: { name: "AFDIAG Frankrijk", url: "https://www.afdiag.fr" } },
    { flag: "🇪🇸", country: "Spanje", benefit: "Geen nationale vergoeding, maar enkele autonome regio's (Navarra, Castilla-La Mancha, Extremadura) geven jaarlijkse subsidie €600-1500.", legal: "Allergeneninformatie verplicht in horeca.", link: { name: "FACE Spanje", url: "https://celiacos.org" } },
    { flag: "🇺🇸", country: "Verenigde Staten", benefit: "Meerkosten GF-voedsel aftrekbaar als 'medical expense' op IRS Form 1040 Schedule A (alleen het verschil met regulier eten, > 7,5% AGI).", legal: "ADA (Americans with Disabilities Act): coeliakie erkend als handicap. Scholen/universiteiten/werkgevers moeten GF-accommodaties bieden. FDA-regel: 'gluten-free' = <20 ppm.", link: { name: "Celiac Disease Foundation", url: "https://celiac.org/gluten-free-living/federal-benefits/tax-deduction-guide-for-gluten-free-diet" } },
    { flag: "🇨🇦", country: "Canada", benefit: "Meerkosten GF-voeding aftrekbaar als 'Medical Expense Tax Credit' (METC) op federale belastingaangifte met dokterscertificaat.", legal: "Health Canada: 'gluten-free' label = <20 ppm. Federale allergenenwet verplicht.", link: { name: "Canadian Celiac Association", url: "https://www.celiac.ca" } },
    { flag: "🇦🇺", country: "Australië", benefit: "Geen directe vergoeding, maar GF-meerkosten kunnen onder NDIS vallen bij ernstige bijkomende beperkingen.", legal: "Strengste GF-norm ter wereld: <3 ppm voor 'gluten free' label (FSANZ). Allergenenwet verplicht.", link: { name: "Coeliac Australia", url: "https://www.coeliac.org.au" } },
  ],
  usefulSites: [
    {
      category: "Coeliakie organisaties",
      sites: [
        { name: "Coeliakie België", url: "https://www.coeliakie.be", desc: "Officiële Belgische coeliakie organisatie, productenlijsten, recepten en nieuws." },
        { name: "Nederlandse Coeliakie Vereniging", url: "https://www.glutenvrij.nl", desc: "NCV: erkenning, vergoedingen en reisinfo voor Nederland." },
        { name: "Coeliac UK", url: "https://www.coeliac.org.uk", desc: "Grootste coeliakie organisatie ter wereld. Gratis reiskaarten downloadbaar." },
        { name: "Celiac Disease Foundation", url: "https://celiac.org", desc: "Wetenschappelijke updates, dieetadvies en reisbronnen." },
        { name: "Association of European Coeliac Societies", url: "https://aoecs.eu", desc: "AOECS coördineert het Europese licentiesysteem voor glutenvrije producten." },
      ],
    },
    {
      category: "Reis & eten",
      sites: [
        { name: "Find Me Gluten Free", url: "https://www.findmeglutenfree.com", desc: "Gebruikersreviews van glutenvrije restaurants wereldwijd." },
        { name: "Gluten Free Passport", url: "https://glutenfreepassport.com", desc: "Reiskaarten en fiches per land in meerdere talen." },
        { name: "Triumph Dining", url: "https://www.triumphdining.com", desc: "Glutenvrije reiskaarten voor 80+ landen, betaald maar kwalitatief." },
        { name: "iEatOut Gluten Free", url: "https://www.ieatout.com.au", desc: "App en website voor restaurants met glutenvrije opties." },
        { name: "AllergyEats", url: "https://www.allergyeats.com", desc: "VS-gerichte allergiefriendly restaurant zoeker met gebruikersbeoordelingen." },
      ],
    },
    {
      category: "Wetenschap & gezondheid",
      sites: [
        { name: "Beyond Celiac", url: "https://www.beyondceliac.org", desc: "Wetenschappelijk onderzoek, klinische studies en patiëntenadvocacy." },
        { name: "University of Chicago Celiac Center", url: "https://www.cureceliacdisease.org", desc: "Medisch kenniscentrum met gratis patiëntenbrochures." },
        { name: "Celiac.com", url: "https://www.celiac.com", desc: "Forum, nieuws en productupdates. Een van de oudste bronnen online." },
      ],
    },
  ],
  didYouKnow: [
    { fact: "1 op 100 mensen heeft coeliakie, maar slechts 1 op 4 is officieel gediagnosticeerd.", source: "Beyond Celiac" },
    { fact: "Het glutenvrije markt was in 2023 wereldwijd meer dan €6 miljard waard, en groeit jaarlijks 9%.", source: "Statista" },
    { fact: "Finse en Italiaanse kinderen hebben de hoogste coeliakie-prevalentie ter wereld.", source: "European Journal of Gastroenterology" },
    { fact: "Een glutenvrij dieet moet levenslang gevolgd worden. Ook bij geen symptomen herstelt de darmvlokken pas na 1-2 jaar.", source: "Celiac Disease Foundation" },
    { fact: "Havermout is van nature glutenvrij, maar wordt bijna altijd besmet tijdens de oogst of verwerking. Kies altijd gecertificeerde GF-haver.", source: "Coeliakie België" },
    { fact: "In Italië krijgt elke officieel gediagnosticeerde coeliakiepatiënt een maandelijkse vergoeding van de staat voor glutenvrije voedingsproducten.", source: "Italian Ministry of Health" },
    { fact: "Veel vliegmaatschappijen serveren glutenvrije speciale maaltijden vóór andere passagiers, zodat je er zeker van bent dat het juiste bord bij jou terechtkomt.", source: "Coeliac UK" },
    { fact: "Coeliakie is de enige auto-immuunziekte waarbij de omgevingstrigger (gluten) volledig bekend én vermijdbaar is.", source: "NIH" },
  ],
};

// ====== FRENCH ======
const fr: ResourcesContent = {
  meta: {
    title: "Astuces & Liens utiles pour les personnes atteintes de la maladie cœliaque | GlutenGo",
    description: "Tout ce qu'il faut savoir en voyage avec la maladie cœliaque : droits aux bagages supplémentaires, avantages fiscaux, sites utiles, assurances et conseils.",
    keywords: "conseils voyage cœliaque, bagage supplémentaire cœliaque, remboursement maladie auto-immune, voyage sans gluten",
    ogTitle: "Astuces & Liens utiles pour les personnes cœliaques",
    ogDescription: "Bagages supplémentaires, avantages fiscaux, sites utiles et conseils voyage pour les personnes cœliaques.",
  },
  hero: {
    badge: "Informations utiles",
    title: "Tout ce que vous devez savoir",
    subtitle: "Sites utiles, droits de voyage, avantages fiscaux, conseils et anecdotes pour les voyageurs cœliaques.",
  },
  sections: {
    quickTips: { title: "Astuces de voyage", subtitle: "Connaissances pratiques pour la route" },
    rightsBenefits: { title: "Droits & remboursements", subtitle: "Bagages supplémentaires, avantages fiscaux et assurance" },
    rightsByCountry: {
      title: "Droits & remboursements par pays",
      subtitle: "Qu'obtenez-vous où ? Remboursements, déductions fiscales et protection légale dans le monde",
      disclaimer: "⚠️ La réglementation change régulièrement. Vérifiez toujours via la source officielle ou l'association cœliaque de votre pays.",
    },
    usefulSites: { title: "Sites utiles", subtitle: "Sources fiables sur la maladie cœliaque et le voyage sans gluten" },
    didYouKnow: { title: "Le saviez-vous…", subtitle: "Faits intéressants sur la maladie cœliaque et la vie sans gluten" },
    cta: {
      title: "Prêt pour votre voyage ?",
      subtitle: "Générez votre carte de traduction sans gluten, trouvez des restaurants et consultez nos guides par pays — tout dans une application.",
      cards: "Créer une carte de traduction",
      countries: "Voir les guides par pays",
    },
  },
  labels: { financial: "💰 Financier", legal: "⚖️ Légal", source: "Source" },
  homeHighlight: {
    badge: "Droits et conseils",
    title: "Des droits que vous ne connaissez sans doute pas",
    subtitle: "En tant que personne cœliaque, vous avez plus de possibilités que vous ne le pensez. Du bagage supplémentaire gratuit aux avantages fiscaux.",
    seeAll: "Voir toutes les astuces, droits et liens utiles",
    rights: [
      { emoji: "🧳", title: "Bagage supplémentaire gratuit", text: "La plupart des compagnies européennes accordent aux personnes cœliaques un bagage supplémentaire pour la nourriture médicale. Demandez-le à l'enregistrement avec un certificat médical.", tag: "Aérien", tagColor: "bg-blue-100 text-blue-700" },
      { emoji: "💶", title: "Avantage fiscal", text: "Beaucoup de pays permettent de récupérer une partie du surcoût des produits sans gluten via votre déclaration. Conservez vos tickets et demandez un certificat à votre médecin.", tag: "Financier", tagColor: "bg-emerald-100 text-emerald-700" },
      { emoji: "✈️", title: "Repas médical à bord", text: "Commandez gratuitement un GFML (Gluten Free Meal) lors de votre réservation. Disponible chez Brussels Airlines, KLM, Lufthansa et bien d'autres, sans surcoût.", tag: "Repas", tagColor: "bg-amber-100 text-amber-700" },
      { emoji: "📄", title: "Certificat médical", text: "Un certificat en anglais ouvre des portes : bagage supplémentaire, repas spéciaux et passage en douane plus simple avec de grandes quantités de nourriture sans gluten.", tag: "Document", tagColor: "bg-purple-100 text-purple-700" },
    ],
    facts: [
      { number: "1 sur 100", label: "personnes a la maladie cœliaque, mais seulement 1 sur 4 est officiellement diagnostiquée" },
      { number: "30+", label: "pays avec les phrases d'urgence GlutenGo disponibles, entièrement hors ligne" },
      { number: "6 Mrd €", label: "valeur du marché sans gluten dans le monde — en croissance chaque année" },
    ],
  },
  quickTips: [
    { emoji: "✈️", title: "Réservez toujours un repas spécial", text: "Chez la plupart des compagnies, vous pouvez réserver un GFML 24-72h avant le départ via votre réservation. Gratuit, et plus sûr que le repas standard." },
    { emoji: "🏨", title: "Appelez toujours votre hôtel à l'avance", text: "Préférez l'appel à l'e-mail. Demandez explicitement si le petit-déjeuner peut être sans gluten et s'il y a un grille-pain ou un plan de travail séparé. Confirmez la veille." },
    { emoji: "🛒", title: "Trouvez un supermarché local dès le 1er jour", text: "Repérez le supermarché le plus proche à l'arrivée et faites le plein de basiques sans gluten. Galettes de riz, fruits, noix et yaourts sauvent bien des situations." },
    { emoji: "📱", title: "Téléchargez les cartes hors ligne", text: "Téléchargez Google Maps hors ligne pour votre destination. Cherchez 'gluten free' ou 'coeliac' — beaucoup de restaurants se taggent eux-mêmes. Pas besoin de Wi-Fi." },
    { emoji: "🌿", title: "Pays aux cuisines naturellement sans gluten", text: "Japon (riz, poisson), Mexique (tortillas de maïs), Inde (riz, lentilles, dal), Thaïlande (riz, nouilles tamari) et Éthiopie (injera de teff) sont souvent naturellement sans gluten. Méfiez-vous de la sauce soja et des marinades." },
    { emoji: "🚨", title: "Préparez un plan d'urgence", text: "Connaissez l'hôpital le plus proche, sachez dire 'réaction allergique' dans la langue locale et ayez toujours un snack de secours. Les Phrases d'urgence GlutenGo vous aident à dire ce qu'il faut." },
    { emoji: "🍷", title: "Alcool et bière : attention", text: "Vin et spiritueux (whisky, vodka de pomme de terre) sont souvent sûrs. La bière classique contient du gluten. Choisissez une bière sans gluten ou du cidre. Certaines liqueurs peuvent poser problème." },
    { emoji: "💊", title: "Emportez vos propres enzymes", text: "Les enzymes digestives (GluteGuard ou AN-PEP) ne protègent pas totalement mais aident en cas de petite contamination accidentelle. Demandez d'abord à votre médecin." },
    { emoji: "🌐", title: "Apprenez le mot local pour 'blé'", text: "Blé : wheat (EN), tarwe (NL), Weizen (DE), grano/frumento (IT), trigo (ES/PT), コムギ komugi (JA), ข้าวสาลี khao sali (TH). Connaissez le mot et lisez vos menus." },
    { emoji: "📋", title: "Tenez un journal alimentaire en voyage", text: "Notez ce que vous avez mangé et où. En cas de réaction, vous retracerez la cause beaucoup plus vite — utile pour vous et votre médecin." },
  ],
  baggageTips: [
    {
      title: "Nourriture médicale = bagage supplémentaire gratuit",
      badge: "Aérien",
      content: `Beaucoup de compagnies aériennes autorisent l'emport de nourriture sans gluten comme nécessité médicale, en plus des limites normales. Demandez-le à l'enregistrement ou au service client.

Preuves utiles : certificat médical ou lettre de diagnostic (de préférence en anglais), ainsi que les numéros de licence AOECS de vos produits.`,
      airlines: [
        { name: "Brussels Airlines", note: "Demandez le 'medical meal' à la réservation + signalez à l'enregistrement." },
        { name: "Lufthansa", note: "Repas sans gluten gratuit sur commande, nourriture médicale supplémentaire en cabine autorisée avec certificat." },
        { name: "KLM", note: "Option Special Meals 'Gluten Intolerant Meal' (GFML) à la réservation." },
        { name: "Ryanair / EasyJet", note: "Pas de repas spéciaux mais emporter sa propre nourriture est toujours autorisé." },
      ],
    },
    {
      title: "Compensation financière dans le monde",
      badge: "Financier",
      content: "Beaucoup de pays prévoient une compensation financière pour le surcoût du sans gluten — les règles varient selon le pays et un diagnostic officiel est toujours requis. Voir le tableau ci-dessous pour un aperçu par pays.",
      links: [{ name: "AOECS — aperçu par pays", url: "https://aoecs.eu" }],
    },
    {
      title: "Assurance voyage et maladie cœliaque",
      badge: "Assurance",
      content: `Les assurances voyage standard ne couvrent pas toujours les incidents liés à la maladie cœliaque. Demandez toujours explicitement si vous êtes couvert pour une hospitalisation à l'étranger suite à une contamination, une annulation pour complications médicales et le rapatriement.

Déclarez toujours la maladie cœliaque à la souscription. Parmi les assureurs qui gèrent bien : Europ Assistance, Allianz Travel et AXA Travel.`,
      links: [],
    },
    {
      title: "Certificat médical : toujours avec vous",
      badge: "Document",
      content: `Une lettre de votre médecin en anglais (et idéalement dans la langue locale) est votre meilleur document de voyage. Elle aide pour les repas spéciaux à bord, le bagage supplémentaire, la douane lors de grandes quantités, et l'aide médicale à l'étranger.

Demandez à votre médecin une lettre indiquant le diagnostic, la date, la gravité (la maladie cœliaque est auto-immune) et confirmant qu'un régime sans gluten est médicalement nécessaire.`,
      links: [],
    },
  ],
  countryRights: [
    { flag: "🇧🇪", country: "Belgique", benefit: "Déduction fiscale du surcoût des produits sans gluten comme frais médicaux via le SPF Finances. Coeliakie België publie chaque année les forfaits.", legal: "Information sur les allergènes obligatoire en restauration (UE 1169/2011).", link: { name: "Coeliakie België", url: "https://www.coeliakie.be" } },
    { flag: "🇳🇱", country: "Pays-Bas", benefit: "Déduction des frais de santé spécifiques (coûts diététiques) via l'administration fiscale, montant annuel fixe (~900 €) avec diagnostic officiel.", legal: "Étiquetage allergènes obligatoire dans les restaurants (loi UE).", link: { name: "NCV info fiscale", url: "https://www.glutenvrij.nl/belasting" } },
    { flag: "🇮🇹", country: "Italie", benefit: "Allocation mensuelle de l'État (56-140 € selon âge/sexe) via le Service Sanitaire National pour les produits SG certifiés en pharmacie.", legal: "Maladie cœliaque reconnue légalement comme maladie sociale (Loi 123/2005). Cantines scolaires & hôpitaux doivent proposer des repas SG.", link: { name: "AIC Italie", url: "https://www.celiachia.it" } },
    { flag: "🇬🇧", country: "Royaume-Uni", benefit: "Pain et mix SG sur ordonnance NHS (variable selon la région — Angleterre limitée, Écosse/Pays de Galles/NI plus large).", legal: "Loi sur les allergènes (Natasha's Law 2021) : tout aliment préemballé en magasin doit afficher tous les ingrédients. Obligations strictes en restauration.", link: { name: "Coeliac UK", url: "https://www.coeliac.org.uk" } },
    { flag: "🇩🇪", country: "Allemagne", benefit: "Pas d'allocation directe, mais surcoûts SG déductibles comme 'außergewöhnliche Belastungen' au Finanzamt avec certificat médical.", legal: "Schwerbehindertenausweis (carte d'invalidité, GdB 20) possible — donne des avantages fiscaux.", link: { name: "DZG Allemagne", url: "https://www.dzg-online.de" } },
    { flag: "🇫🇷", country: "France", benefit: "Remboursement partiel des produits SG par la Sécurité Sociale (~33-46 €/mois) sur ordonnance, uniquement pour les produits avec code ACS.", legal: "Allergènes obligatoires sur les menus des restaurants (décret 2015).", link: { name: "AFDIAG France", url: "https://www.afdiag.fr" } },
    { flag: "🇪🇸", country: "Espagne", benefit: "Pas d'allocation nationale, mais certaines régions autonomes (Navarre, Castille-La Manche, Estrémadure) versent une subvention annuelle de 600-1500 €.", legal: "Information sur les allergènes obligatoire en restauration.", link: { name: "FACE Espagne", url: "https://celiacos.org" } },
    { flag: "🇺🇸", country: "États-Unis", benefit: "Surcoût du SG déductible comme 'medical expense' sur IRS Form 1040 Schedule A (uniquement la différence avec un aliment normal, > 7,5 % AGI).", legal: "ADA (Americans with Disabilities Act) : la maladie cœliaque est reconnue comme handicap. Écoles/universités/employeurs doivent fournir des aménagements SG. Règle FDA : 'gluten-free' = <20 ppm.", link: { name: "Celiac Disease Foundation", url: "https://celiac.org/gluten-free-living/federal-benefits/tax-deduction-guide-for-gluten-free-diet" } },
    { flag: "🇨🇦", country: "Canada", benefit: "Surcoût des aliments SG déductible comme Medical Expense Tax Credit (METC) sur la déclaration fédérale avec certificat médical.", legal: "Santé Canada : label 'gluten-free' = <20 ppm. Loi fédérale sur les allergènes en vigueur.", link: { name: "Canadian Celiac Association", url: "https://www.celiac.ca" } },
    { flag: "🇦🇺", country: "Australie", benefit: "Pas d'allocation directe, mais les surcoûts SG peuvent relever du NDIS en cas d'incapacités supplémentaires sévères.", legal: "Norme SG la plus stricte au monde : <3 ppm pour le label 'gluten free' (FSANZ). Loi sur les allergènes en vigueur.", link: { name: "Coeliac Australia", url: "https://www.coeliac.org.au" } },
  ],
  usefulSites: [
    {
      category: "Organisations cœliaques",
      sites: [
        { name: "Coeliakie België", url: "https://www.coeliakie.be", desc: "Organisation cœliaque belge officielle, listes de produits, recettes et actualités." },
        { name: "Nederlandse Coeliakie Vereniging", url: "https://www.glutenvrij.nl", desc: "NCV : reconnaissance, allocations et informations voyage pour les Pays-Bas." },
        { name: "Coeliac UK", url: "https://www.coeliac.org.uk", desc: "Plus grande organisation cœliaque au monde. Cartes de voyage gratuites à télécharger." },
        { name: "Celiac Disease Foundation", url: "https://celiac.org", desc: "Actualités scientifiques, conseils diététiques et ressources voyage." },
        { name: "Association of European Coeliac Societies", url: "https://aoecs.eu", desc: "AOECS coordonne le système européen de licence des produits sans gluten." },
      ],
    },
    {
      category: "Voyage & nourriture",
      sites: [
        { name: "Find Me Gluten Free", url: "https://www.findmeglutenfree.com", desc: "Avis utilisateurs sur les restaurants sans gluten dans le monde." },
        { name: "Gluten Free Passport", url: "https://glutenfreepassport.com", desc: "Cartes de voyage et fiches par pays en plusieurs langues." },
        { name: "Triumph Dining", url: "https://www.triumphdining.com", desc: "Cartes de voyage SG pour 80+ pays — payant mais qualitatif." },
        { name: "iEatOut Gluten Free", url: "https://www.ieatout.com.au", desc: "App et site pour les restaurants avec options sans gluten." },
        { name: "AllergyEats", url: "https://www.allergyeats.com", desc: "Moteur de recherche US pour restaurants allergy-friendly avec avis utilisateurs." },
      ],
    },
    {
      category: "Science & santé",
      sites: [
        { name: "Beyond Celiac", url: "https://www.beyondceliac.org", desc: "Recherche scientifique, essais cliniques et défense des patients." },
        { name: "University of Chicago Celiac Center", url: "https://www.cureceliacdisease.org", desc: "Centre médical de référence avec brochures patient gratuites." },
        { name: "Celiac.com", url: "https://www.celiac.com", desc: "Forum, actualités et mises à jour produits. Une des plus anciennes sources en ligne." },
      ],
    },
  ],
  didYouKnow: [
    { fact: "1 personne sur 100 a la maladie cœliaque, mais seulement 1 sur 4 est officiellement diagnostiquée.", source: "Beyond Celiac" },
    { fact: "Le marché du sans gluten pesait plus de 6 milliards € dans le monde en 2023, et croît de 9 % par an.", source: "Statista" },
    { fact: "Les enfants finlandais et italiens ont la plus haute prévalence cœliaque au monde.", source: "European Journal of Gastroenterology" },
    { fact: "Un régime sans gluten doit être suivi à vie. Même sans symptômes, les villosités intestinales ne récupèrent qu'après 1-2 ans.", source: "Celiac Disease Foundation" },
    { fact: "L'avoine est naturellement sans gluten, mais presque toujours contaminée à la récolte ou la transformation. Choisissez toujours de l'avoine certifiée SG.", source: "Coeliakie België" },
    { fact: "En Italie, chaque patient cœliaque officiellement diagnostiqué reçoit une allocation mensuelle de l'État pour les produits sans gluten.", source: "Ministère italien de la Santé" },
    { fact: "Beaucoup de compagnies aériennes servent les repas spéciaux sans gluten avant les autres passagers, pour s'assurer que la bonne assiette arrive devant vous.", source: "Coeliac UK" },
    { fact: "La maladie cœliaque est la seule maladie auto-immune dont le déclencheur environnemental (le gluten) est entièrement connu et évitable.", source: "NIH" },
  ],
};

const MAP: Record<string, ResourcesContent> = { en, nl, fr };

export function getResourcesContent(lang: string): ResourcesContent {
  return MAP[lang] ?? en;
}
