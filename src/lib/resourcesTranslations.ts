import type { LangCode } from "./translations";

export type ResourcesLang = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  sectionTips: string; sectionTipsSub: string;
  sectionRights: string; sectionRightsSub: string;
  sectionSites: string; sectionSitesSub: string;
  sectionFacts: string; sectionFactsSub: string;
  ctaTitle: string; ctaSub: string; ctaPrimary: string; ctaSecondary: string;
  baggageTitle: string; baggageBadge: string; baggageContent: string;
  taxTitle: string; taxBadge: string; taxContent: string;
  insuranceTitle: string; insuranceBadge: string; insuranceContent: string;
  certTitle: string; certBadge: string; certContent: string;
  tips: { title: string; text: string }[];
  factsSource: string;
  sitesCatOrgs: string; sitesCatTravel: string; sitesCatScience: string;
};

const en: ResourcesLang = {
  heroBadge: "Your rights worldwide",
  heroTitle: "Rights you probably didn't know you had",
  heroSubtitle: "As a celiac patient you have more options than you think. From free extra baggage to tax benefits — worldwide.",
  sectionTips: "Travel tips & knowledge", sectionTipsSub: "Practical know-how for on the go",
  sectionRights: "Rights & benefits", sectionRightsSub: "Extra baggage, tax deductions and insurance worldwide",
  sectionSites: "Useful websites", sectionSitesSub: "Trusted sources for celiac disease and gluten-free travel",
  sectionFacts: "Did you know…", sectionFactsSub: "Interesting facts about celiac disease and gluten-free living",
  ctaTitle: "Ready for your trip?",
  ctaSub: "Generate your gluten-free translation card, find restaurants and browse our country guides — all in one app.",
  ctaPrimary: "Create a translation card", ctaSecondary: "Browse country guides",
  baggageTitle: "Medical food = free extra baggage",
  baggageBadge: "Aviation",
  baggageContent: `Most major airlines worldwide allow you to carry gluten-free food as a medical necessity, in addition to normal baggage limits. Request this when booking or through the airline's customer service.

What helps: a doctor's letter or diagnosis certificate (preferably in English), together with the AOECS gluten-free licence numbers of your products.`,
  taxTitle: "Tax deductions for extra celiac costs",
  taxBadge: "Financial",
  taxContent: `Many countries offer tax deductions or state reimbursements for the extra costs of gluten-free products, provided you have an official celiac diagnosis.

🇮🇹 Italy: Monthly state reimbursement of €100–140 for diagnosed patients.
🇬🇧 UK: Gluten-free staples available on NHS prescription.
🇧🇪 Belgium: Deduction via tax return as extraordinary illness costs (FOD Financiën).
🇳🇱 Netherlands: NCV publishes annual extra-cost amounts for the tax return.
🇦🇺 Australia: ATO allows medical expense deductions including special diet costs.
🇩🇪 Germany: Deductible as Krankheitskosten with proof of medical necessity.
🇫🇷 France: Partial reimbursement possible via AFDIAG and Social Security.
🇺🇸 USA: Medical deductions possible if costs exceed 7.5% of adjusted gross income.

Check with your national celiac association or a local tax adviser for the rules in your country.`,
  insuranceTitle: "Travel insurance for celiac disease",
  insuranceBadge: "Insurance",
  insuranceContent: `Standard travel insurance does not always cover celiac-related incidents. Always ask explicitly whether you are covered for: hospitalisation due to gluten contamination abroad, trip cancellation due to medical complications, and emergency repatriation.

Always declare celiac disease when taking out a policy. Insurers with good experience include Europ Assistance, Allianz Travel, AXA Travel and World Nomads.`,
  certTitle: "Medical certificate: always carry one",
  certBadge: "Document",
  certContent: `A doctor's certificate in English (and ideally in the local language too) is your best travel document. It helps with: access to special airline meals, extra baggage allowance for medical food, customs when carrying large quantities of gluten-free food, and medical care abroad.

Ask your GP for a letter stating your diagnosis, the date, the severity (celiac disease is an autoimmune disease) and confirmation that a gluten-free diet is medically necessary.`,
  tips: [
    { title: "Always order a special meal", text: "At most airlines you can request a GFML (Gluten Free Meal) 24–72 hours before departure via your booking. Free, and safer than the standard meal." },
    { title: "Call your hotel in advance", text: "Calling is better than emailing. Ask explicitly whether breakfast can be gluten-free, and whether there is a separate toaster or work surface. Confirm the day before arrival." },
    { title: "Find a local supermarket on day 1", text: "After arrival find the nearest supermarket and stock up on gluten-free basics. Rice cakes, fruit, nuts and yoghurt rescue many an emergency." },
    { title: "Download offline maps", text: "Download Google Maps offline for your destination. Search 'gluten free' or 'coeliac' — many restaurants tag themselves. No wifi needed." },
    { title: "Naturally gluten-free cuisines", text: "Japan (rice, fish), Mexico (corn tortillas), India (rice, lentils, dal), Thailand (rice with tamari) and Ethiopia (teff injera) are largely naturally gluten-free. Always ask about soy sauce and marinades." },
    { title: "Make an emergency plan", text: "Know the nearest hospital, learn to say 'allergic reaction' in the local language, and always carry an emergency snack. GlutenGo's Emergency Phrases help you say the right thing." },
    { title: "Alcohol: watch out", text: "Wine and spirits (whisky, potato vodka) are often safe. Regular beer contains gluten. Choose gluten-free beer or cider. Some liqueurs can also be problematic." },
    { title: "Bring digestive enzymes", text: "Gluten-digestive enzymes (such as GluteGuard or AN-PEP) do not protect completely, but can help as backup for minor contamination. Consult your doctor first." },
    { title: "Learn the local word for wheat", text: "Wheat in different languages: blé (FR), Weizen (DE), grano/frumento (IT), trigo (ES/PT), komugi/コムギ (JA), khao sali (TH). Know the word and you can read menus yourself." },
    { title: "Keep a food diary while travelling", text: "Note what you ate and where. If you have a reaction, you can quickly trace the cause — useful for both you and your doctor." },
  ],
  factsSource: "Source",
  sitesCatOrgs: "Celiac organisations", sitesCatTravel: "Travel & food", sitesCatScience: "Science & health",
};

