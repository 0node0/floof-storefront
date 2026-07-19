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
        className="text-sm font-medium text-floof-pink underline underline-offset-2 hover:text-floof-coral"
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
            className="absolute inset-0 bg-floof-dark/50 backdrop-blur-sm"
            aria-label="Close size guide"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex items-center justify-between border-b border-floof-dark/5 bg-white px-6 py-4 rounded-t-3xl">
              <h2 id="size-guide-title" className="text-lg font-bold text-floof-dark">
                {guide.title}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full w-9 h-9 flex items-center justify-center hover:bg-floof-sand text-floof-dark/60"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 5l8 8M13 5l-8 8" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-floof-dark/60 mb-4">{guide.note}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-floof-dark/40 mb-2">
                Measurements in {guide.unit}
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-floof-dark/10 text-left text-floof-dark/50">
                    <th className="py-2 pr-2 font-medium">Size</th>
                    <th className="py-2 pr-2 font-medium">Chest</th>
                    <th className="py-2 font-medium">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.rows.map((row) => (
                    <tr key={row.size} className="border-b border-floof-dark/5">
                      <td className="py-3 pr-2 font-semibold text-floof-dark">{row.size}</td>
                      <td className="py-3 pr-2 text-floof-dark/70">{row.chest}</td>
                      <td className="py-3 text-floof-dark/70">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-xs text-floof-dark/40">
                Print-on-demand blanks can vary slightly by manufacturer. When in doubt, size up.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
