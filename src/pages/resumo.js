import { getNotes } from '../utils.js';

export function renderResumo() {
  const app = document.getElementById('app');
  const notes = getNotes();
  const dates = Object.keys(notes).sort().reverse();

  app.innerHTML = `
    <header class="mb-10 flex flex-col gap-6">
      <nav class="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium">
        <a href="#" class="nav-link">Hoje</a>
        <a href="#resumo" class="nav-link active">Resumo</a>
        <a href="#calendario" class="nav-link">Calendário</a>
        <a href="#badges" class="nav-link">Badges</a>
      </nav>
      <div class="flex flex-col gap-3">
        <h1 class="text-4xl md:text-5xl font-elegant font-bold tracking-tight title-gradient">Resumo</h1>
        <p class="text-lg font-medium" style="color: var(--text-secondary)">Todas as suas entradas organizadas por data</p>
      </div>
    </header>
    <section class="space-y-6">
      ${dates.length === 0 ?
        `<div class="card-glass p-8 text-center">
          <p style="color: var(--text-muted)" class="text-lg">Nenhuma anotação registrada ainda.</p>
          <p style="color: var(--text-muted)" class="text-sm mt-2">Comece fazendo sua primeira anotação hoje!</p>
        </div>`
        :
        dates.map(date => `
          <article class="card-glass p-5 md:p-6 hover:shadow-xl transition-all duration-300 group">
            <div class="flex items-center justify-between mb-4">
              <time datetime="${date}" class="text-sm font-semibold tracking-wide" style="color: var(--text-secondary)">${new Date(date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</time>
              <span class="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full" style="background: var(--card-border); color: var(--text-secondary)">
                ${notes[date].length} caracteres
              </span>
            </div>
            <p style="color: var(--text-primary)" class="leading-relaxed whitespace-pre-wrap">${notes[date]}</p>
          </article>
        `).join('')
      }
    </section>
  `;
}