const nl: ResourcesLang = {
  heroBadge: "Je rechten wereldwijd",
  heroTitle: "Rechten die je waarschijnlijk nog niet kent",
  heroSubtitle: "Als coeliakiepatiënt heb je meer mogelijkheden dan je denkt. Van gratis extra bagage tot belastingvoordelen — wereldwijd.",
  sectionTips: "Reiswetjes & tips", sectionTipsSub: "Praktische kennis voor onderweg",
  sectionRights: "Rechten & vergoedingen", sectionRightsSub: "Extra bagage, belastingvoordelen en verzekering wereldwijd",
  sectionSites: "Handige websites", sectionSitesSub: "Betrouwbare bronnen voor coeliakie en glutenvrij reizen",
  sectionFacts: "Wist je dat…", sectionFactsSub: "Interessante feiten over coeliakie en glutenvrij leven",
  ctaTitle: "Klaar voor je reis?",
  ctaSub: "Genereer je glutenvrij vertaalkaart, zoek restaurants en bekijk onze landengidsen, alles in één app.",
  ctaPrimary: "Maak een vertaalkaart", ctaSecondary: "Landengidsen bekijken",
  baggageTitle: "Medisch voedsel = gratis extra bagage",
  baggageBadge: "Luchtvaart",
  baggageContent: `De meeste grote luchtvaartmaatschappijen wereldwijd staan toe dat je glutenvrij voedsel meeneemt als medische noodzaak, bovenop de normale bagagelimieten. Vraag dit aan bij het boeken of via de klantenservice.

Bewijs dat helpt: een doktersattest of diagnosebrief (bij voorkeur in het Engels), samen met de AOECS glutenvrij licentienummers van je producten.`,
  taxTitle: "Belastingvoordeel op glutenvrije producten",
  taxBadge: "Financieel",
  taxContent: `Veel landen bieden belastingaftrek of staatsvergoeding voor de meerkosten van glutenvrije producten, als je een officiële coeliakie-diagnose hebt.

🇮🇹 Italië: Maandelijkse staatsvergoeding van €100–140 voor gediagnosticeerde patiënten.
🇬🇧 Verenigd Koninkrijk: Glutenvrije basisproducten op NHS-recept verkrijgbaar.
🇧🇪 België: Aftrek via belastingaangifte als buitengewone ziekte-uitgaven (FOD Financiën).
🇳🇱 Nederland: NCV publiceert jaarlijks de geldende meerkosten voor de belastingaangifte.
🇦🇺 Australië: ATO staat medische kostenaftrek toe, ook voor speciale dieetkosten.
🇩🇪 Duitsland: Aftrekbaar als Krankheitskosten met bewijs van medische noodzaak.
🇫🇷 Frankrijk: Gedeeltelijke vergoeding mogelijk via AFDIAG en sociale zekerheid.
🇺🇸 Verenigde Staten: Medische aftrek mogelijk als kosten meer dan 7,5% van het inkomen bedragen.

Neem contact op met de coeliakie-organisatie in jouw land of een belastingadviseur voor de specifieke regels bij jou.`,
  insuranceTitle: "Verzekering voor coeliakie op reis",
  insuranceBadge: "Verzekering",
  insuranceContent: `Standaard reisverzekeringen dekken niet altijd coeliakie-gerelateerde incidenten. Vraag altijd expliciet of je gedekt bent voor: ziekenhuisopname door glutenbesmetting in het buitenland, annulering door medische complicaties en repatriëring.

Meld coeliakie altijd bij het afsluiten van een polis. Verzekeraars met goede ervaring zijn Europ Assistance, Allianz Travel, AXA Travel en World Nomads.`,
  certTitle: "Medisch attest: altijd meenemen",
  certBadge: "Document",
  certContent: `Een doktersattest in het Engels (en liefst ook in de lokale taal) is je beste reisdocument. Het helpt bij: toegang tot speciale vliegtuigmaaltijden, extra bagageruimte voor medisch voedsel, douane bij grote hoeveelheden glutenvrij voedsel en medische hulp in het buitenland.

Vraag je huisarts om een brief met je diagnose, de datum, de ernst (coeliakie is een auto-immuunziekte) en bevestiging dat een glutenvrij dieet medisch noodzakelijk is.`,
  tips: [
    { title: "Bestel altijd een speciale maaltijd", text: "Bij de meeste luchtvaartmaatschappijen kun je 24–72u voor vertrek een GFML (Gluten Free Meal) bestellen via je boeking. Gratis en veiliger dan de standaardmaaltijd." },
    { title: "Bel je hotel altijd op voorhand", text: "Bellen is beter dan mailen. Vraag expliciet of het ontbijt glutenvrij kan, en of er een aparte broodrooster of werkoppervlak is. Bevestig de dag voor aankomst." },
    { title: "Vind een lokale supermarkt op dag 1", text: "Zoek direct na aankomst de dichtstbijzijnde supermarkt en sla glutenvrije basisproducten in. Rijstwafels, fruit, noten en yoghurt redden menige noodsituatie." },
    { title: "Download offline kaarten", text: "Download Google Maps offline voor je bestemming. Zoek op 'gluten free' of 'coeliac' — veel restaurants taggen zichzelf. Geen wifi nodig." },
    { title: "Landen met van nature glutenvrije keukens", text: "Japan (rijst, vis), Mexico (maïstortilla's), India (rijst, linzen), Thailand (rijst met tamari) en Ethiopië (teff-injera) zijn grotendeels van nature glutenvrij. Vraag altijd naar sojasaus en marinades." },
    { title: "Stel een noodplan op", text: "Ken het dichtstbijzijnde ziekenhuis, weet hoe je 'allergische reactie' zegt in de lokale taal, en heb altijd een noodsnack bij. GlutenGo's Noodfrases helpen je het juiste te zeggen." },
    { title: "Alcohol: let op", text: "Wijn en sterke drank (whisky, aardappelvodka) zijn vaak veilig. Gewoon bier bevat gluten. Kies glutenvrij bier of cider. Sommige likeur kan ook problematisch zijn." },
    { title: "Neem je eigen enzymen mee", text: "Gluten-digestieve enzymen (zoals GluteGuard of AN-PEP) bieden geen volledige bescherming, maar kunnen als back-up helpen bij kleine besmettingen. Raadpleeg eerst je arts." },
    { title: "Leer het lokale woord voor tarwe", text: "Tarwe in andere talen: blé (FR), Weizen (DE), grano/frumento (IT), trigo (ES/PT), komugi/コムギ (JA), khao sali (TH). Ken het woord en je kunt menu's zelf lezen." },
    { title: "Houd een eetdagboek bij op reis", text: "Noteer wat je gegeten hebt en waar. Bij een reactie kun je sneller achterhalen wat de oorzaak was, handig voor jezelf en je arts." },
  ],
  factsSource: "Bron",
  sitesCatOrgs: "Coeliakie organisaties", sitesCatTravel: "Reis & eten", sitesCatScience: "Wetenschap & gezondheid",
};

