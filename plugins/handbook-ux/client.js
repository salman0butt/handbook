const SEARCH_SELECTORS = [
  '.navbar__search-input',
  '.navbar__search input',
  '.aa-Input',
  'input[placeholder*="Search"]',
];

function findSearchInput() {
  for (const selector of SEARCH_SELECTORS) {
    const input = document.querySelector(selector);
    if (input) return input;
  }
  return null;
}

function focusSearch() {
  const input = findSearchInput();
  if (!input) return false;
  input.focus();
  input.click();
  return true;
}

function installSearchShortcuts() {
  if (window.__handbookSearchShortcutsInstalled) return;
  window.__handbookSearchShortcutsInstalled = true;

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const isTyping = target && (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    );

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      focusSearch();
      return;
    }

    if (!isTyping && event.key === '/') {
      event.preventDefault();
      focusSearch();
    }
  });
}

function ensureSearchHint() {
  const input = findSearchInput();
  if (!input || input.dataset.handbookHintAdded) return;
  input.dataset.handbookHintAdded = 'true';
  input.setAttribute('aria-label', 'Search all handbook documentation');
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  input.placeholder = `Search docs…  ${isMac ? '⌘K' : 'Ctrl K'}`;
}

function ensureProgressBar() {
  const isDoc = window.location.pathname.includes('/docs/');
  let bar = document.querySelector('.handbook-reading-progress');

  if (!isDoc) {
    if (bar) bar.remove();
    return;
  }

  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'handbook-reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
  }

  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollable) * 100)) : 0;
    bar.style.setProperty('--handbook-progress', `${progress}%`);
  };

  update();
  if (window.__handbookProgressHandler) window.removeEventListener('scroll', window.__handbookProgressHandler);
  window.__handbookProgressHandler = update;
  window.addEventListener('scroll', update, {passive: true});
}

function makeLink(anchor, className = '') {
  const link = document.createElement('a');
  link.href = anchor.href;
  link.textContent = anchor.textContent.trim();
  link.className = className;
  return link;
}

function ensureFallbackPaginator() {
  if (!window.location.pathname.includes('/docs/')) return;
  if (document.querySelector('.pagination-nav')) return;

  const active = document.querySelector('.theme-doc-sidebar-menu .menu__link--active');
  const article = document.querySelector('article');
  if (!active || !article) return;

  const links = Array.from(document.querySelectorAll('.theme-doc-sidebar-menu a.menu__link'))
    .filter((link) => link.href && !link.classList.contains('menu__link--sublist'));
  const index = links.findIndex((link) => link.href === active.href);
  if (index < 0) return;

  const previous = links[index - 1];
  const next = links[index + 1];
  if (!previous && !next) return;

  const nav = document.createElement('nav');
  nav.className = 'pagination-nav handbook-fallback-pagination';
  nav.setAttribute('aria-label', 'Documentation pages navigation');

  if (previous) {
    const a = makeLink(previous, 'pagination-nav__link pagination-nav__link--prev');
    a.innerHTML = `<div class="pagination-nav__sublabel">Previous</div><div class="pagination-nav__label">${previous.textContent.trim()}</div>`;
    nav.appendChild(a);
  } else {
    nav.appendChild(document.createElement('span'));
  }

  if (next) {
    const a = makeLink(next, 'pagination-nav__link pagination-nav__link--next');
    a.innerHTML = `<div class="pagination-nav__sublabel">Next</div><div class="pagination-nav__label">${next.textContent.trim()}</div>`;
    nav.appendChild(a);
  }

  article.appendChild(nav);
}

function ensureRelatedTopics() {
  if (!window.location.pathname.includes('/docs/')) return;
  const article = document.querySelector('article');
  const active = document.querySelector('.theme-doc-sidebar-menu .menu__link--active');
  if (!article || !active || article.querySelector('.handbook-related-topics')) return;

  const category = active.closest('li.theme-doc-sidebar-item-category, li');
  const scope = category || document.querySelector('.theme-doc-sidebar-menu');
  if (!scope) return;

  const candidates = Array.from(scope.querySelectorAll('a.menu__link'))
    .filter((link) => link.href && link.href !== active.href && !link.classList.contains('menu__link--sublist'))
    .slice(0, 4);

  const pathnameParts = window.location.pathname.split('/').filter(Boolean);
  const docsIndex = pathnameParts.indexOf('docs');
  const handbook = docsIndex >= 0 ? pathnameParts[docsIndex + 1] : null;

  if (!candidates.length && !handbook) return;

  const section = document.createElement('section');
  section.className = 'handbook-related-topics';
  section.innerHTML = '<div class="handbook-related-topics__eyebrow">Keep learning</div><h2>Related topics</h2>';

  const grid = document.createElement('div');
  grid.className = 'handbook-related-topics__grid';

  candidates.forEach((candidate) => {
    const card = makeLink(candidate, 'handbook-related-topics__card');
    card.innerHTML = `<span>Related chapter</span><strong>${candidate.textContent.trim()}</strong>`;
    grid.appendChild(card);
  });

  if (handbook) {
    const home = document.createElement('a');
    const basePrefix = window.location.pathname.split('/docs/')[0];
    home.href = `${basePrefix}/${handbook}`;
    home.className = 'handbook-related-topics__card';
    home.innerHTML = `<span>Handbook overview</span><strong>${handbook.replace(/-/g, ' ')} learning path</strong>`;
    grid.appendChild(home);
  }

  section.appendChild(grid);
  const paginator = article.querySelector('.pagination-nav');
  if (paginator) article.insertBefore(section, paginator);
  else article.appendChild(section);
}

