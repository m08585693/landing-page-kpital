(function () {
    const SUPABASE_URL = 'https://axizggoozkrticfhsmjw.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_E4uCzGnnDOWGNChcwv_oXw_KHVcpF3O';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        },
        { threshold: 0.15 }
    );

    fadeEls.forEach((el) => observer.observe(el));

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

    const form = document.getElementById('emailForm');
    if (form) {
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
                const { error } = await supabase
                    .from('subscribers')
                    .insert({ email });

                if (error) throw error;

                const code = email.split('@')[0].slice(0, 4).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
                const referralInput = document.getElementById('referralInput');
                if (referralInput) {
                    referralInput.value = 'kpital.app/invite/' + code;
                }

                form.innerHTML = `
                    <div class="success-message">
                        <p class="success-title">✓ Tu es inscrit&middot;e !</p>
                        <p class="success-text">On te tient au courant dès le lancement.</p>
                    </div>
                `;

                const parrainage = document.getElementById('parrainage');
                if (parrainage) {
                    setTimeout(() => parrainage.scrollIntoView({ behavior: 'smooth' }), 500);
                }
            } catch {
                submitBtn.disabled = false;
                submitBtn.textContent = "Je rejoins la liste d'attente ›";
                emailInput.style.borderColor = '#EF4444';

                const errMsg = document.createElement('p');
                errMsg.className = 'form-error';
                errMsg.textContent = 'Une erreur est survenue. Réessaie ou contacte-nous.';
                form.appendChild(errMsg);
            }
        });
    }

    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            const input = document.getElementById('referralInput');
            if (!input) return;

            try {
                await navigator.clipboard.writeText(input.value);
                copyBtn.textContent = 'Copié !';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = "Copier mon lien ›";
                    copyBtn.classList.remove('copied');
                }, 2000);
            } catch {
                input.select();
                input.setSelectionRange(0, 99999);
                document.execCommand('copy');
                copyBtn.textContent = 'Copié !';
                copyBtn.classList.add('copied');
                setTimeout(() => {
                    copyBtn.textContent = "Copier mon lien ›";
                    copyBtn.classList.remove('copied');
                }, 2000);
            }
        });
    }
})();
