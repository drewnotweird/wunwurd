const base = import.meta.env.BASE_URL

function imgs(segment) {
  return Array.from({ length: 3 }, (_, i) => `${base}images/${segment}${i + 1}.jpg`)
}

export const heads = imgs('head')
export const bodies = imgs('body')
export const legs = imgs('legs')

// Static title images for the start screen machine
export const titleImgs = [
  `${base}images/title1.jpg`,
  `${base}images/title2.jpg`,
  `${base}images/title3.jpg`,
]
