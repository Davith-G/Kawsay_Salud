

export enum ViewName {
  HOME = 'HOME',
  NATURAL = 'NATURAL',
  CHAT = 'CHAT',
  MAP = 'MAP',
  AUXILIO = 'AUXILIO'
}

export type Language = 'es' | 'qu' | 'en';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface Plant {
  id: number | string; // Allow string IDs for AI generated plants
  nameKichwa: string;
  nameSpanish: string;
  description: string;
  uses: string;
  imageUrl: string;
  // New fields for recipes
  ingredients?: string[];
  preparation?: string;
  contraindications?: string;
  isAiGenerated?: boolean;
  category?: 'plant' | 'remedy'; // Nuevo campo para filtro
}

export interface EmergencyContact {
  name: string;
  number: string;
  type: 'general' | 'police' | 'health';
}

// Gemini Types
export interface PlaceResult {
  name: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  schedule: string;
  address: string;
  distance: string;
  type: 'hospital' | 'pharmacy' | 'other';
  uri?: string; // Link to google maps
  lat?: number;
  lng?: number;
}

export interface MapGroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface SavedPlace {
  title: string;
  uri: string;
  addedAt: number;
  rating?: number;
  address?: string;
}