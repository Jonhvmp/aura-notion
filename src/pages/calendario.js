import { getNotes } from '../utils.js';

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function renderCalendario() {
  const app = document.getElementById('app');
  const notes = getNotes();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getMonthDays(year, month);
  const daysWithNotes = Object.keys(notes);

  app.innerHTML = `
    <nav class="flex gap-4 mb-6">
      <a href="#" class="hover:underline">Hoje</a>
      <a href="#resumo" class="hover:underline">Resumo</a>
      <a href="#calendario" class="text-lg font-bold text-fuchsia-700">Calendário</a>
      <a href="#badges" class="hover:underline">Badges</a>
    </nav>
    <h1 class="text-3xl font-elegant font-bold mb-4 text-fuchsia-900">Calendário</h1>
    <div class="grid grid-cols-7 gap-2 bg-white/80 rounded-lg p-4 shadow">
      ${Array.from({length: daysInMonth}, (_, i) => {
        const d = new Date(year, month, i+1);
        const iso = d.toISOString().slice(0,10);
        const hasNote = daysWithNotes.includes(iso);
        return `<div class="w-10 h-10 flex items-center justify-center rounded-lg font-bold ${hasNote ? 'bg-fuchsia-400 text-white shadow' : 'bg-fuchsia-100 text-fuchsia-700'}">${i+1}</div>`;
      }).join('')}
    </div>
    <p class="mt-4 text-fuchsia-700">Dias destacados possuem anotações.</p>
  `;
}
