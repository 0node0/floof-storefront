/** Inline SVG icons — stroke style, currentColor. No emoji. */
import type { ReactNode } from "react"

export type IconName =
  | "truck"
  | "lock"
  | "return"
  | "palm"
  | "cart"
  | "check"
  | "package"
  | "pin"
  | "alert"
  | "shirt"
  | "hoodie"
  | "spark"
  | "star"
  | "close"
  | "chevron"
  | "party"

interface Props {
  name: IconName
  className?: string
  /** Accessible label; omit for decorative icons */
  title?: string
  size?: number
}

const paths: Record<IconName, ReactNode> = {
  truck: (
    <>
      <path d="M1 3h10v10H1z" />
      <path d="M11 6h4l3 3v4h-7V6z" />
      <circle cx="5" cy="16" r="1.5" />
      <circle cx="15" cy="16" r="1.5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="9" width="10" height="8" rx="1.5" />
      <path d="M7 9V6.5a2.5 2.5 0 0 1 5 0V9" />
    </>
  ),
  return: (
    <>
      <path d="M3 8h9a4 4 0 0 1 0 8H7" />
      <path d="M6 5L3 8l3 3" />
    </>
  ),
  palm: (
    <>
      <path d="M9 17V9" />
      <path d="M9 10c-2-3-5-3.5-6-2 2 0 4 1.5 5 3.5" />
      <path d="M9 9c0-3.5-2-6-1-7 0 2 1.5 4 2 6" />
      <path d="M9 9c2-3 5-3.5 6-2-2 0-4 1.5-5 3.5" />
      <path d="M9 17h2" />
    </>
  ),
  cart: (
    <>
      <circle cx="7" cy="17" r="1.2" />
      <circle cx="15" cy="17" r="1.2" />
      <path d="M2 3h2l1.5 9h10l2-6H6" />
    </>
  ),
  check: (
    <>
      <path d="M4 10l3.5 3.5L14 6" />
    </>
  ),
  package: (
    <>
      <path d="M3 7l6-3 6 3v8l-6 3-6-3V7z" />
      <path d="M3 7l6 3 6-3" />
      <path d="M9 10v8" />
    </>
  ),
  pin: (
    <>
      <path d="M9 16s5-4 5-8a5 5 0 1 0-10 0c0 4 5 8 5 8z" />
      <circle cx="9" cy="8" r="1.5" />
    </>
  ),
  alert: (
    <>
      <path d="M9 3L2 16h14L9 3z" />
      <path d="M9 8v4" />
      <circle cx="9" cy="14" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  shirt: (
    <>
      <path d="M6 5l3 2h2l3-2 3 2-2 3h-1v8H6V10H5L3 7l3-2z" />
    </>
  ),
  hoodie: (
    <>
      <path d="M6 8c0-2.5 1.5-4 4-4s4 1.5 4 4v2" />
      <path d="M5 10h10v8H5z" />
      <path d="M5 12H3v4h2" />
      <path d="M15 12h2v4h-2" />
      <path d="M9 8v2" />
    </>
  ),
  spark: (
    <>
      <path d="M9 2v4M9 14v4M2 9h4M14 9h4" />
      <path d="M4.5 4.5l2.5 2.5M13 13l2.5 2.5M13.5 4.5L11 7M7 11l-2.5 2.5" />
    </>
  ),
  star: (
    <>
      <path d="M9 2.5l1.8 4.2 4.5.4-3.4 3 1 4.4L9 12.3l-3.9 2.2 1-4.4-3.4-3 4.5-.4L9 2.5z" />
    </>
  ),
  close: (
    <>
      <path d="M5 5l8 8M13 5l-8 8" />
    </>
  ),
  chevron: (
    <>
      <path d="M5 7l4 4 4-4" />
    </>
  ),
  party: (
    <>
      <path d="M4 14l6-10 2 4 4 1-7 8H4z" />
      <path d="M12 4v2M15 6l1.5 1.5M16 10h2" />
    </>
  ),
}

export default function Icon({ name, className = "", title, size = 20 }: Props) {
  const decorative = !title
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={decorative ? true : undefined}
      role={decorative ? undefined : "img"}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  )
}
