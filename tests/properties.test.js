/**
 * Property-Based Tests for AWS Beginner Blueprint
 * Uses fast-check library for property-based testing
 * 
 * Run with: npm test
 */

// Mock browser environment for Node.js testing
if (typeof window === 'undefined') {
    global.window = {};
    global.document = { 
        addEventListener: () => {},
        createElement: (tag) => ({
            className: '',
            textContent: '',
            title: '',
            appendChild: () => {},
            style: { display: '' }
        })
    };
}

// Import modules (adjust paths as needed for your test runner)
const fc = require('fast-check');

// Load knowledge base
const knowledgeBase = require('../data/knowledge-base.json');

// Import modules for testing
const MatchingModule = require('../js/matching.js');
const SearchModule = require('../js/search.js');
const WorkflowRenderer = require('../js/workflow-renderer.js');
const ExportModule = require('../js/export.js');
const ComparisonModule = require('../js/comparison.js');
const BadgeComponents = require('../js/components/badges.js');

// Initialize SearchModule with knowledge base
SearchModule.init(knowledgeBase);

describe('AWS Beginner Blueprint - Property-Based Tests', () => {

    /**
     * **Feature: aws-beginner-blueprint, Property 1: Case-Insensitive Matching**
     * **Validates: Requirements 1.1, 2.1, 10.1**
     */
    describe('Property 1: Case-Insensitive Matching', () => {
        test('matching produces same result regardless of input casing', () => {
            fc.assert(
                fc.property(
                    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz '.split('')), { minLength: 1, maxLength: 50 }),
                    (input) => {
                        const lowerResult = MatchingModule.findBestMatch(input.toLowerCase(), knowledgeBase.patterns);
                        const upperResult = MatchingModule.findBestMatch(input.toUpperCase(), knowledgeBase.patterns);
                        const mixedResult = MatchingModule.findBestMatch(input, knowledgeBase.patterns);
                        
                        // All should return the same pattern (or all null)
                        const lowerPatternId = lowerResult.pattern?.id || null;
                        const upperPatternId = upperResult.pattern?.id || null;
                        const mixedPatternId = mixedResult.pattern?.id || null;
                        
                        return lowerPatternId === upperPatternId && upperPatternId === mixedPatternId;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 2: Highest Score Selection**
     * **Validates: Requirements 1.2, 10.2**
     */
    describe('Property 2: Highest Score Selection', () => {
        test('selected pattern has score >= all other patterns', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...['api', 'serverless', 'database', 'static website', 'ai image', 'container', 'notification']),
                    (query) => {
                        const result = MatchingModule.findBestMatch(query, knowledgeBase.patterns);
                        
                        if (result.noMatch) return true;
                        
                        // Check that no other pattern has a higher score
                        for (const pattern of knowledgeBase.patterns) {
                            const score = MatchingModule.calculateScore(query, pattern);
                            if (score > result.score) {
                                return false;
                            }
                        }
                        return true;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 4: Service Search Substring Match**
     * **Validates: Requirements 2.3**
     */
    describe('Property 4: Service Search Substring Match', () => {
        test('all returned services contain search term in name or id', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...['lambda', 's3', 'ec2', 'dynamo', 'api', 'cloud', 'sage']),
                    (query) => {
                        const results = SearchModule.searchByServiceName(query);
                        const lowerQuery = query.toLowerCase();
                        
                        return results.every(service => 
                            service.name.toLowerCase().includes(lowerQuery) ||
                            service.id.toLowerCase().includes(lowerQuery) ||
                            service.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
                        );
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 5: Topic-Pattern Association**
     * **Validates: Requirements 3.2**
     */
    describe('Property 5: Topic-Pattern Association', () => {
        test('patterns returned for topic have that topic in trendTags', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...knowledgeBase.trendingTopics.map(t => t.id)),
                    (topicId) => {
                        const topic = knowledgeBase.trendingTopics.find(t => t.id === topicId);
                        const patterns = SearchModule.getPatternsByTopic(topicId);
                        
                        // All returned patterns should be in the topic's relatedPatterns
                        return patterns.every(pattern => 
                            topic.relatedPatterns.includes(pattern.id)
                        );
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 6: Stack Size Constraint**
     * **Validates: Requirements 4.2**
     */
    describe('Property 6: Stack Size Constraint', () => {
        test('all patterns have 1-5 services in stack', () => {
            for (const pattern of knowledgeBase.patterns) {
                expect(pattern.stack.length).toBeGreaterThanOrEqual(1);
                expect(pattern.stack.length).toBeLessThanOrEqual(5);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 9: Service Data Completeness**
     * **Validates: Requirements 6.1, 6.2, 6.3, 7.1, 7.4, 9.1**
     */
    describe('Property 9: Service Data Completeness', () => {
        test('all services have required fields', () => {
            const requiredFields = ['id', 'name', 'icon', 'category', 'shortDescription', 
                                   'documentation', 'billingModel', 'costHint', 'hasFreeTier'];
            
            for (const service of knowledgeBase.services) {
                for (const field of requiredFields) {
                    expect(service).toHaveProperty(field);
                    expect(service[field]).toBeDefined();
                }
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 10: Related Services Limit**
     * **Validates: Requirements 7.2**
     */
    describe('Property 10: Related Services Limit', () => {
        test('getRelatedServices returns at most 3 services', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...knowledgeBase.services.map(s => s.id)),
                    (serviceId) => {
                        const service = SearchModule.getServiceById(serviceId);
                        const related = SearchModule.getRelatedServices(service, 3);
                        return related.length <= 3;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 11: Category Filter Accuracy**
     * **Validates: Requirements 8.3**
     */
    describe('Property 11: Category Filter Accuracy', () => {
        test('filtered services all belong to selected category', () => {
            fc.assert(
                fc.property(
                    fc.constantFrom(...knowledgeBase.categories),
                    (category) => {
                        const filtered = SearchModule.filterByCategory(category);
                        return filtered.every(service => service.category === category);
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 12: Knowledge Base JSON Validity**
     * **Validates: Requirements 9.5, 9.6**
     */
    describe('Property 12: Knowledge Base JSON Validity', () => {
        test('knowledge base can be serialized and deserialized', () => {
            const serialized = JSON.stringify(knowledgeBase);
            const deserialized = JSON.parse(serialized);
            
            expect(deserialized.services.length).toBe(knowledgeBase.services.length);
            expect(deserialized.patterns.length).toBe(knowledgeBase.patterns.length);
            expect(deserialized.trendingTopics.length).toBe(knowledgeBase.trendingTopics.length);
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 13: Category Coverage**
     * **Validates: Requirements 9.4**
     */
    describe('Property 13: Category Coverage', () => {
        test('all categories have at least one service', () => {
            for (const category of knowledgeBase.categories) {
                const services = knowledgeBase.services.filter(s => s.category === category);
                expect(services.length).toBeGreaterThan(0);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 14: Pattern Data Completeness**
     * **Validates: Requirements 16.1, 16.2, 16.3, 16.4, 17.1, 17.4, 19.2**
     */
    describe('Property 14: Pattern Data Completeness', () => {
        test('all patterns have required fields', () => {
            const requiredFields = ['id', 'label', 'intentKeywords', 'stack', 'summary',
                                   'workflowDiagram', 'costLevel', 'popularityScore',
                                   'difficultyLevel', 'estimatedBuildTime', 'prerequisiteKnowledge',
                                   'securityNotes', 'learningResources'];
            
            for (const pattern of knowledgeBase.patterns) {
                for (const field of requiredFields) {
                    expect(pattern).toHaveProperty(field);
                }
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 15: Export Filename Format**
     * **Validates: Requirements 14.4**
     */
    describe('Property 15: Export Filename Format', () => {
        test('generated filename matches pattern', () => {
            fc.assert(
                fc.property(
                    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz-'.split('')), { minLength: 1, maxLength: 30 }),
                    (patternId) => {
                        const filename = ExportModule.generateFilename(patternId);
                        return filename.endsWith('-architecture.png') && 
                               filename.length > '-architecture.png'.length;
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 16: Comparison Availability**
     * **Validates: Requirements 15.1**
     */
    describe('Property 16: Comparison Availability', () => {
        test('hasComparison returns true only when alternativeStack exists', () => {
            for (const pattern of knowledgeBase.patterns) {
                const hasComparison = ComparisonModule.hasComparison(pattern);
                const hasAlternative = pattern.alternativeStack !== undefined;
                expect(hasComparison).toBe(hasAlternative);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 17: Popularity Badge Assignment**
     * **Validates: Requirements 18.2, 18.3**
     */
    describe('Property 17: Popularity Badge Assignment', () => {
        test('trending badge shown for score > 80', () => {
            fc.assert(
                fc.property(
                    fc.integer({ min: 81, max: 100 }),
                    (score) => {
                        const badge = BadgeComponents.renderPopularityBadge(score, []);
                        return badge !== null && badge.textContent.includes('Trending');
                    }
                ),
                { numRuns: 100 }
            );
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 18: Popularity Sort Order**
     * **Validates: Requirements 18.4**
     */
    describe('Property 18: Popularity Sort Order', () => {
        test('getAllPatterns returns patterns sorted by popularity descending', () => {
            const patterns = SearchModule.getAllPatterns();
            
            for (let i = 1; i < patterns.length; i++) {
                expect(patterns[i-1].popularityScore).toBeGreaterThanOrEqual(patterns[i].popularityScore);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 19: Security Notes Count**
     * **Validates: Requirements 19.1**
     */
    describe('Property 19: Security Notes Count', () => {
        test('all patterns have 1-3 security notes', () => {
            for (const pattern of knowledgeBase.patterns) {
                expect(pattern.securityNotes.length).toBeGreaterThanOrEqual(1);
                expect(pattern.securityNotes.length).toBeLessThanOrEqual(3);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 20: Cost Badge Assignment**
     * **Validates: Requirements 20.2, 20.3**
     */
    describe('Property 20: Cost Badge Assignment', () => {
        test('low cost badge shown for Low costLevel', () => {
            const badge = BadgeComponents.renderCostBadge('Low');
            expect(badge).not.toBeNull();
            expect(badge.textContent).toContain('Low Cost');
        });

        test('cost sensitive badge shown for High costLevel', () => {
            const badge = BadgeComponents.renderCostBadge('High');
            expect(badge).not.toBeNull();
            expect(badge.textContent).toContain('Cost Sensitive');
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 21: Popularity Score Range**
     * **Validates: Requirements 18.1**
     */
    describe('Property 21: Popularity Score Range', () => {
        test('all patterns have popularityScore between 1 and 100', () => {
            for (const pattern of knowledgeBase.patterns) {
                expect(pattern.popularityScore).toBeGreaterThanOrEqual(1);
                expect(pattern.popularityScore).toBeLessThanOrEqual(100);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 22: Cost Level Validity**
     * **Validates: Requirements 20.1**
     */
    describe('Property 22: Cost Level Validity', () => {
        test('all patterns have valid costLevel', () => {
            const validLevels = ['Low', 'Medium', 'High'];
            
            for (const pattern of knowledgeBase.patterns) {
                expect(validLevels).toContain(pattern.costLevel);
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 7: Workflow Node Order**
     * **Validates: Requirements 5.1, 5.4**
     */
    describe('Property 7: Workflow Node Order', () => {
        test('user nodes are at position 0 when present', () => {
            for (const pattern of knowledgeBase.patterns) {
                const userNode = pattern.workflowDiagram.nodes.find(n => n.serviceId === 'user');
                if (userNode) {
                    expect(userNode.position).toBe(0);
                }
            }
        });
    });

    /**
     * **Feature: aws-beginner-blueprint, Property 8: Valid Edge References**
     * **Validates: Requirements 5.2**
     */
    describe('Property 8: Valid Edge References', () => {
        test('all edge references point to valid nodes', () => {
            for (const pattern of knowledgeBase.patterns) {
                const nodeIds = new Set(pattern.workflowDiagram.nodes.map(n => n.id));
                
                for (const edge of pattern.workflowDiagram.edges) {
                    expect(nodeIds.has(edge.from)).toBe(true);
                    expect(nodeIds.has(edge.to)).toBe(true);
                }
            }
        });
    });
});
