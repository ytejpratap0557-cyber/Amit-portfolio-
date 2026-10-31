// Single source of truth. Edit here. Leave stats empty ("") to hide them. Nothing below is invented.
export const site = {
  name: "Amit Nagvanshi", title: "Content Creator", location: "Kolkata, West Bengal, India",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "", // add business email to show it in Media Kit
  portrait: "/images/amit.svg", // replace with /images/amit.jpg and update this path
  youtube: { handle: "@amit_nagvanshi23", url: "https://www.youtube.com/@amit_nagvanshi23" },
  instagram: { handle: "@nagvanshiamit23", url: "https://www.instagram.com/nagvanshiamit23/" },
  about: [
    "Placeholder: write Amit's story here — how he started creating and what drives him.",
    "Placeholder: describe his creative philosophy and the kind of content he makes.",
  ],
  categories: [] as string[], // shown in Media Kit only if filled
  stats: { youtubeSubscribers: "", instagramFollowers: "", totalViews: "", contentPublished: "" },
  pastBrands: [] as string[], // verified only
};
export const services = [
  ["Sponsored Content", "Dedicated content built around your brand message.", "Megaphone"],
  ["Instagram Reels Promotion", "Short-form reels made for reach and recall.", "Clapperboard"],
  ["YouTube Brand Integration", "Natural integrations inside long-form videos.", "Youtube"],
  ["Product Promotion", "Put your product in front of an engaged audience.", "Rocket"],
  ["Product Reviews", "Honest, detailed reviews in Amit's own voice.", "Star"],
  ["Creative Campaigns", "Concept-led campaigns across platforms.", "Sparkles"],
  ["Brand Partnerships", "Long-term collaborations that grow with your brand.", "Handshake"],
] as const;
