import { useState } from "react"

type Props = {
  images: string[]
  alt: string
  phrase?: string
  variant?: "default" | "bare"
}

/**
 * PDP image gallery — main shot + selectable thumbs (lifestyle mockups).
 */
export default function ProductGallery({
  images,
  alt,
  phrase,
  variant = "default",
}: Props) {
  const shots = images.filter(Boolean)
  const [active, setActive] = useState(0)
  const current = shots[active] || shots[0]
  const bare = variant === "bare"
  const shellClass = bare ? "product-pdp-gallery product-pdp-gallery--bare min-w-0" : "border-[3px] border-ink min-w-0"
  const mainClass = bare
    ? "product-pdp-gallery__main aspect-square flex items-center justify-center overflow-hidden"
    : "aspect-square bg-cream p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-hidden"
  const thumbRailClass = bare
    ? "product-pdp-gallery__thumbs p-2 sm:p-3"
    : "border-t-[3px] border-ink bg-paper-2 p-2 sm:p-3"
  const footnoteClass = bare
    ? "product-pdp-gallery__note text-center text-xs font-mono py-2"
    : "text-center text-xs font-mono text-muted py-3 border-t-[3px] border-ink bg-paper-2"

  if (!current) {
    return (
      <div className={shellClass}>
        <div className={mainClass}>
          <span className="font-display text-4xl md:text-5xl text-paper leading-tight text-center">
            {phrase || alt}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={shellClass}>
      <div className={mainClass}>
        <img
          key={current}
          src={current}
          alt={alt}
          className="w-full h-full object-contain"
          loading="eager"
          width={800}
          height={800}
          data-product-fly-source
        />
      </div>

      {shots.length > 1 && (
        <div className={thumbRailClass}>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="listbox"
            aria-label="Product images"
          >
            {shots.map((src, i) => {
              const selected = i === active
              return (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  aria-label={`View image ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-[2px] overflow-hidden bg-cream transition-colors ${
                    selected
                      ? "border-accent ring-2 ring-accent"
                      : "border-ink/40 hover:border-ink"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={80}
                    height={80}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      <p className={footnoteClass}>
        Colors shown as digital mockups · final print may vary slightly
      </p>
    </div>
  )
}
