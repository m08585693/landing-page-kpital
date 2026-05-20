(function () {
    /* ─── FADE-IN ON SCROLL ─── */
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    fadeEls.forEach((el) => observer.observe(el));

    /* ─── PROGRESS BAR ANIMATION ─── */
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progressObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        progressFill.style.animationPlayState = 'running';
                        progressObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.3 }
        );
        progressObserver.observe(progressFill.parentElement);
    }

    /* ─── EMAIL FORM — BREVO ─── */
    const form = document.getElementById('emailForm');
    if (!form) return;

    const emailInput = document.getElementById('emailInput');
    const submitBtn = form.querySelector('.btn-submit');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.style.borderColor = '#EF4444';
            return;
        }

        emailInput.style.borderColor = '';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours…';

        try {
            const response = await fetch(
                'https://api-brevo.kpital.workers.dev/subscribe',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                form.innerHTML = `
                    <div class="success-message">
                        <p class="success-title">✓ Tu es inscrit&middot;e !</p>
                        <p class="success-text">On te tient au courant dès le lancement.</p>
                    </div>
                `;
            } else {
                throw new Error('Erreur serveur');
            }
        } catch {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Je rejoins la liste d\'attente ›';
            emailInput.style.borderColor = '#EF4444';

            const errMsg = document.createElement('p');
            errMsg.className = 'form-error';
            errMsg.textContent = 'Une erreur est survenue. Réessaie ou contacte-nous.';
            form.appendChild(errMsg);
        }
    });
})();
