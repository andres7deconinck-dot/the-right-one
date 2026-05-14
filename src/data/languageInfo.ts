// Per-language helper info used on country detail pages.
// Keyed by the `emergencyPhrase.lang` string used in countries.ts.

export type LanguageInfo = {
  // Words to look for on supermarket food labels (avoid these)
  avoidWords: string[];
  // GF claim wording on packaging
  gfClaim: string[];
  // Restaurant phrases
  askGF: string;
  askCrossContamination: string;
  thankYou: string;
  // Emergency number
  emergencyNumber: string;
};

const EU_EMERGENCY = "112";

export const LANGUAGE_INFO: Record<string, LanguageInfo> = {
  Italian: {
    avoidWords: ["frumento", "grano", "farina di grano", "orzo", "segale", "avena", "malto", "kamut", "farro", "couscous"],
    gfClaim: ["senza glutine", "spiga sbarrata (logo AIC)"],
    askGF: "È senza glutine? / Avete un menù per celiaci?",
    askCrossContamination: "Potete evitare la contaminazione crociata? Utensili puliti, pentola separata.",
    thankYou: "Grazie mille!",
    emergencyNumber: EU_EMERGENCY,
  },
  French: {
    avoidWords: ["blé", "froment", "farine de blé", "orge", "seigle", "avoine", "malt", "épeautre", "kamut", "amidon de blé"],
    gfClaim: ["sans gluten", "épi de blé barré (logo AFDIAG)"],
    askGF: "Est-ce que c'est sans gluten ?",
    askCrossContamination: "Pouvez-vous éviter toute contamination croisée — ustensiles propres, surface propre, friteuse séparée ?",
    thankYou: "Merci beaucoup !",
    emergencyNumber: EU_EMERGENCY,
  },
  "Dutch/French": {
    avoidWords: ["tarwe", "tarwemeel", "gerst", "rogge", "haver", "mout", "spelt", "blé", "orge", "seigle", "avoine", "malt"],
    gfClaim: ["glutenvrij", "sans gluten", "doorgekruiste graanaar (BCU)"],
    askGF: "Is het glutenvrij? / Est-ce sans gluten ?",
    askCrossContamination: "Kunt u kruisbesmetting vermijden? / Pouvez-vous éviter la contamination croisée ?",
    thankYou: "Dank u! / Merci !",
    emergencyNumber: EU_EMERGENCY,
  },
  Dutch: {
    avoidWords: ["tarwe", "tarwemeel", "gerst", "rogge", "haver", "mout", "spelt", "kamut", "couscous"],
    gfClaim: ["glutenvrij", "doorgekruiste graanaar"],
    askGF: "Is het glutenvrij?",
    askCrossContamination: "Kunt u mijn eten apart bereiden zonder kruisbesmetting?",
    thankYou: "Dank u wel!",
    emergencyNumber: EU_EMERGENCY,
  },
  German: {
    avoidWords: ["Weizen", "Weizenmehl", "Gerste", "Roggen", "Hafer", "Malz", "Dinkel", "Grünkern", "Kamut", "Couscous"],
    gfClaim: ["glutenfrei", "durchgestrichene Ähre (DZG)"],
    askGF: "Ist das glutenfrei?",
    askCrossContamination: "Können Sie Kreuzkontamination vermeiden? Saubere Utensilien, getrennte Fritteuse.",
    thankYou: "Vielen Dank!",
    emergencyNumber: EU_EMERGENCY,
  },
  Spanish: {
    avoidWords: ["trigo", "harina de trigo", "cebada", "centeno", "avena", "malta", "espelta", "kamut", "sémola", "cuscús"],
    gfClaim: ["sin gluten", "espiga barrada (FACE)"],
    askGF: "¿Es sin gluten? / ¿Tienen menú para celíacos?",
    askCrossContamination: "¿Pueden evitar la contaminación cruzada? Utensilios limpios, sartén aparte.",
    thankYou: "¡Muchas gracias!",
    emergencyNumber: EU_EMERGENCY,
  },
  Portuguese: {
    avoidWords: ["trigo", "farinha de trigo", "cevada", "centeio", "aveia", "malte", "espelta", "cuscuz"],
    gfClaim: ["sem glúten", "espiga riscada (APC)"],
    askGF: "É sem glúten? / Têm menu para celíacos?",
    askCrossContamination: "Podem evitar a contaminação cruzada? Utensílios limpos, frigideira separada.",
    thankYou: "Muito obrigado/a!",
    emergencyNumber: EU_EMERGENCY,
  },
  Greek: {
    avoidWords: ["σιτάρι (sitari = wheat)", "κριθάρι (krithari = barley)", "σίκαλη (sikali = rye)", "βρώμη (vromi = oats)", "βύνη (vyni = malt)"],
    gfClaim: ["χωρίς γλουτένη (chorís gloutén)", "διαγραμμένο στάχυ"],
    askGF: "Είναι χωρίς γλουτένη; (Eínai chorís gloutén?)",
    askCrossContamination: "Μπορείτε να αποφύγετε τη διασταυρούμενη μόλυνση;",
    thankYou: "Ευχαριστώ! (Efcharistó!)",
    emergencyNumber: EU_EMERGENCY,
  },
  Swedish: {
    avoidWords: ["vete", "vetemjöl", "korn", "råg", "havre", "malt", "dinkel", "couscous", "bulgur"],
    gfClaim: ["glutenfri", "överkorsat ax"],
    askGF: "Är det glutenfritt?",
    askCrossContamination: "Kan ni undvika korskontaminering? Rena redskap, separat panna.",
    thankYou: "Tack så mycket!",
    emergencyNumber: EU_EMERGENCY,
  },
  English: {
    avoidWords: ["wheat", "wheat flour", "barley", "rye", "oats (unless certified GF)", "malt", "malt extract", "spelt", "kamut", "couscous", "semolina", "modified wheat starch"],
    gfClaim: ["gluten-free", "certified gluten-free", "crossed grain symbol"],
    askGF: "Is this gluten-free? Do you have a celiac/coeliac menu?",
    askCrossContamination: "Can you avoid cross-contamination? Clean utensils, separate pan, dedicated fryer.",
    thankYou: "Thank you so much!",
    emergencyNumber: "911 / 999 / 112",
  },
  "English (Australian)": {
    avoidWords: ["wheat", "wheat flour", "barley", "rye", "oats (unless certified GF)", "malt", "spelt", "couscous", "semolina"],
    gfClaim: ["gluten free (<3ppm in AU)", "Coeliac Australia crossed-grain symbol"],
    askGF: "Is this gluten-free? Do you have a coeliac menu?",
    askCrossContamination: "Can you avoid cross-contamination? Clean utensils, separate pan, dedicated fryer.",
    thankYou: "Thanks so much!",
    emergencyNumber: "000",
  },
  "English/French": {
    avoidWords: ["wheat", "barley", "rye", "oats", "malt", "blé", "orge", "seigle", "avoine", "malt"],
    gfClaim: ["gluten-free / sans gluten", "CCA certified"],
    askGF: "Is this gluten-free? / Est-ce sans gluten ?",
    askCrossContamination: "Avoid cross-contamination please. / Évitez la contamination croisée s'il vous plaît.",
    thankYou: "Thanks! / Merci !",
    emergencyNumber: "911",
  },
  Japanese: {
    avoidWords: ["小麦 (komugi = wheat)", "麦 (mugi = barley/wheat group)", "大麦 (ōmugi = barley)", "ライ麦 (raimugi = rye)", "醤油 (shōyu = soy sauce, contains wheat)", "麩 (fu = wheat gluten)", "麦芽 (bakuga = malt)"],
    gfClaim: ["グルテンフリー (gurutenfurī)", "小麦不使用 (komugi-fushiyō = wheat-free)"],
    askGF: "グルテンフリーですか？ (Gurutenfurī desu ka?)",
    askCrossContamination: "別の調理器具で別々に作ってください (Betsu no chōri-kigu de betsubetsu ni tsukutte kudasai)",
    thankYou: "ありがとうございます (Arigatō gozaimasu)",
    emergencyNumber: "119 (medical) / 110 (police)",
  },
  Thai: {
    avoidWords: ["แป้งสาลี (paeng salee = wheat flour)", "ซีอิ๊ว (see-ew = soy sauce)", "ซอสหอยนางรม (oyster sauce)", "บะหมี่ (bami = wheat noodles)"],
    gfClaim: ["ปราศจากกลูเตน (prat-sa-jak gluten)", "ไม่มีกลูเตน (mai mee gluten)"],
    askGF: "อาหารนี้ไม่มีกลูเตนใช่ไหม? (Aharn ni mai mee gluten chai mai?)",
    askCrossContamination: "กรุณาใช้กระทะและอุปกรณ์ที่สะอาด แยกจากแป้งสาลี",
    thankYou: "ขอบคุณค่ะ/ครับ (Khob khun ka/krap)",
    emergencyNumber: "1669 (medical) / 191 (police)",
  },
  Korean: {
    avoidWords: ["밀 (mil = wheat)", "보리 (bori = barley)", "호밀 (homil = rye)", "간장 (ganjang = soy sauce)", "고추장 (gochujang)", "쌈장 (ssamjang)", "맥아 (maega = malt)"],
    gfClaim: ["글루텐 프리 (gulluten free)", "밀 없음 (mil eopseum = no wheat)"],
    askGF: "글루텐이 없나요? (Gulluten-i eopnayo?)",
    askCrossContamination: "교차오염을 피해 주세요. 깨끗한 조리도구로 따로 조리해 주세요.",
    thankYou: "감사합니다 (Gamsahamnida)",
    emergencyNumber: "119 (medical) / 112 (police)",
  },
  Vietnamese: {
    avoidWords: ["lúa mì (wheat)", "bột mì (wheat flour)", "lúa mạch (barley)", "tương (soy sauce)", "dầu hào (oyster sauce)", "mì (wheat noodles)"],
    gfClaim: ["không gluten", "không chứa gluten"],
    askGF: "Món này không có gluten phải không?",
    askCrossContamination: "Xin hãy dùng dụng cụ sạch và nấu riêng, tránh lúa mì.",
    thankYou: "Cảm ơn rất nhiều!",
    emergencyNumber: "115 (medical) / 113 (police)",
  },
  Hindi: {
    avoidWords: ["गेहूं (gehoon = wheat)", "जौ (jau = barley)", "राई (rai = rye)", "मैदा (maida = refined wheat flour)", "सूजी (suji = semolina)", "आटा (atta = wheat flour)"],
    gfClaim: ["ग्लूटेन मुक्त (gluten mukt)", "बिना गेहूं (bina gehoon = without wheat)"],
    askGF: "क्या यह ग्लूटेन मुक्त है? (Kya yeh gluten mukt hai?)",
    askCrossContamination: "कृपया साफ बर्तनों में अलग से बनाएं, गेहूं से बचें।",
    thankYou: "धन्यवाद (Dhanyavaad)",
    emergencyNumber: "112 / 102 (ambulance)",
  },
};

export function getLanguageInfo(lang: string): LanguageInfo {
  return LANGUAGE_INFO[lang] ?? LANGUAGE_INFO.English;
}
