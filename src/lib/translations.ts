export type LangCode = "en" | "nl" | "fr" | "de" | "es" | "it" | "pt" | "ja" | "th" | "pl" | "ar" | "zh";

export type Translations = {
  nav: {
    restaurants: string;
    trips: string;
    countries: string;
    pricing: string;
    tools: string;
    translationCards: string;
    aiAssistant: string;
    travelMode: string;
    ingredientAnalyzer: string;
    emergencyPhrases: string;
    signIn: string;
    startFree: string;
    dashboard: string;
    signOut: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    rating: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: { title: string; text: string }[];
  };
  howItWorks: {
    title: string;
    steps: { t: string; d: string }[];
  };
  teasers: {
    badge: string;
    title: string;
    subtitle: string;
    tabCard: string;
    tabIngredient: string;
    tabCountry: string;
    freePlan: string;
    freePlanDesc: string;
    seePlans: string;
    pickLanguage: string;
    unlockCard: string;
    pasteIngredients: string;
    checkGluten: string;
    freeIngredient: string;
    freeIngredientDesc: string;
    comparePlans: string;
    chooseDestination: string;
    previewCountries: string;
    previewCountriesDesc: string;
    unlockGuides: string;
    unlockFull: string;
    upgradeUnlock: string;
    getFullGuide: string;
    analyzing: string;
    notSafe: string;
  };
  testimonials: {
    title: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    seePlans: string;
    createAccount: string;
  };
  faq: {
    title: string;
  };
  footer: {
    product: string;
    company: string;
    safety: string;
    safetyText: string;
    tagline: string;
    copyright: string;
  };
  common: {
    openFeature: string;
    lockedContent: string;
  };
};

const en: Translations = {
  nav: {
    restaurants: "Restaurants",
    trips: "Trips",
    countries: "Countries",
    pricing: "Pricing",
    tools: "Tools",
    translationCards: "Translation Cards",
    aiAssistant: "AI Assistant",
    travelMode: "Travel Mode",
    ingredientAnalyzer: "Ingredient Analyzer",
    emergencyPhrases: "Emergency Phrases",
    signIn: "Sign in",
    startFree: "Start free",
    dashboard: "Dashboard",
    signOut: "Sign out",
  },
  hero: {
    badge: "Built with celiac travelers",
    titleLine1: "Travel the world",
    titleHighlight: "gluten-free",
    titleLine2: ", without the stress.",
    subtitle: "AI-powered travel tools for people with celiac disease and gluten intolerance. Translation cards, safe restaurants and country guides, always in your pocket.",
    ctaPrimary: "Start traveling safely",
    ctaSecondary: "Explore country guides",
    rating: "from 1,200+ celiac travelers",
  },
  features: {
    title: "Everything you need to eat safely abroad",
    subtitle: "Six tools that replace a dozen apps, sticky notes and last-minute searching at the table.",
    items: [
      { title: "Translation Cards", text: "Generate medical-grade allergy cards in 16 languages. Show, share, save offline." },
      { title: "Country Guides", text: "Safe foods, risks, brands, and emergency phrases curated per destination." },
      { title: "AI Travel Assistant", text: "Ask anything: 'What can I eat in Tokyo?' Get calm, structured, safety-first answers." },
      { title: "Travel Mode", text: "One tap to a fullscreen card for staff. Cross-contamination, severity, thank you." },
      { title: "Ingredient Analyzer", text: "Paste or scan a label. Our AI flags gluten, hidden risks, and safe alternatives." },
      { title: "Emergency Phrases", text: "Critical gluten-free phrases per country and language, always available offline." },
    ],
  },
  howItWorks: {
    title: "How it works",
    steps: [
      { t: "Pick your destination", d: "Browse country-specific guides written for celiac travelers, not tourists." },
      { t: "Generate your cards", d: "Tap the language. Our AI writes a calm, accurate medical card you can show staff." },
      { t: "Travel with confidence", d: "Offline access, AI assistant, and emergency phrases, always one tap away." },
    ],
  },
  teasers: {
    badge: "Try before you subscribe",
    title: "See it in action",
    subtitle: "Real tools, real results. Test a free preview right now, no account needed.",
    tabCard: "Translation Card",
    tabIngredient: "Ingredient Check",
    tabCountry: "Country Guide",
    freePlan: "Free plan: 3 cards/month",
    freePlanDesc: "Unlock 16 languages, PDF export, offline access and severity levels on the Traveler plan.",
    seePlans: "See all plans",
    pickLanguage: "Step 1: Pick a language",
    unlockCard: "Unlock full card",
    pasteIngredients: "Paste an ingredient list",
    checkGluten: "Check for gluten",
    freeIngredient: "Free: analyze up to 3 ingredients",
    freeIngredientDesc: "Upgrade for unlimited labels, photo scan, barcode lookup and allergen deep-dive.",
    comparePlans: "Compare plans",
    chooseDestination: "Choose a destination",
    previewCountries: "Preview: 3 of 30+ countries",
    previewCountriesDesc: "Get full guides, safe brand lists, restaurant tips and offline access.",
    unlockGuides: "Unlock all guides",
    unlockFull: "Safe brands, local tips & offline mode",
    upgradeUnlock: "Upgrade to unlock",
    getFullGuide: "Get full guide",
    analyzing: "Analyzing…",
    notSafe: "Not safe: 2 risks found",
  },
  testimonials: {
    title: "Loved by travelers who can't afford mistakes",
  },
  pricing: {
    title: "Start free. Upgrade when you fly.",
    subtitle: "3 cards/month free, forever. From €12.99/month for unlimited everything.",
    seePlans: "See plans",
    createAccount: "Create account",
  },
  faq: { title: "Questions, answered" },
  footer: {
    product: "Product",
    company: "Company",
    safety: "Safety",
    safetyText: "GlutenGo provides translation tools and information. Always confirm preparation with restaurant staff. This is not medical advice.",
    tagline: "Travel the world gluten-free, without the stress.",
    copyright: "Made with care for celiac travelers.",
  },
  common: {
    openFeature: "Open feature",
    lockedContent: "Subscribers only",
  },
};

