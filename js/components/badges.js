/**
 * Badge Components - Renders various badges for patterns and services
 */

const BadgeComponents = {
    /**
     * Render popularity badge based on score and tags
     * @param {number} score - Popularity score (1-100)
     * @param {string[]} tags - Pattern tags
     * @returns {HTMLElement|null} Badge element or null
     */
    renderPopularityBadge(score, tags = []) {
        if (score > 80) {
            return this.createBadge('🔥 Trending', 'badge-trending');
        }
        
        if (score >= 60 && score <= 80) {
            const hasStudentTag = tags.some(tag => 
                tag.toLowerCase().includes('college') || 
                tag.toLowerCase().includes('student')
            );
            if (hasStudentTag) {
                return this.createBadge('⭐ Popular for Projects', 'badge-popular');
            }
        }
        
        return null;
    },

    /**
     * Render cost level badge
     * @param {string} costLevel - Cost level (Low, Medium, High)
     * @returns {HTMLElement|null} Badge element or null
     */
    renderCostBadge(costLevel) {
        switch (costLevel) {
            case 'Low':
                return this.createBadge('💰 Low Cost', 'badge-low-cost');
            case 'High':
                const badge = this.createBadge('⚠️ Cost Sensitive', 'badge-high-cost');
                badge.title = 'This architecture may incur significant costs. Review pricing carefully.';
                return badge;
            default:
                return null;
        }
    },

    /**
     * Render difficulty level badge
     * @param {string} level - Difficulty level (Beginner, Intermediate, Advanced)
     * @returns {HTMLElement} Badge element
     */
    renderDifficultyBadge(level) {
        const classMap = {
            'Beginner': 'badge-beginner',
            'Intermediate': 'badge-intermediate',
            'Advanced': 'badge-advanced'
        };
        return this.createBadge(level, classMap[level] || 'badge-category');
    },

    /**
     * Render free tier badge
     * @param {boolean} hasFreeTier - Whether service has free tier
     * @returns {HTMLElement|null} Badge element or null
     */
    renderFreeTierBadge(hasFreeTier) {
        if (hasFreeTier) {
            return this.createBadge('✓ Free Tier', 'badge-free-tier');
        }
        return null;
    },

    /**
     * Render category badge
     * @param {string} category - Service category
     * @returns {HTMLElement} Badge element
     */
    renderCategoryBadge(category) {
        return this.createBadge(category, 'badge-category');
    },

    /**
     * Render trend tag badges
     * @param {string[]} trendTags - Array of trend tags
     * @returns {HTMLElement[]} Array of badge elements
     */
    renderTrendTags(trendTags = []) {
        return trendTags.map(tag => this.createBadge(tag, 'badge-category'));
    },

    /**
     * Create a badge element
     * @param {string} text - Badge text
     * @param {string} className - CSS class name
     * @returns {HTMLElement} Badge element
     */
    createBadge(text, className) {
        const badge = document.createElement('span');
        badge.className = `badge ${className}`;
        badge.textContent = text;
        return badge;
    },

    /**
     * Render all badges for a pattern
     * @param {Object} pattern - Solution pattern
     * @returns {HTMLElement} Container with all badges
     */
    renderPatternBadges(pattern) {
        const container = document.createElement('div');
        container.className = 'pattern-badges';

        // Popularity badge
        const popularityBadge = this.renderPopularityBadge(
            pattern.popularityScore, 
            pattern.trendTags
        );
        if (popularityBadge) container.appendChild(popularityBadge);

        // Cost badge
        const costBadge = this.renderCostBadge(pattern.costLevel);
        if (costBadge) container.appendChild(costBadge);

        // Difficulty badge
        if (pattern.difficultyLevel) {
            container.appendChild(this.renderDifficultyBadge(pattern.difficultyLevel));
        }

        return container;
    },

    /**
     * Render all badges for a service
     * @param {Object} service - AWS service
     * @returns {HTMLElement} Container with all badges
     */
    renderServiceBadges(service) {
        const container = document.createElement('div');
        container.className = 'service-card-badges';

        // Category badge
        if (service.category) {
            container.appendChild(this.renderCategoryBadge(service.category));
        }

        // Free tier badge
        const freeTierBadge = this.renderFreeTierBadge(service.hasFreeTier);
        if (freeTierBadge) container.appendChild(freeTierBadge);

        return container;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BadgeComponents;
}