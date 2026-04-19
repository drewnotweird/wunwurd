/**
 * WBRelated — dynamic related-products renderer
 *
 * Usage:
 *   WBRelated.render(gridEl, config)
 *
 * config for regular products:
 *   { type: 'product', handle: 'hoonjuice' }
 *   Renders: same-collection products first, then fills from featured.
 *   Excludes the current handle.
 *
 * config for custom bottle products:
 *   { type: 'custom', handle: '500-round', blendCode: 'WB123456' }
 *   Renders: all other custom products. Carries blend code in hrefs.
 *
 * config with no specific product (e.g. vouchers, gift pages):
 *   { type: 'product', handle: null }
 *   Renders: featured products.
 */

window.WBRelated = (function () {

    function buildCard(href, image, title, price, comparePrice, soldOut) {
        var soldOutClass = soldOut ? ' wb-soldout' : '';
        var badge = soldOut
            ? '<div class="wb-soldoutbadge">Sold out</div>'
            : (comparePrice ? '<div class="wb-salebadge">Sale</div>' : '');
        var priceHtml = (comparePrice
            ? '<div class="wb-product-notprice"><s>' + comparePrice + '</s></div>'
            : '')
            + '<div class="wb-product-price">' + price + '</div>';

        return '<li class="wb-productcell">'
            + '<div class="wb-productitem' + soldOutClass + '" onclick="location.href=\'' + href + '\'">'
            + '<div class="wb-productmedia">'
            + '<div class="wb-productimage"><img src="' + image + '" alt="' + title + '" /></div>'
            + '<div class="wb-productbadge">' + badge + '</div>'
            + '</div>'
            + '<div class="wb-productcontent"><div class="wb-productinfo">'
            + '<h3 class="wb-producttitle wb-tiny-heading"><a href="' + href + '">' + title + '</a></h3>'
            + '<div class="wb-productdetails"><div class="wb-productcosts">' + priceHtml + '</div></div>'
            + '</div></div>'
            + '</div></li>';
    }

    function render(gridEl, config) {
        if (!gridEl) return;
        var MAX = config.max || 4;
        var items = [];

        if (config.type === 'custom') {
            var customProducts = window.WB_CUSTOM_PRODUCTS || {};
            var blendSuffix = config.blendCode ? '&blend=' + config.blendCode : '';
            Object.keys(customProducts).forEach(function (h) {
                if (h === config.handle) return;
                var p = customProducts[h];
                items.push({
                    href:         'custom-product.html?handle=' + h + blendSuffix,
                    image:        p.image,
                    title:        p.title,
                    price:        p.price,
                    comparePrice: null,
                    soldOut:      p.soldOut || false,
                });
            });

        } else {
            var products    = window.WB_PRODUCTS    || {};
            var collections = window.WB_COLLECTIONS || {};
            var seen = {};
            if (config.handle) seen[config.handle] = true;

            function addProduct(h) {
                if (seen[h] || items.length >= MAX) return;
                var p = products[h];
                if (!p) return;
                seen[h] = true;
                items.push({
                    href:         p.href || ('product.html?handle=' + h),
                    image:        p.images[0],
                    title:        p.title,
                    price:        p.price,
                    comparePrice: p.comparePrice,
                    soldOut:      p.soldOut,
                });
            }

            // Same collection first
            var current = config.handle && products[config.handle];
            if (current && current.collection && collections[current.collection]) {
                (collections[current.collection].products || []).forEach(addProduct);
            }

            // Fill remainder from featured
            (((collections.featured || {}).products) || []).forEach(addProduct);
        }

        var html = '';
        items.slice(0, MAX).forEach(function (item) {
            html += buildCard(item.href, item.image, item.title, item.price, item.comparePrice, item.soldOut);
        });
        gridEl.innerHTML = html;
    }

    return { render: render };

})();
