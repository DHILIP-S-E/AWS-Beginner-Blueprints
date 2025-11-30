/**
 * Matching Module - Keyword matching algorithm for AWS Beginner Blueprint
 * Implements case-insensitive matching with score calculation and tiebreaker logic
 */

const MatchingModule = {
    /**
     * Normalize input text to lowercase and extract words
     * @param {string} input - User input text
     * @returns {string[]} Array of lowercase words
     */
    normalizeInput(input) {
        if (!input || typeof input !== 'string') return [];
        return input
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 1);
    },

    /**
     * Calculate match score between input and pattern
     * @param {string} input - User input text
     * @param {Object} pattern - Solution pattern object
     * @returns {number} Match score (number of matched keywords)
     */
    calculateScore(input, pattern) {
        const inputWords = this.normalizeInput(input);
        if (inputWords.length === 0 || !pattern.intentKeywords) return 0;

        let score = 0;
        const patternKeywords = pattern.intentKeywords.map(k => k.toLowerCase());
        
        // Add common synonyms for better matching
        const synonyms = {
            'ml': ['machine', 'learning', 'model'],
            'ai': ['artificial', 'intelligence', 'smart'],
            'deploy': ['deployment', 'host', 'serve'],
            'frontend': ['web', 'ui', 'interface', 'client'],
            'backend': ['api', 'server', 'service']
        };

        for (const word of inputWords) {
            // Direct keyword matching
            for (const keyword of patternKeywords) {
                if (keyword.includes(word) || word.includes(keyword)) {
                    score++;
                    break;
                }
            }
            
            // Synonym matching
            for (const [key, values] of Object.entries(synonyms)) {
                if (word === key || values.includes(word)) {
                    for (const keyword of patternKeywords) {
                        if (keyword === key || values.includes(keyword)) {
                            score++;
                            break;
                        }
                    }
                }
            }
        }
        return score;
    },

    /**
     * Compare tag specificity between two patterns
     * @param {Object} patternA - First pattern
     * @param {Object} patternB - Second pattern
     * @returns {number} Positive if A more specific, negative if B more specific
     */
    compareTagSpecificity(patternA, patternB) {
        const tagsA = patternA.trendTags?.length || 0;
        const tagsB = patternB.trendTags?.length || 0;
        return tagsA - tagsB;
    },

    /**
     * Find the best matching pattern for user input
     * @param {string} input - User input text
     * @param {Object[]} patterns - Array of solution patterns
     * @returns {Object} Match result with pattern, score, and matched keywords
     */
    findBestMatch(input, patterns) {
        if (!input || !patterns || patterns.length === 0) {
            return { pattern: null, score: 0, matchedKeywords: [], noMatch: true };
        }

        const inputWords = this.normalizeInput(input);
        let bestMatch = null;
        let bestScore = 0;
        let matchedKeywords = [];

        for (const pattern of patterns) {
            const score = this.calculateScore(input, pattern);
            
            if (score > bestScore) {
                bestScore = score;
                bestMatch = pattern;
                matchedKeywords = this.getMatchedKeywords(inputWords, pattern.intentKeywords);
            } else if (score === bestScore && score > 0 && bestMatch) {
                // Tiebreaker: prefer pattern with more specific tags
                if (this.compareTagSpecificity(pattern, bestMatch) > 0) {
                    bestMatch = pattern;
                    matchedKeywords = this.getMatchedKeywords(inputWords, pattern.intentKeywords);
                }
            }
        }

        return {
            pattern: bestMatch,
            score: bestScore,
            matchedKeywords,
            noMatch: bestScore === 0
        };
    },

    /**
     * Get list of matched keywords
     * @param {string[]} inputWords - Normalized input words
     * @param {string[]} patternKeywords - Pattern intent keywords
     * @returns {string[]} Array of matched keywords
     */
    getMatchedKeywords(inputWords, patternKeywords) {
        if (!patternKeywords) return [];
        const matched = [];
        const lowerKeywords = patternKeywords.map(k => k.toLowerCase());

        for (const word of inputWords) {
            for (const keyword of lowerKeywords) {
                if (keyword.includes(word) || word.includes(keyword)) {
                    if (!matched.includes(keyword)) {
                        matched.push(keyword);
                    }
                    break;
                }
            }
        }
        return matched;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatchingModule;
}