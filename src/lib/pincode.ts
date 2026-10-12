/**
 * Service Area PIN Code Registry & Validation
 *
 * Kailash Solar service territory covers:
 * - Meerut District (all 250xxx PIN codes & 245206)
 * - Modipuram (250110)
 * - Modinagar (201204, 201201)
 */

export const SERVICEABLE_PINCODES: Record<string, string> = {
  // Modinagar & Surrounding Areas (Ghaziabad District)
  "201201": "Modinagar (Govindpuri / Harmukhpuri / Churiyala)",
  "201204": "Modinagar (Main / Begmabad / Niwari / Patla / Tibra / Modipon / Bisokhar)",
  "201206": "Muradnagar / Duhai / Modinagar Border",
  "245304": "Bhojpur / Faridnagar (Modinagar Block)",

  // Modinagar & Meerut Border Areas (Hapur & Ghaziabad borders so no customer is lost)
  "245301": "Pilkhuwa (Modinagar / Bhojpur Border)",
  "245101": "Hapur (Main / Meerut Border)",
  "245102": "Hapur (Mandi / Meerut Border)",
  "245201": "Babugarh (Hapur / Meerut Border)",
  "201017": "Raj Nagar Extension / Duhai Border",
  "201003": "Morta / Meerut Road Border",

  // Modipuram & Meerut North
  "250110": "Modipuram / Pallavpuram / Siwaya / Dulhera",

  // Meerut District & Urban Areas
  "250001": "Meerut Cantt / Abu Lane / Ganganagar / Kanker Khera / Begum Bagh",
  "250002": "Meerut City / Lisari / Malyana / Delhi Road",
  "250003": "Meerut Kutchery / Saket / Civil Lines / University Road",
  "250004": "Meerut (Medical College / Shastri Nagar / CCS University / Jagriti Vihar)",
  "250005": "Meerut (MIET / Subharti / Baghpat Rd / Shobhapur)",
  "250103": "Meerut (Shatabdi Nagar / Partapur / Rithani)",
  "250104": "Kithore / Radhana (Meerut)",
  "250106": "Machhra (Meerut)",
  "250205": "Mohiuddinpur (Meerut-Modinagar Border)",
  "250221": "Daurala / Alipur (Meerut)",
  "250222": "Lawar (Meerut)",
  "250223": "Kapsad / Mandora (Meerut)",
  "250341": "Dabathwa / Khirwa Jalalpur (Meerut)",
  "250342": "Sardhana (Meerut)",
  "250344": "Sarawa / Karnawal / Khiwai (Meerut)",
  "250345": "Rohata (Meerut)",
  "250401": "Mawana (Meerut)",
  "250402": "Mawana Factory (Meerut)",
  "250404": "Hastinapur (Meerut)",
  "250406": "Parikshitgarh (Meerut)",
  "250501": "Jani / Siwal Khas (Meerut)",
  "250502": "Kharkhoda (Meerut)",
  "245206": "Kharkhuda / Ajrara / Atrara / Gagol (Meerut Border)",

  // Historic Meerut Postal Division (Baghpat / Baraut / Khekra)
  "250101": "Khekra (Western UP)",
  "250601": "Tatiri / Agarwal Mandi",
  "250606": "Aminagar Sarai",
  "250609": "Baghpat",
  "250611": "Baraut",
  "250617": "Chhaprauli",
  "250619": "Tikri",
  "250622": "Binauli",
  "250623": "Katha",
};

export const OUTSIDE_REGION_ERROR =
  "We currently serve only Meerut, Modipuram, and Modinagar, but we will expand to your area soon.";

/**
 * Checks if a given 6-digit PIN code is within our service area.
 */
export function isServiceablePincode(pincode: string): boolean {
  const cleaned = pincode.trim().replace(/\D/g, "");
  if (cleaned.length !== 6) return false;

  // Exact match in registry (covers Modinagar, Modipuram, and Meerut postal locations)
  if (cleaned in SERVICEABLE_PINCODES) return true;

  // All 250xxx codes belong to Meerut postal division
  if (cleaned.startsWith("250")) return true;

  return false;
}

/**
 * Returns the human-readable region name if serviceable, otherwise null.
 */
export function getPincodeRegion(pincode: string): string | null {
  const cleaned = pincode.trim().replace(/\D/g, "");
  if (!isServiceablePincode(cleaned)) return null;

  if (SERVICEABLE_PINCODES[cleaned]) {
    return SERVICEABLE_PINCODES[cleaned];
  }

  if (cleaned.startsWith("250")) {
    return "Meerut Region";
  }

  return "Meerut / Modinagar / Modipuram";
}

/**
 * Extracts a 6-digit PIN code from a string (e.g. an address line).
 */
export function extractPincode(text: string): string | null {
  if (!text) return null;
  const match = text.match(/\b\d{6}\b/);
  return match ? match[0] : null;
}

/**
 * Comprehensive validation function.
 */
export function validatePincode(pincode: string): {
  isValid: boolean;
  error?: string;
  region?: string;
} {
  const cleaned = pincode.trim().replace(/\D/g, "");

  if (!cleaned) {
    return {
      isValid: false,
      error: "PIN code is required. Please enter your 6-digit PIN code.",
    };
  }

  if (cleaned.length !== 6) {
    return {
      isValid: false,
      error: "Please enter a valid 6-digit PIN code.",
    };
  }

  if (!isServiceablePincode(cleaned)) {
    return {
      isValid: false,
      error: OUTSIDE_REGION_ERROR,
    };
  }

  return {
    isValid: true,
    region: getPincodeRegion(cleaned) || "Meerut / Modipuram / Modinagar",
  };
}