const fr: ResourcesLang = {
  heroBadge: "Vos droits dans le monde entier",
  heroTitle: "Des droits que vous ne connaissiez probablement pas",
  heroSubtitle: "En tant que patient cœliaque, vous avez plus d'options que vous ne le pensez. Des bagages supplémentaires gratuits aux avantages fiscaux, partout dans le monde.",
  sectionTips: "Conseils de voyage", sectionTipsSub: "Savoir-faire pratique pour la route",
  sectionRights: "Droits & avantages", sectionRightsSub: "Bagages supplémentaires, déductions fiscales et assurance dans le monde entier",
  sectionSites: "Sites utiles", sectionSitesSub: "Sources fiables pour la maladie cœliaque et les voyages sans gluten",
  sectionFacts: "Le saviez-vous…", sectionFactsSub: "Faits intéressants sur la maladie cœliaque et la vie sans gluten",
  ctaTitle: "Prêt pour votre voyage ?",
  ctaSub: "Générez votre carte de traduction sans gluten, trouvez des restaurants et consultez nos guides pays, tout en une seule appli.",
  ctaPrimary: "Créer une carte de traduction", ctaSecondary: "Voir les guides pays",
  baggageTitle: "Nourriture médicale = bagages supplémentaires gratuits",
  baggageBadge: "Aviation",
  baggageContent: `La plupart des grandes compagnies aériennes dans le monde permettent d'emporter des aliments sans gluten comme nécessité médicale, en plus des limites de bagages normales. Demandez-le lors de la réservation ou auprès du service client.

Ce qui aide: une lettre médicale ou un certificat de diagnostic (de préférence en anglais), avec les numéros de licence AOECS de vos produits.`,
  taxTitle: "Déductions fiscales pour les coûts supplémentaires",
  taxBadge: "Financier",
  taxContent: `De nombreux pays offrent des déductions fiscales ou des remboursements pour les coûts supplémentaires des produits sans gluten, sous réserve d'un diagnostic officiel de maladie cœliaque.

🇮🇹 Italie: Remboursement mensuel de l'État de 100–140€.
🇬🇧 Royaume-Uni: Produits de base sans gluten disponibles sur ordonnance NHS.
🇧🇪 Belgique: Déduction via déclaration fiscale comme frais extraordinaires de maladie (FOD Financiën).
🇳🇱 Pays-Bas: La NCV publie annuellement les montants de surcoûts pour la déclaration fiscale.
🇦🇺 Australie: L'ATO permet des déductions pour frais médicaux, y compris les régimes spéciaux.
🇩🇪 Allemagne: Déductible en tant que Krankheitskosten avec preuve de nécessité médicale.
🇫🇷 France: Remboursement partiel possible via l'AFDIAG et la Sécurité sociale.
🇺🇸 États-Unis: Déductions médicales possibles si les coûts dépassent 7,5% du revenu brut ajusté.

Contactez l'association cœliaque de votre pays ou un conseiller fiscal local pour connaître les règles applicables.`,
  insuranceTitle: "Assurance voyage pour la maladie cœliaque",
  insuranceBadge: "Assurance",
  insuranceContent: `Les assurances voyage standard ne couvrent pas toujours les incidents liés à la maladie cœliaque. Demandez toujours explicitement si vous êtes couvert pour: l'hospitalisation due à une contamination au gluten à l'étranger, l'annulation pour complications médicales et le rapatriement d'urgence.

Déclarez toujours la maladie cœliaque lors de la souscription. Les assureurs expérimentés comprennent Europ Assistance, Allianz Travel, AXA Travel et World Nomads.`,
  certTitle: "Certificat médical: toujours l'emporter",
  certBadge: "Document",
  certContent: `Un certificat médical en anglais (et idéalement aussi en langue locale) est votre meilleur document de voyage. Il aide pour: l'accès aux repas spéciaux en avion, les bagages supplémentaires pour aliments médicaux, la douane avec de grandes quantités d'aliments sans gluten et les soins médicaux à l'étranger.

Demandez à votre médecin une lettre indiquant votre diagnostic, la date, la gravité (la maladie cœliaque est une maladie auto-immune) et la confirmation qu'un régime sans gluten est médicalement nécessaire.`,
  tips: [
    { title: "Commandez toujours un repas spécial", text: "La plupart des compagnies aériennes permettent de commander un GFML 24–72h avant le départ via votre réservation. Gratuit et plus sûr que le repas standard." },
    { title: "Appelez votre hôtel à l'avance", text: "L'appel est préférable à l'e-mail. Demandez si le petit-déjeuner peut être sans gluten et s'il y a un grille-pain séparé. Confirmez la veille de l'arrivée." },
    { title: "Trouvez un supermarché dès le jour 1", text: "À l'arrivée, trouvez le supermarché le plus proche et faites le plein de produits sans gluten de base. Galettes de riz, fruits et noix sauvent souvent la mise." },
    { title: "Téléchargez des cartes hors ligne", text: "Téléchargez Google Maps hors ligne. Recherchez 'sans gluten' ou 'cœliaque' — de nombreux restaurants se taguent. Pas de wifi nécessaire." },
    { title: "Cuisines naturellement sans gluten", text: "Japon (riz, poisson), Mexique (tortillas de maïs), Inde (riz, lentilles), Thaïlande (riz avec tamari) et Éthiopie (injera de teff) sont largement sans gluten. Vérifiez toujours la sauce soja." },
    { title: "Établissez un plan d'urgence", text: "Connaissez l'hôpital le plus proche, sachez dire 'réaction allergique' en langue locale et ayez une collation d'urgence. Les Phrases d'urgence GlutenGo vous aident." },
    { title: "Alcool: attention", text: "Le vin et les spiritueux (whisky, vodka de pomme de terre) sont souvent sûrs. La bière ordinaire contient du gluten. Choisissez bière ou cidre sans gluten." },
    { title: "Emportez des enzymes digestives", text: "Les enzymes digestives du gluten (GluteGuard, AN-PEP) n'offrent pas de protection complète, mais peuvent aider en cas de légère contamination. Consultez votre médecin." },
    { title: "Apprenez le mot local pour le blé", text: "Blé dans d'autres langues: Weizen (DE), grano (IT), trigo (ES/PT), komugi (JA). Connaître le mot vous permet de lire les menus vous-même." },
    { title: "Tenez un journal alimentaire", text: "Notez ce que vous avez mangé et où. En cas de réaction, vous pouvez rapidement identifier la cause — utile pour vous et votre médecin." },
  ],
  factsSource: "Source",
  sitesCatOrgs: "Associations cœliaques", sitesCatTravel: "Voyage & alimentation", sitesCatScience: "Science & santé",
};

