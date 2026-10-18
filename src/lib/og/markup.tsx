import type { ReactNode } from "react"
import type { OgPalette } from "./palette"
import { OG_HEIGHT, OG_WIDTH } from "./constants"

const DISPLAY = "Archivo Black"
const MONO = "IBM Plex Mono"

function grainOverlay(color: string): ReactNode {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.07,
        backgroundImage: `repeating-linear-gradient(0deg, ${color} 0px, transparent 1px, transparent 3px),
          repeating-linear-gradient(90deg, ${color} 0px, transparent 1px, transparent 4px)`,
      }}
    />
  )
}

function wordmark(palette: OgPalette): ReactNode {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: MONO,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: palette.inkMuted,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          background: palette.accent,
          border: `2px solid ${palette.border}`,
        }}
      />
      floof.space
    </div>
  )
}

export interface ProductOgProps {
  palette: OgPalette
  title: string
  priceLabel: string
  typeLabel: string
  imageDataUrl: string | null
}

export function productOgMarkup({
  palette,
  title,
  priceLabel,
  typeLabel,
  imageDataUrl,
}: ProductOgProps): ReactNode {
  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        flexDirection: "row",
        background: palette.background,
        color: palette.ink,
        position: "relative",
        overflow: "hidden",
        fontFamily: MONO,
      }}
    >
      {grainOverlay(palette.ink)}
      <div
        style={{
          width: 620,
          height: OG_HEIGHT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 56,
          borderRight: `4px solid ${palette.border}`,
          background: `linear-gradient(145deg, ${palette.backgroundWash} 0%, ${palette.background} 55%)`,
          position: "relative",
        }}
      >
        {imageDataUrl ? (
          <img
            src={imageDataUrl}
            width={480}
            height={520}
            style={{
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        ) : (
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 48,
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1,
              opacity: 0.35,
            }}
          >
            Floof
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 48px 44px",
          position: "relative",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "8px 14px",
              background: palette.accent,
              color: palette.accentInk,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              border: `3px solid ${palette.border}`,
            }}
          >
            {typeLabel}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: DISPLAY,
              fontSize: 46,
              lineHeight: 0.95,
              textTransform: "uppercase",
              maxWidth: 520,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 36,
              fontWeight: 600,
              color: palette.accent,
            }}
          >
            {priceLabel}
          </div>
        </div>
        {wordmark(palette)}
      </div>
    </div>
  )
}

export interface CollectionOgProps {
  palette: OgPalette
  title: string
  tagline: string
  thumbs: string[]
}

export function collectionOgMarkup({
  palette,
  title,
  tagline,
  thumbs,
}: CollectionOgProps): ReactNode {
  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: palette.background,
        color: palette.ink,
        position: "relative",
        overflow: "hidden",
        padding: "48px 56px",
        fontFamily: MONO,
      }}
    >
      {grainOverlay(palette.ink)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: palette.accent,
            }}
          >
            Shop collection
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: DISPLAY,
              fontSize: 72,
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 22,
              color: palette.inkMuted,
              maxWidth: 640,
              lineHeight: 1.35,
            }}
          >
            {tagline}
          </div>
        </div>
        {wordmark(palette)}
      </div>
      <div
        style={{
          marginTop: 40,
          display: "flex",
          flexDirection: "row",
          gap: 20,
          flex: 1,
          alignItems: "flex-end",
        }}
      >
        {thumbs.map((src, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 280,
              border: `4px solid ${palette.border}`,
              background: palette.backgroundWash,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
            }}
          >
            <img
              src={src}
              width={220}
              height={240}
              style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export interface BrandOgProps {
  palette: OgPalette
  headline: string
  subline: string
  badge?: string
}

export function brandOgMarkup({
  palette,
  headline,
  subline,
  badge,
}: BrandOgProps): ReactNode {
  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${palette.background} 0%, ${palette.backgroundWash} 45%, ${palette.background} 100%)`,
        color: palette.ink,
        position: "relative",
        overflow: "hidden",
        padding: "64px 72px",
        fontFamily: MONO,
      }}
    >
      {grainOverlay(palette.ink)}
      <div
        style={{
          position: "absolute",
          top: 48,
          right: 56,
        }}
      >
        {wordmark(palette)}
      </div>
      {badge ? (
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            padding: "10px 16px",
            background: palette.accent,
            color: palette.accentInk,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            border: `3px solid ${palette.border}`,
          }}
        >
          {badge}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: DISPLAY,
          fontSize: 88,
          lineHeight: 0.9,
          textTransform: "uppercase",
          maxWidth: 900,
          marginTop: badge ? 28 : 0,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 26,
          color: palette.inkMuted,
          maxWidth: 780,
          lineHeight: 1.4,
        }}
      >
        {subline}
      </div>
      <div
        style={{
          marginTop: 48,
          width: 120,
          height: 8,
          background: palette.accent,
        }}
      />
    </div>
  )
}
