/**
 * Service Modal Component - Shows detailed service information in a modal
 */

const DocumentationPanelComponent = {
    knowledgeBase: null,

    /**
     * Initialize the service modal
     * @param {Object} kb - Knowledge base
     */
    init(kb) {
        this.knowledgeBase = kb;
        this.setupEventListeners();
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const modal = document.getElementById('service-modal');
        const closeBtn = document.getElementById('service-modal-close');
        const overlay = document.getElementById('service-modal-overlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.hide());
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                this.hide();
            }
        });
    },

    /**
     * Show service details in modal
     * @param {Object} service - Service object
     */
    show(service) {
        if (!service) return;

        const modal = document.getElementById('service-modal');
        if (!modal) return;

        this.renderServiceDetails(service);
        this.renderRelatedServices(service);

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    },

    /**
     * Hide the service modal
     */
    hide() {
        const modal = document.getElementById('service-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    },

    /**
     * Render service details
     * @param {Object} service - Service object
     */
    renderServiceDetails(service) {
        // Set icon
        const icon = document.getElementById('service-modal-icon');
        if (icon) {
            icon.src = `assets/icons/${service.icon}`;
            icon.alt = service.name;
        }

        // Set title
        const title = document.getElementById('service-modal-title');
        if (title) title.textContent = service.name;

        // Set category
        const category = document.getElementById('service-modal-category');
        if (category) category.textContent = service.category;

        // Set tier info
        const tier = document.getElementById('service-modal-tier');
        if (tier) {
            tier.textContent = service.hasFreeTier ? 'Free Tier Available' : 'Paid Service';
            tier.className = service.hasFreeTier ? 'service-tier' : 'service-tier paid';
        }

        // Set description
        const description = document.getElementById('service-modal-description');
        if (description) description.textContent = service.documentation || service.shortDescription;

        // Add calculator button to modal header
        const modalHeader = document.querySelector('.service-modal-header .service-info');
        if (modalHeader) {
            // Remove existing calculator button if any
            const existingBtn = modalHeader.querySelector('.modal-calculator-btn');
            if (existingBtn) existingBtn.remove();
            
            // Add new calculator button
            const calcBtn = document.createElement('button');
            calcBtn.className = 'modal-calculator-btn';
            calcBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="2"/>
                    <line x1="8" y1="18" x2="12" y2="18" stroke="currentColor" stroke-width="2"/>
                </svg>
                Calculator
            `;
            calcBtn.onclick = () => openCalculator(service.id);
            modalHeader.appendChild(calcBtn);
        }

        // Add pricing calculator
        const pricingContainer = document.getElementById('service-pricing-info');
        if (pricingContainer && window.priceCalculator) {
            pricingContainer.innerHTML = window.priceCalculator.generatePricingHTML(service.id);
        }

        // Set use cases
        const useCases = document.getElementById('service-use-cases');
        if (useCases && service.tags) {
            useCases.innerHTML = service.tags
                .map(tag => `<span class="use-case-tag">${tag}</span>`)
                .join('');
        }
    },

    /**
     * Render related services
     * @param {Object} service - Service object
     */
    renderRelatedServices(service) {
        const container = document.getElementById('related-services-grid');
        if (!container || !service.relatedServiceIds) return;

        container.innerHTML = '';
        
        service.relatedServiceIds.forEach(serviceId => {
            const relatedService = this.findServiceById(serviceId);
            if (relatedService) {
                const card = this.createRelatedServiceCard(relatedService);
                container.appendChild(card);
            }
        });
    },

    /**
     * Create a related service card
     * @param {Object} service - Service object
     * @returns {HTMLElement} Card element
     */
    createRelatedServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'related-service-card';
        card.dataset.serviceId = service.id;
        
        card.innerHTML = `
            <img src="assets/icons/${service.icon}" alt="${service.name}" class="related-service-icon">
            <div class="related-service-info">
                <h4>${service.name}</h4>
                <p>${service.shortDescription}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            this.show(service);
        });

        return card;
    },

    /**
     * Find service by ID
     * @param {string} serviceId - Service ID
     * @returns {Object|null} Service object or null
     */
    findServiceById(serviceId) {
        if (!this.knowledgeBase || !this.knowledgeBase.services) return null;
        return this.knowledgeBase.services.find(s => s.id === serviceId) || null;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentationPanelComponent;
}