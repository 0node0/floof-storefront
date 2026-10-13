export function pieceCountLabel(count: number): string {
  if (count === 1) return "1 piece"
  return `${count} pieces`
}

export function pieceCountShort(count: number): string {
  return pieceCountLabel(count)
}

export function shopAllLabel(count: number): string {
  return `Shop all ${count}`
}