const nl: Translations = {
  nav: {
    restaurants: "Restaurants",
    trips: "Reizen",
    countries: "Landen",
    pricing: "Prijzen",
    tools: "Tools",
    translationCards: "Vertaalkaarten",
    aiAssistant: "AI-assistent",
    travelMode: "Reismodus",
    ingredientAnalyzer: "Ingrediëntencheck",
    emergencyPhrases: "Noodfrases",
    signIn: "Inloggen",
    startFree: "Gratis starten",
    dashboard: "Dashboard",
    signOut: "Uitloggen",
  },
  hero: {
    badge: "Gebouwd met coeliakie-reizigers",
    titleLine1: "Reis de wereld over",
    titleHighlight: "glutenvrij",
    titleLine2: ", zonder de stress.",
    subtitle: "AI-gestuurde reistools voor mensen met coeliakie en glutenintolerantie. Vertaalkaarten, veilige restaurants en landengidsen, altijd bij de hand.",
    ctaPrimary: "Begin veilig te reizen",
    ctaSecondary: "Bekijk landengidsen",
    rating: "van 1.200+ coeliakie-reizigers",
  },
  features: {
    title: "Alles wat je nodig hebt om veilig te eten in het buitenland",
    subtitle: "Zes tools die een dozijn apps, post-its en paniekgoogelen aan tafel vervangen.",
    items: [
      { title: "Vertaalkaarten", text: "Genereer medisch-kwaliteit allergiekaarten in 16 talen. Tonen, delen, offline opslaan." },
      { title: "Landengidsen", text: "Veilig voedsel, risico's, merken en noodfrases per bestemming." },
      { title: "AI-reisassistent", text: "Stel alles: 'Wat kan ik eten in Tokyo?' Rustige, veiligheidsgerichte antwoorden." },
      { title: "Reismodus", text: "Één tik naar volledig scherm voor personeel. Kruisbesmetting, ernst, dankjewel." },
      { title: "Ingrediëntencheck", text: "Plak of scan een label. Onze AI markeert gluten, verborgen risico's en veilige alternatieven." },
      { title: "Noodfrases", text: "Kritieke glutenvrije frases per land en taal, altijd offline beschikbaar." },
    ],
  },
  howItWorks: {
    title: "Zo werkt het",
    steps: [
      { t: "Kies je bestemming", d: "Blader door landspecifieke gidsen geschreven voor coeliakie-reizigers, niet voor toeristen." },
      { t: "Genereer je kaarten", d: "Tik op de taal. Onze AI schrijft een nauwkeurige medische kaart die je aan het personeel kunt laten zien." },
      { t: "Reis met vertrouwen", d: "Offline toegang, AI-assistent en noodfrases, altijd één tik verwijderd." },
    ],
  },
  teasers: {
    badge: "Probeer voor je abonneert",
    title: "Zie het in actie",
    subtitle: "Echte tools, echte resultaten. Test een gratis voorbeeld nu. Geen account nodig.",
    tabCard: "Vertaalkaart",
    tabIngredient: "Ingrediëntencheck",
    tabCountry: "Landengids",
    freePlan: "Gratis plan: 3 kaarten/maand",
    freePlanDesc: "Ontgrendel 16 talen, PDF-export, offline toegang en ernstniveaus in het Traveler-plan.",
    seePlans: "Alle plannen bekijken",
    pickLanguage: "Stap 1: Kies een taal",
    unlockCard: "Volledige kaart ontgrendelen",
    pasteIngredients: "Plak een ingrediëntenlijst",
    checkGluten: "Controleer op gluten",
    freeIngredient: "Gratis: analyseer tot 3 ingrediënten",
    freeIngredientDesc: "Upgrade voor onbeperkte labels, fotoscan, barcodecheck en diepgaande allergeenanalyse.",
    comparePlans: "Plannen vergelijken",
    chooseDestination: "Kies een bestemming",
    previewCountries: "Voorbeeld: 3 van 30+ landen",
    previewCountriesDesc: "Krijg volledige gidsen, veilige merken, restauranttips en offline toegang.",
    unlockGuides: "Alle gidsen ontgrendelen",
    unlockFull: "Veilige merken, lokale tips & offline modus",
    upgradeUnlock: "Upgrade om te ontgrendelen",
    getFullGuide: "Volledige gids ophalen",
    analyzing: "Analyseren…",
    notSafe: "Niet veilig: 2 risico's gevonden",
  },
  testimonials: { title: "Geliefd bij reizigers die het zich niet kunnen veroorloven fouten te maken" },
  pricing: {
    title: "Begin gratis. Upgrade als je vliegt.",
    subtitle: "3 kaarten/maand gratis, voor altijd. Vanaf €12,99/maand voor alles onbeperkt.",
    seePlans: "Plannen bekijken",
    createAccount: "Account aanmaken",
  },
  faq: { title: "Vragen, beantwoord" },
  footer: {
    product: "Product",
    company: "Bedrijf",
    safety: "Veiligheid",
    safetyText: "GlutenGo biedt vertaaltools en informatie. Bevestig altijd de bereiding bij het restaurantpersoneel. Dit is geen medisch advies.",
    tagline: "Reis de wereld over glutenvrij, zonder de stress.",
    copyright: "Gemaakt met zorg voor coeliakie-reizigers.",
  },
  common: { openFeature: "Feature openen", lockedContent: "Alleen voor abonnees" },
};

