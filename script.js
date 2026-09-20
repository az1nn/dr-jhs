(() => {
  const INSTAGRAM_DIRECT = 'https://ig.me/m/medicinal_cann';
  const PROFILE_URL = 'https://www.instagram.com/medicinal_cann/';
  const toast = document.getElementById('toast');

  function track(eventName, payload = {}) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...payload });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 3000);
  }

  const params = new URLSearchParams(window.location.search);
  const attribution = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    if (params.get(key)) attribution[key] = params.get(key);
  });
  if (Object.keys(attribution).length) {
    localStorage.setItem('jhs_attribution', JSON.stringify({ ...attribution, capturedAt: new Date().toISOString() }));
  }

  document.querySelectorAll('.js-instagram').forEach(link => {
    link.addEventListener('click', () => track('instagram_click', { placement: link.dataset.cta || 'unknown' }));
  });

  const form = document.getElementById('leadAssist');
  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const modalidade = new FormData(form).get('modalidade') || 'online';
      const message = modalidade === 'presencial'
        ? 'Olá, Dr. João! Vim pelo site e gostaria de informações para agendar uma consulta presencial em Belo Horizonte.'
        : 'Olá, Dr. João! Vim pelo site e gostaria de informações para agendar uma consulta online.';

      try {
        await navigator.clipboard.writeText(message);
        showToast('Mensagem copiada. Cole no direct do Instagram.');
      } catch (_) {
        showToast('Abrindo o Instagram para você enviar o direct.');
      }

      track('lead_assist_submit', { modalidade });
      const popup = window.open(INSTAGRAM_DIRECT, '_blank', 'noopener,noreferrer');
      if (!popup) window.location.href = PROFILE_URL;
    });
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;

  document.querySelectorAll('.reveal').forEach(el => {
    if (observer) observer.observe(el);
    else el.classList.add('is-visible');
  });
})();
