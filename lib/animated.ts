// Which cards get live 3D art: `count` of every `per` cards, picked at random. Cards are counted by their place in the list on screen,
// in blocks of `per`; the pattern is fixed by `seed` (one per visit), so cards do not change while someone scrolls.
function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickAnimated(total: number, seed: number, per = 6, count = 2): boolean[] {
  const out: boolean[] = Array(total).fill(false);
  for (let start = 0; start < total; start += per) {
    const size = Math.min(per, total - start);
    const take = size === per ? count : Math.round((size * count) / per); // a short last block gets its fair share
    const rand = mulberry32(seed + start * 7919);
    const order = Array.from({ length: size }, (_, i) => i);
    for (let i = size - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    order.slice(0, take).forEach((i) => (out[start + i] = true));
  }
  return out;
}
