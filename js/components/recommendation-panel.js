/**
 * Recommendation Panel Component
 * Displays solution pattern recommendations with all details
 */

const RecommendationPanelComponent = {
    /**
     * Render the recommendation panel with a pattern
     * @param {Object} pattern - Solution pattern object
     * @param {Object} services - Map of service IDs to service objects
     */
    render(pattern, services) {
        if (!pattern) {
            this.hide();
            return;
        }

        this.show();
        this.renderHeader(pattern);
        this.renderPrerequisites(pattern);
        this.renderStack(pattern, services);
        this.renderCostGuidance(pattern, services);
        this.renderSecurityNotes(pattern);
        this.renderLearningResources(pattern);
    },

    /**
     * Show the recommendation panel
     */
    show() {
        const section = document.getElementById('recommendation-panel');
        if (section) {
            section.style.display = 'block';
            section.classList.add('active');
            section.removeAttribute('hidden');
            section.removeAttribute('style');
            section.style.display = 'block';
        }
    },

    /**
     * Hide the recommendation panel
     */
    hide() {
        const section = document.getElementById('recommendation-panel');
        if (section) {
            section.classList.remove('active');
            section.style.display = 'none';
        }
    },

    /**
     * Render the header section
     * @param {Object} pattern - Solution pattern
     */
    renderHeader(pattern) {
        const titleEl = document.getElementById('pattern-title');
        const summaryEl = document.getElementById('pattern-summary');
        const badgesEl = document.getElementById('pattern-badges');

        if (titleEl) titleEl.textContent = pattern.label || 'Solution Pattern';
        if (summaryEl) summaryEl.textContent = pattern.summary || 'No description available';
        
        if (badgesEl && typeof BadgeComponents !== 'undefined') {
            badgesEl.innerHTML = '';
            const badges = BadgeComponents.renderPatternBadges(pattern);
            if (badges) badgesEl.appendChild(badges);
        }
    },

    /**
     * Render prerequisites section
     * @param {Object} pattern - Solution pattern
     */
    renderPrerequisites(pattern) {
        const container = document.getElementById('prerequisites-content');
        if (!container) return;

        const prereqs = pattern.prerequisiteKnowledge || [];
        
        container.innerHTML = `
            <div class="prereq-item">
                <svg class="prereq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M8 4V8L11 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div>
                    <div class="prereq-label">Estimated Time</div>
                    <div class="prereq-value">${pattern.estimatedBuildTime || 'N/A'}</div>
                </div>
            </div>
            <div class="prereq-item">
                <svg class="prereq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 14L6 10L10 12L14 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
                <div>
                    <div class="prereq-label">Difficulty</div>
                    <div class="prereq-value">${pattern.difficultyLevel || 'N/A'}</div>
                </div>
            </div>
            <div class="prereq-item">
                <svg class="prereq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3Z" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M5 7H11M5 10H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <div>
                    <div class="prereq-label">Required Knowledge</div>
                    <ul class="prereq-list">
                        ${prereqs.map(k => `<li>${k}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Render stack service cards
     * @param {Object} pattern - Solution pattern
     * @param {Object} services - Map of service IDs to service objects
     */
    renderStack(pattern, services) {
        const container = document.getElementById('service-cards');
        if (!container || !pattern.stack) return;

        container.innerHTML = '';
        
        pattern.stack.forEach(serviceId => {
            const service = services[serviceId];
            if (service) {
                let card;
                if (typeof ServiceCardComponent !== 'undefined') {
                    card = ServiceCardComponent.createCompactCard(service, (service) => {
                        if (typeof DocumentationPanelComponent !== 'undefined') {
                            DocumentationPanelComponent.show(service);
                        }
                    });
                } else {
                    // Fallback card creation
                    card = document.createElement('div');
                    card.className = 'service-card-compact';
                    card.innerHTML = `
                        <div class="service-card-info">
                            <h4>${service.name}</h4>
                            <p>${service.shortDescription}</p>
                        </div>
                    `;
                }
                container.appendChild(card);
            }
        });
    },

    /**
     * Render cost guidance section
     * @param {Object} pattern - Solution pattern
     * @param {Object} services - Map of service IDs to service objects
     */
    renderCostGuidance(pattern, services) {
        const container = document.getElementById('cost-cards');
        if (!container || !pattern.stack) return;

        container.innerHTML = '';
        
        pattern.stack.forEach(serviceId => {
            const service = services[serviceId];
            if (service) {
                const card = document.createElement('div');
                card.className = 'cost-card';
                card.innerHTML = `
                    <div class="cost-card-header">
                        <img src="assets/icons/${service.icon}" alt="${service.name}" class="cost-card-icon"
                             onerror="this.style.display='none'">
                        <span class="cost-card-name">${service.name}</span>
                    </div>
                    <div class="cost-card-model">${service.billingModel}</div>
                    <div class="cost-card-hint">${service.costHint}</div>
                    ${service.hasFreeTier ? '<div class="cost-card-free-tier">✓ Free Tier Available</div>' : ''}
                `;
                container.appendChild(card);
            }
        });
    },

    /**
     * Render security notes
     * @param {Object} pattern - Solution pattern
     */
    renderSecurityNotes(pattern) {
        const container = document.getElementById('security-notes');
        if (!container) return;

        const notes = pattern.securityNotes || [];
        container.innerHTML = notes
            .map(note => `
                <div class="security-note">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1L11 3V7C11 10 8 13 8 13C8 13 5 10 5 7V3L8 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    </svg>
                    ${note}
                </div>
            `).join('');
    },

    /**
     * Render learning resources
     * @param {Object} pattern - Solution pattern
     */
    renderLearningResources(pattern) {
        const container = document.getElementById('learning-links');
        if (!container) return;

        const resources = pattern.learningResources || [];
        container.innerHTML = resources
            .map(resource => `
                <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="learning-link">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        <path d="M5 6H11M5 9H9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    ${resource.title}
                </a>
            `).join('');
    },

    /**
     * Scroll to the recommendation panel
     */
    scrollTo() {
        const section = document.getElementById('recommendation-panel');
        if (section) {
            section.style.display = 'block';
            section.classList.add('active');
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecommendationPanelComponent;
}