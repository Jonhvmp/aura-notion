import { getBadges, getStreak } from '../utils.js';

const BADGE_LABELS = {
  '3dias': '3 Dias Seguidos',
  '7dias': '7 Dias Seguidos',
  '30dias': '30 Dias Seguidos'
};

const BADGE_DESCRIPTIONS = {
  '3dias': 'Consistência é o primeiro passo para o sucesso',
  '7dias': 'Uma semana inteira de dedicação e foco',
  '30dias': 'Um mês completo de disciplina e crescimento'
};

export function renderBadges() {
  const app = document.getElementById('app');
  const badges = getBadges();
  const currentStreak = getStreak();
  const all = Object.keys(BADGE_LABELS);

  app.innerHTML = `
    <header class="mb-10 flex flex-col gap-6">
      <nav class="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium">
        <a href="#" class="nav-link">Hoje</a>
        <a href="#resumo" class="nav-link">Resumo</a>
        <a href="#calendario" class="nav-link">Calendário</a>
        <a href="#badges" class="nav-link active">Badges</a>
      </nav>
      <div class="flex flex-col gap-3">
        <h1 class="text-4xl md:text-5xl font-elegant font-bold tracking-tight title-gradient">Conquistas</h1>
        <p class="text-lg font-medium" style="color: var(--text-secondary)">Colecione badges mantendo sua sequência</p>
      </div>
    </header>

    ${currentStreak > 0 ? `
    <section class="card-glass p-6 mb-8">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-xl flex items-center justify-center text-2xl" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
          🔥
        </div>
        <div>
          <h2 class="text-xl font-bold" style="color: var(--text-primary)">Sequência Atual</h2>
          <p class="text-lg font-semibold" style="color: var(--brand-accent)">${currentStreak} dia${currentStreak > 1 ? 's' : ''} seguidos</p>
        </div>
      </div>
    </section>
    ` : ''}

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      ${all.map(code => {
        const owned = badges.includes(code);
        const targetDays = parseInt(code.replace(/\D/g, ''));
        const progress = Math.min((currentStreak / targetDays) * 100, 100);

        return `
          <div class="card-glass p-6 flex flex-col gap-4 ${owned ? 'ring-2 ring-purple-500/30' : 'opacity-75'}">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${owned ? 'bg-gradient-to-br from-purple-500 to-purple-700' : 'bg-gray-600'}" style="${owned ? '' : 'background: rgba(107, 114, 128, 0.5)'}">
                ${owned ? '🏆' : targetDays}
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-lg" style="color: ${owned ? 'var(--brand-accent)' : 'var(--text-secondary)'}">
                  ${BADGE_LABELS[code]}
                </h3>
                <p class="text-sm leading-relaxed" style="color: var(--text-muted)">
                  ${BADGE_DESCRIPTIONS[code]}
                </p>
              </div>
            </div>

            ${!owned ? `
            <div class="mt-2">
              <div class="flex justify-between text-xs mb-1" style="color: var(--text-muted)">
                <span>Progresso</span>
                <span>${currentStreak}/${targetDays} dias</span>
              </div>
              <div class="w-full bg-gray-700 rounded-full h-2">
                <div class="h-2 rounded-full transition-all duration-500" style="width: ${progress}%; background: linear-gradient(90deg, var(--brand-accent), var(--brand-accent-hover))"></div>
              </div>
            </div>
            ` : `
            <div class="flex items-center gap-2 text-sm font-medium" style="color: var(--brand-accent)">
              <span>✓</span>
              <span>Conquistado!</span>
            </div>
            `}
          </div>
        `;
      }).join('')}
    </section>
  `;
}