const de: ResourcesLang = {
  heroBadge: "Ihre Rechte weltweit",
  heroTitle: "Rechte, die Sie wahrscheinlich noch nicht kennen",
  heroSubtitle: "Als Zöliakie-Patient haben Sie mehr Möglichkeiten, als Sie denken. Von kostenlosem Freigepäck bis Steuervorteilen — weltweit.",
  sectionTips: "Reisetipps & Wissen", sectionTipsSub: "Praktisches Know-how für unterwegs",
  sectionRights: "Rechte & Vergünstigungen", sectionRightsSub: "Freigepäck, Steuerabzüge und Versicherung weltweit",
  sectionSites: "Nützliche Websites", sectionSitesSub: "Vertrauenswürdige Quellen für Zöliakie und glutenfreies Reisen",
  sectionFacts: "Wussten Sie…", sectionFactsSub: "Interessante Fakten über Zöliakie und glutenfreies Leben",
  ctaTitle: "Bereit für Ihre Reise?",
  ctaSub: "Erstellen Sie Ihre glutenfreie Übersetzungskarte, finden Sie Restaurants und sehen Sie unsere Länderführer — alles in einer App.",
  ctaPrimary: "Übersetzungskarte erstellen", ctaSecondary: "Länderführer ansehen",
  baggageTitle: "Medizinisches Essen = kostenloses Freigepäck",
  baggageBadge: "Luftfahrt",
  baggageContent: `Die meisten großen Fluggesellschaften weltweit erlauben es, glutenfreie Lebensmittel als medizinische Notwendigkeit mitzunehmen, zusätzlich zu den normalen Gepäckgrenzen. Fragen Sie beim Buchen oder über den Kundenservice.

Was hilft: ein Arztschreiben oder Diagnosezeugnis (vorzugsweise auf Englisch), zusammen mit den AOECS-Lizenznummern Ihrer Produkte.`,
  taxTitle: "Steuerabzüge für Mehrkosten bei Zöliakie",
  taxBadge: "Finanziell",
  taxContent: `Viele Länder bieten Steuerabzüge oder staatliche Erstattungen für die Mehrkosten glutenfreier Produkte, sofern eine offizielle Zöliakie-Diagnose vorliegt.

🇮🇹 Italien: Monatliche Staatserstattung von 100–140€ für diagnostizierte Patienten.
🇬🇧 Vereinigtes Königreich: Glutenfreie Grundnahrungsmittel auf NHS-Rezept erhältlich.
🇧🇪 Belgien: Abzug über Steuererklärung als außergewöhnliche Krankheitskosten (FOD Financiën).
🇳🇱 Niederlande: Die NCV veröffentlicht jährlich die geltenden Mehrkosten für die Steuererklärung.
🇦🇺 Australien: Das ATO erlaubt Abzüge für Krankheitskosten einschließlich Sonderdiät.
🇩🇪 Deutschland: Als Krankheitskosten absetzbar mit Nachweis medizinischer Notwendigkeit.
🇫🇷 Frankreich: Teilerstattung über AFDIAG und Sozialversicherung möglich.
🇺🇸 USA: Medizinische Abzüge möglich, wenn Kosten 7,5% des Bruttoeinkommens übersteigen.

Wenden Sie sich an Ihre nationale Zöliakie-Vereinigung oder einen Steuerberater für die Regeln in Ihrem Land.`,
  insuranceTitle: "Reiseversicherung bei Zöliakie",
  insuranceBadge: "Versicherung",
  insuranceContent: `Standard-Reiseversicherungen decken nicht immer zöliakiebezogene Vorfälle ab. Fragen Sie immer explizit, ob Sie abgedeckt sind für: Krankenhausaufenthalt durch Glutenkontamination im Ausland, Stornierung wegen medizinischer Komplikationen und Rückholung.

Geben Sie Zöliakie immer beim Abschluss einer Police an. Versicherer mit guter Erfahrung: Europ Assistance, Allianz Travel, AXA Travel und World Nomads.`,
  certTitle: "Ärztliches Attest: immer dabei haben",
  certBadge: "Dokument",
  certContent: `Ein Arztzeugnis auf Englisch (und idealerweise auch in der Landessprache) ist Ihr bestes Reisedokument. Es hilft bei: Zugang zu Sondermahlzeiten im Flugzeug, zusätzlichem Gepäck für medizinische Lebensmittel, Zoll bei großen Mengen glutenfreier Lebensmittel und medizinischer Versorgung im Ausland.

Bitten Sie Ihren Arzt um einen Brief mit Ihrer Diagnose, dem Datum, der Schwere (Zöliakie ist eine Autoimmunerkrankung) und der Bestätigung, dass eine glutenfreie Ernährung medizinisch notwendig ist.`,
  tips: [
    { title: "Immer ein Sonderessen bestellen", text: "Bei den meisten Airlines können Sie 24–72h vor Abflug ein GFML (Gluten Free Meal) über Ihre Buchung bestellen. Kostenlos und sicherer als die Standardmahlzeit." },
    { title: "Hotel immer vorher anrufen", text: "Anrufen ist besser als mailen. Fragen Sie explizit, ob das Frühstück glutenfrei sein kann und ob es einen separaten Toaster gibt. Bestätigen Sie am Tag vor Ankunft." },
    { title: "Lokalen Supermarkt am Tag 1 finden", text: "Finden Sie nach der Ankunft den nächsten Supermarkt und kaufen Sie glutenfreie Grundnahrungsmittel ein. Reiswaffeln, Obst, Nüsse und Joghurt helfen in Notfällen." },
    { title: "Offline-Karten herunterladen", text: "Laden Sie Google Maps offline für Ihr Reiseziel herunter. Suchen Sie nach 'gluten free' oder 'coeliac' — viele Restaurants taggen sich selbst. Kein WLAN nötig." },
    { title: "Natürlich glutenfreie Küchen", text: "Japan (Reis, Fisch), Mexiko (Maistortillas), Indien (Reis, Linsen), Thailand (Reis mit Tamari) und Äthiopien (Teff-Injera) sind größtenteils von Natur aus glutenfrei. Fragen Sie immer nach Sojasoße." },
    { title: "Notfallplan aufstellen", text: "Kennen Sie das nächste Krankenhaus, wissen Sie, wie man 'allergische Reaktion' in der Landessprache sagt, und haben Sie immer einen Notfallsnack dabei." },
    { title: "Alkohol: Vorsicht", text: "Wein und Spirituosen (Whisky, Kartoffelvodka) sind oft sicher. Normales Bier enthält Gluten. Wählen Sie glutenfreies Bier oder Cider. Einige Liköre können auch problematisch sein." },
    { title: "Verdauungsenzyme mitnehmen", text: "Gluten-Verdauungsenzyme (GluteGuard, AN-PEP) schützen nicht vollständig, können aber bei kleinen Verunreinigungen als Backup helfen. Fragen Sie zuerst Ihren Arzt." },
    { title: "Lokales Wort für Weizen lernen", text: "Weizen in anderen Sprachen: blé (FR), grano/frumento (IT), trigo (ES/PT), komugi (JA). Kennen Sie das Wort, können Sie Speisekarten selbst lesen." },
    { title: "Ernährungstagebuch auf Reisen", text: "Notieren Sie, was und wo Sie gegessen haben. Bei einer Reaktion können Sie die Ursache schnell zurückverfolgen — nützlich für Sie und Ihren Arzt." },
  ],
  factsSource: "Quelle",
  sitesCatOrgs: "Zöliakie-Organisationen", sitesCatTravel: "Reise & Essen", sitesCatScience: "Wissenschaft & Gesundheit",
};

