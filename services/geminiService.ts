import { GoogleGenAI, Chat, GenerateContentResponse, Tool, Type } from "@google/genai";
import { PlaceResult, Plant, Language } from "../types";

// En el proceso de build de Vite, process.env.API_KEY será reemplazado por el valor real.
// @ts-ignore
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("API_KEY no encontrada. Asegúrate de configurar el archivo .env y vite.config.ts");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "AIzaSyCSTNRmF2qs-YXdW5ZDTf4z39Z0QtArFbA" });

/**
 * Chatbot Service using Gemini 3 Pro Preview
 * Contextualized for Chimborazo community (Traditional + Modern Medicine)
 */
let chatSession: Chat | null = null;
let currentLanguage: Language = 'es';

export const initializeChat = (language: Language = 'es') => {
  if (!apiKey) return; // Don't initialize if no key
  
  // Only re-initialize if language changed or session is null
  if (chatSession && currentLanguage === language) return;
  
  currentLanguage = language;
  
  let systemInstruction = "";

  if (language === 'qu') {
    systemInstruction = `Kanka "Yachak" kanki, shuk hampik antanikik (asistente virtual) Cruz Loma, Chimborazo ayllullaktapak.
    
    Kamba ruraykuna:
    1. Hampi yachayta willay, mishu hampikunawan (medicina moderna) y runa hampikunawan (medicina tradicional) tantachishpa.
    2. Alli shimita rimay, kuyaywan, Kichwa shimipi rimay. Runashimita alli yachanki.
    3. Unguy sinchi kakpi (yawarta chinkachikpi, mana samayta ushakpi), NIH HAMPINA WASIMAN riy ninki.
    4. Hampi yurakunata riksichiy (manzanilla, matico, eucalipto).
    5. Chimborazo urku kawsayta riksinki.
    
    AMA "diagnóstico" kukuypachu. Kanqa yanapaklla kanki.`;
  } else if (language === 'en') {
    systemInstruction = `You are "Yachak", a virtual health assistant designed for the community of Cruz Loma, Chimborazo, Ecuador.
    
    Your main goals are:
    1. Provide health information integrating modern medicine with traditional Andean medicine.
    2. Speak in an empathetic, respectful, and clear tone in ENGLISH.
    3. If the user mentions severe symptoms (severe chest pain, difficulty breathing, heavy bleeding), ALWAYS recommend going to a health center immediately.
    4. When suggesting natural remedies (e.g., chamomile, matico, eucalyptus), explain what they are for and how to prepare them safely.
    5. You know the local context: high altitude, cold weather, Andean diet.
    
    DO NOT give definitive medical diagnoses. You are an informative guide.`;
  } else {
    // Default Spanish
    systemInstruction = `Eres "Yachak", un asistente de salud virtual diseñado para la comunidad de Chimborazo, Ecuador, como parte del proyecto Kawsay Salud.
        
    Tus objetivos principales son:
    1. Proveer información sobre salud integrando la medicina moderna (occidental) con la medicina tradicional andina (remedios naturales, plantas, saberes ancestrales).
    2. Hablar con un tono empático, respetuoso y claro, usando español accesible. Puedes usar palabras en Kichwa como "Alli Puncha" (Buenos días) o "Yupaychani" (Gracias).
    3. Si el usuario menciona síntomas graves (dolor torácico fuerte, dificultad para respirar, sangrado profuso, etc.), SIEMPRE recomienda acudir inmediatamente a un centro de salud u hospital.
    4. Cuando sugieras remedios naturales (ej. manzanilla, matico, eucalipto), explica para qué sirven y cómo prepararlos de forma segura.
    5. Conoces el contexto local: altura, frío, alimentación de la sierra ecuatoriana.
    
    NO des diagnósticos médicos definitivos. Eres una guía informativa y de apoyo.`;
  }

  try {
    chatSession = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction,
      },
    });
  } catch (e) {
    console.error("Error initializing chat", e);
  }
};

export const sendMessageStream = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!apiKey) throw new Error("API Key faltante. Configura tu entorno.");
  
  if (!chatSession) {
    initializeChat(currentLanguage);
  }
  if (!chatSession) throw new Error("No se pudo iniciar la sesión de chat.");

  try {
    return await chatSession.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    // Re-initialize on error in case session expired
    initializeChat(currentLanguage);
    if (chatSession) {
         return await chatSession.sendMessageStream({ message });
    }
    throw error;
  }
};

