/**
 * Documentation Panel Component - Shows service documentation and related services
 */

const DocumentationPanelComponent = {
    knowledgeBase: null,
    isVisible: false,

    /**
     * Initialize the documentation panel
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
        const closeBtn = document.getElementById('doc-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }
    },

    /**
     * Show documentation for a service
     * @param {Object} service - Service object
     */
    show(service) {
        if (!service) return;

        const panel = document.getElementById('documentation-panel');
        const serviceInfo = document.getElementById('doc-service-info');
        const content = document.getElementById('doc-content');
        const relatedContainer = document.getElementById('related-cards');

        if (!panel || !serviceInfo || !content) return;

        // Update service info
        serviceInfo.innerHTML = `
            <div class="doc-service-header">
                <img 
                    src="assets/icons/${service.icon}" 
                    alt="${service.name}"
                    class="doc-service-icon"
                    onerror="this.style.display='none'"
                >
                <div class="doc-service-details">
                    <h2>${service.name}</h2>
                    <span class="badge badge-category">${service.category}</span>
                    ${service.hasFreeTier ? '<span class="badge badge-free-tier">✓ Free Tier</span>' : ''}
                </div>
            </div>
        `;

        // Update content
        content.innerHTML = `
            <div class="doc-section">
                <h3>📖 Overview</h3>
                <p>${service.documentation}</p>
            </div>
            
            <div class="doc-section">
                <h3>💰 Billing Model</h3>
                <p><strong>Model:</strong> ${service.billingModel}</p>
                <p><strong>Cost Hint:</strong> ${service.costHint}</p>
                <div class="cost-disclaimer">
                    ⚠️ This is educational cost guidance only. Check AWS Pricing pages for production workloads.
                </div>
            </div>

            <div class="doc-section">
                <h3>🏷️ Tags & Use Cases</h3>
                <div class="doc-tags">
                    ${service.tags ? service.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                </div>
            </div>
        `;

        // Show related services
        this.renderRelatedServices(service, relatedContainer);

        // Show panel
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth' });
        this.isVisible = true;
    },

    /**
     * Hide the documentation panel
     */
    hide() {
        const panel = document.getElementById('documentation-panel');
        if (panel) {
            panel.style.display = 'none';
            this.isVisible = false;
        }
    },

    /**
     * Render related services (max 3)
     * @param {Object} service - Current service
     * @param {HTMLElement} container - Container for related services
     */
    renderRelatedServices(service, container) {
        if (!container || !service.relatedServiceIds) return;

        container.innerHTML = '';

        const relatedServices = service.relatedServiceIds
            .slice(0, 3)
            .map(id => this.knowledgeBase.services.find(s => s.id === id))
            .filter(Boolean);

        if (relatedServices.length === 0) {
            container.innerHTML = '<p>No related services found.</p>';
            return;
        }

        relatedServices.forEach(relatedService => {
            const card = this.createRelatedServiceCard(relatedService);
            container.appendChild(card);
        });
    },

    /**
     * Create a related service card
     * @param {Object} service - Related service
     * @returns {HTMLElement} Related service card
     */
    createRelatedServiceCard(service) {
        const card = document.createElement('div');
        card.className = 'related-service-card';
        card.dataset.serviceId = service.id;

        card.innerHTML = `
            <img 
                src="assets/icons/${service.icon}" 
                alt="${service.name}"
                class="related-service-icon"
                onerror="this.textContent='☁️'"
            >
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
     * Toggle panel visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DocumentationPanelComponent;
}