const es: ResourcesLang = {
  heroBadge: "Tus derechos en todo el mundo",
  heroTitle: "Derechos que probablemente no conocías",
  heroSubtitle: "Como paciente celíaco tienes más opciones de las que crees. Desde equipaje adicional gratuito hasta ventajas fiscales, en todo el mundo.",
  sectionTips: "Consejos de viaje", sectionTipsSub: "Conocimiento práctico para el camino",
  sectionRights: "Derechos y beneficios", sectionRightsSub: "Equipaje extra, deducciones fiscales y seguro en todo el mundo",
  sectionSites: "Sitios útiles", sectionSitesSub: "Fuentes fiables para la celiaquía y los viajes sin gluten",
  sectionFacts: "¿Sabías que…", sectionFactsSub: "Datos interesantes sobre la celiaquía y la vida sin gluten",
  ctaTitle: "¿Listo para tu viaje?",
  ctaSub: "Genera tu tarjeta de traducción sin gluten, encuentra restaurantes y consulta nuestras guías de países, todo en una sola app.",
  ctaPrimary: "Crear tarjeta de traducción", ctaSecondary: "Ver guías de países",
  baggageTitle: "Comida médica = equipaje adicional gratuito",
  baggageBadge: "Aviación",
  baggageContent: `La mayoría de las grandes aerolíneas en todo el mundo permiten llevar alimentos sin gluten como necesidad médica, además de los límites de equipaje normales. Solicítalo al reservar o a través del servicio de atención al cliente.

Lo que ayuda: una carta médica o certificado de diagnóstico (preferiblemente en inglés), junto con los números de licencia AOECS de tus productos.`,
  taxTitle: "Deducciones fiscales por costes adicionales de celiaquía",
  taxBadge: "Financiero",
  taxContent: `Muchos países ofrecen deducciones fiscales o reembolsos estatales por los costes adicionales de los productos sin gluten, con un diagnóstico oficial de celiaquía.

🇮🇹 Italia: Reembolso estatal mensual de 100–140€ para pacientes diagnosticados.
🇬🇧 Reino Unido: Alimentos básicos sin gluten disponibles con receta NHS.
🇧🇪 Bélgica: Deducción mediante declaración de la renta como gastos extraordinarios de enfermedad (FOD Financiën).
🇳🇱 Países Bajos: La NCV publica anualmente los costes adicionales para la declaración fiscal.
🇦🇺 Australia: La ATO permite deducciones por gastos médicos incluyendo dietas especiales.
🇩🇪 Alemania: Deducible como Krankheitskosten con prueba de necesidad médica.
🇫🇷 Francia: Reembolso parcial posible a través de AFDIAG y la Seguridad Social.
🇺🇸 EE. UU.: Deducciones médicas posibles si los costes superan el 7,5% de la renta bruta ajustada.

Contacta con la asociación celíaca de tu país o un asesor fiscal local para conocer las normas aplicables.`,
  insuranceTitle: "Seguro de viaje para la celiaquía",
  insuranceBadge: "Seguro",
  insuranceContent: `Los seguros de viaje estándar no siempre cubren incidentes relacionados con la celiaquía. Pregunta siempre explícitamente si estás cubierto para: hospitalización por contaminación con gluten en el extranjero, cancelación por complicaciones médicas y repatriación de emergencia.

Declara siempre la celiaquía al contratar un seguro. Aseguradoras con buena experiencia: Europ Assistance, Allianz Travel, AXA Travel y World Nomads.`,
  certTitle: "Certificado médico: llévalo siempre",
  certBadge: "Documento",
  certContent: `Un certificado médico en inglés (e idealmente también en el idioma local) es tu mejor documento de viaje. Ayuda con: acceso a comidas especiales en el avión, equipaje adicional para alimentos médicos, aduanas con grandes cantidades de alimentos sin gluten y atención médica en el extranjero.

Pide a tu médico una carta con tu diagnóstico, la fecha, la gravedad (la celiaquía es una enfermedad autoinmune) y la confirmación de que una dieta sin gluten es médicamente necesaria.`,
  tips: [
    { title: "Pide siempre una comida especial", text: "En la mayoría de aerolíneas puedes pedir un GFML 24–72h antes de la salida a través de tu reserva. Gratis y más seguro que la comida estándar." },
    { title: "Llama siempre al hotel con antelación", text: "Llamar es mejor que enviar un correo. Pregunta si el desayuno puede ser sin gluten y si hay tostadora separada. Confirma el día anterior a la llegada." },
    { title: "Encuentra un supermercado el día 1", text: "Tras la llegada, encuentra el supermercado más cercano y abastécete de básicos sin gluten. Tortitas de arroz, fruta, frutos secos y yogur salvan muchas situaciones." },
    { title: "Descarga mapas sin conexión", text: "Descarga Google Maps sin conexión para tu destino. Busca 'gluten free' o 'coeliac' — muchos restaurantes se etiquetan. No necesitas wifi." },
    { title: "Cocinas naturalmente sin gluten", text: "Japón (arroz, pescado), México (tortillas de maíz), India (arroz, lentejas), Tailandia (arroz con tamari) y Etiopía (injera de teff) son en gran parte sin gluten. Pregunta siempre por la salsa de soja." },
    { title: "Prepara un plan de emergencia", text: "Conoce el hospital más cercano, aprende a decir 'reacción alérgica' en el idioma local y lleva siempre un snack de emergencia." },
    { title: "Alcohol: precaución", text: "El vino y los licores fuertes (whisky, vodka de patata) suelen ser seguros. La cerveza normal contiene gluten. Elige cerveza sin gluten o sidra." },
    { title: "Lleva enzimas digestivas", text: "Las enzimas digestivas del gluten (GluteGuard, AN-PEP) no protegen completamente, pero pueden ayudar como respaldo ante pequeñas contaminaciones. Consulta a tu médico." },
    { title: "Aprende la palabra local para el trigo", text: "Trigo en otros idiomas: blé (FR), Weizen (DE), grano (IT), komugi (JA). Conocer la palabra te permite leer los menús por ti mismo." },
    { title: "Lleva un diario alimentario al viajar", text: "Anota qué has comido y dónde. Ante una reacción, puedes identificar rápidamente la causa — útil para ti y para tu médico." },
  ],
  factsSource: "Fuente",
  sitesCatOrgs: "Organizaciones celíacas", sitesCatTravel: "Viaje y alimentación", sitesCatScience: "Ciencia y salud",
};

