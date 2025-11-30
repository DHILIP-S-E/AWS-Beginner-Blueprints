/**
 * Trending Topics Component - Renders and handles trending topic selection
 */

const TrendingTopicsComponent = {
    knowledgeBase: null,
    selectionCallback: null,

    /**
     * Initialize the trending topics component
     * @param {Object} kb - Knowledge base
     * @param {Function} callback - Function to call when topic is selected
     */
    init(kb, callback) {
        this.knowledgeBase = kb;
        this.selectionCallback = callback;
        this.render();
    },

    /**
     * Render trending topic cards
     */
    render() {
        const container = document.getElementById('trending-grid');
        if (!container || !this.knowledgeBase) return;

        container.innerHTML = '';

        this.knowledgeBase.trendingTopics.forEach(topic => {
            const card = this.createTopicCard(topic);
            container.appendChild(card);
        });
    },

    /**
     * Create a trending topic button
     * @param {Object} topic - Trending topic object
     * @returns {HTMLElement} Topic button element
     */
    createTopicButton(topic) {
        const button = document.createElement('button');
        button.className = 'topic-chip';
        button.dataset.topicId = topic.id;
        button.textContent = `${topic.icon} ${topic.label}`;

        button.addEventListener('click', () => {
            this.selectTopic(topic);
        });

        return button;
    },

    /**
     * Create a trending topic card
     * @param {Object} topic - Trending topic object
     * @returns {HTMLElement} Topic card element
     */
    createTopicCard(topic) {
        const card = document.createElement('div');
        card.className = 'trending-card card-interactive';
        card.dataset.topicId = topic.id;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');

        const tags = topic.tags || ['Popular', 'Beginner-Friendly'];
        const tagsHtml = tags.map(tag => `<span class="trending-card-tag">${tag}</span>`).join('');

        const iconSvg = this.getIconSvg(topic.icon);
        
        card.innerHTML = `
            <div class="trending-card-header">
                <div class="trending-card-icon">${iconSvg}</div>
                <h3 class="trending-card-title">${topic.label}</h3>
            </div>
            <p class="trending-card-description">${topic.description}</p>
            <div class="trending-card-tags">
                ${tagsHtml}
            </div>
        `;

        card.addEventListener('click', () => {
            // Add visual feedback
            this.setActiveCard(card);
            this.selectTopic(topic);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.setActiveCard(card);
                this.selectTopic(topic);
            }
        });

        return card;
    },

    /**
     * Get SVG icon for topic
     * @param {string} iconName - Icon name
     * @returns {string} SVG icon
     */
    getIconSvg(iconName) {
        const icons = {
            'ai': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/></svg>',
            'serverless': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13 10V3L4 14H11L11 21L20 10H13Z" fill="currentColor"/></svg>',
            'container': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 9H15V15H9V9Z" fill="currentColor"/></svg>',
            'realtime': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="currentColor"/></svg>',
            'analytics': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3V21H21" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 14L12 9L16 13L21 8" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
            'security': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L15 5V11C15 15 12 19 12 19C12 19 9 15 9 11V5L12 2Z" fill="currentColor"/></svg>',
            'edge': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M2 12H6M18 12H22M12 2V6M12 18V22" stroke="currentColor" stroke-width="2"/></svg>',
            'iot': '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12.55C5 12.55 6.5 11 8 11S11 12.55 11 12.55" stroke="currentColor" stroke-width="2" fill="none"/><path d="M13 12.55C13 12.55 14.5 11 16 11S19 12.55 19 12.55" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8" cy="16" r="1" fill="currentColor"/><circle cx="16" cy="16" r="1" fill="currentColor"/></svg>'
        };
        return icons[iconName] || icons['ai'];
    },

    /**
     * Handle topic selection
     * @param {Object} topic - Selected topic
     */
    selectTopic(topic) {
        if (this.selectionCallback) {
            // Get first pattern for this topic
            const patterns = this.getPatternsByTopic(topic.id);
            if (patterns.length > 0) {
                this.selectionCallback(patterns[0]);
                this.scrollToRecommendations();
            }
        }
    },

    /**
     * Get patterns for a topic
     * @param {string} topicId - Topic ID
     * @returns {Object[]} Array of patterns
     */
    getPatternsByTopic(topicId) {
        if (!this.knowledgeBase) return [];

        const topic = this.knowledgeBase.trendingTopics.find(t => t.id === topicId);
        if (!topic || !topic.relatedPatterns) return [];

        return topic.relatedPatterns
            .map(patternId => this.knowledgeBase.patterns.find(p => p.id === patternId))
            .filter(Boolean);
    },

    /**
     * Set active card visual state
     * @param {HTMLElement} activeCard - The card to mark as active
     */
    setActiveCard(activeCard) {
        // Remove active class from all cards
        const allCards = document.querySelectorAll('.trending-card');
        allCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to selected card
        activeCard.classList.add('active');
    },

    /**
     * Scroll to recommendations panel
     */
    scrollToRecommendations() {
        const panel = document.getElementById('recommendation-panel');
        if (panel) {
            panel.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrendingTopicsComponent;
}