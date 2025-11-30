/**
 * Service Card Component - Renders individual service cards
 */

const ServiceCardComponent = {
    /**
     * Create a service card element
     * @param {Object} service - Service object
     * @param {Function} clickCallback - Callback for card click
     * @returns {HTMLElement} Service card element
     */
    createCard(service, clickCallback) {
        const card = document.createElement('div');
        card.className = 'service-card card-interactive';
        card.dataset.serviceId = service.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const badges = this.renderBadges(service);

        card.innerHTML = `
            <div class="service-card-header">
                <div class="service-card-icon">
                    <img 
                        src="assets/icons/${service.icon}" 
                        alt="${service.name}" 
                        onerror="this.style.display='none';"
                    >
                </div>
                <div class="service-card-info">
                    <h3 class="service-card-title">${service.name}</h3>
                    <div class="service-card-category">${service.category}</div>
                </div>
            </div>
            <p class="service-card-description">${service.shortDescription}</p>
            <div class="service-card-badges">
                ${badges}
            </div>
            <div class="service-card-footer">
                <div class="service-card-pricing">${service.hasFreeTier ? 'Free Tier Available' : 'Paid Service'}</div>
                <div class="service-card-actions">
                    <button class="calculator-btn" onclick="openCalculator('${service.id}')" title="Price Calculator">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" stroke-width="2"/>
                            <line x1="8" y1="6" x2="16" y2="6" stroke="currentColor" stroke-width="2"/>
                            <line x1="8" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2"/>
                            <line x1="8" y1="14" x2="16" y2="14" stroke="currentColor" stroke-width="2"/>
                            <line x1="8" y1="18" x2="12" y2="18" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                    <svg class="service-card-arrow" viewBox="0 0 24 24" fill="none">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        `;

        // Add click handler
        if (clickCallback) {
            card.addEventListener('click', () => clickCallback(service));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clickCallback(service);
                }
            });
        }

        return card;
    },

    /**
     * Render service icon
     * @param {Object} service - Service object
     * @returns {string} Icon HTML
     */
    renderIcon(service) {
        const iconPath = `assets/icons/${service.icon}`;
        return `
            <div class="service-card-icon">
                <img 
                    src="${iconPath}" 
                    alt="${service.name}" 
                    class="service-icon"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >
                <div class="service-icon-placeholder" style="display: none;">
                    ${this.getServiceEmoji(service.category)}
                </div>
            </div>
        `;
    },

    /**
     * Render service badges
     * @param {Object} service - Service object
     * @returns {string} Badges HTML
     */
    renderBadges(service) {
        let badges = '';
        
        if (service.hasFreeTier) {
            badges += `<span class="badge badge-free-tier">Free Tier</span>`;
        }

        if (service.costLevel) {
            const costClass = service.costLevel.toLowerCase().replace(' ', '-');
            badges += `<span class="badge badge-${costClass}">${service.costLevel}</span>`;
        }

        if (service.complexity) {
            const complexityClass = service.complexity.toLowerCase();
            badges += `<span class="badge badge-${complexityClass}">${service.complexity}</span>`;
        }

        return badges;
    },

    /**
     * Get SVG icon for service category
     * @param {string} category - Service category
     * @returns {string} SVG icon
     */
    getServiceEmoji(category) {
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect width="16" height="16" rx="4" fill="currentColor" opacity="0.2"/><circle cx="8" cy="8" r="3" fill="currentColor"/></svg>`;
    },

    /**
     * Create a compact service card for recommendations
     * @param {Object} service - Service object
     * @param {Function} clickCallback - Callback for card click
     * @returns {HTMLElement} Compact service card
     */
    createCompactCard(service, clickCallback) {
        const card = document.createElement('div');
        card.className = 'service-card-compact';
        card.dataset.serviceId = service.id;

        card.innerHTML = `
            <div class="service-card-icon-small">
                <img 
                    src="assets/icons/${service.icon}" 
                    alt="${service.name}"
                    onerror="this.style.display='none';"
                >
            </div>
            <div class="service-card-info">
                <h4>${service.name}</h4>
                <p>${service.shortDescription}</p>
            </div>
        `;

        if (clickCallback) {
            card.addEventListener('click', () => clickCallback(service));
        }

        return card;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceCardComponent;
}