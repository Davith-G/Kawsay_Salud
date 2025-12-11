
import { Plant, EmergencyContact, Language } from './types';

export const TRANSLATIONS = {
  es: {
    greeting: "Alli Puncha!",
    greeting_sub: "(Buenos días)",
    welcome_message: "Soy tu asistente de salud, listo para ayudar a la comunidad de Cruz Loma.",
    nav_home: "Inicio",
    nav_natural: "Natural",
    nav_chat: "Chat IA",
    nav_map: "Mapa",
    nav_auxilio: "Auxilio",
    quick_map_title: "Ver Mapa",
    quick_map_desc: "Hospitales cercanos",
    quick_chat_title: "Chat IA",
    quick_chat_desc: "Pregunta a Yachak",
    natural_title: "Medicina Natural",
    natural_subtitle: "Plantas Medicinales",
    natural_desc: "Catálogo de plantas locales y sus usos curativos.",
    natural_btn: "Consultar catálogo",
    emergency_title: "¿Emergencia?",
    emergency_desc: "Guías de primeros auxilios y números.",
    chat_welcome: "Alli Puncha! Soy Yachak, tu asistente de salud. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre malestares, plantas medicinales, o dónde encontrar un médico.",
    chat_placeholder: "Escribe tu consulta aquí...",
    chat_error: "Error: No pude conectar. Verifica tu internet y API Key.",
    map_title: "Mapa de Salud",
    map_search_placeholder: "Buscar (ej: Farmacia, Hospital)...",
    map_btn_search: "Buscar",
    map_btn_favorites: "Favoritos",
    map_no_results: "Busca centros de salud cercanos.",
    map_offline: "Sin conexión a Internet",
    natural_header: "Medicina Natural",
    natural_tab_catalog: "Catálogo y Recetas",
    natural_tab_consult: "Consultar Síntoma",
    natural_search_placeholder: "Buscar...",
    natural_consult_label: "¿Qué malestar tienes?",
    natural_consult_placeholder: "Ej: Tengo dolor de estómago y frío...",
    natural_btn_consult: "Buscar Remedio",
    natural_loading: "Consultando a la abuela IA...",
    natural_filter_all: "Todos",
    natural_filter_plants: "Plantas",
    natural_filter_remedies: "Remedios",
    auxilio_title: "Zona de Auxilio",
    auxilio_subtitle: "Mantén la calma y sigue las instrucciones.",
    auxilio_guides: "Guías Rápidas",
    settings_title: "Configuración",
    settings_appearance: "Apariencia",
    settings_language: "Idioma / Shimikuna",
    lang_es: "Español",
    lang_qu: "Kichwa",
    lang_en: "English"
  },
  qu: {
    greeting: "Alli Puncha!",
    greeting_sub: "(Alli Puncha)",
    welcome_message: "Ñuka kani kamba hampik, Cruz Loma ayllullaktata yanapankapak.",
    nav_home: "Wasi",
    nav_natural: "Hampi",
    nav_chat: "Rimana",
    nav_map: "Rikuna",
    nav_auxilio: "Yanapay",
    quick_map_title: "Rikuna",
    quick_map_desc: "Hampi wasikuna",
    quick_chat_title: "Rimana",
    quick_chat_desc: "Tapuy Yachakta",
    natural_title: "Hampi Yura",
    natural_subtitle: "Hampi Yurakuna",
    natural_desc: "Kaypi tiyan tukuy hampi yurakuna.",
    natural_btn: "Rikuy yurakunata",
    emergency_title: "¿Llaki tiyanchu?",
    emergency_desc: "Yanapaykuna kaypi tiyan.",
    chat_welcome: "Alli Puncha! Ñuka kani Yachak, kamba hampik. ¿Imapi yanapana ushani? Tapuway unguymanta, hampi yurakunamanta, maypi hampikta tarinamanta.",
    chat_placeholder: "Killkay kamba tapuyta...",
    chat_error: "Pantasqa: Mana internet tiyanchu.",
    map_title: "Hampi Mapa",
    map_search_placeholder: "Maskay (Hampi wasi)...",
    map_btn_search: "Maskana",
    map_btn_favorites: "Munashkakuna",
    map_no_results: "Maskay hampi wasikunata.",
    map_offline: "Mana internet tiyanchu",
    natural_header: "Hampi Yura",
    natural_tab_catalog: "Yurakuna",
    natural_tab_consult: "Tapuna",
    natural_search_placeholder: "Maskay...",
    natural_consult_label: "¿Ima nanayta charinki?",
    natural_consult_placeholder: "Shunkuta nanawan...",
    natural_btn_consult: "Maskay Hampita",
    natural_loading: "Hatun mamata tapukuni...",
    natural_filter_all: "Tukuy",
    natural_filter_plants: "Yurakuna",
    natural_filter_remedies: "Hampikuna",
    auxilio_title: "Yanapay Kuskalla",
    auxilio_subtitle: "Ama mancharichu, kaita ruray.",
    auxilio_guides: "Utschalla Yanapay",
    settings_title: "Allichina",
    settings_appearance: "Rikuy",
    settings_language: "Shimi",
    lang_es: "Español",
    lang_qu: "Kichwa",
    lang_en: "English"
  },
  en: {
    greeting: "Alli Puncha!",
    greeting_sub: "(Good Morning)",
    welcome_message: "I am your health assistant, ready to help the Cruz Loma community.",
    nav_home: "Home",
    nav_natural: "Natural",
    nav_chat: "AI Chat",
    nav_map: "Map",
    nav_auxilio: "Help",
    quick_map_title: "View Map",
    quick_map_desc: "Nearby hospitals",
    quick_chat_title: "AI Chat",
    quick_chat_desc: "Ask Yachak",
    natural_title: "Natural Medicine",
    natural_subtitle: "Medicinal Plants",
    natural_desc: "Catalog of local plants and healing uses.",
    natural_btn: "View catalog",
    emergency_title: "Emergency?",
    emergency_desc: "First aid guides and numbers.",
    chat_welcome: "Alli Puncha! I am Yachak, your health assistant. How can I help you today? You can ask me about ailments, medicinal plants, or where to find a doctor.",
    chat_placeholder: "Type your question here...",
    chat_error: "Error: Could not connect. Check internet.",
    map_title: "Health Map",
    map_search_placeholder: "Search (Pharmacy, Hospital)...",
    map_btn_search: "Search",
    map_btn_favorites: "Favorites",
    map_no_results: "Search for nearby health centers.",
    map_offline: "No Internet Connection",
    natural_header: "Natural Medicine",
    natural_tab_catalog: "Catalog & Recipes",
    natural_tab_consult: "Consult Symptom",
    natural_search_placeholder: "Search...",
    natural_consult_label: "What are your symptoms?",
    natural_consult_placeholder: "Ex: I have a stomach ache...",
    natural_btn_consult: "Find Remedy",
    natural_loading: "Consulting AI Wisdom...",
    natural_filter_all: "All",
    natural_filter_plants: "Plants",
    natural_filter_remedies: "Remedies",
    auxilio_title: "Help Zone",
    auxilio_subtitle: "Stay calm and follow instructions.",
    auxilio_guides: "Quick Guides",
    settings_title: "Settings",
    settings_appearance: "Appearance",
    settings_language: "Language",
    lang_es: "Español",
    lang_qu: "Kichwa",
    lang_en: "English"
  }
};

