import { getNotes } from '../utils.js';

export function renderResumo() {
  const app = document.getElementById('app');
  const notes = getNotes();
  const dates = Object.keys(notes).sort().reverse();
  app.innerHTML = `
    <nav class="flex gap-4 mb-6">
      <a href="#" class="hover:underline">Hoje</a>
      <a href="#resumo" class="text-lg font-bold text-fuchsia-700">Resumo</a>
      <a href="#calendario" class="hover:underline">Calendário</a>
      <a href="#badges" class="hover:underline">Badges</a>
    </nav>
    <h1 class="text-3xl font-elegant font-bold mb-4 text-fuchsia-900">Resumo das Anotações</h1>
    <div class="space-y-4">
      ${dates.length === 0 ? '<p class="text-fuchsia-700">Nenhuma anotação ainda.</p>' : dates.map(date => `
        <div class="bg-white/80 rounded-lg p-4 border-l-4 border-fuchsia-400 shadow">
          <div class="font-semibold text-fuchsia-800 mb-1">${date}</div>
          <div class="text-fuchsia-900">${notes[date]}</div>
        </div>
      `).join('')}
    </div>
  `;
}
