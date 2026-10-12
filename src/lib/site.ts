function envUrl(key: string): string | undefined {
  const value = import.meta.env[key]
  if (typeof value === "string" && value.trim()) return value.trim()
  return undefined
}

export const site = {
  name: "Floof",
  tagline: "Ink first. Clothes second.",
  description:
    "Floof is a Southwest Florida clothing brand — witty tees and hoodies printed fresh when you order. Soft blanks, sharp wit, no deadstock.",
  url: envUrl("PUBLIC_SITE_URL") ?? "https://floof.space",
  location: "Southwest Florida",
  email: envUrl("PUBLIC_CONTACT_EMAIL") ?? "hello@floof.space",
  social: {
    instagram: envUrl("PUBLIC_SOCIAL_INSTAGRAM"),
    tiktok: envUrl("PUBLIC_SOCIAL_TIKTOK"),
    x: envUrl("PUBLIC_SOCIAL_X"),
  },
}

export interface SocialLink {
  label: string
  href: string
}

export function configuredSocialLinks(): SocialLink[] {
  const links: SocialLink[] = []
  if (site.social.instagram) {
    links.push({ label: "Instagram", href: site.social.instagram })
  }
  if (site.social.tiktok) {
    links.push({ label: "TikTok", href: site.social.tiktok })
  }
  if (site.social.x) {
    links.push({ label: "X", href: site.social.x })
  }
  return links
}
