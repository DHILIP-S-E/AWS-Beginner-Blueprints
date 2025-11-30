/**
 * Smart Suggestions Integration - Connect suggestions with existing components
 */

// Extend SmartSuggestions with integration methods
if (typeof SmartSuggestions !== 'undefined') {
    
    // Override service selection to use existing modal
    SmartSuggestions.handleServiceSelection = function(suggestion) {
        const service = suggestion.data;
        
        // Use existing service modal functionality
        if (typeof openServiceModal === 'function') {
            openServiceModal(service.name);
        } else {
            // Fallback to showing service details
            this.showServiceDetails(service);
        }
    };

    // Override pattern selection to use existing workflow renderer
    SmartSuggestions.handlePatternSelection = function(suggestion) {
        const pattern = suggestion.data;
        
        // Use existing pattern selection handler
        if (typeof handlePatternSelection === 'function') {
            handlePatternSelection(pattern);
        } else if (window.WorkflowRenderer) {
            WorkflowRenderer.renderPattern(pattern);
        }
    };

    // Override category selection to use existing service index
    SmartSuggestions.handleCategorySelection = function(suggestion) {
        const category = suggestion.data.category;
        
        // Use existing service index filtering
        if (typeof ServiceIndexComponent !== 'undefined' && ServiceIndexComponent.filterByCategory) {
            ServiceIndexComponent.filterByCategory(category);
            
            // Scroll to service index
            const serviceIndex = document.getElementById('service-index');
            if (serviceIndex) {
                serviceIndex.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Fallback to showing category services
            this.showCategoryServices(category);
        }
    };

    // Override concept selection to show educational content
    SmartSuggestions.handleConceptSelection = function(suggestion) {
        const conceptData = suggestion.data;
        
        // Show concept guide
        this.showConceptGuide(conceptData);
        
        // Also trigger related pattern if available
        if (conceptData.relatedPatterns && conceptData.relatedPatterns.length > 0) {
            const patternId = conceptData.relatedPatterns[0];
            const pattern = this.knowledgeBase.patterns.find(p => p.id === patternId);
            if (pattern && typeof handlePatternSelection === 'function') {
                setTimeout(() => handlePatternSelection(pattern), 500);
            }
        }
    };

    // Add method to integrate with existing search results section
    SmartSuggestions.showSearchResults = function(query, suggestions) {
        const resultsSection = document.getElementById('search-results');
        const queryTitle = document.getElementById('search-query-title');
        const resultsContent = document.getElementById('search-results-content');
        
        if (!resultsSection || !queryTitle || !resultsContent) {
            return;
        }

        queryTitle.textContent = `Search Results for: "${query}"`;
        
        // Group suggestions by type
        const serviceResults = suggestions.filter(s => s.type === 'service');
        const patternResults = suggestions.filter(s => s.type === 'pattern');
        const conceptResults = suggestions.filter(s => s.type === 'concept');
        
        let html = '';
        
        if (serviceResults.length > 0) {
            html += `
                <div class="results-section">
                    <h3>AWS Services</h3>
                    <div class="services-grid">
                        ${serviceResults.map(service => `
                            <div class="service-card" data-service-id="${service.id}">
                                <img src="assets/icons/${service.icon}" alt="${service.title}" width="32" height="32">
                                <div class="service-info">
                                    <h4>${service.title}</h4>
                                    <p>${service.subtitle}</p>
                                    <span class="category">${service.category}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (patternResults.length > 0) {
            html += `
                <div class="results-section">
                    <h3>Solution Patterns</h3>
                    <div class="patterns-grid">
                        ${patternResults.map(pattern => `
                            <div class="pattern-card" data-pattern-id="${pattern.id}">
                                <h4>${pattern.title}</h4>
                                <p>${pattern.subtitle}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (conceptResults.length > 0) {
            html += `
                <div class="results-section">
                    <h3>Learning Guides</h3>
                    <div class="concepts-grid">
                        ${conceptResults.map(concept => `
                            <div class="concept-card" data-concept-id="${concept.id}">
                                <img src="assets/icons/${concept.icon}" alt="${concept.title}" width="32" height="32">
                                <div class="concept-info">
                                    <h4>${concept.title}</h4>
                                    <p>${concept.subtitle}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        resultsContent.innerHTML = html;
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Bind click events
        resultsContent.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', () => {
                const serviceId = card.dataset.serviceId;
                const service = serviceResults.find(s => s.id === serviceId);
                if (service) {
                    this.handleServiceSelection(service);
                }
            });
        });
        
        resultsContent.querySelectorAll('.pattern-card').forEach(card => {
            card.addEventListener('click', () => {
                const patternId = card.dataset.patternId;
                const pattern = patternResults.find(p => p.id === patternId);
                if (pattern) {
                    this.handlePatternSelection(pattern);
                }
            });
        });
        
        resultsContent.querySelectorAll('.concept-card').forEach(card => {
            card.addEventListener('click', () => {
                const conceptId = card.dataset.conceptId;
                const concept = conceptResults.find(c => c.id === conceptId);
                if (concept) {
                    this.handleConceptSelection(concept);
                }
            });
        });
    };

    // Override performSearch to use existing search functionality
    SmartSuggestions.performSearch = function(query) {
        // First try intent search
        if (typeof handleIntentSearch === 'function') {
            const result = handleIntentSearch(query);
            if (result && !result.noMatch) {
                return;
            }
        }
        
        // Fallback to generating suggestions and showing results
        const suggestions = this.generateSuggestions(query);
        if (suggestions.length > 0) {
            this.showSearchResults(query, suggestions);
        }
    };
}

// Global function to handle search from suggestion chips
window.handleSuggestionSearch = function(query) {
    const searchInput = document.getElementById('intent-input');
    if (searchInput) {
        searchInput.value = query;
        
        // Trigger smart suggestions if available
        if (typeof SmartSuggestions !== 'undefined' && SmartSuggestions.performSearch) {
            SmartSuggestions.performSearch(query);
        } else if (typeof handleIntentSearch === 'function') {
            handleIntentSearch(query);
        }
    }
};

// Update suggestion chips to use the new handler
document.addEventListener('DOMContentLoaded', () => {
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.textContent.trim();
            handleSuggestionSearch(query);
        });
    });
});