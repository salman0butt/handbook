function fixGeneratedBaseLinks() {
  if (typeof window === 'undefined' || !window.location.pathname.includes('/docs/')) return;
  const basePrefix = window.location.pathname.split('/docs/')[0];
  document.querySelectorAll('.handbook-study-links a[href^="/docs/"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith(`${basePrefix}/docs/`)) link.setAttribute('href', `${basePrefix}${href}`);
  });
}

if (typeof window !== 'undefined') {
  const schedule = () => setTimeout(fixGeneratedBaseLinks, 450);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once: true});
  else schedule();
  document.addEventListener('click', schedule);
  window.addEventListener('popstate', schedule);
}
