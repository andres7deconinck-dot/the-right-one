export type Phrase = {
  category: string;
  english: string;
  translation: string;
  phonetic?: string;
};

export type EmergencyCountry = {
  code: string;
  name: string;
  flag: string;
  language: string;
  emergencyNumber: string;
  ambulance: string;
  scriptNote?: string;
  phrases: Phrase[];
};

const phrasesFor = (
  medical: string,
  celiac: string,
  pharmacy: string,
  hospital: string,
  reaction: string,
  ambulance: string,
  phon?: [string, string, string, string, string, string],
): Phrase[] => [
  { category: "🚨 Medical Emergency", english: "I need a hospital immediately.", translation: medical, phonetic: phon?.[0] },
  { category: "🌾 Celiac & Gluten", english: "I have celiac disease and I ate gluten.", translation: celiac, phonetic: phon?.[1] },
  { category: "💊 Pharmacy", english: "I need to find a pharmacy.", translation: pharmacy, phonetic: phon?.[2] },
  { category: "🏥 Directions", english: "Where is the nearest hospital?", translation: hospital, phonetic: phon?.[3] },
  { category: "⚠️ Allergic Reaction", english: "I am having an allergic reaction. I need help.", translation: reaction, phonetic: phon?.[4] },
  { category: "🚑 Call Ambulance", english: "Please call an ambulance.", translation: ambulance, phonetic: phon?.[5] },
];

export const EMERGENCY_COUNTRIES: EmergencyCountry[] = [
  {
    code: "jp", name: "Japan", flag: "🇯🇵", language: "Japanese",
    emergencyNumber: "119", ambulance: "119",
    scriptNote: "Japanese is written in a mix of kanji and katakana (the script used for foreign words like グルテン gluten and アレルギー allergy). A Japanese person can read this card instantly — show it rather than trying to say it. If you do need to speak, use the romanized pronunciation guide shown beneath each phrase.",
    phrases: phrasesFor(
      "病院に今すぐ行く必要があります。",
      "私はセリアック病で、グルテンを食べてしまいました。",
      "薬局を探しています。",
      "一番近い病院はどこですか？",
      "アレルギー反応が起きています。助けてください。",
      "救急車を呼んでください。",
      ["Byōin ni ima sugu iku hitsuyō ga arimasu.", "Watashi wa seriakku-byō de, guruten o tabete shimaimashita.", "Yakkyoku o sagashite imasu.", "Ichiban chikai byōin wa doko desu ka?", "Arerugī hannō ga okite imasu. Tasukete kudasai.", "Kyūkyūsha o yonde kudasai."],
    ),
  },
  {
    code: "th", name: "Thailand", flag: "🇹🇭", language: "Thai",
    emergencyNumber: "1669", ambulance: "1669",
    scriptNote: "Thai uses its own alphabet, which most visitors cannot read aloud. Show the card directly to a Thai person. The romanized pronunciation guide beneath each phrase is there if you need to attempt it verbally.",
    phrases: phrasesFor(
      "ฉันต้องไปโรงพยาบาลทันที",
      "ฉันเป็นโรคเซลิแอคและฉันกินกลูเตนเข้าไป",
      "ฉันกำลังหาร้านขายยา",
      "โรงพยาบาลที่ใกล้ที่สุดอยู่ที่ไหน?",
      "ฉันกำลังมีอาการแพ้ ช่วยด้วย",
      "กรุณาเรียกรถพยาบาล",
      ["Chăn dtông bpai rohng-payaabaan tan-tee", "Chăn bpen rôhk celiac láe chăn gin gluten", "Chăn gam-lang hăa ráan kăai yaa", "Rohng-payaabaan têe glâi têe-sùt yùu têe năi?", "Chăn gam-lang mee aa-gaan páe, chûay dûay", "Gà-rú-naa rîak rót payaabaan"],
    ),
  },
  {
    code: "it", name: "Italy", flag: "🇮🇹", language: "Italian",
    emergencyNumber: "112", ambulance: "118",
    phrases: phrasesFor(
      "Ho bisogno di un ospedale immediatamente.",
      "Sono celiaco/a e ho mangiato glutine.",
      "Devo trovare una farmacia.",
      "Dov'è l'ospedale più vicino?",
      "Sto avendo una reazione allergica. Ho bisogno di aiuto.",
      "Per favore chiamate un'ambulanza.",
    ),
  },
  {
    code: "es", name: "Spain", flag: "🇪🇸", language: "Spanish",
    emergencyNumber: "112", ambulance: "061",
    phrases: phrasesFor(
      "Necesito un hospital inmediatamente.",
      "Tengo enfermedad celíaca y comí gluten.",
      "Necesito encontrar una farmacia.",
      "¿Dónde está el hospital más cercano?",
      "Estoy teniendo una reacción alérgica. Necesito ayuda.",
      "Por favor, llamen a una ambulancia.",
    ),
  },
  {
    code: "us", name: "United States", flag: "🇺🇸", language: "English",
    emergencyNumber: "911", ambulance: "911",
    phrases: phrasesFor(
      "I need a hospital immediately.",
      "I have celiac disease and I ate gluten.",
      "I need to find a pharmacy.",
      "Where is the nearest hospital?",
      "I am having an allergic reaction. I need help.",
      "Please call an ambulance.",
    ),
  },
  {
    code: "de", name: "Germany", flag: "🇩🇪", language: "German",
    emergencyNumber: "112", ambulance: "112",
    phrases: phrasesFor(
      "Ich brauche sofort ein Krankenhaus.",
      "Ich habe Zöliakie und ich habe Gluten gegessen.",
      "Ich muss eine Apotheke finden.",
      "Wo ist das nächste Krankenhaus?",
      "Ich habe eine allergische Reaktion. Ich brauche Hilfe.",
      "Bitte rufen Sie einen Krankenwagen.",
    ),
  },
  {
    code: "fr", name: "France", flag: "🇫🇷", language: "French",
    emergencyNumber: "112", ambulance: "15",
    phrases: phrasesFor(
      "J'ai besoin d'un hôpital immédiatement.",
      "Je suis cœliaque et j'ai mangé du gluten.",
      "J'ai besoin de trouver une pharmacie.",
      "Où est l'hôpital le plus proche ?",
      "Je fais une réaction allergique. J'ai besoin d'aide.",
      "Appelez une ambulance, s'il vous plaît.",
    ),
  },
  {
    code: "nl", name: "Netherlands", flag: "🇳🇱", language: "Dutch",
    emergencyNumber: "112", ambulance: "112",
    phrases: phrasesFor(
      "Ik moet onmiddellijk naar het ziekenhuis.",
      "Ik heb coeliakie en ik heb gluten gegeten.",
      "Ik moet een apotheek vinden.",
      "Waar is het dichtstbijzijnde ziekenhuis?",
      "Ik heb een allergische reactie. Ik heb hulp nodig.",
      "Bel alstublieft een ambulance.",
    ),
  },
];

export const EMERGENCY_NUMBERS = [
  { region: "EU general", emergency: "112", ambulance: "112" },
  { region: "Japan", emergency: "119", ambulance: "119" },
  { region: "Thailand", emergency: "1669", ambulance: "1669" },
  { region: "USA", emergency: "911", ambulance: "911" },
  { region: "Australia", emergency: "000", ambulance: "000" },
];