const it: ResourcesLang = {
  heroBadge: "I tuoi diritti nel mondo",
  heroTitle: "Diritti che probabilmente non conoscevi",
  heroSubtitle: "Come paziente celiaco hai più possibilità di quanto pensi. Dal bagaglio extra gratuito ai vantaggi fiscali, in tutto il mondo.",
  sectionTips: "Consigli di viaggio", sectionTipsSub: "Conoscenze pratiche per la strada",
  sectionRights: "Diritti e agevolazioni", sectionRightsSub: "Bagaglio extra, detrazioni fiscali e assicurazione nel mondo",
  sectionSites: "Siti utili", sectionSitesSub: "Fonti affidabili per la celiachia e i viaggi senza glutine",
  sectionFacts: "Lo sapevi…", sectionFactsSub: "Fatti interessanti sulla celiachia e la vita senza glutine",
  ctaTitle: "Pronto per il tuo viaggio?",
  ctaSub: "Genera la tua carta di traduzione senza glutine, trova ristoranti e consulta le nostre guide paese, tutto in un'unica app.",
  ctaPrimary: "Crea una carta di traduzione", ctaSecondary: "Vedi le guide paese",
  baggageTitle: "Cibo medico = bagaglio extra gratuito",
  baggageBadge: "Aviazione",
  baggageContent: `La maggior parte delle grandi compagnie aeree mondiali consente di portare alimenti senza glutine come necessità medica, in aggiunta ai normali limiti del bagaglio. Richiedilo alla prenotazione o tramite il servizio clienti.

Cosa aiuta: una lettera medica o certificato di diagnosi (preferibilmente in inglese), insieme ai numeri di licenza AOECS dei tuoi prodotti.`,
  taxTitle: "Detrazioni fiscali per i costi aggiuntivi da celiachia",
  taxBadge: "Finanziario",
  taxContent: `Molti paesi offrono detrazioni fiscali o rimborsi statali per i costi aggiuntivi dei prodotti senza glutine, a condizione di avere una diagnosi ufficiale di celiachia.

🇮🇹 Italia: Rimborso mensile statale di 100–140€ per i pazienti diagnosticati.
🇬🇧 Regno Unito: Alimenti base senza glutine disponibili su prescrizione NHS.
🇧🇪 Belgio: Detrazione tramite dichiarazione dei redditi come spese straordinarie di malattia (FOD Financiën).
🇳🇱 Paesi Bassi: La NCV pubblica annualmente gli importi aggiuntivi per la dichiarazione fiscale.
🇦🇺 Australia: L'ATO consente deduzioni per spese mediche incluse le diete speciali.
🇩🇪 Germania: Deducibile come Krankheitskosten con prova di necessità medica.
🇫🇷 Francia: Rimborso parziale possibile tramite AFDIAG e previdenza sociale.
🇺🇸 USA: Deduzioni mediche possibili se i costi superano il 7,5% del reddito lordo rettificato.

Contatta l'associazione celiaca del tuo paese o un consulente fiscale locale per le regole applicabili.`,
  insuranceTitle: "Assicurazione di viaggio per la celiachia",
  insuranceBadge: "Assicurazione",
  insuranceContent: `Le assicurazioni di viaggio standard non coprono sempre gli incidenti legati alla celiachia. Chiedi sempre esplicitamente se sei coperto per: ricovero ospedaliero a causa di contaminazione da glutine all'estero, cancellazione per complicazioni mediche e rimpatrio d'emergenza.

Dichiara sempre la celiachia al momento di stipulare una polizza. Assicuratori con buona esperienza: Europ Assistance, Allianz Travel, AXA Travel e World Nomads.`,
  certTitle: "Certificato medico: portalo sempre con te",
  certBadge: "Documento",
  certContent: `Un certificato medico in inglese (e idealmente anche nella lingua locale) è il tuo miglior documento di viaggio. Aiuta con: accesso ai pasti speciali in aereo, bagaglio extra per alimenti medici, dogana con grandi quantità di alimenti senza glutine e assistenza medica all'estero.

Chiedi al tuo medico una lettera con la diagnosi, la data, la gravità (la celiachia è una malattia autoimmune) e la conferma che una dieta senza glutine è medicalmente necessaria.`,
  tips: [
    { title: "Ordina sempre un pasto speciale", text: "La maggior parte delle compagnie aeree ti permette di ordinare un GFML 24–72h prima della partenza tramite la tua prenotazione. Gratuito e più sicuro del pasto standard." },
    { title: "Chiama sempre l'hotel in anticipo", text: "Telefonare è meglio che inviare una mail. Chiedi esplicitamente se la colazione può essere senza glutine e se c'è un tostapane separato. Conferma il giorno prima dell'arrivo." },
    { title: "Trova un supermercato locale il giorno 1", text: "All'arrivo, trova il supermercato più vicino e rifornisciti di prodotti senza glutine di base. Gallette di riso, frutta, noci e yogurt salvano molte situazioni." },
    { title: "Scarica mappe offline", text: "Scarica Google Maps offline per la tua destinazione. Cerca 'senza glutine' o 'coeliac' — molti ristoranti si taggano. Nessun wifi necessario." },
    { title: "Cucine naturalmente senza glutine", text: "Giappone (riso, pesce), Messico (tortillas di mais), India (riso, lenticchie), Tailandia (riso con tamari) ed Etiopia (injera di teff) sono in gran parte naturalmente senza glutine." },
    { title: "Prepara un piano d'emergenza", text: "Conosci l'ospedale più vicino, impara a dire 'reazione allergica' nella lingua locale e porta sempre uno spuntino d'emergenza." },
    { title: "Alcol: attenzione", text: "Vino e superalcolici (whisky, vodka di patate) sono spesso sicuri. La birra normale contiene glutine. Scegli birra senza glutine o sidro." },
    { title: "Porta enzimi digestivi", text: "Gli enzimi digestivi del glutine (GluteGuard, AN-PEP) non proteggono completamente, ma possono aiutare come backup per piccole contaminazioni. Consulta prima il tuo medico." },
    { title: "Impara la parola locale per il grano", text: "Grano in altre lingue: blé (FR), Weizen (DE), trigo (ES/PT), komugi (JA). Conoscere la parola ti permette di leggere i menu da solo." },
    { title: "Tieni un diario alimentare in viaggio", text: "Annota cosa hai mangiato e dove. In caso di reazione, puoi risalire rapidamente alla causa — utile per te e per il tuo medico." },
  ],
  factsSource: "Fonte",
  sitesCatOrgs: "Associazioni celiache", sitesCatTravel: "Viaggio e cibo", sitesCatScience: "Scienza e salute",
};

