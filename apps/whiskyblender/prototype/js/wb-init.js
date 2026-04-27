function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName('*');
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute('w3-include-html');
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                        // Re-execute any scripts in the injected HTML
                        Array.from(elmnt.querySelectorAll('script')).forEach(function (old) {
                            var s = document.createElement('script');
                            Array.from(old.attributes).forEach(function (a) { s.setAttribute(a.name, a.value); });
                            s.textContent = old.textContent;
                            old.parentNode.replaceChild(s, old);
                        });
                    }
                    if (this.status == 404) { elmnt.innerHTML = 'Page not found.'; }
                    elmnt.removeAttribute('w3-include-html');
                    includeHTML();
                }
            };
            xhttp.open('GET', file + '?t=' + Date.now(), true);
            xhttp.send();
            return;
        }
    }
}