const fr: Translations = {
  nav: {
    restaurants: "Restaurants", trips: "Voyages", countries: "Pays", pricing: "Tarifs", tools: "Outils",
    translationCards: "Cartes de traduction", aiAssistant: "Assistant IA", travelMode: "Mode voyage",
    ingredientAnalyzer: "Analyse ingrédients", emergencyPhrases: "Phrases d'urgence",
    signIn: "Se connecter", startFree: "Commencer gratuitement", dashboard: "Tableau de bord", signOut: "Se déconnecter",
  },
  hero: {
    badge: "Créé avec des voyageurs cœliaques",
    titleLine1: "Voyagez dans le monde",
    titleHighlight: "sans gluten",
    titleLine2: ", sans le stress.",
    subtitle: "Outils de voyage IA pour les personnes atteintes de la maladie cœliaque et d'intolérance au gluten. Cartes de traduction, restaurants sûrs et guides par pays, dans votre poche.",
    ctaPrimary: "Commencer à voyager en sécurité",
    ctaSecondary: "Explorer les guides par pays",
    rating: "de plus de 1 200 voyageurs cœliaques",
  },
  features: {
    title: "Tout ce dont vous avez besoin pour manger en sécurité à l'étranger",
    subtitle: "Six outils qui remplacent une douzaine d'apps et les recherches paniquées à table.",
    items: [
      { title: "Cartes de traduction", text: "Générez des cartes d'allergie médicales en 16 langues. Montrez, partagez, sauvegardez hors ligne." },
      { title: "Guides par pays", text: "Aliments sûrs, risques, marques et phrases d'urgence par destination." },
      { title: "Assistant de voyage IA", text: "Demandez tout : 'Que puis-je manger à Tokyo ?' Réponses calmes axées sur la sécurité." },
      { title: "Mode voyage", text: "Un tap vers une carte plein écran pour le personnel. Contamination croisée, gravité, merci." },
      { title: "Analyse ingrédients", text: "Collez ou scannez une étiquette. Notre IA signale le gluten, les risques cachés et les alternatives." },
      { title: "Phrases d'urgence", text: "Phrases sans gluten essentielles par pays et langue, toujours disponibles hors ligne." },
    ],
  },
  howItWorks: {
    title: "Comment ça marche",
    steps: [
      { t: "Choisissez votre destination", d: "Parcourez des guides par pays écrits pour les voyageurs cœliaques, pas pour les touristes." },
      { t: "Générez vos cartes", d: "Appuyez sur la langue. Notre IA rédige une carte médicale précise à montrer au personnel." },
      { t: "Voyagez en confiance", d: "Accès hors ligne, assistant IA et phrases d'urgence, toujours à portée de main." },
    ],
  },
  teasers: {
    badge: "Essayez avant de vous abonner", title: "Voyez-le en action",
    subtitle: "Vrais outils, vrais résultats. Testez un aperçu gratuit maintenant. Aucun compte requis.",
    tabCard: "Carte de traduction", tabIngredient: "Vérif. ingrédients", tabCountry: "Guide pays",
    freePlan: "Plan gratuit : 3 cartes/mois",
    freePlanDesc: "Débloquez 16 langues, export PDF, accès hors ligne et niveaux de gravité.",
    seePlans: "Voir tous les plans", pickLanguage: "Étape 1 : Choisissez une langue", unlockCard: "Débloquer la carte complète",
    pasteIngredients: "Collez une liste d'ingrédients", checkGluten: "Vérifier le gluten",
    freeIngredient: "Gratuit : analyser jusqu'à 3 ingrédients",
    freeIngredientDesc: "Passez à la version supérieure pour des étiquettes illimitées, scan photo et codes-barres.",
    comparePlans: "Comparer les plans", chooseDestination: "Choisissez une destination",
    previewCountries: "Aperçu : 3 des 30+ pays", previewCountriesDesc: "Obtenez des guides complets, marques sûres et accès hors ligne.",
    unlockGuides: "Débloquer tous les guides", unlockFull: "Marques sûres, conseils locaux & mode hors ligne",
    upgradeUnlock: "Débloquer avec l'upgrade", getFullGuide: "Obtenir le guide complet",
    analyzing: "Analyse en cours…", notSafe: "Pas sûr : 2 risques détectés",
  },
  testimonials: { title: "Apprécié par les voyageurs qui ne peuvent pas se permettre d'erreurs" },
  pricing: {
    title: "Commencez gratuitement. Passez à la version supérieure quand vous volez.",
    subtitle: "3 cartes/mois gratuites, pour toujours. À partir de 12,99 €/mois pour tout illimité.",
    seePlans: "Voir les plans", createAccount: "Créer un compte",
  },
  faq: { title: "Questions, réponses" },
  footer: {
    product: "Produit", company: "Entreprise", safety: "Sécurité",
    safetyText: "GlutenGo fournit des outils de traduction et des informations. Confirmez toujours la préparation avec le personnel du restaurant. Ce n'est pas un avis médical.",
    tagline: "Voyagez dans le monde sans gluten, sans stress.",
    copyright: "Fait avec soin pour les voyageurs cœliaques.",
  },
  common: { openFeature: "Ouvrir la fonctionnalité", lockedContent: "Abonnés uniquement" },
};

