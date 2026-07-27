import { useState } from "react"
import { sizeGuide } from "@/lib/product"

interface Props {
  category?: string
}

export default function SizeGuide({ category = "tees" }: Props) {
  const [open, setOpen] = useState(false)
  const guide =
    category === "hoodies" ? sizeGuide.hoodies : sizeGuide.tees

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-accent underline underline-offset-2 hover:text-secondary"
      >
        Size guide
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="size-guide-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-paper/80 backdrop-blur-sm"
            aria-label="Close size guide"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full sm:max-w-lg border-[3px] border-ink bg-paper shadow-[10px_10px_0_0_var(--color-accent)] max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex items-center justify-between border-b-[3px] border-ink bg-paper-2 px-6 py-4">
              <h2 id="size-guide-title" className="font-display text-lg text-ink">
                {guide.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center border-[2px] border-ink hover:bg-accent hover:text-accent-ink text-ink"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l8 8M13 5l-8 8" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-ink-2 mb-4 normal-case tracking-normal font-normal">{guide.note}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Measurements in {guide.unit}
              </p>
              <table className="w-full text-sm border-[2px] border-ink">
                <thead>
                  <tr className="border-b-[2px] border-ink text-left text-muted bg-paper-2">
                    <th className="py-2 px-3 font-medium">Size</th>
                    <th className="py-2 px-3 font-medium">Chest</th>
                    <th className="py-2 px-3 font-medium">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row) => (
                    <tr key={row.size} className="border-b border-ink/20 last:border-0">
                      <td className="py-3 px-3 font-semibold text-ink">{row.size}</td>
                      <td className="py-3 px-3 text-ink-2">{row.chest}</td>
                      <td className="py-3 px-3 text-ink-2">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-muted normal-case tracking-normal font-normal">
                Print-on-demand blanks can vary slightly by manufacturer. When in doubt, size up.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
