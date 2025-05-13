export const ROOM_TYPES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Dining Room",
  "Outdoor Patio",
  "Kids Room",
  "Nursery",
  "Hallway",
  "Basement",
  "Attic",
  "Garage",
  "Entryway",
  "Laundry Room",
  "Sunroom",
  "Home Gym",
  "Playroom",
  "Guest Room",
  "Studio Apartment",
] as const;

export const DESIGN_STYLES = [
  "Minimalist",
  "Scandinavian",
  "Modern",
  "Bohemian (Boho)",
  "Industrial",
  "Farmhouse (Modern Farmhouse)",
  "Coastal (Hamptons)",
  "Mid-Century Modern",
  "Art Deco",
  "Traditional",
  "Contemporary",
  "Rustic",
  "Shabby Chic",
  "Hollywood Glam",
  "Japandi",
  "Biophilic",
  "Maximalist",
  "Eclectic",
  "Transitional",
  "Tropical",
] as const;

export const COLOR_PALETTES = [
  { name: "Neutral Serenity", primary: "Light Gray", secondary: "Beige" },
  { name: "Cool Blues", primary: "Navy Blue", secondary: "Sky Blue" },
  { name: "Warm Earth Tones", primary: "Terracotta", secondary: "Olive Green" },
  { name: "Monochromatic Grays", primary: "Charcoal Gray", secondary: "Light Silver" },
  { name: "Vibrant Contrast", primary: "Teal", secondary: "Mustard Yellow" },
  { name: "Pastel Dreams", primary: "Lavender", secondary: "Mint Green" },
  { name: "Bold & Dramatic", primary: "Emerald Green", secondary: "Deep Plum" },
  { name: "Earthy Greens", primary: "Forest Green", secondary: "Sage Green"},
  { name: "Sunny Yellows", primary: "Lemon Yellow", secondary: "Pale Yellow"},
  { name: "Romantic Pinks", primary: "Dusty Rose", secondary: "Blush Pink"},
] as const;

export const FURNITURE_STYLES = [
  "Classic & Timeless",
  "Modern & Sleek (IKEA-like)",
  "Luxury & Ornate",
  "Rustic & Reclaimed",
  "Vintage & Retro",
  "Minimalist & Functional",
  "Custom (describe below)",
] as const;

export const BUDGET_LEVELS = [
  "Affordable & Budget-Friendly",
  "Mid-Range & Balanced",
  "Premium & High-End",
] as const;

export const LIGHTING_PREFERENCES = [
  "Warm & Cozy (e.g., soft yellow light)",
  "Cool & Crisp (e.g., bright white light)",
  "Ambient & Diffused (e.g., general, even lighting)",
  "Natural Light Simulation (e.g., bright, airy, sunlit)",
  "Dramatic & Accent (e.g., spotlights, uplighting)",
] as const;


export type RoomType = typeof ROOM_TYPES[number];
export type DesignStyle = typeof DESIGN_STYLES[number];
export type ColorPaletteOption = typeof COLOR_PALETTES[number]['name'];
export type FurnitureStyleOption = typeof FURNITURE_STYLES[number];
export type BudgetLevelOption = typeof BUDGET_LEVELS[number];
export type LightingPreferenceOption = typeof LIGHTING_PREFERENCES[number];
