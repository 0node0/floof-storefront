import { useState } from "react"

type Props = {
  images: string[]
  alt: string
  phrase?: string
}

/**
 * PDP image gallery — main shot + selectable thumbs (lifestyle mockups).
 */
export default function ProductGallery({ images, alt, phrase }: Props) {
  const shots = images.filter(Boolean)
  const [active, setActive] = useState(0)
  const current = shots[active] || shots[0]

  if (!current) {
    return (
      <div className="border-[3px] border-ink min-w-0">
        <div className="aspect-square bg-cream p-6 sm:p-8 md:p-12 flex items-center justify-center">
          <span className="font-display text-4xl md:text-5xl text-paper leading-tight text-center">
            {phrase || alt}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="border-[3px] border-ink min-w-0">
      <div className="aspect-square bg-cream p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-hidden">
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
        <div className="border-t-[3px] border-ink bg-paper-2 p-2 sm:p-3">
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

      <p className="text-center text-xs font-mono text-muted py-3 border-t-[3px] border-ink bg-paper-2">
        Colors shown as digital mockups · final print may vary slightly
      </p>
    </div>
  )
}
