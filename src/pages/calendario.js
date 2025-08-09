import { getNotes } from '../utils.js';

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export function renderCalendario() {
  const app = document.getElementById('app');
  const notes = getNotes();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysWithNotes = Object.keys(notes);

  const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  app.innerHTML = `
    <header class="mb-10 flex flex-col gap-6">
      <nav class="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium">
        <a href="#" class="nav-link">Hoje</a>
        <a href="#resumo" class="nav-link">Resumo</a>
        <a href="#calendario" class="nav-link active">Calendário</a>
        <a href="#badges" class="nav-link">Badges</a>
      </nav>
      <div class="flex flex-col gap-3">
        <h1 class="text-4xl md:text-5xl font-elegant font-bold tracking-tight title-gradient">Calendário</h1>
        <p class="text-lg font-medium" style="color: var(--text-secondary)">${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</p>
      </div>
    </header>
    <section class="card-glass p-6 md:p-8">
      <div class="grid grid-cols-7 gap-3 text-xs font-semibold uppercase tracking-wide mb-4" style="color: var(--text-muted)">
        <div class="text-center p-2">Dom</div>
        <div class="text-center p-2">Seg</div>
        <div class="text-center p-2">Ter</div>
        <div class="text-center p-2">Qua</div>
        <div class="text-center p-2">Qui</div>
        <div class="text-center p-2">Sex</div>
        <div class="text-center p-2">Sáb</div>
      </div>
      <div class="grid grid-cols-7 gap-3">
        ${Array.from({length: firstDay}, () => '<div class="w-12 h-12 md:w-14 md:h-14"></div>').join('')}
        ${Array.from({length: daysInMonth}, (_, i) => {
          const d = new Date(year, month, i+1);
          const iso = d.toISOString().slice(0,10);
          const hasNote = daysWithNotes.includes(iso);
          const isToday = iso === new Date().toISOString().slice(0,10);

          return `<div class="calendar-day relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl font-semibold text-sm md:text-base transition-all duration-300 ${
            hasNote
              ? 'has-note text-white shadow-lg'
              : 'text-gray-400'
          } ${
            isToday
              ? 'ring-2 ring-offset-2 ring-purple-500'
              : ''
          }" style="${
            hasNote
              ? 'background: linear-gradient(135deg, var(--brand-accent), var(--brand-accent-hover)); box-shadow: 0 8px 25px -8px rgba(139, 92, 246, 0.4);'
              : 'background: rgba(255, 255, 255, 0.05);'
          }">
            ${i+1}
            ${hasNote ? '<span class="absolute -bottom-1 right-1 w-2 h-2 rounded-full bg-yellow-400 shadow"></span>' : ''}
          </div>`;
        }).join('')}
      </div>
      <div class="mt-6 flex items-center gap-4 text-sm" style="color: var(--text-muted)">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-purple-600"></div>
          <span>Dias com anotações</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border-2 border-purple-500"></div>
          <span>Hoje</span>
        </div>
      </div>
    </section>
  `;
}
