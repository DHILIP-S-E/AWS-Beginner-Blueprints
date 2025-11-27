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
        card.className = 'service-card';
        card.dataset.serviceId = service.id;

        const icon = this.renderIcon(service);
        const badges = this.renderBadges(service);

        card.innerHTML = `
            ${icon}
            <div class="service-card-content">
                <h3 class="service-card-title">${service.name}</h3>
                <p class="service-card-description">${service.shortDescription}</p>
                ${badges}
                <div class="service-card-actions">
                    <button class="btn-secondary service-learn-more">Learn More</button>
                </div>
            </div>
        `;

        // Add click handler
        if (clickCallback) {
            card.addEventListener('click', () => clickCallback(service));
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
        let badges = `<span class="badge badge-category">${service.category}</span>`;
        
        if (service.hasFreeTier) {
            badges += `<span class="badge badge-free-tier">✓ Free Tier</span>`;
        }

        return `<div class="service-card-badges">${badges}</div>`;
    },

    /**
     * Get emoji for service category
     * @param {string} category - Service category
     * @returns {string} Emoji character
     */
    getServiceEmoji(category) {
        const emojiMap = {
            'Compute': '⚡',
            'Storage': '📦',
            'Database': '🗄️',
            'AI/ML': '🤖',
            'Analytics': '📊',
            'Security': '🔒',
            'Networking': '🌐',
            'DevOps': '🔧',
            'Migration': '🚚',
            'IoT': '📡',
            'Business Apps': '💼',
            'Contact Center': '📞',
            'Media Services': '🎬',
            'Blockchain': '⛓️',
            'Quantum': '⚛️'
        };
        return emojiMap[category] || '☁️';
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
                    onerror="this.textContent='${this.getServiceEmoji(service.category)}'"
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