const de: Translations = {
  nav: {
    restaurants: "Restaurants", trips: "Reisen", countries: "Länder", pricing: "Preise", tools: "Tools",
    translationCards: "Übersetzungskarten", aiAssistant: "KI-Assistent", travelMode: "Reisemodus",
    ingredientAnalyzer: "Zutatenprüfer", emergencyPhrases: "Notfallphrasen",
    signIn: "Anmelden", startFree: "Kostenlos starten", dashboard: "Dashboard", signOut: "Abmelden",
  },
  hero: {
    badge: "Entwickelt mit Zöliakie-Reisenden",
    titleLine1: "Bereise die Welt",
    titleHighlight: "glutenfrei",
    titleLine2: ", ohne Stress.",
    subtitle: "KI-gestützte Reisetools für Menschen mit Zöliakie und Glutenunverträglichkeit. Übersetzungskarten, sichere Restaurants und Länderführer, immer dabei.",
    ctaPrimary: "Sicher reisen beginnen",
    ctaSecondary: "Länderführer erkunden",
    rating: "von über 1.200 Zöliakie-Reisenden",
  },
  features: {
    title: "Alles was Sie brauchen, um im Ausland sicher zu essen",
    subtitle: "Sechs Tools, die ein Dutzend Apps, Notizzettel und Panik-Googeln am Tisch ersetzen.",
    items: [
      { title: "Übersetzungskarten", text: "Medizinische Allergiekarten in 16 Sprachen generieren. Zeigen, teilen, offline speichern." },
      { title: "Länderführer", text: "Sichere Speisen, Risiken, Marken und Notfallphrasen pro Reiseziel." },
      { title: "KI-Reiseassistent", text: "Fragen Sie alles: 'Was kann ich in Tokio essen?' Ruhige, sicherheitsorientierte Antworten." },
      { title: "Reisemodus", text: "Ein Tap zur Vollbildkarte für das Personal. Kreuzkontamination, Schweregrad, Danke." },
      { title: "Zutatenprüfer", text: "Label einfügen oder scannen. Unsere KI markiert Gluten, versteckte Risiken und sichere Alternativen." },
      { title: "Notfallphrasen", text: "Kritische glutenfreie Phrasen pro Land und Sprache, immer offline verfügbar." },
    ],
  },
  howItWorks: {
    title: "So funktioniert es",
    steps: [
      { t: "Wählen Sie Ihr Reiseziel", d: "Durchsuchen Sie länderspezifische Führergeschrieben für Zöliakie-Reisende, nicht für Touristen." },
      { t: "Generieren Sie Ihre Karten", d: "Tippen Sie auf die Sprache. Unsere KI schreibt eine genaue medizinische Karte." },
      { t: "Reisen Sie mit Vertrauen", d: "Offline-Zugang, KI-Assistent und Notfallphrasen, immer einen Tap entfernt." },
    ],
  },
  teasers: {
    badge: "Testen Sie vor dem Abonnement", title: "Sehen Sie es in Aktion",
    subtitle: "Echte Tools, echte Ergebnisse. Testen Sie jetzt eine kostenlose Vorschau. Kein Konto erforderlich.",
    tabCard: "Übersetzungskarte", tabIngredient: "Zutatencheck", tabCountry: "Länderführer",
    freePlan: "Kostenloser Plan: 3 Karten/Monat",
    freePlanDesc: "16 Sprachen, PDF-Export, Offline-Zugang und Schweregrade freischalten.",
    seePlans: "Alle Pläne ansehen", pickLanguage: "Schritt 1: Sprache wählen", unlockCard: "Vollständige Karte freischalten",
    pasteIngredients: "Zutatenliste einfügen", checkGluten: "Auf Gluten prüfen",
    freeIngredient: "Kostenlos: bis zu 3 Zutaten analysieren",
    freeIngredientDesc: "Upgraden für unbegrenzte Labels, Foto-Scan und Barcode-Suche.",
    comparePlans: "Pläne vergleichen", chooseDestination: "Reiseziel wählen",
    previewCountries: "Vorschau: 3 von 30+ Ländern", previewCountriesDesc: "Vollständige Führermarken und Offline-Zugang erhalten.",
    unlockGuides: "Alle Führerfreischalten", unlockFull: "Sichere Marken, lokale Tipps & Offline-Modus",
    upgradeUnlock: "Zum Freischalten upgraden", getFullGuide: "Vollständigen Führer holen",
    analyzing: "Analysiere…", notSafe: "Nicht sicher: 2 Risiken gefunden",
  },
  testimonials: { title: "Beliebt bei Reisenden, die sich keine Fehler leisten können" },
  pricing: {
    title: "Kostenlos starten. Upgraden wenn Sie fliegen.",
    subtitle: "3 Karten/Monat kostenlos, für immer. Ab 12,99 €/Monat für alles unbegrenzt.",
    seePlans: "Pläne ansehen", createAccount: "Konto erstellen",
  },
  faq: { title: "Fragen, beantwortet" },
  footer: {
    product: "Produkt", company: "Unternehmen", safety: "Sicherheit",
    safetyText: "GlutenGo bietet Übersetzungstools und Informationen. Bestätigen Sie immer die Zubereitung beim Restaurantpersonal. Dies ist kein medizinischer Rat.",
    tagline: "Bereise die Welt glutenfrei, ohne Stress.",
    copyright: "Mit Sorgfalt für Zöliakie-Reisende gemacht.",
  },
  common: { openFeature: "Feature öffnen", lockedContent: "Nur für Abonnenten" },
};