function enhanceInterviewPages() {
  const path = window.location.pathname;
  if (!/interview|mock-interview/.test(path)) return;
  const markdown = document.querySelector('.theme-doc-markdown');
  if (!markdown || markdown.querySelector('.handbook-study-links')) return;

  const parts = path.split('/').filter(Boolean);
  const docsIndex = parts.indexOf('docs');
  const handbook = docsIndex >= 0 ? parts[docsIndex + 1] : null;
  if (!handbook) return;

  const maps = {
    typescript: [
      ['Generics & type manipulation', '/docs/typescript/11-16-generics-and-type-manipulation'],
      ['Narrowing & safety', '/docs/typescript/06-10-narrowing-functions-safety-literals'],
      ['Modules & TSConfig', '/docs/typescript/26-31-modules-tsconfig-monorepos-declarations-libraries-js'],
      ['Architecture & compiler reasoning', '/docs/typescript/40-49-backends-architecture-domain-type-level-compiler-performance-debugging'],
    ],
    react: [
      ['State & hooks', '/docs/react/state/state-snapshots-and-queues'],
      ['Effects', '/docs/react/effects/use-effect'],
      ['Performance', '/docs/react/performance/measure-before-optimizing'],
      ['Architecture', '/docs/react/architecture/component-and-state-architecture'],
    ],
    nextjs: [
      ['Routing & navigation', '/docs/nextjs/app-router-and-layouts/route-tree-pages-and-layouts'],
      ['Data fetching', '/docs/nextjs/data-fetching/async-server-components-and-data-ownership'],
      ['Caching & rendering', '/docs/nextjs/caching-rendering-and-revalidation/cache-model-and-rendering-decision-tree'],
      ['Architecture', '/docs/nextjs/architecture-and-large-applications/architecture-mental-model-boundaries-ownership-and-dependency-direction'],
    ],
  };

  const links = maps[handbook];
  if (!links) return;

  const panel = document.createElement('aside');
  panel.className = 'handbook-study-links';
  panel.innerHTML = '<strong>Review before answering</strong><span>Jump back to the chapters that support these interview questions.</span>';
  const list = document.createElement('div');
  list.className = 'handbook-study-links__links';

  links.forEach(([label, href]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    list.appendChild(a);
  });

  panel.appendChild(list);
  markdown.insertBefore(panel, markdown.firstChild?.nextSibling || markdown.firstChild);
}

function ensureSectionToggles() {
  if (!window.location.pathname.includes('/docs/')) return;
  const markdown = document.querySelector('.theme-doc-markdown');
  if (!markdown) return;

  const headings = Array.from(markdown.querySelectorAll(':scope > h2'));
  headings.forEach((heading) => {
    if (heading.dataset.handbookToggleAdded || heading.closest('.handbook-related-topics')) return;

    const sectionNodes = [];
    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      sectionNodes.push(node);
      node = node.nextElementSibling;
    }

    if (sectionNodes.length < 4) return;

    heading.dataset.handbookToggleAdded = 'true';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'handbook-section-toggle';
    button.textContent = 'Collapse section';
    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', `Collapse ${heading.textContent.trim()} section`);

    button.addEventListener('click', () => {
      const collapsed = button.getAttribute('aria-expanded') === 'false';
      sectionNodes.forEach((element) => {
        element.hidden = !collapsed;
      });
      button.setAttribute('aria-expanded', collapsed ? 'true' : 'false');
      button.textContent = collapsed ? 'Collapse section' : 'Expand section';
    });

    heading.appendChild(button);
  });
}

function initialiseHandbookUx() {
  installSearchShortcuts();
  setTimeout(ensureSearchHint, 150);
  setTimeout(() => {
    ensureProgressBar();
    ensureFallbackPaginator();
    ensureRelatedTopics();
    enhanceInterviewPages();
    ensureSectionToggles();
  }, 200);
}

if (typeof window !== 'undefined') {
  const boot = () => initialiseHandbookUx();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once: true});
  else boot();

  window.addEventListener('popstate', () => setTimeout(initialiseHandbookUx, 100));
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (link && link.origin === window.location.origin) setTimeout(initialiseHandbookUx, 250);
  });
}
