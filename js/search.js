/**
 * Search Module - Search functionality for AWS Beginner Blueprint
 * Handles intent search, service name search, category filtering, and topic filtering
 */

const SearchModule = {
    knowledgeBase: null,

    /**
     * Initialize the search module with knowledge base data
     * @param {Object} kb - Knowledge base object
     */
    init(kb) {
        this.knowledgeBase = kb;
    },

    /**
     * Search by user intent/description
     * @param {string} query - User's project description
     * @returns {Object} Match result with pattern and score
     */
    searchByIntent(query) {
        if (!this.knowledgeBase || !this.knowledgeBase.patterns) {
            return { pattern: null, score: 0, noMatch: true };
        }
        return MatchingModule.findBestMatch(query, this.knowledgeBase.patterns);
    },

    /**
     * Search for AWS services by name
     * @param {string} query - Service name or partial name
     * @returns {Object[]} Array of matching services
     */
    searchByServiceName(query) {
        if (!this.knowledgeBase || !this.knowledgeBase.services || !query) {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();
        if (normalizedQuery.length === 0) return [];

        return this.knowledgeBase.services.filter(service => {
            const nameMatch = service.name.toLowerCase().includes(normalizedQuery);
            const idMatch = service.id.toLowerCase().includes(normalizedQuery);
            const tagMatch = service.tags?.some(tag => 
                tag.toLowerCase().includes(normalizedQuery)
            );
            return nameMatch || idMatch || tagMatch;
        });
    },

    /**
     * Filter services by category
     * @param {string} category - Category name
     * @returns {Object[]} Array of services in the category
     */
    filterByCategory(category) {
        if (!this.knowledgeBase || !this.knowledgeBase.services) {
            return [];
        }

        if (!category || category === '') {
            return this.knowledgeBase.services;
        }

        return this.knowledgeBase.services.filter(service => 
            service.category === category
        );
    },

    /**
     * Get solution patterns by trending topic
     * @param {string} topicId - Trending topic ID
     * @returns {Object[]} Array of related solution patterns
     */
    getPatternsByTopic(topicId) {
        if (!this.knowledgeBase) return [];

        const topic = this.knowledgeBase.trendingTopics?.find(t => t.id === topicId);
        if (!topic || !topic.relatedPatterns) return [];

        return topic.relatedPatterns
            .map(patternId => this.knowledgeBase.patterns?.find(p => p.id === patternId))
            .filter(Boolean);
    },

    /**
     * Get a service by ID
     * @param {string} serviceId - Service ID
     * @returns {Object|null} Service object or null
     */
    getServiceById(serviceId) {
        if (!this.knowledgeBase || !this.knowledgeBase.services) return null;
        return this.knowledgeBase.services.find(s => s.id === serviceId) || null;
    },

    /**
     * Get a pattern by ID
     * @param {string} patternId - Pattern ID
     * @returns {Object|null} Pattern object or null
     */
    getPatternById(patternId) {
        if (!this.knowledgeBase || !this.knowledgeBase.patterns) return null;
        return this.knowledgeBase.patterns.find(p => p.id === patternId) || null;
    },

    /**
     * Get all services for a pattern's stack
     * @param {Object} pattern - Solution pattern
     * @returns {Object[]} Array of service objects
     */
    getServicesForPattern(pattern) {
        if (!pattern || !pattern.stack) return [];
        return pattern.stack
            .map(serviceId => this.getServiceById(serviceId))
            .filter(Boolean);
    },

    /**
     * Get related services for a service
     * @param {Object} service - Service object
     * @param {number} limit - Maximum number of related services
     * @returns {Object[]} Array of related service objects
     */
    getRelatedServices(service, limit = 3) {
        if (!service || !service.relatedServiceIds) return [];
        return service.relatedServiceIds
            .slice(0, limit)
            .map(id => this.getServiceById(id))
            .filter(Boolean);
    },

    /**
     * Get all categories
     * @returns {string[]} Array of category names
     */
    getCategories() {
        return this.knowledgeBase?.categories || [];
    },

    /**
     * Get all trending topics
     * @returns {Object[]} Array of trending topic objects
     */
    getTrendingTopics() {
        return this.knowledgeBase?.trendingTopics || [];
    },

    /**
     * Get all services sorted by name
     * @returns {Object[]} Array of all services
     */
    getAllServices() {
        if (!this.knowledgeBase || !this.knowledgeBase.services) return [];
        return [...this.knowledgeBase.services].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
    },

    /**
     * Get all patterns sorted by popularity
     * @returns {Object[]} Array of all patterns
     */
    getAllPatterns() {
        if (!this.knowledgeBase || !this.knowledgeBase.patterns) return [];
        return [...this.knowledgeBase.patterns].sort((a, b) => 
            (b.popularityScore || 0) - (a.popularityScore || 0)
        );
    },

    /**
     * Get patterns that use a specific service
     * @param {string} serviceId - Service ID
     * @returns {Object[]} Array of patterns using the service
     */
    getPatternsUsingService(serviceId) {
        if (!this.knowledgeBase || !this.knowledgeBase.patterns) return [];
        return this.knowledgeBase.patterns.filter(pattern => 
            pattern.stack?.includes(serviceId)
        );
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchModule;
}