const es: Translations = {
  nav: {
    restaurants: "Restaurantes", trips: "Viajes", countries: "Países", pricing: "Precios", tools: "Herramientas",
    translationCards: "Tarjetas de traducción", aiAssistant: "Asistente IA", travelMode: "Modo viaje",
    ingredientAnalyzer: "Analizador de ingredientes", emergencyPhrases: "Frases de emergencia",
    signIn: "Iniciar sesión", startFree: "Empezar gratis", dashboard: "Panel", signOut: "Cerrar sesión",
  },
  hero: {
    badge: "Creado con viajeros celíacos",
    titleLine1: "Viaja por el mundo",
    titleHighlight: "sin gluten",
    titleLine2: ", sin el estrés.",
    subtitle: "Herramientas de viaje con IA para personas con enfermedad celíaca e intolerancia al gluten. Tarjetas de traducción, restaurantes seguros y guías por país, en tu bolsillo.",
    ctaPrimary: "Empieza a viajar con seguridad",
    ctaSecondary: "Explorar guías por país",
    rating: "de más de 1.200 viajeros celíacos",
  },
  features: {
    title: "Todo lo que necesitas para comer con seguridad en el extranjero",
    subtitle: "Seis herramientas que reemplazan una docena de apps y búsquedas de pánico en la mesa.",
    items: [
      { title: "Tarjetas de traducción", text: "Genera tarjetas de alergia médica en 16 idiomas. Muestra, comparte, guarda sin conexión." },
      { title: "Guías por país", text: "Alimentos seguros, riesgos, marcas y frases de emergencia por destino." },
      { title: "Asistente de viaje IA", text: "Pregunta lo que sea: '¿Qué puedo comer en Tokio?' Respuestas tranquilas y seguras." },
      { title: "Modo viaje", text: "Un tap hacia una tarjeta en pantalla completa para el personal. Contaminación cruzada, gravedad, gracias." },
      { title: "Analizador de ingredientes", text: "Pega o escanea una etiqueta. Nuestra IA detecta gluten, riesgos ocultos y alternativas." },
      { title: "Frases de emergencia", text: "Frases sin gluten esenciales por país e idioma, siempre disponibles sin conexión." },
    ],
  },
  howItWorks: {
    title: "Cómo funciona",
    steps: [
      { t: "Elige tu destino", d: "Explora guías específicas por país escritas para viajeros celíacos, no para turistas." },
      { t: "Genera tus tarjetas", d: "Toca el idioma. Nuestra IA escribe una tarjeta médica precisa para mostrar al personal." },
      { t: "Viaja con confianza", d: "Acceso sin conexión, asistente IA y frases de emergencia, siempre a un tap." },
    ],
  },
  teasers: {
    badge: "Prueba antes de suscribirte", title: "Vélo en acción",
    subtitle: "Herramientas reales, resultados reales. Prueba una vista previa gratuita ahora. Sin cuenta.",
    tabCard: "Tarjeta de traducción", tabIngredient: "Check ingredientes", tabCountry: "Guía país",
    freePlan: "Plan gratuito: 3 tarjetas/mes",
    freePlanDesc: "Desbloquea 16 idiomas, exportación PDF, acceso sin conexión y niveles de gravedad.",
    seePlans: "Ver todos los planes", pickLanguage: "Paso 1: Elige un idioma", unlockCard: "Desbloquear tarjeta completa",
    pasteIngredients: "Pega una lista de ingredientes", checkGluten: "Verificar gluten",
    freeIngredient: "Gratis: analiza hasta 3 ingredientes",
    freeIngredientDesc: "Actualiza para etiquetas ilimitadas, escaneo de fotos y búsqueda de códigos de barras.",
    comparePlans: "Comparar planes", chooseDestination: "Elige un destino",
    previewCountries: "Vista previa: 3 de 30+ países", previewCountriesDesc: "Obtén guías completas, marcas seguras y acceso sin conexión.",
    unlockGuides: "Desbloquear todas las guías", unlockFull: "Marcas seguras, consejos locales y modo sin conexión",
    upgradeUnlock: "Actualizar para desbloquear", getFullGuide: "Obtener guía completa",
    analyzing: "Analizando…", notSafe: "No seguro: 2 riesgos encontrados",
  },
  testimonials: { title: "Amado por viajeros que no pueden permitirse errores" },
  pricing: {
    title: "Empieza gratis. Actualiza cuando vueles.",
    subtitle: "3 tarjetas/mes gratis, para siempre. Desde 12,99 €/mes para todo ilimitado.",
    seePlans: "Ver planes", createAccount: "Crear cuenta",
  },
  faq: { title: "Preguntas, respondidas" },
  footer: {
    product: "Producto", company: "Empresa", safety: "Seguridad",
    safetyText: "GlutenGo proporciona herramientas de traducción e información. Confirma siempre la preparación con el personal del restaurante. Esto no es consejo médico.",
    tagline: "Viaja por el mundo sin gluten, sin estrés.",
    copyright: "Hecho con cuidado para viajeros celíacos.",
  },
  common: { openFeature: "Abrir función", lockedContent: "Solo suscriptores" },
};

