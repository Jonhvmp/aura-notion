class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.setupEventListeners();
    }

    // Criar modal dinâmico
    createModal(options = {}) {
        const {
            title = 'Modal',
            content = '',
            type = 'info', // info, confirm, alert, view
            icon = 'ph-info',
            onConfirm = null,
            onCancel = null,
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            showCancel = true,
            showConfirm = true,
            maxWidth = '500px'
        } = options;

        // Remover modal existente se houver
        this.closeModal();

        // Criar overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.maxWidth = maxWidth;

        // Header do modal
        const header = document.createElement('div');
        header.className = 'modal-header';
        header.innerHTML = `
            <div class="modal-title">
                <i class="${icon}"></i>
                ${title}
            </div>
            <button class="modal-close" onclick="modalSystem.closeModal()">
                <i class="ph-x"></i>
            </button>
        `;

        // Body do modal
        const body = document.createElement('div');
        body.className = 'modal-body';

        if (typeof content === 'string') {
            body.innerHTML = content;
        } else {
            body.appendChild(content);
        }

        // Footer do modal
        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        if (showCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'modal-btn modal-btn-secondary';
            cancelBtn.innerHTML = `<i class="ph-x-circle"></i> ${cancelText}`;
            cancelBtn.onclick = () => {
                if (onCancel) onCancel();
                this.closeModal();
            };
            footer.appendChild(cancelBtn);
        }

        if (showConfirm) {
            const confirmBtn = document.createElement('button');
            confirmBtn.className = `modal-btn ${type === 'confirm' ? 'modal-btn-danger' : 'modal-btn-primary'}`;
            confirmBtn.innerHTML = `<i class="ph-check-circle"></i> ${confirmText}`;
            confirmBtn.onclick = () => {
                if (onConfirm) onConfirm();
                this.closeModal();
            };
            footer.appendChild(confirmBtn);
        }

        // Montar modal
        modal.appendChild(header);
        modal.appendChild(body);
        if (showCancel || showConfirm) {
            modal.appendChild(footer);
        }
        overlay.appendChild(modal);

        // Adicionar ao DOM
        document.body.appendChild(overlay);
        this.activeModal = overlay;

        // Configurar scroll shadows
        this.setupScrollShadows(body);

        // Exibir modal
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });

        // Event listeners
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', this.handleKeydown.bind(this));

        return { modal, overlay, body };
    }

    // Configurar shadows de scroll
    setupScrollShadows(bodyElement) {
        const updateShadows = () => {
            const { scrollTop, scrollHeight, clientHeight } = bodyElement;

            // Verificar se tem conteúdo que pode fazer scroll
            if (scrollHeight > clientHeight) {
                bodyElement.classList.add('has-scroll');

                // Shadow no topo (quando não está no início)
                if (scrollTop > 5) {
                    bodyElement.classList.add('show-top-shadow');
                } else {
                    bodyElement.classList.remove('show-top-shadow');
                }

                // Shadow na parte inferior (quando não está no final)
                if (scrollTop < scrollHeight - clientHeight - 5) {
                    bodyElement.classList.add('show-bottom-shadow');
                } else {
                    bodyElement.classList.remove('show-bottom-shadow');
                }
            } else {
                bodyElement.classList.remove('has-scroll', 'show-top-shadow', 'show-bottom-shadow');
            }
        };

        // Verificar inicialmente e após um pequeno delay para garantir renderização
        setTimeout(updateShadows, 100);
        updateShadows();

        // Observer para mudanças de conteúdo
        const resizeObserver = new ResizeObserver(updateShadows);
        resizeObserver.observe(bodyElement);

        // Event listener para scroll
        bodyElement.addEventListener('scroll', updateShadows);

        // Cleanup quando modal fechar
        this.shadowCleanup = () => {
            resizeObserver.disconnect();
            bodyElement.removeEventListener('scroll', updateShadows);
        };
    }

    // Modal de confirmação
    confirm(message, title = 'Confirmar Ação', options = {}) {
        return new Promise((resolve) => {
            this.createModal({
                title,
                content: message,
                type: 'confirm',
                icon: 'ph-warning-circle',
                confirmText: options.confirmText || 'Sim',
                cancelText: options.cancelText || 'Cancelar',
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
                ...options
            });
        });
    }

    // Modal de alerta
    alert(message, title = 'Aviso', options = {}) {
        return new Promise((resolve) => {
            this.createModal({
                title,
                content: message,
                type: 'alert',
                icon: 'ph-info-circle',
                showCancel: false,
                confirmText: 'OK',
                onConfirm: () => resolve(true),
                ...options
            });
        });
    }

    // Modal de visualização de conteúdo
    view(content, title = 'Visualizar', options = {}) {
        return this.createModal({
            title,
            content,
            type: 'view',
            icon: 'ph-eye',
            showConfirm: false,
            cancelText: 'Fechar',
            maxWidth: options.maxWidth || '600px',
            ...options
        });
    }

    // Fechar modal
    closeModal() {
        if (this.activeModal) {
            this.activeModal.classList.remove('show');

            setTimeout(() => {
                if (this.activeModal && this.activeModal.parentNode) {
                    this.activeModal.parentNode.removeChild(this.activeModal);
                }
                this.activeModal = null;

                // Cleanup das shadows
                if (this.shadowCleanup) {
                    this.shadowCleanup();
                    this.shadowCleanup = null;
                }
            }, 300);

            document.removeEventListener('keydown', this.handleKeydown.bind(this));
        }
    }

    // Manipular teclas
    handleKeydown(e) {
        if (e.key === 'Escape') {
            this.closeModal();
        }
    }

    // Event listeners globais
    setupEventListeners() {
        // Fechar modal ao clicar no overlay
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
    }
}

// Instanciar sistema global
const modalSystem = new ModalSystem();

// Substituir alert e confirm nativos
window.customAlert = (message, title, options) => modalSystem.alert(message, title, options);
window.customConfirm = (message, title, options) => modalSystem.confirm(message, title, options);

// Funções de conveniência
window.showModal = (options) => modalSystem.createModal(options);
window.showViewModal = (content, title, options) => modalSystem.view(content, title, options);
window.closeModal = () => modalSystem.closeModal();

// Export para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalSystem;
}