const pt: ResourcesLang = {
  heroBadge: "Os seus direitos no mundo todo",
  heroTitle: "Direitos que provavelmente não conhecia",
  heroSubtitle: "Como paciente celíaco tem mais opções do que pensa. Desde bagagem extra gratuita a benefícios fiscais, em todo o mundo.",
  sectionTips: "Dicas de viagem", sectionTipsSub: "Conhecimento prático para a estrada",
  sectionRights: "Direitos e benefícios", sectionRightsSub: "Bagagem extra, deduções fiscais e seguro em todo o mundo",
  sectionSites: "Sites úteis", sectionSitesSub: "Fontes confiáveis para doença celíaca e viagens sem glúten",
  sectionFacts: "Sabia que…", sectionFactsSub: "Factos interessantes sobre a doença celíaca e a vida sem glúten",
  ctaTitle: "Pronto para a sua viagem?",
  ctaSub: "Gere o seu cartão de tradução sem glúten, encontre restaurantes e consulte os nossos guias de países, tudo numa só app.",
  ctaPrimary: "Criar cartão de tradução", ctaSecondary: "Ver guias de países",
  baggageTitle: "Comida médica = bagagem extra gratuita",
  baggageBadge: "Aviação",
  baggageContent: `A maioria das grandes companhias aéreas em todo o mundo permite levar alimentos sem glúten como necessidade médica, além dos limites normais de bagagem. Solicite ao fazer a reserva ou através do serviço ao cliente.

O que ajuda: uma carta médica ou certificado de diagnóstico (de preferência em inglês), com os números de licença AOECS dos seus produtos.`,
  taxTitle: "Deduções fiscais pelos custos adicionais de celíacos",
  taxBadge: "Financeiro",
  taxContent: `Muitos países oferecem deduções fiscais ou reembolsos estatais pelos custos adicionais de produtos sem glúten, mediante diagnóstico oficial de doença celíaca.

🇮🇹 Itália: Reembolso mensal do Estado de 100–140€ para pacientes diagnosticados.
🇬🇧 Reino Unido: Alimentos básicos sem glúten disponíveis em receita médica NHS.
🇧🇪 Bélgica: Dedução via declaração fiscal como despesas extraordinárias de doença (FOD Financiën).
🇳🇱 Países Baixos: A NCV publica anualmente os valores de custos adicionais para a declaração fiscal.
🇦🇺 Austrália: A ATO permite deduções de despesas médicas incluindo dietas especiais.
🇩🇪 Alemanha: Dedutível como Krankheitskosten com prova de necessidade médica.
🇫🇷 França: Reembolso parcial possível via AFDIAG e Segurança Social.
🇺🇸 EUA: Deduções médicas possíveis se os custos excederem 7,5% do rendimento bruto ajustado.

Contacte a associação celíaca do seu país ou um consultor fiscal local para as regras aplicáveis.`,
  insuranceTitle: "Seguro de viagem para a doença celíaca",
  insuranceBadge: "Seguro",
  insuranceContent: `Os seguros de viagem padrão nem sempre cobrem incidentes relacionados com a doença celíaca. Pergunte sempre explicitamente se está coberto para: hospitalização por contaminação com glúten no estrangeiro, cancelamento por complicações médicas e repatriamento de emergência.

Declare sempre a doença celíaca ao contratar um seguro. Seguradoras com boa experiência: Europ Assistance, Allianz Travel, AXA Travel e World Nomads.`,
  certTitle: "Certificado médico: leve-o sempre consigo",
  certBadge: "Documento",
  certContent: `Um certificado médico em inglês (e idealmente também no idioma local) é o seu melhor documento de viagem. Ajuda com: acesso a refeições especiais no avião, bagagem extra para alimentos médicos, alfândega com grandes quantidades de alimentos sem glúten e cuidados médicos no estrangeiro.

Peça ao seu médico uma carta com o diagnóstico, a data, a gravidade (a doença celíaca é uma doença autoimune) e confirmação de que uma dieta sem glúten é medicamente necessária.`,
  tips: [
    { title: "Peça sempre uma refeição especial", text: "Na maioria das companhias aéreas pode pedir um GFML 24–72h antes da partida via reserva. Gratuito e mais seguro que a refeição padrão." },
    { title: "Ligue sempre ao hotel antecipadamente", text: "Ligar é melhor que enviar e-mail. Pergunte se o pequeno-almoço pode ser sem glúten e se há torradeira separada. Confirme no dia anterior à chegada." },
    { title: "Encontre um supermercado no dia 1", text: "À chegada, encontre o supermercado mais próximo e abasteça-se de básicos sem glúten. Bolacha de arroz, fruta, nozes e iogurte salvam muitas situações." },
    { title: "Descarregue mapas offline", text: "Descarregue o Google Maps offline para o seu destino. Pesquise 'gluten free' ou 'coeliac' — muitos restaurantes identificam-se. Não precisa de wifi." },
    { title: "Cozinhas naturalmente sem glúten", text: "Japão (arroz, peixe), México (tortilhas de milho), Índia (arroz, lentilhas), Tailândia (arroz com tamari) e Etiópia (injera de teff) são em grande parte naturalmente sem glúten." },
    { title: "Prepare um plano de emergência", text: "Conheça o hospital mais próximo, aprenda a dizer 'reação alérgica' no idioma local e leve sempre um lanche de emergência." },
    { title: "Álcool: atenção", text: "Vinho e bebidas espirituosas (whisky, vodka de batata) são frequentemente seguros. A cerveja normal contém glúten. Escolha cerveja sem glúten ou sidra." },
    { title: "Leve enzimas digestivas", text: "As enzimas digestivas do glúten (GluteGuard, AN-PEP) não protegem completamente, mas podem ajudar como apoio em pequenas contaminações. Consulte primeiro o seu médico." },
    { title: "Aprenda a palavra local para trigo", text: "Trigo noutros idiomas: blé (FR), Weizen (DE), grano (IT), komugi (JA). Conhecer a palavra permite-lhe ler as ementas sozinho." },
    { title: "Mantenha um diário alimentar em viagem", text: "Registe o que comeu e onde. Em caso de reação, pode identificar rapidamente a causa — útil para si e para o seu médico." },
  ],
  factsSource: "Fonte",
  sitesCatOrgs: "Associações celíacas", sitesCatTravel: "Viagem e alimentação", sitesCatScience: "Ciência e saúde",
};

