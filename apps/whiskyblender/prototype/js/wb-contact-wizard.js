(function () {
    var answers = {
        name: '', email: '', phone: '',
        path: '', message: '',
        about: '', quantity: '', whisky: '', label: '', additional: ''
    };

    var PROGRESS = {
        contact:    0,
        message:   100,
        about:     20,
        quantity:  40,
        whisky:    60,
        label:     80,
        additional: 100
    };

    var PROGRESS = {
        contact:     0,
        message:   100,
        about:      20,
        quantity:   40,
        whisky:     60,
        label:      80,
        additional: 100
    };

    var LABELS = {
        about:      '1 of 5',
        quantity:   '2 of 5',
        whisky:     '3 of 5',
        label:      '4 of 5',
        additional: '5 of 5'
    };

    var stepHistory = ['contact'];

    function el(id) { return document.getElementById(id); }

    function showStep(name) {
        var wizard = el('wbContactWizard');
        if (!wizard) return;

        wizard.querySelectorAll('.wbcw-step').forEach(function (s) {
            s.classList.remove('wbcw-active');
        });
        wizard.querySelectorAll('.wbcw-choice.wbcw-flash').forEach(function (b) {
            b.classList.remove('wbcw-flash');
        });

        var target = wizard.querySelector('[data-step="' + name + '"]');
        if (target) target.classList.add('wbcw-active');

        var prog = el('wbcwProgress');
        if (prog) prog.style.width = (PROGRESS[name] || 0) + '%';

        var labelEl = el('wbcwStepLabel');
        if (labelEl) {
            var txt = LABELS[name] || '';
            labelEl.textContent = txt;
            labelEl.style.display = txt ? '' : 'none';
        }

        /* Scroll wizard top into view if it's above the viewport */
        var rect = wizard.getBoundingClientRect();
        if (rect.top < 0) {
            window.scrollTo({ top: window.scrollY + rect.top - 20, behavior: 'smooth' });
        }
    }

    /* Validate email — called only at submit, not on path click */
    function validateEmail() {
        var emailEl = el('wbcwEmail');
        if (!emailEl) return false;
        var val = emailEl.value.trim();
        if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            emailEl.classList.add('wbcw-field-error');
            var errEl = el('wbcwEmailError');
            if (errEl) errEl.classList.add('wbcw-visible');
            /* return to contact step if we've navigated away */
            if (stepHistory[stepHistory.length - 1] !== 'contact') {
                stepHistory = ['contact'];
                showStep('contact');
            }
            emailEl.focus();
            return false;
        }
        emailEl.classList.remove('wbcw-field-error');
        var errEl2 = el('wbcwEmailError');
        if (errEl2) errEl2.classList.remove('wbcw-visible');
        return true;
    }

    function captureContact() {
        var nameEl = el('wbcwName'), emailEl = el('wbcwEmail'), phoneEl = el('wbcwPhone');
        answers.name  = nameEl  ? nameEl.value.trim()  : '';
        answers.email = emailEl ? emailEl.value.trim() : '';
        answers.phone = phoneEl ? phoneEl.value.trim() : '';
    }

    /* Path choice — no validation here, just navigate */
    window.wbcwChoosePath = function (path) {
        captureContact();
        answers.path = path;
        var next = path === 'message' ? 'message' : 'about';
        stepHistory.push(next);
        showStep(next);
    };

    /* Auto-advance choice steps */
    window.wbcwAnswer = function (field, value, next, btn) {
        answers[field] = value;
        if (btn) btn.classList.add('wbcw-flash');
        setTimeout(function () {
            stepHistory.push(next);
            if (next === 'additional') buildSummary();
            showStep(next);
        }, 200);
    };

    window.wbcwBack = function () {
        if (stepHistory.length > 1) {
            stepHistory.pop();
            showStep(stepHistory[stepHistory.length - 1]);
        }
    };

    function buildSummary() {
        var s = el('wbcwSummary');
        if (!s) return;
        var rows = [
            ['You',     answers.about    || '—'],
            ['Bottles', answers.quantity  || '—'],
            ['Whisky',  answers.whisky    || '—'],
            ['Label',   answers.label     || '—']
        ];
        var html = '<div class="wbcw-summary-grid">';
        rows.forEach(function (r) {
            html += '<span class="wbcw-summary-key">' + r[0] + '</span>' +
                    '<span class="wbcw-summary-val">' + r[1] + '</span>';
        });
        html += '</div>';
        s.innerHTML = html;
    }

    function buildBody() {
        if (answers.path === 'message') return answers.message;
        var lines = ['Collaboration enquiry', ''];
        if (answers.about)      lines.push('About: '    + answers.about);
        if (answers.quantity)   lines.push('Bottles: '  + answers.quantity);
        if (answers.whisky)     lines.push('Whisky: '   + answers.whisky);
        if (answers.label)      lines.push('Label: '    + answers.label);
        if (answers.additional) { lines.push(''); lines.push('Additional info: ' + answers.additional); }
        var uploadEl = el('wbcwUpload');
        if (uploadEl && uploadEl.files[0]) { lines.push(''); lines.push('Image attached: ' + uploadEl.files[0].name); }
        return lines.join('\n');
    }

    window.wbcwSubmit = function () {
        /* Capture latest textarea values */
        var msgEl = el('wbcwMessage'), addEl = el('wbcwAdditional');
        if (answers.path === 'message') {
            answers.message = msgEl ? msgEl.value.trim() : '';
        } else {
            answers.additional = addEl ? addEl.value.trim() : '';
        }

        /* Validate email at submit time */
        captureContact();
        if (!validateEmail()) return;

        /* ── SHOPIFY: uncomment and adapt ──────────────────────────────────
        var hiddenName  = el('wbcwHiddenName');
        var hiddenEmail = el('wbcwHiddenEmail');
        var hiddenPhone = el('wbcwHiddenPhone');
        var hiddenBody  = el('wbcwHiddenBody');
        if (hiddenName)  hiddenName.value  = answers.name;
        if (hiddenEmail) hiddenEmail.value = answers.email;
        if (hiddenPhone) hiddenPhone.value = answers.phone;
        if (hiddenBody)  hiddenBody.value  = buildBody();
        var form = el('wbContactForm');
        if (form) form.submit();
        return;
        ──────────────────────────────────────────────────────────────────── */

        /* Prototype: show success state */
        document.querySelectorAll('.wbcw-step').forEach(function (s) {
            s.classList.remove('wbcw-active');
        });
        var successEl = el('wbcwSuccess');
        if (successEl) successEl.classList.add('wbcw-active');
    };

    /* Email input — clear errors and gate path buttons on valid email */
    document.addEventListener('input', function (e) {
        if (e.target && e.target.id === 'wbcwEmail') {
            e.target.classList.remove('wbcw-field-error');
            var errEl = el('wbcwEmailError');
            if (errEl) errEl.classList.remove('wbcw-visible');

            var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value.trim());
            document.querySelectorAll('.wbcw-paths .wbcw-choice').forEach(function (btn) {
                btn.disabled = !valid;
            });
        }
    });

    /* File upload — update displayed filename */
    document.addEventListener('change', function (e) {
        if (e.target && e.target.id === 'wbcwUpload') {
            var filenameEl = el('wbcwUploadFilename');
            if (!filenameEl) return;
            var file = e.target.files[0];
            filenameEl.textContent = file ? file.name : 'Optional';
            filenameEl.classList.toggle('wbcw-has-file', !!file);
        }
    });
})();
