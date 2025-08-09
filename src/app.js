import { renderHome } from './pages/home.js';
import { renderResumo } from './pages/resumo.js';
import { renderCalendario } from './pages/calendario.js';
import { renderBadges } from './pages/badges.js';

const routes = {
  '': renderHome,
  '#resumo': renderResumo,
  '#calendario': renderCalendario,
  '#badges': renderBadges
};

function router() {
  const hash = window.location.hash;
  const render = routes[hash] || renderHome;
  render();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