const ja: ResourcesLang = {
  heroBadge: "世界中でのあなたの権利",
  heroTitle: "知らなかったかもしれない権利",
  heroSubtitle: "セリアック病患者として、あなたは思っている以上の選択肢があります。無料の追加荷物から税制優遇まで、世界中で。",
  sectionTips: "旅のヒントと知識", sectionTipsSub: "旅行中の実践的なノウハウ",
  sectionRights: "権利と特典", sectionRightsSub: "追加荷物、税控除、世界中の保険",
  sectionSites: "便利なウェブサイト", sectionSitesSub: "セリアック病とグルテンフリー旅行の信頼できる情報源",
  sectionFacts: "ご存じでしたか…", sectionFactsSub: "セリアック病とグルテンフリー生活に関する興味深い事実",
  ctaTitle: "旅の準備はできていますか？",
  ctaSub: "グルテンフリー翻訳カードを作成し、レストランを探し、国別ガイドを確認。すべて一つのアプリで。",
  ctaPrimary: "翻訳カードを作成", ctaSecondary: "国別ガイドを見る",
  baggageTitle: "医療食品 = 無料の追加荷物",
  baggageBadge: "航空",
  baggageContent: `世界中のほとんどの大手航空会社は、通常の手荷物制限に加えて、グルテンフリー食品を医療的必要性として持ち込むことを許可しています。予約時または航空会社のカスタマーサービスを通じてリクエストしてください。

役立つもの：医師の手紙または診断書（できれば英語で）とAOECS認定ライセンス番号。`,
  taxTitle: "セリアック病の追加費用への税控除",
  taxBadge: "財務",
  taxContent: `多くの国では、公式なセリアック病の診断を条件として、グルテンフリー製品の追加費用に対する税控除や国家補償を提供しています。

🇮🇹 イタリア：診断患者への月額100〜140€の国家補償。
🇬🇧 英国：NHS処方でグルテンフリーの基本食品が入手可能。
🇧🇪 ベルギー：異常な疾病費用として確定申告で控除（FOD Financiën）。
🇳🇱 オランダ：NCVが毎年確定申告用の追加費用額を発表。
🇦🇺 オーストラリア：ATOが特別食事を含む医療費控除を認可。
🇩🇪 ドイツ：医療必要性の証明でKrankheitskostenとして控除可能。
🇫🇷 フランス：AFDIAGと社会保障を通じて一部補償が可能。
🇺🇸 米国：費用が調整総所得の7.5%を超える場合、医療控除が可能。

詳細はお住まいの国のセリアック病協会または税理士にご相談ください。`,
  insuranceTitle: "セリアック病の旅行保険",
  insuranceBadge: "保険",
  insuranceContent: `標準的な旅行保険は、セリアック病関連の事故を常にカバーするわけではありません。以下についてカバーされているか必ず確認してください：海外でのグルテン汚染による入院、医療的合併症による旅行キャンセル、緊急帰国。

保険加入時は常にセリアック病を申告してください。経験豊富な保険会社：Europ Assistance、Allianz Travel、AXA Travel、World Nomads。`,
  certTitle: "診断書：常に携帯する",
  certBadge: "書類",
  certContent: `英語の医師証明書（できれば現地語でも）は最良の旅行書類です。特別な機内食へのアクセス、医療食品のための追加手荷物、大量のグルテンフリー食品の税関申告、海外での医療ケアに役立ちます。

主治医に、診断名、日付、重症度（セリアック病は自己免疫疾患）、グルテンフリーダイエットが医療的に必要であることを記載した手紙を依頼してください。`,
  tips: [
    { title: "特別食を必ず注文する", text: "ほとんどの航空会社では、出発の24〜72時間前にGFML（グルテンフリーミール）を予約から注文できます。無料で標準食より安全です。" },
    { title: "ホテルには必ず事前に電話する", text: "メールより電話が効果的です。朝食がグルテンフリー対応できるか、別のトースターがあるかを明示的に確認してください。到着前日にも確認しましょう。" },
    { title: "初日に地元のスーパーを見つける", text: "到着後すぐに最寄りのスーパーマーケットを見つけ、グルテンフリーの基本食品を購入してください。ライスケーキ、果物、ナッツ、ヨーグルトが緊急時に役立ちます。" },
    { title: "オフラインマップをダウンロードする", text: "目的地のGoogleマップをオフラインでダウンロードしてください。'gluten free'や'coeliac'で検索するとレストランが見つかります。Wi-Fi不要。" },
    { title: "自然にグルテンフリーな料理", text: "日本（米、魚）、メキシコ（コーントルティーヤ）、インド（米、豆）、タイ（米、たまり醤油）、エチオピア（テフのインジェラ）は概ねグルテンフリーです。醤油は必ず確認を。" },
    { title: "緊急時の計画を立てる", text: "最寄りの病院を把握し、現地語で'アレルギー反応'と言えるようにし、緊急用スナックを常に持ち歩きましょう。GlutenGoの緊急フレーズが役立ちます。" },
    { title: "アルコール：注意が必要", text: "ワインやスピリッツ（ウィスキー、ジャガイモのウォッカ）は多くの場合安全です。通常のビールにはグルテンが含まれます。グルテンフリービールまたはサイダーを選んでください。" },
    { title: "消化酵素を持参する", text: "グルテン消化酵素（GluteGuard、AN-PEP）は完全な保護はできませんが、少量の汚染時のバックアップとして役立ちます。まず医師に相談してください。" },
    { title: "現地語で「小麦」を覚える", text: "小麦の各国語：blé（仏）、Weizen（独）、grano（伊）、trigo（西/葡）、小麦/komugi（日）。単語を知れば自分でメニューが読めます。" },
    { title: "旅行中の食事日記をつける", text: "何をどこで食べたか記録してください。反応があった場合、原因を迅速に特定できます。自分のためにも医師のためにも役立ちます。" },
  ],
  factsSource: "出典",
  sitesCatOrgs: "セリアック病団体", sitesCatTravel: "旅行と食事", sitesCatScience: "科学と健康",
};

export const RESOURCES_TR: Record<LangCode, ResourcesLang> = {
  en, nl, fr, de, es, it, pt, ja,
  th: en, pl: en, ar: en, zh: en,
};
