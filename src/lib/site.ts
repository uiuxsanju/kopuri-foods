/** Brand-wide constants and WhatsApp helpers for Kopuri Foods. */

export const BRAND = {
  name: "Kopuri Foods",
  tagline: "Andhra Originals",
  phoneDisplay: "+91 94943 15894",
  /** wa.me requires digits only, with country code and no symbols. */
  phoneDigits: "919494315894",
  telHref: "tel:+919494315894",
  email: "kopurifoods@gmail.com",
  address: {
    line1: "1123-18-3247, Krishna Tulasi Nagar",
    line2: "Swarnabharathi Nagar, Peda Palakaluru",
    line3: "Andhra Pradesh 522006, India",
  },
} as const;

export const ADDRESS_ONE_LINE = `${BRAND.address.line1}, ${BRAND.address.line2}, ${BRAND.address.line3}`;

export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS_ONE_LINE,
)}`;

/** Builds a wa.me deep link that works on mobile app and WhatsApp Web alike. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${BRAND.phoneDigits}?text=${encodeURIComponent(message)}`;
}

export const GENERAL_ENQUIRY = whatsappUrl(
  `Hello ${BRAND.name}, I would like to know more about your karam, pickles and spice powders.`,
);

export function mailtoUrl(subject: string): string {
  return `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}`;
}
