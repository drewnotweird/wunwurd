const base = import.meta.env.BASE_URL

function imgs(segment) {
  return Array.from({ length: 3 }, (_, i) => `${base}images/${segment}${i + 1}.jpg`)
}

export const heads = imgs('head')
export const bodies = imgs('body')
export const legs = imgs('legs')

// Title image arrays for the start screen machine.
// Monster images at index 0 & 2 (face 0 shows on load), title image at index 1.
// Attract spin: spin(1) — flips through monsters then lands on title.
// Button press: spin(0 or 2) — spins from title back to a monster face.
export const titleHeads = [heads[0], `${base}images/title1.jpg`, heads[1]]
export const titleBodies = [bodies[0], `${base}images/title2.jpg`, bodies[1]]
export const titleLegs  = [legs[0],  `${base}images/title3.jpg`, legs[1]]
