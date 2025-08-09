import { getNotes, createNavigation, setupNavigation } from '../utils.js';

function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

window.viewNote = function(date) {
  const notes = getNotes();
  if (notes[date]) {
    alert(`Anotação de ${new Date(date).toLocaleDateString('pt-BR')}:\n\n${notes[date]}`);
  }
};

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
    <div class="main-content">
      ${createNavigation('calendario')}

      <div class="container">
        <header class="text-center mb-10">
          <h1 class="title">Calendário</h1>
          <p class="subtitle">${monthName.charAt(0).toUpperCase()+monthName.slice(1)}</p>
        </header>
        
        <section class="card">
          <div class="calendar-grid">
            <div class="calendar-header">Dom</div>
            <div class="calendar-header">Seg</div>
            <div class="calendar-header">Ter</div>
            <div class="calendar-header">Qua</div>
            <div class="calendar-header">Qui</div>
            <div class="calendar-header">Sex</div>
            <div class="calendar-header">Sáb</div>
            
            ${Array.from({length: firstDay}, () => '<div class="calendar-day"></div>').join('')}
            ${Array.from({length: daysInMonth}, (_, i) => {
              const d = new Date(year, month, i+1);
              const iso = d.toISOString().slice(0,10);
              const hasNote = daysWithNotes.includes(iso);
              const isToday = iso === new Date().toISOString().slice(0,10);

              return `<div class="calendar-day ${hasNote ? 'has-note' : ''} ${isToday ? 'today' : ''}" onclick="viewNote('${iso}')">
                <div class="day-number">${i+1}</div>
                ${hasNote ? `<div class="day-preview">${notes[iso].substring(0, 100)}${notes[iso].length > 100 ? '...' : ''}</div>` : ''}
              </div>`;
            }).join('')}
          </div>
          
          <div class="mt-6 flex items-center gap-4 text-sm text-slate-400">
            <div class="flex items-center gap-2">
              <i class="ph ph-circle-fill text-brand-500"></i>
              <span>Dias com anotações</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="ph ph-calendar-check text-brand-400"></i>
              <span>Hoje</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  setupNavigation();
}