const it: Translations = {
  nav: {
    restaurants: "Ristoranti", trips: "Viaggi", countries: "Paesi", pricing: "Prezzi", tools: "Strumenti",
    translationCards: "Carte di traduzione", aiAssistant: "Assistente IA", travelMode: "Modalità viaggio",
    ingredientAnalyzer: "Analizzatore ingredienti", emergencyPhrases: "Frasi di emergenza",
    signIn: "Accedi", startFree: "Inizia gratis", dashboard: "Dashboard", signOut: "Esci",
  },
  hero: {
    badge: "Creato con viaggiatori celiaci",
    titleLine1: "Viaggia per il mondo",
    titleHighlight: "senza glutine",
    titleLine2: ", senza lo stress.",
    subtitle: "Strumenti di viaggio IA per persone con malattia celiaca e intolleranza al glutine. Carte di traduzione, ristoranti sicuri e guide per paese, in tasca.",
    ctaPrimary: "Inizia a viaggiare in sicurezza",
    ctaSecondary: "Esplora le guide per paese",
    rating: "da oltre 1.200 viaggiatori celiaci",
  },
  features: {
    title: "Tutto ciò di cui hai bisogno per mangiare sicuro all'estero",
    subtitle: "Sei strumenti che sostituiscono una dozzina di app e le ricerche disperate al tavolo.",
    items: [
      { title: "Carte di traduzione", text: "Genera carte allergie mediche in 16 lingue. Mostra, condividi, salva offline." },
      { title: "Guide per paese", text: "Cibi sicuri, rischi, marche e frasi di emergenza per destinazione." },
      { title: "Assistente di viaggio IA", text: "Chiedi tutto: 'Cosa posso mangiare a Tokyo?' Risposte calme e orientate alla sicurezza." },
      { title: "Modalità viaggio", text: "Un tap verso una carta a schermo intero per il personale. Contaminazione crociata, gravità, grazie." },
      { title: "Analizzatore ingredienti", text: "Incolla o scansiona un'etichetta. La nostra IA segnala glutine, rischi nascosti e alternative." },
      { title: "Frasi di emergenza", text: "Frasi senza glutine essenziali per paese e lingua, sempre disponibili offline." },
    ],
  },
  howItWorks: {
    title: "Come funziona",
    steps: [
      { t: "Scegli la tua destinazione", d: "Sfoglia guide specifiche per paese scritte per viaggiatori celiaci, non per turisti." },
      { t: "Genera le tue carte", d: "Tocca la lingua. La nostra IA scrive una carta medica precisa da mostrare al personale." },
      { t: "Viaggia con fiducia", d: "Accesso offline, assistente IA e frasi di emergenza, sempre a portata di tap." },
    ],
  },
  teasers: {
    badge: "Prova prima di abbonarti", title: "Vedi come funziona",
    subtitle: "Strumenti reali, risultati reali. Prova un'anteprima gratuita ora. Nessun account necessario.",
    tabCard: "Carta di traduzione", tabIngredient: "Controllo ingredienti", tabCountry: "Guida paese",
    freePlan: "Piano gratuito: 3 carte/mese",
    freePlanDesc: "Sblocca 16 lingue, esportazione PDF, accesso offline e livelli di gravità.",
    seePlans: "Vedi tutti i piani", pickLanguage: "Passo 1: Scegli una lingua", unlockCard: "Sblocca la carta completa",
    pasteIngredients: "Incolla una lista di ingredienti", checkGluten: "Controlla il glutine",
    freeIngredient: "Gratis: analizza fino a 3 ingredienti",
    freeIngredientDesc: "Aggiorna per etichette illimitate, scansione foto e ricerca codici a barre.",
    comparePlans: "Confronta i piani", chooseDestination: "Scegli una destinazione",
    previewCountries: "Anteprima: 3 di 30+ paesi", previewCountriesDesc: "Ottieni guide complete, marche sicure e accesso offline.",
    unlockGuides: "Sblocca tutte le guide", unlockFull: "Marche sicure, consigli locali e modalità offline",
    upgradeUnlock: "Upgrade per sbloccare", getFullGuide: "Ottieni la guida completa",
    analyzing: "Analisi in corso…", notSafe: "Non sicuro: 2 rischi trovati",
  },
  testimonials: { title: "Amato dai viaggiatori che non possono permettersi errori" },
  pricing: {
    title: "Inizia gratis. Fai l'upgrade quando voli.",
    subtitle: "3 carte/mese gratis, per sempre. Da €12,99/mese per tutto illimitato.",
    seePlans: "Vedi i piani", createAccount: "Crea account",
  },
  faq: { title: "Domande, risposte" },
  footer: {
    product: "Prodotto", company: "Azienda", safety: "Sicurezza",
    safetyText: "GlutenGo fornisce strumenti di traduzione e informazioni. Conferma sempre la preparazione con il personale del ristorante. Questo non è un consiglio medico.",
    tagline: "Viaggia per il mondo senza glutine, senza stress.",
    copyright: "Fatto con cura per i viaggiatori celiaci.",
  },
  common: { openFeature: "Apri funzione", lockedContent: "Solo abbonati" },
};

