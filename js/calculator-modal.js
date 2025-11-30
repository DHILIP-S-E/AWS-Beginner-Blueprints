// Calculator Modal Component
const CalculatorModal = {
    init() {
        this.createModal();
    },

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'calculator-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeCalculator()"></div>
            <div class="modal-content calculator-modal-content">
                <div class="modal-header">
                    <h3 id="calculator-title">Price Calculator</h3>
                    <button class="modal-close" onclick="closeCalculator()">&times;</button>
                </div>
                <div class="modal-body" id="calculator-body">
                    <!-- Calculator content will be inserted here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    show(serviceId) {
        const modal = document.getElementById('calculator-modal');
        const title = document.getElementById('calculator-title');
        const body = document.getElementById('calculator-body');
        
        if (!modal || !title || !body) return;

        // Get service info
        const service = SearchModule.getServiceById(serviceId);
        if (!service) return;

        title.textContent = `${service.name} - Price Calculator`;
        body.innerHTML = window.priceCalculator.generatePricingHTML(serviceId);
        
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
    },

    hide() {
        const modal = document.getElementById('calculator-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    }
};

// Global functions
function openCalculator(serviceId) {
    CalculatorModal.show(serviceId);
}

function closeCalculator() {
    CalculatorModal.hide();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CalculatorModal.init());
} else {
    CalculatorModal.init();
}