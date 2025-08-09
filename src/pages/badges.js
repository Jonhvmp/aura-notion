import { getBadges, getStreak, createNavigation, setupNavigation } from '../utils.js';

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
    ${createNavigation('badges')}

    <div class="main-content">
      <div class="container">
        <header class="page-header">
          <h1 class="title">
            <i class="ph ph-trophy"></i>
            Conquistas
          </h1>
          <p class="subtitle">Colecione badges mantendo sua sequência</p>
        </header>

        ${currentStreak > 0 ? `
        <section class="card">
          <div class="flex items-center gap-4">
            <div class="badge-icon fire-gradient">
              <i class="ph ph-fire"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold" style="color: var(--text-primary)">Sequência Atual</h2>
              <p class="text-lg font-semibold" style="color: var(--brand-accent)">${currentStreak} dia${currentStreak > 1 ? 's' : ''} seguidos</p>
            </div>
          </div>
        </section>
        ` : ''}

        <section class="badge-grid">
          ${all.map(code => {
            const owned = badges.includes(code);
            const targetDays = parseInt(code.replace(/\D/g, ''));
            const progress = Math.min((currentStreak / targetDays) * 100, 100);

            return `
              <div class="badge-card ${owned ? 'earned' : ''}">
                <div class="badge-icon">
                  ${owned ? '<i class="ph ph-trophy"></i>' : targetDays}
                </div>
                <h3 class="badge-title">
                  ${BADGE_LABELS[code]}
                </h3>
                <p class="badge-description">
                  ${BADGE_DESCRIPTIONS[code]}
                </p>

                ${!owned ? `
                <div class="progress-section">
                  <div class="progress-header">
                    <span>Progresso</span>
                    <span>${currentStreak}/${targetDays} dias</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                  </div>
                </div>
                ` : `
                <div class="badge-completed">
                  <i class="ph ph-check-circle"></i>
                  <span>Conquistado!</span>
                </div>
                `}
              </div>
            `;
          }).join('')}
        </section>
      </div>
    </div>
  `;

  setupNavigation();
}
