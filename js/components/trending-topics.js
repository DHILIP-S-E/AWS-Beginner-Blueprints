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
            const button = this.createTopicButton(topic);
            container.appendChild(button);
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
        card.className = 'trending-card';
        card.dataset.topicId = topic.id;

        card.innerHTML = `
            <div class="trending-card-icon">${topic.icon}</div>
            <h3 class="trending-card-title">${topic.label}</h3>
            <p class="trending-card-desc">${topic.description}</p>
        `;

        card.addEventListener('click', () => {
            this.selectTopic(topic);
        });

        return card;
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