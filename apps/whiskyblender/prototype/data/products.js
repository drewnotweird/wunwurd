/**
 * DAWN EQUIVALENT: Shopify product objects (product.json metafield data)
 *
 * In Dawn these are Liquid objects accessed as {{ product.title }}, {{ product.price }}, etc.
 * Here they are plain JS objects keyed by handle, loaded into window.WB_PRODUCTS.
 *
 * Field mapping to Shopify/Dawn:
 *   handle        → product.handle
 *   title         → product.title
 *   price         → product.price (formatted)
 *   comparePrice  → product.compare_at_price (formatted, null if no sale)
 *   soldOut       → product.available (inverted)
 *   images        → product.images[] (paths relative to images/)
 *   type          → product.type
 *   bottleSize    → product.metafields.custom.bottle_size
 *   abv           → product.metafields.custom.abv
 *   variants      → product.variants[] (null = single variant, quantity only)
 *   collection    → product.collections[0].handle
 *   description   → product.description (HTML)
 *   tastingNotes  → product.metafields.custom.tasting_notes
 *   badge         → product.metafields.custom.badge
 */

window.WB_PRODUCTS = {

  hoonjuice: {
    handle: 'hoonjuice',
    title: 'Hoon Juice',
    price: '£45.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/collaborations/hoonjuice01.jpg',
      'images/products/collaborations/hoonjuice02.jpg',
      'images/products/collaborations/hoonjuice03.jpg',
      'images/products/collaborations/hoonjuice04.jpg',
      'images/products/collaborations/hoonjuice05.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'collaborations',
    description: `
      <p>Introducing Hoon Juice – a one-off, never-to-be-repeated custom blended malt Scotch whisky inspired by the foul-mouthed ex-cop and full-time violent headcase, Robert Hoon, from the pages of JD Kirk's bestselling thriller series.</p>
      <p>Lovingly crafted in Scotland, this limited edition whisky isn't just a drink – it's a middle finger in a bottle. With a copper foil label featuring a message straight from Hoon himself, every detail is soaked in attitude.</p>
      <p>Order now and you'll get:</p>
      <ul>
        <li>A 500ml bottle of Hoon Juice limited edition custom blended malt Scotch whisky.</li>
        <li>A letter from Bob Hoon, complete with his brutally honest (and foul-mouthed) tasting notes.</li>
        <li>Two bar-ready beermat-style coasters printed with some of Hoon's most savage one-liners.</li>
        <li>A custom hessian bag featuring a whisky-related quote from Bob's first solo book, NORTHWIND.</li>
      </ul>
      <p>This isn't just Scotch. It's Hoon Juice. And, with a strictly limited run of only 1000 bottles being produced, when it's gone, it's gone.</p>
      <p>Please note — Hoon Juice will not grant you Bob's near-indestructibility, or empower you to take on an international criminal cartel more or less single-handedly. (Although it might make you feel like you can.)</p>
    `,
    tastingNotes: `<p>Bob disnae dae tastin' notes.</p>`,
    badge: null,
  },

  goldendrop: {
    handle: 'goldendrop',
    title: 'The Golden Drop',
    price: '£40.00',
    comparePrice: null,
    soldOut: true,
    images: [
      'images/products/collaborations/goldendrop01b.jpg',
      'images/products/collaborations/goldendrop02.jpg',
      'images/products/collaborations/goldendrop03.jpg',
      'images/products/collaborations/goldendrop04.jpg',
      'images/products/collaborations/goldendrop05.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'collaborations',
    description: `
      <p>"The Golden Drop" is an in-house Scotch whisky bottled for The Canny Man's, a historic Edinburgh pub established in 1871. The original owner, John Kerr, created this blend of Speyside-style Scotch, which is exclusively available at the pub. A recent limited run of 300 bottles quickly sold out, making it a sought-after item for visitors and locals of the famous, quirky establishment.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> Wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> Lush!!! Light and mouth-watering green fruit flavours like granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: 'Sold out',
  },

  caskslug: {
    handle: 'caskslug',
    title: 'Cask Slug',
    price: '£35.00',
    comparePrice: null,
    soldOut: true,
    images: [
      'images/products/collaborations/caskslug01.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'collaborations',
    description: `
      <p>Cask Slug is a limited edition bottle of Blended Malt Scotch Whisky from Norwich Grindcore band, Vast Slug. The label is designed by the awesome Corvidae. Soft gold in colour and bottled at a bold 46% ABV, it's crafted to ignite even the darkest soul.</p>
      <p>On the nose, expect fresh, zesty aromas — green barley, beeswax, and a subtle touch of lime. The palate delivers a creamy texture with malty depth and hints of leather. It finishes smooth and refreshing, leaving you ready for the next sip.</p>
      <p>A light, spirit-forward whisky perfect for sipping — beautifully balanced, not overpowered by wood and absolutely slug-free.</p>
    `,
    tastingNotes: null,
    badge: 'Sold out',
  },

  joeydunlop: {
    handle: 'joeydunlop',
    title: 'Joey Dunlop Foundation',
    price: '£44.00',
    comparePrice: null,
    soldOut: true,
    images: [
      'images/products/collaborations/joeydunlop01.jpg',
      'images/products/collaborations/joeydunlop02.jpg',
      'images/products/collaborations/joeydunlop03.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '700ml',
    abv: '40%',
    variants: null,
    collection: 'collaborations',
    description: `
      <p>Crafted in proud collaboration with Ralfy.com and The Joey Dunlop Foundation, this limited-edition whisky marks two remarkable milestones — the third anniversary of Bradden Bridge House and 30 years since Joey Dunlop's first TT victory with Honda.</p>
      <p>Every drop in this commemorative bottling has been selected to embody the same values Joey lived by: dedication, humility, and excellence. Matured with care and bottled with purpose, it offers a balance of rich malt character, subtle oak spice, and a lingering finish that speaks of quiet strength and endurance.</p>
      <p>Each bottle is individually numbered and presented with bespoke labelling celebrating Joey's legacy and the ongoing mission of The Joey Dunlop Foundation: providing accessible accommodation for those in need at Bradden Bridge House.</p>
      <p>This is more than whisky — it's a celebration of community, craftsmanship, and courage.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> honeyed barley, orchard fruit, and a touch of smoke.</p>
      <p><strong>Palate:</strong> rich malt character with subtle oak spice.</p>
      <p><strong>Finish:</strong> lingering, speaks of quiet strength and endurance.</p>
    `,
    badge: 'Sold out',
  },

  doctorsspecial: {
    handle: 'doctorsspecial',
    title: "Doctors' Special",
    price: '£90.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/doctorsspecial/doctorsspecial01.jpg',
      'images/products/doctorsspecial/doctorsspecial02.jpg',
      'images/products/doctorsspecial/doctorsspecial03.jpg',
    ],
    type: 'Blended Scotch whisky',
    bottleSize: '500ml + 200ml',
    abv: '46%',
    variants: [
      { label: 'One of each', value: 'both',        image: 'images/products/doctorsspecial/doctorsspecial01.jpg' },
      { label: '500ml only',  value: 'gardi-500ml', image: 'images/products/doctorsspecial/doctorsspecial50001.jpg' },
      { label: '200ml only',  value: 'gardi-200ml', image: 'images/products/doctorsspecial/doctorsspecial20001.jpg' },
    ],
    collection: 'andrewsofbothwell',
    description: `
      <p><strong>Batch #002.</strong></p>
      <p>Unwind and indulge in a playful sip of Doctors' Special, the Scotch whisky that's sure to cure the monotony in your day. Fact is, this is an old brand from the mid 20th century. We loved the label so much we didn't want to see it die after being forgotten by one of the French conglomerates that owns a massive chunk of the Scotch whisky industry!</p>
      <p>This is a majority of peaty single malt and just a wee dose of very old grain.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> bright amber colour with slow and thin forming legs!</p>
      <p><strong>Nose:</strong> smoky bacon and a wee bit of TCP.</p>
      <p><strong>Palate:</strong> rich and just a wee bit chewy but still light on the palate. Toffee, potent peat, and fresh oak flavours.</p>
      <p><strong>Finish:</strong> woody and lingering. The peat goes soft and fruity on the end.</p>
    `,
    badge: null,
  },

  braxtoncrackers: {
    handle: 'braxtoncrackers',
    title: "Braxton Cracker's Attack & Die",
    price: '£40.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/braxtoncrackers/braxtoncrackers01.jpg',
      'images/products/braxtoncrackers/braxtoncrackers02.jpg',
      'images/products/braxtoncrackers/braxtoncrackers03.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'andrewsofbothwell',
    description: `
      <p>This was bottled for Andy's historian pal Don Frazer in memory of his mentor Grady McWhiney. McWhiney was a big fan of Scotland and Scotch whisky! He was the author of <em>Braxton Bragg and Confederate Defeat</em>, <em>Cracker Culture: Celtic Ways in the Old South</em>, and <em>Attack and Die: Military Tactics and the Southern Heritage</em>.</p>
      <p>This whisky is best enjoyed in the style of McWhiney himself, with a good book or good company!</p>
      <p><strong>McWhiney's Sweet Tea:</strong> 1 part BC to 3 parts Sweet Tea, served over ice.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: null,
  },

  hipflask: {
    handle: 'hipflask',
    title: 'Tweed Hipflask',
    price: '£28.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/hipflask/hipflask01.jpg',
      'images/products/hipflask/hipflask02.jpg',
      'images/products/hipflask/hipflask03.jpg',
    ],
    type: '6oz stainless steel flask',
    bottleSize: null,
    abv: null,
    variants: null,
    collection: 'weebits',
    description: `
      <p>Crafted from stainless steel and bound with Harris Tweed and leather, this 6oz flask is embroidered with our stag and falcon crest and has a screw cap attached to the flask to ensure it never goes missing. Complete with Harris Tweed authentication label.</p>
    `,
    tastingNotes: null,
    badge: null,
  },

  jotter: {
    handle: 'jotter',
    title: 'Tasting Jotter',
    price: '£2.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/jotter/jotter01.jpg',
      'images/products/jotter/jotter02.jpg',
      'images/products/jotter/jotter03.jpg',
    ],
    type: 'Plain paper notepad',
    bottleSize: null,
    abv: null,
    variants: [
      { label: 'Yellow', value: 'yellow' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Pink', value: 'pink' },
      { label: 'One of each', value: 'oneofeach' },
    ],
    collection: 'weebits',
    description: `
      <p>An old-school jotter, from our school days! Growing up in what was then the Strathclyde Regional Council, as kids we loved this design — back in the days when Glasgow was one of the largest metropoles in Europe.</p>
      <p>A stapled premium finish 72-page retro notebook to log all your whisky adventures... or just doodle in!</p>
    `,
    tastingNotes: null,
    badge: null,
  },

  scotsenglishman: {
    handle: 'scotsenglishman',
    title: 'Scotsman & Englishman',
    price: '£70.00',
    comparePrice: '£80.00',
    soldOut: false,
    images: [
      'images/products/scotsenglishman/scotsenglishman01.jpg',
      'images/products/scotsenglishman/scotsenglishman02.jpg',
      'images/products/scotsenglishman/scotsenglishman03.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: [
      { label: 'Scotsman & Englishman (pair)', value: 'both',       image: 'images/products/scotsenglishman/scotsenglishman01.jpg' },
      { label: 'Scotsman only',               value: 'scotsman',   image: 'images/products/scotsenglishman/scotsman01.jpg' },
      { label: 'Englishman only',             value: 'englishman', image: 'images/products/scotsenglishman/englishman01.jpg' },
    ],
    collection: 'andrewsofbothwell',
    description: `
      <p>Rex Whistler, born in 1905, was a talented British illustrator, designer and painter. His most amusing and "grotesque" work, which he called "Reversible Faces", was a series of upside-down and right-side-up portraits published the year of his death in Normandy, 1944.</p>
      <p>This particular piece — <em>Scotsman & Englishman</em> — inspired us to create this pair of charming bottlings; each with the exact same label, just applied in two different directions.</p>
    `,
    tastingNotes: `
      <p>The whisky is full of creamy, delicious maltiness. With notes of leather and beeswax with a hint of fresh apples.</p>
    `,
    badge: 'Sale',
  },

  idrinkwhisky: {
    handle: 'idrinkwhisky',
    title: 'I Drink Whisky T-Shirt',
    price: '£28.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/idrinkwhisky/idrinkwhisky01.jpg',
      'images/products/idrinkwhisky/idrinkwhisky02.jpg',
      'images/products/idrinkwhisky/idrinkwhisky03.jpg',
    ],
    type: 'T-Shirt — 100% organic cotton',
    bottleSize: null,
    abv: null,
    variants: [
      { label: 'Medium', value: 'medium' },
      { label: 'Large', value: 'large' },
      { label: 'X Large', value: 'xlarge' },
      { label: '2X Large', value: '2xlarge' },
    ],
    collection: 'weebits',
    description: `
      <p>A sexy T-Shirt designed by Drew himself. Medium fit with finished hems and a round neckline, ready to pair with all your favourite outfits. Dress it up or down and have a dram while doing so.</p>
      <ul>
        <li>100% organic ring-spun cotton</li>
        <li>Fabric weight: 5.3 oz/yd² (180 g/m²)</li>
        <li>Medium fit, set-in sleeves</li>
        <li>1×1 rib at collar</li>
      </ul>
      <p>This product is made especially for you as soon as you place an order. Making products on demand instead of in bulk helps reduce overproduction — thank you for making thoughtful purchasing decisions!</p>
    `,
    tastingNotes: null,
    badge: null,
  },

  weemansblend: {
    handle: 'weemansblend',
    title: "The Wee Man's Blend",
    price: '£36.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/weemansblend/weemansblend01.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'andrewsofbothwell',
    description: `
      <p>The wee man disnae care if you add water, ice, fizzy juice, or milk. There's no 'special occasion' required, nor an excuse or justification to enjoy it. Nothin' needin' explained about casks, stills, barley, yeast, or how auld it is.</p>
      <p>Made up of Speyside single malts with a dose of the Highlands and a splash of Islay. Bottled with minimal filtration or fuss.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> light gold with wee skinny legs!</p>
      <p><strong>Nose:</strong> fresh, peppery (is it rocket/cilantro?) with a fruity character. No so much peat.</p>
      <p><strong>Palate:</strong> peat is there! Light and refreshing with vanilla, ginger and a little green fruitiness.</p>
      <p><strong>Finish:</strong> short but satisfying, the peat lingers.</p>
    `,
    badge: null,
  },

  yerauntfannys: {
    handle: 'yerauntfannys',
    title: 'Yer Aunt Fanny\'s',
    price: '£36.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/yerauntfannys/yerauntfannys01.jpg',
      'images/products/yerauntfannys/yerauntfannys02.jpg',
      'images/products/yerauntfannys/yerauntfannys03.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'andrewsofbothwell',
    description: `
      <p>14 years on, YAFCA (our oldest consistent blend) is now bottled in memory of the man who coined the infamous phrase. Martin McCabe was a wonderful human being, father to an amazing legacy of kids from Bellshill to Nottingham, and an important friend. In addition, he was perhaps one of the greatest consumers of McEwan's Export Lager on Earth.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: null,
  },

  nipbefore: {
    handle: 'nipbefore',
    title: 'The Nip Before Christmas',
    price: '£25.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/nipbefore/thenipbefore01.jpg',
      'images/products/nipbefore/thenipbefore02.jpg',
      'images/products/nipbefore/thenipbefore03.jpg',
      'images/products/nipbefore/thenipbefore04.jpg',
    ],
    type: null,
    bottleSize: null,
    abv: null,
    variants: null,
    collection: null,
    description: `
      <p>A cute wee festive dram made for Christmas Eve. This charming bottle of whisky features a simple To / From label, just like a classic gift tag, so you can make your present perfectly personal. A small touch that brings a lot of warmth to the night before Christmas.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: null,
  },

  poachersdram: {
    handle: 'poachersdram',
    title: "The Poacher's Dram",
    price: '£42.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/collaborations/poachersdram.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'collaborations',
    description: `<p>Coming soon.</p>`,
    tastingNotes: null,
    badge: null,
  },

  '80yearsofthebinos': {
    handle: '80yearsofthebinos',
    title: '80 Years of the Binos',
    price: '£80.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/football/80yearsofthebinos/80yearsofthebinos-01.jpg',
      'images/products/football/80yearsofthebinos/80yearsofthebinos-02.jpg',
      'images/products/football/80yearsofthebinos/80yearsofthebinos-03.jpg',
      'images/products/football/80yearsofthebinos/80yearsofthebinos-04.jpg',
      'images/products/football/80yearsofthebinos/80yearsofthebinos-05.jpg',
    ],
    type: 'Single malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'football',
    description: `
      <p>Celebrating 80 Years of Stirling Albion Football Club. Nestled in the historic city of Stirling, the club boasts a rich and varied history, marked by memorable triumphs and challenges overcome.</p>
      <p>Limited to 80 bottles, the Supporters Edition is a one-off single cask single malt bottling, specially selected to commemorate the founding of Stirling Albion Football Club in 1945. The profits raised from this bottle will go back into supporting the team.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: null,
  },

  glasgow: {
    handle: 'glasgow',
    title: 'Glasgow',
    price: '£36.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/iconicscotland/glasgow01.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml / 200ml',
    abv: '46%',
    variants: [
      { label: '500ml', value: 'gardi-500ml' },
      { label: '200ml', value: 'gardi-200ml' },
    ],
    collection: 'iconicscotland',
    description: `
      <p>Glasgow (Scottish Gaelic: Glaschu) is home to the bird that never flew, the tree that never grew, the bell that never rang, and the fish that never swam... until Big Saint Mungo turned up and showed the locals his holy tricks (latterly known as miracles).</p>
      <p>This adaptation of Shipping on the Clyde (1881) by John Atkins Grimshaw captures the iconic "Broomielaw" that was to make Glasgow, for a time, one of the most important ports in the world, and the Second City of the British Empire.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: null,
  },

  glasgow850: {
    handle: 'glasgow850',
    title: 'Glasgow 850',
    price: '£70.00',
    comparePrice: '£80.00',
    soldOut: false,
    images: [
      'images/products/collaborations/glasgow850_four.jpg',
      'images/products/collaborations/glasgow850_02.jpg',
      'images/products/collaborations/glasgow850_03.jpg',
      'images/products/collaborations/glasgow850_04.jpg',
      'images/products/collaborations/glasgow850_05.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '200ml',
    abv: '46%',
    variants: [
      { label: '4 pack (bird, tree, bell & fish)', value: 'both',      image: 'images/products/collaborations/glasgow850_four.jpg' },
      { label: 'Glasgow 850',                      value: 'glasgow850', image: 'images/products/collaborations/glasgow850_main.jpg' },
      { label: 'Bird that never flew',             value: 'bird',       image: 'images/products/collaborations/glasgow850_bird.jpg' },
      { label: 'Tree that never grew',             value: 'tree',       image: 'images/products/collaborations/glasgow850_tree.jpg' },
      { label: 'Bell that never rang',             value: 'bell',       image: 'images/products/collaborations/glasgow850_bell.jpg' },
      { label: 'Fish that never swam',             value: 'fish',       image: 'images/products/collaborations/glasgow850_fish.jpg' },
    ],
    collection: 'collaborations',
    description: `
      <p>Glasgow's journey to becoming the vibrant city we know today took a major step in 1175 when it was granted the status of a burgh — meaning that 2025 marks Glasgow's 850th birthday, and we bottled some whisky to celebrate!</p>
      <p>It's a huge milestone and everyone who has or does call Glasgow home is invited to the party.</p>
      <p>We're bottling 170 of each of the 5 labels in this collection — get yours and mark the celebration!</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: 'Sale',
  },

  dramsylvania: {
    handle: 'dramsylvania',
    title: 'Dramsylvania',
    price: '£85.00',
    comparePrice: null,
    soldOut: true,
    images: [
      'images/products/collaborations/dramsylvania01.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml',
    abv: '46%',
    variants: null,
    collection: 'collaborations',
    description: `<p>A limited edition collaboration bottling. Sold out.</p>`,
    tastingNotes: null,
    badge: 'Sold out',
  },

  saythanks: {
    handle: 'saythanks',
    title: 'Say Thanks',
    price: '£36.00',
    comparePrice: null,
    soldOut: false,
    images: [
      'images/products/qualitypatter/saythanks01.jpg',
    ],
    type: 'Blended malt Scotch whisky',
    bottleSize: '500ml / 200ml',
    abv: '46%',
    variants: [
      { label: '500ml', value: 'gardi-500ml' },
      { label: '200ml', value: 'gardi-200ml' },
    ],
    collection: 'qualitypatter',
    description: `
      <p>Legends never die! We all know a legend who deserves recognition.</p>
      <p>Imagine you took a job in Oxford. You figured you'd only be away for six months, so you asked the neighbours teenage son to keep an eye on your house in Florida. You gave him a few bob to keep the grass trim and collect the mail. Then, you got stuck in the UK and your house got smashed by a bunch of hurricanes... and every time, Wee Roman the neighbour's son got the heid doon and did the work to save the house.</p>
      <p>He is A TOTAL LEGEND! And although it's illegal for him to drink alcohol in the USA, he is still deserving of a bottle of Scotch with a label to recognise his status.</p>
    `,
    tastingNotes: `
      <p><strong>Appearance:</strong> pale straw colour with fat and fast forming legs!</p>
      <p><strong>Nose:</strong> wet cut grass and spicy liquorice, with a wee hint of lime juice.</p>
      <p><strong>Palate:</strong> light and mouth-watering green fruit flavours — granny smith apples, pear drops, and fresh squeezed lime juice.</p>
      <p><strong>Finish:</strong> warming but short on intensity, though the soft citric fruit flavour lingers pleasantly long!</p>
    `,
    badge: null,
  },

};
