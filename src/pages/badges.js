import { getBadges } from '../utils.js';

const BADGE_LABELS = {
  '3dias': '3 Dias Seguidos',
  '7dias': '7 Dias Seguidos',
  '30dias': '30 Dias Seguidos'
};

export function renderBadges() {
  const app = document.getElementById('app');
  const badges = getBadges();
  app.innerHTML = `
    <nav class="flex gap-4 mb-6">
      <a href="#" class="hover:underline">Hoje</a>
      <a href="#resumo" class="hover:underline">Resumo</a>
      <a href="#calendario" class="hover:underline">Calendário</a>
      <a href="#badges" class="text-lg font-bold text-fuchsia-700">Badges</a>
    </nav>
    <h1 class="text-3xl font-elegant font-bold mb-4 text-fuchsia-900">Badges de Sequência</h1>
    <div class="flex gap-4">
      ${badges.length === 0 ? '<p class="text-fuchsia-700">Nenhum badge conquistado ainda.</p>' : badges.map(b => `<span class="badge">${BADGE_LABELS[b]}</span>`).join('')}
    </div>
    <p class="mt-4 text-fuchsia-700">Conquiste badges ao manter sua sequência de anotações!</p>
  `;
}