const pt: Translations = {
  nav: {
    restaurants: "Restaurantes", trips: "Viagens", countries: "Países", pricing: "Preços", tools: "Ferramentas",
    translationCards: "Cartões de tradução", aiAssistant: "Assistente IA", travelMode: "Modo viagem",
    ingredientAnalyzer: "Analisador ingredientes", emergencyPhrases: "Frases de emergência",
    signIn: "Entrar", startFree: "Começar grátis", dashboard: "Painel", signOut: "Sair",
  },
  hero: {
    badge: "Criado com viajantes celíacos",
    titleLine1: "Viaje pelo mundo",
    titleHighlight: "sem glúten",
    titleLine2: ", sem stress.",
    subtitle: "Ferramentas de viagem com IA para pessoas com doença celíaca e intolerância ao glúten. Cartões de tradução, restaurantes seguros e guias por país, no seu bolso.",
    ctaPrimary: "Comece a viajar com segurança",
    ctaSecondary: "Explorar guias por país",
    rating: "de mais de 1.200 viajantes celíacos",
  },
  features: {
    title: "Tudo o que precisa para comer com segurança no estrangeiro",
    subtitle: "Seis ferramentas que substituem uma dúzia de apps e pesquisas de pânico à mesa.",
    items: [
      { title: "Cartões de tradução", text: "Gere cartões de alergia médica em 16 idiomas. Mostre, partilhe, guarde offline." },
      { title: "Guias por país", text: "Alimentos seguros, riscos, marcas e frases de emergência por destino." },
      { title: "Assistente de viagem IA", text: "Pergunte o que quiser: 'O que posso comer em Tóquio?' Respostas calmas e seguras." },
      { title: "Modo viagem", text: "Um toque para um cartão em ecrã inteiro para o pessoal. Contaminação cruzada, gravidade, obrigado." },
      { title: "Analisador ingredientes", text: "Cole ou digitalize um rótulo. A nossa IA deteta glúten, riscos ocultos e alternativas." },
      { title: "Frases de emergência", text: "Frases sem glúten essenciais por país e idioma, sempre disponíveis offline." },
    ],
  },
  howItWorks: {
    title: "Como funciona",
    steps: [
      { t: "Escolha o seu destino", d: "Consulte guias por país escritos para viajantes celíacos, não para turistas." },
      { t: "Gere os seus cartões", d: "Toque no idioma. A nossa IA escreve um cartão médico preciso para mostrar ao pessoal." },
      { t: "Viaje com confiança", d: "Acesso offline, assistente IA e frases de emergência, sempre a um toque." },
    ],
  },
  teasers: {
    badge: "Experimente antes de subscrever", title: "Veja em ação",
    subtitle: "Ferramentas reais, resultados reais. Teste uma pré-visualização gratuita agora. Sem conta.",
    tabCard: "Cartão de tradução", tabIngredient: "Verificação ingredientes", tabCountry: "Guia país",
    freePlan: "Plano gratuito: 3 cartões/mês",
    freePlanDesc: "Desbloqueie 16 idiomas, exportação PDF, acesso offline e níveis de gravidade.",
    seePlans: "Ver todos os planos", pickLanguage: "Passo 1: Escolha um idioma", unlockCard: "Desbloquear cartão completo",
    pasteIngredients: "Cole uma lista de ingredientes", checkGluten: "Verificar glúten",
    freeIngredient: "Grátis: analise até 3 ingredientes",
    freeIngredientDesc: "Atualize para rótulos ilimitados, digitalização de fotos e pesquisa de código de barras.",
    comparePlans: "Comparar planos", chooseDestination: "Escolha um destino",
    previewCountries: "Pré-visualização: 3 de 30+ países", previewCountriesDesc: "Obtenha guias completos, marcas seguras e acesso offline.",
    unlockGuides: "Desbloquear todos os guias", unlockFull: "Marcas seguras, dicas locais e modo offline",
    upgradeUnlock: "Atualizar para desbloquear", getFullGuide: "Obter guia completo",
    analyzing: "A analisar…", notSafe: "Não seguro: 2 riscos encontrados",
  },
  testimonials: { title: "Adorado por viajantes que não podem cometer erros" },
  pricing: {
    title: "Comece grátis. Atualize quando voar.",
    subtitle: "3 cartões/mês grátis, para sempre. A partir de €12,99/mês para tudo ilimitado.",
    seePlans: "Ver planos", createAccount: "Criar conta",
  },
  faq: { title: "Perguntas, respondidas" },
  footer: {
    product: "Produto", company: "Empresa", safety: "Segurança",
    safetyText: "GlutenGo fornece ferramentas de tradução e informações. Confirme sempre a preparação com o pessoal do restaurante. Isto não é conselho médico.",
    tagline: "Viaje pelo mundo sem glúten, sem stress.",
    copyright: "Feito com cuidado para viajantes celíacos.",
  },
  common: { openFeature: "Abrir funcionalidade", lockedContent: "Apenas assinantes" },
};