// Base data for Plants
const BASE_PLANTS_DATA = [
  { id: 1, imageUrl: "https://images.unsplash.com/photo-1610725663727-087950a922e7?auto=format&fit=crop&w=800&q=80", nameKichwa: "Matico", nameSpanish: "Matico", category: 'plant' },
  { id: 2, imageUrl: "https://images.unsplash.com/photo-1595863475168-f3c447b91380?auto=format&fit=crop&w=800&q=80", nameKichwa: "Manzanilla", nameSpanish: "Manzanilla", category: 'plant' },
  { id: 3, imageUrl: "https://images.unsplash.com/photo-1628519586379-641d54b69875?auto=format&fit=crop&w=800&q=80", nameKichwa: "Santa María", nameSpanish: "Santa María", category: 'plant' },
  { id: 4, imageUrl: "https://images.unsplash.com/photo-1558695786-512db5613401?auto=format&fit=crop&w=800&q=80", nameKichwa: "Eucalipto", nameSpanish: "Eucalipto", category: 'plant' },
  { id: 5, imageUrl: "https://images.unsplash.com/photo-1612189536067-545741102a4e?auto=format&fit=crop&w=800&q=80", nameKichwa: "Chini Panga", nameSpanish: "Ortiga", category: 'plant' },
  { id: 6, imageUrl: "https://images.unsplash.com/photo-1585662237143-88d381221d96?auto=format&fit=crop&w=800&q=80", nameKichwa: "Valeriana", nameSpanish: "Valeriana", category: 'plant' },
  { id: 7, imageUrl: "https://images.unsplash.com/photo-1627530339407-03e98e61d150?auto=format&fit=crop&w=800&q=80", nameKichwa: "Orégano", nameSpanish: "Orégano", category: 'plant' },
  { id: 8, imageUrl: "https://images.unsplash.com/photo-1620153747129-6141d89e9a4c?auto=format&fit=crop&w=800&q=80", nameKichwa: "Verbena", nameSpanish: "Verbena", category: 'plant' },
  { id: 9, imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=800&q=80", nameKichwa: "Yawar Wiki", nameSpanish: "Sangre de Drago", category: 'plant' },
  { id: 10, imageUrl: "https://images.unsplash.com/photo-1638809315512-078929665128?auto=format&fit=crop&w=800&q=80", nameKichwa: "Paiku", nameSpanish: "Paico", category: 'plant' },
  { id: 11, imageUrl: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=800&q=80", nameKichwa: "Cedrón", nameSpanish: "Cedrón", category: 'plant' },
  { id: 12, imageUrl: "https://images.unsplash.com/photo-1620215176167-5a73711104c2?auto=format&fit=crop&w=800&q=80", nameKichwa: "Ruda", nameSpanish: "Ruda", category: 'plant' },
  { id: 13, imageUrl: "https://images.unsplash.com/photo-1635421255608-72098aa9144b?auto=format&fit=crop&w=800&q=80", nameKichwa: "Llantén", nameSpanish: "Llantén", category: 'plant' },
  { id: 14, imageUrl: "https://images.unsplash.com/photo-1611735341450-74d61e66ee62?auto=format&fit=crop&w=800&q=80", nameKichwa: "Chilca", nameSpanish: "Chilca", category: 'plant' },
  { id: 15, imageUrl: "https://images.unsplash.com/photo-1597822735518-828e5d86a85e?auto=format&fit=crop&w=800&q=80", nameKichwa: "Marku", nameSpanish: "Marco", category: 'plant' },
  // Remedies
  { id: 101, imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", nameKichwa: "Mishki Yaku", nameSpanish: "Agua de Panela y Limón", category: 'remedy' },
  { id: 102, imageUrl: "https://images.unsplash.com/photo-1624362772743-c9096c429676?auto=format&fit=crop&w=800&q=80", nameKichwa: "Kachi Yaku", nameSpanish: "Gárgaras de Sal", category: 'remedy' },
  { id: 103, imageUrl: "https://images.unsplash.com/photo-1512398975429-881e1ec679e9?auto=format&fit=crop&w=800&q=80", nameKichwa: "Kañil Yaku", nameSpanish: "Agua de Canela", category: 'remedy' },
  { id: 104, imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80", nameKichwa: "Sábila", nameSpanish: "Sábila (Aloe Vera)", category: 'remedy' },
  { id: 105, imageUrl: "https://images.unsplash.com/photo-1635583925585-6d09c2188448?auto=format&fit=crop&w=800&q=80", nameKichwa: "Jengibre", nameSpanish: "Jengibre", category: 'remedy' },
  { id: 106, imageUrl: "https://images.unsplash.com/photo-1558223637-25944c68df56?auto=format&fit=crop&w=800&q=80", nameKichwa: "Ajo", nameSpanish: "Ajo Machacado", category: 'remedy' },
  { id: 107, imageUrl: "https://images.unsplash.com/photo-1601397003463-549071c08008?auto=format&fit=crop&w=800&q=80", nameKichwa: "Linaza", nameSpanish: "Agua de Linaza", category: 'remedy' }
];

export const PLANTS_BY_LANG: Record<Language, Plant[]> = {
  es: BASE_PLANTS_DATA.map(p => ({ ...p, description: "", uses: "", ingredients: [], preparation: "", contraindications: "", category: p.category as any })),
  qu: BASE_PLANTS_DATA.map(p => ({ ...p, description: "", uses: "", ingredients: [], preparation: "", contraindications: "", category: p.category as any })),
  en: BASE_PLANTS_DATA.map(p => ({ ...p, description: "", uses: "", ingredients: [], preparation: "", contraindications: "", category: p.category as any }))
};

// Helper to fill data quickly
const fill = (lang: Language, index: number, data: Partial<Plant>) => {
  if (PLANTS_BY_LANG[lang][index]) {
    Object.assign(PLANTS_BY_LANG[lang][index], data);
  }
};

// --- SPANISH DATA ---
fill('es', 0, {
  description: "Arbusto nativo de los Andes con hojas alargadas y textura rugosa.",
  uses: "Cicatrizante, infecciones externas, dolor de estómago.",
  ingredients: ["5 hojas frescas de matico", "1 litro de agua hirviendo"],
  preparation: "1. Lavar bien las hojas.\n2. Colocar las hojas en un recipiente y verter el agua hirviendo.\n3. Tapar y dejar reposar por 10 minutos.\n4. Para heridas: Usar el agua tibia para lavar la zona afectada.",
  contraindications: "No usar en embarazo sin supervisión."
});
fill('es', 1, {
  description: "Hierba aromática de flores blancas con centro amarillo, fácil de conseguir.",
  uses: "Calmante, digestivo, antiinflamatorio ocular.",
  ingredients: ["1 cucharada de flores secas o frescas", "1 taza de agua"],
  preparation: "1. Hervir el agua.\n2. Retirar del fuego y agregar las flores.\n3. Tapar por 5 minutos.\n4. Cernir y beber caliente.",
  contraindications: "Personas alérgicas al polen."
});
fill('es', 2, {
  description: "Planta herbácea de olor fuerte, común en huertos andinos.",
  uses: "Dolores menstruales, golpes de aire, 'limpias'.",
  ingredients: ["Un manojo pequeño de hojas y tallos", "1 litro de agua"],
  preparation: "1. Hervir el agua con la planta por 5 minutos.\n2. Dejar entibiar.\n3. Beber media taza si es para dolor de barriga.",
  contraindications: "No usar durante el embarazo (puede ser abortiva)."
});
fill('es', 3, {
  description: "Árbol grande de hojas aromáticas, muy común en la sierra.",
  uses: "Respiratorio, tos, gripe, descongestionante.",
  ingredients: ["10 hojas maduras de eucalipto", "2 litros de agua"],
  preparation: "1. Poner a hervir el agua con las hojas en una olla grande.\n2. Cuando salga bastante vapor, retirar del fuego.\n3. Cubrirse la cabeza con una toalla e inhalar el vapor (vahos).",
  contraindications: "No ingerir el aceite esencial. Cuidado con niños asmáticos."
});
fill('es', 4, {
  description: "Planta con pelos urticantes que pican al tacto.",
  uses: "Circulación, dolores musculares, artritis, purificación de sangre.",
  ingredients: ["Un ramo de ortiga fresca (usar guantes)"],
  preparation: "1. Golpear suavemente la zona adolorida con la planta fresca (ortigamiento) para activar circulación.\n2. Infusión: Usar 3 hojas en una taza de agua hirviendo.",
  contraindications: "Puede irritar la piel sensible. Usar con respeto."
});
fill('es', 5, {
  description: "Planta pequeña cuyas raíces tienen propiedades sedantes.",
  uses: "Insomnio, nervios, ansiedad, estrés.",
  ingredients: ["1 cucharadita de raíz triturada seca", "1 taza de agua"],
  preparation: "1. Hervir el agua.\n2. Agregar la raíz y dejar hervir a fuego lento 3 minutos.\n3. Dejar reposar tapado y beber antes de dormir.",
  contraindications: "No mezclar con alcohol ni pastillas para dormir."
});
fill('es', 6, {
  description: "Hierba de cocina muy fácil de encontrar en tiendas.",
  uses: "Cólicos estomacales, gases, digestión pesada.",
  ingredients: ["1 cucharada de orégano seco o fresco", "1 taza de agua hirviendo"],
  preparation: "1. Poner el orégano en la taza.\n2. Agregar agua hirviendo.\n3. Tapar con un plato por 5 minutos.\n4. Beber tibio.",
  contraindications: "Ninguna en dosis alimenticias."
});
fill('es', 7, {
  description: "Planta silvestre de flores moradas pequeñas.",
  uses: "Fiebre, hígado, depresión leve.",
  ingredients: ["1 rama pequeña de verbena", "1 taza de agua"],
  preparation: "1. Hervir el agua.\n2. Añadir la planta y apagar el fuego.\n3. Dejar reposar 5 minutos.\n4. Beber con un poco de limón.",
  contraindications: "No usar en embarazo."
});
fill('es', 8, {
  description: "Látex rojizo extraído de la corteza de un árbol amazónico.",
  uses: "Cicatrizante potente, úlceras gástricas, heridas profundas.",
  ingredients: ["Gotas de látex de Sangre de Drago puro"],
  preparation: "1. Heridas: Aplicar directamente y frotar hasta que se vuelva espuma blanca.\n2. Gastritis: Diluir 5 gotas en agua tibia y tomar en ayunas.",
  contraindications: "No exceder la dosis. Puede causar estreñimiento."
});
fill('es', 9, {
  description: "Hierba aromática de olor penetrante, crece como maleza.",
  uses: "Parásitos intestinales, dolor de estómago.",
  ingredients: ["1 rama de paico", "1 taza de agua"],
  preparation: "1. Exprimir jugo de hojas frescas (parásitos).\n2. Infusión suave para dolor de barriga.",
  contraindications: "Muy fuerte. No dar a niños pequeños ni embarazadas."
});
fill('es', 10, {
  description: "Arbusto de hojas largas con aroma a limón.",
  uses: "Nervios, insomnio, digestión, dolor de corazón (emocional).",
  ingredients: ["3 hojas frescas o secas de cedrón", "1 taza de agua caliente"],
  preparation: "1. Colocar las hojas en la taza con agua hirviendo.\n2. Dejar reposar 5 minutos.\n3. Tomar caliente.",
  contraindications: "Ninguna conocida en uso moderado."
});
fill('es', 11, {
  description: "Arbusto de hojas pequeñas, carnosas y olor fuerte.",
  uses: "Mal aire, cólicos menstruales, limpieza energética.",
  ingredients: ["1 ramita pequeña de ruda", "1 litro de agua (baño)"],
  preparation: "1. Mal aire: Hervir un manojo en 2 litros de agua y bañarse.\n2. Cólicos: Una hojita en agua hirviendo (precaución).",
  contraindications: "PROHIBIDA en embarazo (abortiva)."
});
fill('es', 12, {
  description: "Hierba de hojas anchas y nervaduras marcadas.",
  uses: "Inflamación, úlceras, gastritis, heridas externas.",
  ingredients: ["3 hojas de llantén lavadas", "1 taza de agua"],
  preparation: "1. Infusión: Añadir hojas al agua hirviendo y reposar.\n2. Heridas: Machacar hojas frescas y aplicar.",
  contraindications: "Ninguna en dosis normales."
});
fill('es', 13, {
  description: "Arbusto de hojas resinosas y pegajosas.",
  uses: "Golpes, torceduras, inflamación, frío en huesos.",
  ingredients: ["Un manojo de ramas de chilca", "Aguardiente (opcional)"],
  preparation: "1. Calentar las ramas al fuego.\n2. Colocar calientes sobre la zona adolorida.\n3. Vendar y dejar toda la noche.",
  contraindications: "Solo uso externo. No ingerir."
});
fill('es', 14, {
  description: "Planta de olor fuerte y amargo, hojas verdes grisáceas.",
  uses: "Frío, dolor de estómago, artritis.",
  ingredients: ["1 rama de marco", "1 litro de agua"],
  preparation: "1. Hervir agua con la planta.\n2. Usar para baños de asiento o lavar piernas (dolor de huesos).",
  contraindications: "No usar en embarazo."
});
// Remedios
fill('es', 15, {
    description: "Bebida caliente tradicional muy reconfortante.",
    uses: "Gripe, resfriado, dolor de garganta, energizante.",
    ingredients: ["1 bloque de panela", "2 limones", "1 litro de agua"],
    preparation: "1. Hervir el agua con la panela hasta disolver.\n2. Agregar el jugo de los limones.\n3. Tomar muy caliente antes de dormir para sudar el frío.",
    contraindications: "Diabéticos consumir con precaución."
});
fill('es', 16, {
    description: "Solución salina simple pero efectiva.",
    uses: "Dolor de garganta, infección de amígdalas, aftas bucales.",
    ingredients: ["1 cucharadita de sal en grano", "1 vaso de agua tibia"],
    preparation: "1. Disolver la sal en el agua tibia.\n2. Hacer gárgaras profundas por 30 segundos y escupir.\n3. Repetir 3 veces al día.",
    contraindications: "No tragar el agua."
});
fill('es', 17, {
    description: "Infusión caliente para el cuerpo.",
    uses: "Frío interno, cólicos menstruales, mala digestión.",
    ingredients: ["2 ramas de canela", "1 taza de agua"],
    preparation: "1. Hervir el agua con la canela por 10 minutos hasta que tome color.\n2. Cernir y tomar caliente (se puede endulzar con miel).",
    contraindications: "En exceso puede subir la presión."
});
fill('es', 18, {
    description: "Gel natural extraído de la penca de sábila.",
    uses: "Quemaduras de sol, heridas leves, gastritis, piel seca.",
    ingredients: ["1 penca de sábila fresca"],
    preparation: "1. Cortar la penca y dejarla reposar en agua toda la noche para sacar el yodo.\n2. Pelar y extraer el cristal transparente.\n3. Aplicar directo en la piel o licuar con agua para gastritis.",
    contraindications: "No consumir el látex amarillo (es laxante fuerte)."
});
fill('es', 19, {
    description: "Raíz picante muy medicinal.",
    uses: "Náuseas, dolor de garganta, resfriado, mala circulación.",
    ingredients: ["1 trozo de jengibre", "1 taza de agua", "Miel"],
    preparation: "1. Machacar o rallar el jengibre.\n2. Hervir en agua por 5 minutos.\n3. Colar y añadir miel y limón.",
    contraindications: "Puede irritar estómagos sensibles."
});
fill('es', 20, {
    description: "Diente de ajo crudo o macerado.",
    uses: "Presión alta, parásitos, sistema inmune.",
    ingredients: ["1 diente de ajo", "1 vaso de agua"],
    preparation: "1. Picar el ajo finamente.\n2. Tragar como pastilla con agua en ayunas.\n3. No masticar para evitar el olor fuerte.",
    contraindications: "Personas con problemas de coagulación consultar médico."
});
fill('es', 21, {
    description: "Semillas pequeñas ricas en fibra.",
    uses: "Estreñimiento, digestión, colesterol.",
    ingredients: ["1 cucharada de linaza", "1 vaso de agua"],
    preparation: "1. Dejar remojar la linaza en agua toda la noche.\n2. Beber el agua babosa y las semillas en ayunas.",
    contraindications: "Beber mucha agua durante el día."
});


// --- KICHWA DATA ---
fill('qu', 0, { description: "Andes urkumanta yura, suni panga, kharu (áspera).", uses: "Chugrita alliyachinkapak, wiksa nanaypak, infekshyunpak.", ingredients: ["5 panga Matico", "1 litro timpuk yaku"], preparation: "1. Panganakunata mayllay.\n2. Timpuk yakuta churay.\n3. 10 minututa shuyay.\n4. Chugrita mayllankapak o upyankapak.", contraindications: "Wiksayuk warmikuna mana upyanachu." });
fill('qu', 1, { description: "Yurak sisa, sumak asnayuk yura.", uses: "Wiksa nanaypak, ñawi nanaypak, samachinkapak.", ingredients: ["1 kuchara sisa", "1 taza yaku"], preparation: "1. Yakuta timpuchiy.\n2. Sisata churay.\n3. 5 minututa shuyay.\n4. Kunuklla upyay.", contraindications: "Sisa polen mana allichikpi, ama upyaychu." });
fill('qu', 2, { description: "Sinchi asnayuk yura, chakrakunapi wiñan.", uses: "Wiksa nanaypak, wayra hapishkapak, pichankapak.", ingredients: ["Pankakuna", "1 litro yaku"], preparation: "1. Yakupi timpuchiy 5 minututa.\n2. Chiri yakuta shuyay.\n3. Wiksa nanaypak ashalla upyay.", contraindications: "Wiksayuk warmikuna ama upyaychu." });
fill('qu', 3, { description: "Hatun yura, sumak asnayuk panga.", uses: "Chuhchu (tos) unkuypak, samay piskikpi (gripe).", ingredients: ["10 panga Eucalipto", "2 litro yaku"], preparation: "1. Hatun mankapi timpuchiy.\n2. Yakuta rupakpi, samayta aysay (inhalar).\n3. Umata katana.", contraindications: "Yaku aceiteta ama upyaychu. Wawakunapak cuidado." });
fill('qu', 4, { description: "Kaspi yura, makita tipinmi.", uses: "Yawar purinkapak, aycha nanaypak, tullu nanaypak.", ingredients: ["Shuk atado Ortiga"], preparation: "1. Nanay kuskapi mapata waktana (ortigamiento).\n2. Upyankapak: 3 pangata timpuchiy.", contraindications: "Karatami rupachin. Allimanta rurana." });
fill('qu', 5, { description: "Uchilla yura, sapika puñuchinkapak alli.", uses: "Mana puñuyta charikpi, mancharishkapak.", ingredients: ["Sapikuna", "1 taza yaku"], preparation: "1. Yakuta timpuchiy.\n2. Sapita churay, 3 minuto timpuchiy.\n3. Puñunkapak upyana.", contraindications: "Traguwan ama chukruchiychu." });
fill('qu', 6, { description: "Mikuypak yura, tiendapi tiyan.", uses: "Wiksa nanaypak, punkiy (gases).", ingredients: ["1 kuchara Orégano", "1 taza timpuk yaku"], preparation: "1. Yakuta timpuchiy.\n2. Oréganota churay.\n3. 5 minututa shuyay.\n4. Mikushka kipa upyay.", contraindications: "Mana tiyanchu." });
fill('qu', 7, { description: "Sacha yura, morado sisayuk.", uses: "Rupay (fiebre), higado nanaypak.", ingredients: ["Uchilla rama", "1 taza yaku"], preparation: "1. Yakuta timpuchiy.\n2. Ramata churay.\n3. Limonwan upyay.", contraindications: "Wiksayuk warmikuna ama upyaychu." });
fill('qu', 8, { description: "Puka yawar shina, sacha yuramanta.", uses: "Chugrita allichinkapak, wiksa kirita (úlceras).", ingredients: ["Yawar Wiki sutukuna (gotas)"], preparation: "1. Chugripi churana, yurak tukunakaman kakuna.\n2. Wilsa nanaypak: 5 sututa yakupi upyana.", contraindications: "Ama yallita upyaychu." });
fill('qu', 9, { description: "Sinchi asnayuk yura.", uses: "Kurusukuta (parásitos) llukchinkapak.", ingredients: ["1 rama Paiku", "1 taza yaku"], preparation: "1. Panga yakuta llukchiy.\n2. Ayunaspi upyana.", contraindications: "Sinchi yura. Wawakunaman ama karaychu." });
fill('qu', 10, { description: "Limon asnayuk yura.", uses: "Shunku nanaypak, mancharishkapak, puñunkapak.", ingredients: ["3 panga Cedrón", "1 taza yaku"], preparation: "1. Timpuk yakupi pangata churay.\n2. 5 minututa shuyay.\n3. Kunuklla upyay.", contraindications: "Mana tiyanchu." });
fill('qu', 11, { description: "Uchilla panga, sinchi asnayuk.", uses: "Wayra hapishkapak, warmi nanaypak, pichankapak.", ingredients: ["Ruda rama", "Yaku armankapak"], preparation: "1. Wayra hapikpi: Yakuta timpuchishpa armana.\n2. Warmi nanaypak: Uchilla upyana.", contraindications: "WIKSAYUKKUNA AMA UPYACHU." });
fill('qu', 12, { description: "Hatun panga, pampa yura.", uses: "Punkiy (inflamación), wiksa nanay, chugri.", ingredients: ["3 panga Llantén", "1 taza yaku"], preparation: "1. Yakuta timpuchishpa upyana.\n2. Chugripak: Pangata kutana, chugripi churana.", contraindications: "Mana tiyanchu." });
fill('qu', 13, { description: "Llukayuk panga (pegajosa).", uses: "Chukrishkapak (golpes), tullu nanaypak.", ingredients: ["Chilka ramakuna", "Trago (munashpaka)"], preparation: "1. Ninapi kunuchina.\n2. Nanay kuskapi churana.\n3. Watana.", contraindications: "Ama upyaychu, hawallapi churana." });
fill('qu', 14, { description: "Hayak yura, uchilla panga.", uses: "Chiri nanaypak, tullu nanaypak.", ingredients: ["1 rama Marku", "1 litro yaku"], preparation: "1. Yakuta timpuchina.\n2. Chakita mayllana (baños).", contraindications: "Wiksayuk warmikuna ama upyaychu." });
// Remedios Quichua
fill('qu', 15, { description: "Mishki yaku, kunuklla, chiri unkuypak.", uses: "Chuhchu, uma nanay, chiripak.", ingredients: ["Panela", "Limon", "Yaku"], preparation: "1. Panelata yakupi timpuchiy.\n2. Limonta churay.\n3. Rupakllata upyana.", contraindications: "Diabéticos ama yallita upyana." });
fill('qu', 16, { description: "Kachiwan yaku, kunkapak alli.", uses: "Kunka nanay (garganta).", ingredients: ["Kachi", "Kunuk yaku"], preparation: "1. Kachita yakupi churay.\n2. Kunkapi 'gárgaras' rurana.\n3. Ama millpunachu.", contraindications: "Ama millpunachu." });
fill('qu', 17, { description: "Canela yaku, rupak.", uses: "Wiksa nanay, chiri.", ingredients: ["Canela", "Yaku"], preparation: "1. Timpuchiy canelata.\n2. Mishkichiy.\n3. Upyay.", contraindications: "Mana." });
fill('qu', 18, { description: "Sábila, llukayuk panga.", uses: "Rupashkapak, wiksa nanaypak.", ingredients: ["Sábila"], preparation: "1. Yakupi churay tuta pakarinakaman.\n2. Chay llukayukta llukchiy.\n3. Karapi churay.", contraindications: "Ama killuta mikuychu." });
fill('qu', 19, { description: "Jengibre sapika hayakmi.", uses: "Aytiy (vómito), kunka nanay.", ingredients: ["Jengibre", "Miel"], preparation: "1. Jengibreta kutay.\n2. Yakupi timpuchiy.\n3. Mielwan upyay.", contraindications: "Wiksa nanay tiyakpi cuidana." });
fill('qu', 20, { description: "Ajo, sinchi asnayuk.", uses: "Yawar muyuy sinchi (presión), kurusuku.", ingredients: ["Ajo", "Yaku"], preparation: "1. Ajota paki.\n2. Yakuwan millpuy.\n3. Ayunaspi.", contraindications: "Yawar unkuy tiyakpi tapuna." });
fill('qu', 21, { description: "Linaza muju.", uses: "Ishpakunapak, wiksa pichankapak.", ingredients: ["Linaza", "Yaku"], preparation: "1. Yakupi churay tuta.\n2. Pakarinpi upyay.", contraindications: "Yakuta achka upyana." });

// --- ENGLISH DATA ---
fill('en', 0, { description: "Native Andean shrub with elongated leaves and rough texture.", uses: "Healing wounds, external infections, stomach pain.", ingredients: ["5 fresh Matico leaves", "1 liter boiling water"], preparation: "1. Wash leaves well.\n2. Pour boiling water over leaves.\n3. Cover and let sit for 10 mins.\n4. For wounds: Wash the area with the warm water.", contraindications: "Do not use during pregnancy without supervision." });
fill('en', 1, { description: "Aromatic herb with white flowers and yellow center.", uses: "Calming, digestive, eye inflammation.", ingredients: ["1 spoon of flowers", "1 cup water"], preparation: "1. Boil water.\n2. Add flowers.\n3. Cover for 5 mins.\n4. Strain and drink warm.", contraindications: "People allergic to pollen." });
fill('en', 2, { description: "Strong smelling herb, common in Andean gardens.", uses: "Menstrual pain, 'bad air', energy cleansing.", ingredients: ["Small bunch of leaves", "1 liter water"], preparation: "1. Boil water with plant for 5 mins.\n2. Let cool slightly.\n3. Drink half a cup for stomach pain.", contraindications: "Do not use during pregnancy (can be abortive)." });
fill('en', 3, { description: "Large tree with aromatic leaves, very common.", uses: "Respiratory, cough, flu, decongestant.", ingredients: ["10 mature leaves", "2 liters water"], preparation: "1. Boil water with leaves in a large pot.\n2. Remove from fire when steaming.\n3. Cover head with towel and inhale steam.", contraindications: "Do not ingest essential oil. Caution with asthmatic children." });
fill('en', 4, { description: "Plant with stinging hairs.", uses: "Circulation, muscle pain, arthritis.", ingredients: ["Bunch of fresh nettle (use gloves)"], preparation: "1. Gently hit painful area with fresh plant to activate circulation.\n2. Tea: Use 3 leaves in boiling water.", contraindications: "Irritates skin. Use with caution." });
fill('en', 5, { description: "Small plant with sedative roots.", uses: "Insomnia, nerves, anxiety, stress.", ingredients: ["1 tsp dried root", "1 cup water"], preparation: "1. Boil water.\n2. Add root and simmer 3 mins.\n3. Let sit and drink before sleep.", contraindications: "Do not mix with alcohol or sleeping pills." });
fill('en', 6, { description: "Kitchen herb found in stores.", uses: "Stomach colic, gas, heavy digestion.", ingredients: ["1 spoon oregano", "1 cup boiling water"], preparation: "1. Put oregano in cup.\n2. Add boiling water.\n3. Cover for 5 mins.\n4. Drink warm.", contraindications: "None in food doses." });
fill('en', 7, { description: "Wild plant with purple flowers.", uses: "Fever, liver, mild depression.", ingredients: ["1 small branch", "1 cup water"], preparation: "1. Boil water.\n2. Add plant.\n3. Let sit 5 mins.\n4. Drink with lemon.", contraindications: "Do not use in pregnancy." });
fill('en', 8, { description: "Red latex from Amazonian tree bark.", uses: "Powerful healing, gastric ulcers, wounds.", ingredients: ["Drops of pure latex"], preparation: "1. Wounds: Apply directly and rub until white foam appears.\n2. Gastritis: Dilute 5 drops in warm water.", contraindications: "Do not exceed dose. Can cause constipation." });
fill('en', 9, { description: "Strong smelling aromatic herb.", uses: "Intestinal parasites, stomach pain.", ingredients: ["1 branch Paico", "1 cup water"], preparation: "1. Juice fresh leaves (parasites).\n2. Mild tea for stomach pain.", contraindications: "Toxic in high doses. No children or pregnancy." });
fill('en', 10, { description: "Shrub with lemon-scented leaves.", uses: "Nerves, insomnia, digestion.", ingredients: ["3 leaves", "1 cup hot water"], preparation: "1. Put leaves in cup with boiling water.\n2. Let sit 5 mins.\n3. Drink warm.", contraindications: "None known." });
fill('en', 11, { description: "Shrub with small, strong smelling leaves.", uses: "Bad energy, menstrual cramps, cleansing.", ingredients: ["Small branch", "1 liter water (bath)"], preparation: "1. Cleansing: Boil in water and bathe.\n2. Cramps: One leaf in boiling water (caution).", contraindications: "FORBIDDEN in pregnancy (abortive)." });
fill('en', 12, { description: "Herb with broad leaves.", uses: "Inflammation, ulcers, gastritis, wounds.", ingredients: ["3 washed leaves", "1 cup water"], preparation: "1. Tea: Add leaves to boiling water.\n2. Wounds: Crush fresh leaves and apply.", contraindications: "None in normal doses." });
fill('en', 13, { description: "Shrub with sticky resinous leaves.", uses: "Blows, sprains, inflammation, bone cold.", ingredients: ["Bunch of branches", "Alcohol (optional)"], preparation: "1. Heat branches over fire.\n2. Place hot branches on pain area.\n3. Bandage and leave overnight.", contraindications: "External use only." });
fill('en', 14, { description: "Strong bitter plant, grey-green leaves.", uses: "Cold, stomach pain, arthritis.", ingredients: ["1 branch", "1 liter water"], preparation: "1. Boil water with plant.\n2. Use for sitz baths or washing legs.", contraindications: "Do not use in pregnancy." });
// Remedios English
fill('en', 15, { description: "Traditional hot drink.", uses: "Flu, cold, sore throat.", ingredients: ["Panela sugar", "Lemon", "Water"], preparation: "1. Boil water with panela.\n2. Add lemon.\n3. Drink hot.", contraindications: "Diabetics be careful." });
fill('en', 16, { description: "Salt water solution.", uses: "Sore throat.", ingredients: ["Salt", "Warm water"], preparation: "1. Mix salt in water.\n2. Gargle for 30 seconds.\n3. Spit out.", contraindications: "Do not swallow." });
fill('en', 17, { description: "Cinnamon tea.", uses: "Cold, cramps.", ingredients: ["Cinnamon", "Water"], preparation: "1. Boil cinnamon.\n2. Drink hot.", contraindications: "High blood pressure caution." });
fill('en', 18, { description: "Natural gel from Aloe leaf.", uses: "Sunburn, gastritis, dry skin.", ingredients: ["1 Aloe leaf"], preparation: "1. Soak leaf overnight in water.\n2. Extract clear gel.\n3. Apply to skin or blend with water to drink.", contraindications: "Do not eat the yellow latex." });
fill('en', 19, { description: "Spicy medicinal root.", uses: "Nausea, sore throat, cold.", ingredients: ["Ginger", "Honey", "Water"], preparation: "1. Crush ginger.\n2. Boil in water.\n3. Add honey.", contraindications: "Sensitive stomachs caution." });
fill('en', 20, { description: "Raw garlic clove.", uses: "High blood pressure, immune system.", ingredients: ["1 garlic clove"], preparation: "1. Chop garlic.\n2. Swallow with water like a pill.", contraindications: "Bleeding disorders consult doctor." });
fill('en', 21, { description: "Small fiber-rich seeds.", uses: "Constipation, digestion.", ingredients: ["Flaxseed", "Water"], preparation: "1. Soak seeds overnight.\n2. Drink the slimy water.", contraindications: "Drink plenty of water." });

// --- EMERGENCY CONTACTS ---
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { name: "Emergencias General", number: "911", type: "general" },
  { name: "Policía Nacional", number: "101", type: "police" },
  { name: "Centro Salud Cruz Loma", number: "171", type: "health" }
];

// --- FIRST AID GUIDES MULTI-LANG ---
const BASE_GUIDES_DATA = [
  { 
    id: 'rcp', 
    icon: '🫀',
    image: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'choking', 
    icon: '🤢',
    image: 'https://images.unsplash.com/photo-1531945837087-6112b144d507?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'burns', 
    icon: '🔥',
    image: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1b98?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'cuts', 
    icon: '🩸',
    image: 'https://images.unsplash.com/photo-1613310023042-ad79320c00fc?auto=format&fit=crop&w=800&q=80',
  },
  { 
    id: 'fever', 
    icon: '🌡️',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80',
  }
];

export const GUIDES_BY_LANG = {
  es: [
    { ...BASE_GUIDES_DATA[0], title: 'RCP (Reanimación)', content: '1. Verifique si responde y respira.\n2. Llame al 911.\n3. Manos al centro del pecho.\n4. Comprima fuerte y rápido (100/min).\n5. No pare hasta que llegue ayuda.' },
    { ...BASE_GUIDES_DATA[1], title: 'Atragantamiento', content: '1. Abrácela por detrás.\n2. Puño sobre el ombligo.\n3. Presione adentro y arriba.\n4. Repita hasta expulsar objeto.' },
    { ...BASE_GUIDES_DATA[2], title: 'Quemaduras', content: '1. Agua fría (no helada) 10 min.\n2. Cubra con tela limpia.\n3. NO use hielo ni pasta dental.' },
    { ...BASE_GUIDES_DATA[3], title: 'Cortes', content: '1. Lave con agua y jabón.\n2. Presione fuerte para parar sangre.\n3. Eleve la herida.\n4. Si no para, vaya al médico.' },
    { ...BASE_GUIDES_DATA[4], title: 'Fiebre Alta', content: '1. Ropa ligera.\n2. Mucho líquido.\n3. Paños de agua tibia.\n4. Si no baja, médico.' }
  ],
  qu: [
    { ...BASE_GUIDES_DATA[0], title: 'Kawsachina (RCP)', content: '1. Rikuy samanchu.\n2. 911 kayay.\n3. Makita shunkupi churay.\n4. Sinchita llapiy (100 kutin).\n5. Ama shayariychu.' },
    { ...BASE_GUIDES_DATA[1], title: 'Tkakay (Atraganto)', content: '1. Washamanta ugllay.\n2. Makita pupupi churay.\n3. Sinchita aysay.\n4. Llukchinakaman ruray.' },
    { ...BASE_GUIDES_DATA[2], title: 'Rupay (Quemadura)', content: '1. Chiri yakuwan mayllay (10 min).\n2. Yurak trapowan killpay.\n3. AMA hielota churaychu.' },
    { ...BASE_GUIDES_DATA[3], title: 'Chugri (Cortes)', content: '1. Yakuwan mayllay.\n2. Sinchita llapiy yawar ama llukshichun.\n3. Chugrita hatarichiy.' },
    { ...BASE_GUIDES_DATA[4], title: 'Rupay Unkuy (Fiebre)', content: '1. Chumpata llukchiy.\n2. Yakuta upyachiy.\n3. Kunuk yakuwan kakuna.\n4. Hampikman riy.' }
  ],
  en: [
    { ...BASE_GUIDES_DATA[0], title: 'CPR', content: '1. Check breathing.\n2. Call 911.\n3. Hands on center of chest.\n4. Push hard and fast (100/min).\n5. Don\'t stop.' },
    { ...BASE_GUIDES_DATA[1], title: 'Choking', content: '1. Hug from behind.\n2. Fist above navel.\n3. Thrust inward and upward.\n4. Repeat until cleared.' },
    { ...BASE_GUIDES_DATA[2], title: 'Burns', content: '1. Cool water (not ice) 10 min.\n2. Cover with clean cloth.\n3. NO ice or toothpaste.' },
    { ...BASE_GUIDES_DATA[3], title: 'Bleeding', content: '1. Wash with soap/water.\n2. Apply pressure to stop blood.\n3. Elevate wound.\n4. Seek doctor if needed.' },
    { ...BASE_GUIDES_DATA[4], title: 'High Fever', content: '1. Light clothing.\n2. Drink fluids.\n3. Warm water sponge.\n4. Seek doctor if persistent.' }
  ]
};

// Backward compatibility (default ES)
export const MOCK_PLANTS = PLANTS_BY_LANG.es;
export const FIRST_AID_GUIDES = GUIDES_BY_LANG.es;
