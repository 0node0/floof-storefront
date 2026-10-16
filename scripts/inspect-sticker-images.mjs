const PK = process.env.PUBLIC_MEDUSA_PK || "pk_a027f332298303408a1c3e6ce0c4fae09cd0a33985c5bab22819be960cf1fca4"
const BASE = process.env.PUBLIC_MEDUSA_URL || "https://api.floof.space"
const h = { "x-publishable-api-key": PK }

async function head(url) {
  const r = await fetch(url, { method: "HEAD" })
  return {
    len: r.headers.get("content-length"),
    type: r.headers.get("content-type"),
  }
}

async function stickersForHandle(collectionHandle) {
  const col = await (await fetch(`${BASE}/store/collections?handle=${collectionHandle}`, { headers: h })).json()
  const cid = col.collections?.[0]?.id
  const products = (
    await (await fetch(`${BASE}/store/products?collection_id=${cid}&limit=50`, { headers: h })).json()
  ).products
  return (products || []).filter(
    (p) => /sticker/i.test(p.title) || p.metadata?.category === "stickers"
  )
}

for (const handle of ["reads", "desk"]) {
  const stickers = await stickersForHandle(handle)
  console.log(`\n### ${handle} stickers: ${stickers.length}`)
  for (const p of stickers.sort((a, b) => a.title.localeCompare(b.title))) {
    console.log(`\n=== ${p.handle}`)
    console.log(`title: ${p.title}`)
    console.log(`variant[0]: ${p.variants?.[0]?.title}`)
    const urls = (p.images || []).map((i) => i.url)
    if (p.thumbnail && !urls.includes(p.thumbnail)) urls.unshift(p.thumbnail)
    for (let i = 0; i < urls.length; i++) {
      const info = await head(urls[i])
      console.log(`  [${i}] ${info.len}B ${urls[i]}`)
    }
  }
}
