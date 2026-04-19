/**
 * Custom bottling products and blend option definitions.
 *
 * WB_CUSTOM_PRODUCTS — bottle types shown on customoptions.html
 * WB_BLEND_OPTIONS   — the 5 cask options in thelab.html, in order
 */

window.WB_CUSTOM_PRODUCTS = {

  '500-flat': {
    handle:  '500-flat',
    title:   'Custom whisky 500ml flat',
    image:   'images/custom/custom-500-flat.jpg',
    price:   '£54.00',
    meta:    ['Blended malt Scotch whisky', '500ml', '46% abv.'],
    soldOut: false,
  },

  '500-round': {
    handle:  '500-round',
    title:   'Custom whisky 500ml round',
    image:   'images/custom/custom-500-round.jpg',
    price:   '£54.00',
    meta:    ['Blended malt Scotch whisky', '500ml', '46% abv.'],
    soldOut: false,
  },

  '500-round-black': {
    handle:  '500-round-black',
    title:   'Custom whisky 500ml round (black)',
    image:   'images/custom/custom-500-round-black.jpg',
    price:   '£54.00',
    meta:    ['Blended malt Scotch whisky', '500ml', '46% abv.'],
    soldOut: false,
  },

  '200-flat': {
    handle:  '200-flat',
    title:   'Custom whisky 200ml flat',
    image:   'images/custom/custom-200-flat.jpg',
    price:   '£27.00',
    meta:    ['Blended malt Scotch whisky', '200ml', '46% abv.'],
    soldOut: false,
  },

  '12-miniatures': {
    handle:  '12-miniatures',
    title:   '12 custom whisky miniatures',
    image:   'images/custom/custom-12-miniatures.jpg',
    price:   '£100.00',
    meta:    ['Blended malt Scotch whisky', '12 × 50ml', '46% abv.'],
    soldOut: false,
  },

  '700-round': {
    handle:  '700-round',
    title:   'Custom whisky 700ml round',
    image:   'images/custom/custom-700-round.jpg',
    price:   'From £70.00',
    meta:    ['Blended malt Scotch whisky', '700ml', '46% abv.'],
    soldOut: true,
  },

};

// ── Blend options (match thelab.html order exactly) ───────────────────────
window.WB_BLEND_OPTIONS = [
  { label: 'Banana split',        colorClass: 'wb-background-yellow' },
  { label: 'Malted bacon',        colorClass: 'wb-background-green'  },
  { label: 'Spicy beeswax',       colorClass: 'wb-background-red'    },
  { label: 'Salty butter',        colorClass: 'wb-background-blue'   },
  { label: 'Charred marshmallow', colorClass: 'wb-background-brown'  },
];