/**
 * Maps Grounding Service using Gemini 2.5 Flash
 * Finds nearby hospitals and clinics with Structured Data
 */
export const findNearbyPlaces = async (
  query: string, 
  latitude?: number, 
  longitude?: number
): Promise<PlaceResult[]> => {
  if (!apiKey) return [];

  const tools: Tool[] = [{ googleMaps: {} }];
  
  // Construct tool config only if coords are present
  const toolConfig = (latitude && longitude) ? {
    retrievalConfig: {
      latLng: {
        latitude,
        longitude
      }
    }
  } : undefined;

  try {
    // NOTA: Google Maps Tool no soporta 'responseMimeType: application/json'
    // Debemos pedir el JSON explícitamente en el prompt.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Eres un asistente de datos de geolocalización.
      Tarea: Busca en Google Maps: "${query}" cerca de la ubicación provista (Lat: ${latitude}, Lng: ${longitude}).
      
      IMPORTANTE:
      1. Debes generar un JSON array puro. NO agregues texto conversacional antes ni después.
      2. Extrae al menos 10 lugares relevantes. Intenta encontrar la mayor cantidad posible.
      3. Si la herramienta de mapas no te da coordenadas exactas, DEBES ESTIMARLAS (inventar coordenadas plausibles) que estén muy cerca (a menos de 2km) de la ubicación del usuario (${latitude}, ${longitude}).
      
      Formato JSON Requerido:
      [
        {
          "name": "Nombre del lugar",
          "rating": 4.5,
          "reviews": 120,
          "isOpen": true,
          "schedule": "Abierto hasta las 20:00",
          "address": "Dirección completa",
          "distance": "Ej: 1.2 km",
          "type": "hospital" | "pharmacy" | "other",
          "lat": -1.6640,
          "lng": -78.6550
        }
      ]`,
      config: {
        tools,
        toolConfig,
      },
    });

    if (response.text) {
        let cleanText = response.text.trim();
        // Limpiar bloques de código markdown si la IA los incluye
        cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            // Intentar parsear el JSON
            const places = JSON.parse(cleanText) as PlaceResult[];
            
            if (places && places.length > 0) {
                 const enhancedPlaces = places.map((p, index) => {
                   // Fallback coordinate generator (scatter around user)
                   // Scatter slightly more to avoid overlap
                   const fallbackLat = (latitude || -1.6635) + (Math.random() - 0.5) * 0.025;
                   const fallbackLng = (longitude || -78.6546) + (Math.random() - 0.5) * 0.025;

                   return {
                    ...p,
                    lat: p.lat || fallbackLat,
                    lng: p.lng || fallbackLng,
                    uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + " " + p.address)}`
                   };
                });
                return enhancedPlaces;
            }
        } catch (parseError) {
            console.warn("Error parseando JSON de mapas, usando fallback simulado:", parseError);
        }
    }
    
    // FALLBACK SIMULADO: Si la API no devuelve JSON válido, generamos datos mockeados 
    // alrededor de la ubicación del usuario para que el mapa no quede vacío.
    const fallbackPlaces: PlaceResult[] = [
        {
            name: `${query} Central (Simulado)`,
            rating: 4.5,
            reviews: 120,
            isOpen: true,
            schedule: "Abierto 24 horas",
            address: "Av. Principal, Riobamba",
            distance: "0.5 km",
            type: query.toLowerCase().includes('farmacia') ? 'pharmacy' : 'hospital',
            lat: (latitude || -1.6635) + 0.002,
            lng: (longitude || -78.6546) + 0.002,
            uri: "#"
        },
        {
            name: `${query} Norte (Simulado)`,
            rating: 4.0,
            reviews: 85,
            isOpen: false,
            schedule: "Cierra a las 20:00",
            address: "Calle Norte, Riobamba",
            distance: "1.2 km",
            type: query.toLowerCase().includes('farmacia') ? 'pharmacy' : 'hospital',
            lat: (latitude || -1.6635) - 0.003,
            lng: (longitude || -78.6546) - 0.001,
            uri: "#"
        },
        {
            name: `${query} Cruz Loma (Simulado)`,
            rating: 4.8,
            reviews: 200,
            isOpen: true,
            schedule: "Abierto 24 horas",
            address: "Sector Cruz Loma",
            distance: "0.2 km",
            type: query.toLowerCase().includes('farmacia') ? 'pharmacy' : 'hospital',
            lat: (latitude || -1.6635) + 0.001,
            lng: (longitude || -78.6546) - 0.003,
            uri: "#"
        },
        {
            name: `${query} Sur (Simulado)`,
            rating: 3.8,
            reviews: 45,
            isOpen: true,
            schedule: "Abierto hasta 22:00",
            address: "Sector Sur, Riobamba",
            distance: "1.5 km",
            type: query.toLowerCase().includes('farmacia') ? 'pharmacy' : 'hospital',
            lat: (latitude || -1.6635) - 0.005,
            lng: (longitude || -78.6546) + 0.004,
            uri: "#"
        },
         {
            name: `${query} El Sol (Simulado)`,
            rating: 4.2,
            reviews: 150,
            isOpen: true,
            schedule: "24 horas",
            address: "Av. Los Andes",
            distance: "0.8 km",
            type: query.toLowerCase().includes('farmacia') ? 'pharmacy' : 'hospital',
            lat: (latitude || -1.6635) + 0.004,
            lng: (longitude || -78.6546) + 0.001,
            uri: "#"
        },
        {
            name: `${query} Comunitario (Simulado)`,
            rating: 4.9,
            reviews: 30,
            isOpen: true,
            schedule: "08:00 - 18:00",
            address: "Plaza Central",
            distance: "0.3 km",
            type: query.toLowerCase().includes('farmacia') ? 'pharmacy' : 'hospital',
            lat: (latitude || -1.6635) - 0.001,
            lng: (longitude || -78.6546) + 0.003,
            uri: "#"
        }
    ];

    return fallbackPlaces;

  } catch (error) {
    console.error("Error in Maps Grounding:", error);
    return [];
  }
};