const ja: Translations = {
  nav: {
    restaurants: "レストラン", trips: "旅行", countries: "国一覧", pricing: "料金", tools: "ツール",
    translationCards: "翻訳カード", aiAssistant: "AIアシスタント", travelMode: "トラベルモード",
    ingredientAnalyzer: "成分チェック", emergencyPhrases: "緊急フレーズ",
    signIn: "ログイン", startFree: "無料で始める", dashboard: "ダッシュボード", signOut: "ログアウト",
  },
  hero: {
    badge: "セリアック病の旅行者と共に作られました",
    titleLine1: "世界を旅しよう",
    titleHighlight: "グルテンフリーで",
    titleLine2: "、ストレスなしで。",
    subtitle: "セリアック病とグルテン不耐性を持つ人々のためのAI旅行ツール。翻訳カード、安全なレストランと国別ガイド、ポケットの中に。",
    ctaPrimary: "安全に旅を始める",
    ctaSecondary: "国別ガイドを見る",
    rating: "1,200人以上のセリアック旅行者より",
  },
  features: {
    title: "海外で安全に食事するために必要なすべて",
    subtitle: "テーブルでの焦りのGoogle検索を置き換える6つのツール。",
    items: [
      { title: "翻訳カード", text: "16言語で医療グレードのアレルギーカードを生成。表示、共有、オフライン保存。" },
      { title: "国別ガイド", text: "目的地ごとに厳選された安全な食べ物、リスク、ブランド、緊急フレーズ。" },
      { title: "AI旅行アシスタント", text: "「東京で何を食べられますか？」など何でも聞けます。安全最優先の回答。" },
      { title: "トラベルモード", text: "ワンタップでスタッフへのフルスクリーンカード。交差汚染、重症度、ありがとう。" },
      { title: "成分チェック", text: "ラベルを貼り付けまたはスキャン。AIがグルテン、隠れたリスクを検出。" },
      { title: "緊急フレーズ", text: "国と言語ごとの重要なグルテンフリーフレーズ、常にオフラインで利用可能。" },
    ],
  },
  howItWorks: {
    title: "使い方",
    steps: [
      { t: "目的地を選ぶ", d: "観光客向けではなく、セリアック旅行者のために書かれた国別ガイドを閲覧。" },
      { t: "カードを生成", d: "言語をタップ。AIがスタッフに見せられる正確な医療カードを作成。" },
      { t: "自信を持って旅する", d: "オフラインアクセス、AIアシスタント、緊急フレーズ、常にワンタップ。" },
    ],
  },
  teasers: {
    badge: "登録前に試してみる", title: "実際に見てみましょう",
    subtitle: "本物のツール、本物の結果。今すぐ無料プレビューを試してください。アカウント不要。",
    tabCard: "翻訳カード", tabIngredient: "成分チェック", tabCountry: "国別ガイド",
    freePlan: "無料プラン：月3枚",
    freePlanDesc: "16言語、PDFエクスポート、オフラインアクセスをアンロック。",
    seePlans: "すべてのプランを見る", pickLanguage: "ステップ1：言語を選択", unlockCard: "フルカードをアンロック",
    pasteIngredients: "成分リストを貼り付け", checkGluten: "グルテンをチェック",
    freeIngredient: "無料：最大3成分を分析",
    freeIngredientDesc: "無制限ラベル、写真スキャン、バーコード検索にアップグレード。",
    comparePlans: "プランを比較", chooseDestination: "目的地を選択",
    previewCountries: "プレビュー：30以上の国から3か国", previewCountriesDesc: "完全ガイド、安全ブランド、オフラインアクセスを取得。",
    unlockGuides: "すべてのガイドをアンロック", unlockFull: "安全ブランド、ローカルヒント、オフラインモード",
    upgradeUnlock: "アンロックにアップグレード", getFullGuide: "完全ガイドを取得",
    analyzing: "分析中…", notSafe: "安全ではありません。2つのリスクを検出",
  },
  testimonials: { title: "間違いを犯せない旅行者に愛されています" },
  pricing: {
    title: "無料で始めましょう。飛ぶときにアップグレード。",
    subtitle: "月3枚永久無料。無制限は月€12.99から。",
    seePlans: "プランを見る", createAccount: "アカウント作成",
  },
  faq: { title: "よくある質問" },
  footer: {
    product: "製品", company: "会社", safety: "安全について",
    safetyText: "GlutenGoは翻訳ツールと情報を提供します。常にレストランスタッフに調理方法を確認してください。これは医療アドバイスではありません。",
    tagline: "グルテンフリーで世界を旅しよう、ストレスなしで。",
    copyright: "セリアック旅行者への思いを込めて。",
  },
  common: { openFeature: "機能を開く", lockedContent: "サブスクライバー限定" },
};

export const TRANSLATIONS: Record<LangCode, Translations> = {
  en, nl, fr, de, es, it, pt, ja,
  // Fallback to English for languages without full UI translation
  th: en, pl: en, ar: en, zh: en,
};
