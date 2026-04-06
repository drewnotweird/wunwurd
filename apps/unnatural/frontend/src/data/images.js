const base = import.meta.env.BASE_URL

function imgs(segment) {
  return Array.from({ length: 8 }, (_, i) => `${base}images/${segment}${i + 1}.png`)
}

export const head = imgs('head')
export const body = imgs('body')
export const legs = imgs('legs')