/**
 * Traditional Medicine Advisor
 * Uses standard generation to give specific comparisons or advice.
 */
export const getTraditionalAdvice = async (symptom: string): Promise<string> => {
  if (!apiKey) return "Error: Falta la API Key.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `El usuario consulta por: "${symptom}".
      
      Genera una respuesta breve y estructurada en formato Markdown con dos secciones:
      1. **Visión Ancestral/Natural**: Sugiere 1 o 2 remedios naturales comunes en la sierra ecuatoriana (Chimborazo) para esto. Menciona plantas como Matico, Manzanilla, Eucalipto, etc.
      2. **Visión Médica General**: Sugiere cuidados básicos o medicación de venta libre común, y cuándo ver a un doctor.
      
      Responde en el idioma que el usuario está usando o asume Español si no es claro.`,
    });
    return response.text || "No pude generar un consejo en este momento.";
  } catch (error) {
    console.error("Error getting traditional advice:", error);
    return "Error al consultar la sabiduría ancestral.";
  }
};

/**
 * Generates a structured plant recipe using Gemini JSON mode.
 */
export const getPlantDetails = async (plantName: string): Promise<Plant> => {
    if (!apiKey) throw new Error("API Key faltante");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provee información detallada sobre la planta medicinal: "${plantName}" en el contexto de la medicina tradicional de los Andes (Ecuador).
        Necesito nombre en Kichwa (si existe, o inventalo basado en descripción visual si no es común), nombre español, usos, una imagen generada (sigue las instrucciones de schema), ingredientes para un remedio y pasos de preparación.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
                nameSpanish: { type: Type.STRING },
                nameKichwa: { type: Type.STRING },
                description: { type: Type.STRING },
                uses: { type: Type.STRING },
                imageUrl: { type: Type.STRING, description: "Construct a URL for an AI image using this format: https://image.pollinations.ai/prompt/medicinal%20plant%20{EnglishNameOfPlant}%20natural%20photography?width=800&height=600&nologo=true" },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                preparation: { type: Type.STRING, description: "Numbered steps for preparation." },
                contraindications: { type: Type.STRING }
            },
            required: ["nameSpanish", "nameKichwa", "description", "uses", "ingredients", "preparation", "contraindications", "imageUrl"]
          }
        }
      });

      if (response.text) {
          const data = JSON.parse(response.text);
          return {
              id: Date.now(), // Temporary ID
              ...data,
              isAiGenerated: true
          } as Plant;
      }
      throw new Error("Empty response");

    } catch (error) {
        console.error("Error fetching plant details", error);
        throw error;
    }
}