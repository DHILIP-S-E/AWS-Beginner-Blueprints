/**
 * Workflow Display - Show AWS service workflows with icons
 */

const WorkflowDisplay = {
    showServiceWorkflow(service, knowledgeBase) {
        const resultsSection = document.getElementById('search-results');
        const queryTitle = document.getElementById('search-query-title');
        const resultsContent = document.getElementById('search-results-content');
        
        if (!resultsSection) return;

        queryTitle.textContent = `${service.name} - Complete Guide`;
        
        // Find patterns using this service
        const relatedPatterns = knowledgeBase.patterns.filter(p => 
            p.stack && p.stack.includes(service.id)
        );

        // Get related services
        const relatedServices = service.relatedServiceIds
            ?.map(id => knowledgeBase.services.find(s => s.id === id))
            .filter(Boolean)
            .slice(0, 3) || [];

        resultsContent.innerHTML = `
            <div class="workflow-guide">
                <div class="service-overview">
                    <img src="assets/icons/${service.icon}" alt="${service.name}" width="48" height="48">
                    <div class="service-details">
                        <h3>${service.name}</h3>
                        <p>${service.documentation}</p>
                        <div class="service-tags">
                            ${service.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                        </div>
                    </div>
                </div>

                ${relatedPatterns.length > 0 ? `
                    <div class="workflow-patterns">
                        <h4>🏗️ How to use ${service.name}</h4>
                        ${relatedPatterns.map(pattern => `
                            <div class="pattern-workflow" onclick="showPattern('${pattern.id}')">
                                <h5>${pattern.label}</h5>
                                <div class="workflow-steps">
                                    ${pattern.stack.map(serviceId => {
                                        const s = knowledgeBase.services.find(srv => srv.id === serviceId);
                                        return s ? `
                                            <div class="workflow-step">
                                                <img src="assets/icons/${s.icon}" alt="${s.name}" width="24" height="24">
                                                <span>${s.name}</span>
                                            </div>
                                        ` : '';
                                    }).join('<div class="arrow">→</div>')}
                                </div>
                                <p>${pattern.summary}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="service-info-grid">
                    <div class="info-card">
                        <h4>💰 Pricing</h4>
                        <p>${service.costHint}</p>
                        <span class="free-tier ${service.hasFreeTier ? 'available' : 'unavailable'}">
                            ${service.hasFreeTier ? '✅ Free Tier Available' : '❌ No Free Tier'}
                        </span>
                    </div>
                    <div class="info-card">
                        <h4>🔧 Use Cases</h4>
                        <ul>
                            ${service.intentKeywords?.slice(0, 4).map(keyword => 
                                `<li>${keyword.charAt(0).toUpperCase() + keyword.slice(1)}</li>`
                            ).join('') || '<li>General purpose</li>'}
                        </ul>
                    </div>
                </div>

                ${relatedServices.length > 0 ? `
                    <div class="related-services">
                        <h4>🔗 Works well with</h4>
                        <div class="services-row">
                            ${relatedServices.map(s => `
                                <div class="service-chip" onclick="searchService('${s.id}')">
                                    <img src="assets/icons/${s.icon}" alt="${s.name}" width="20" height="20">
                                    <span>${s.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    },

    showConceptWorkflow(concept, knowledgeBase) {
        const resultsSection = document.getElementById('search-results');
        const queryTitle = document.getElementById('search-query-title');
        const resultsContent = document.getElementById('search-results-content');
        
        if (!resultsSection) return;

        queryTitle.textContent = concept.title;
        
        const relatedServices = concept.data.relatedServices
            ?.map(id => knowledgeBase.services.find(s => s.id === id))
            .filter(Boolean) || [];

        const relatedPatterns = concept.data.relatedPatterns
            ?.map(id => knowledgeBase.patterns.find(p => p.id === id))
            .filter(Boolean) || [];

        resultsContent.innerHTML = `
            <div class="concept-workflow">
                <div class="concept-header">
                    <img src="assets/icons/${concept.icon}" alt="${concept.title}" width="48" height="48">
                    <div>
                        <h3>${concept.title}</h3>
                        <p>${concept.subtitle}</p>
                    </div>
                </div>

                <div class="workflow-steps-guide">
                    <h4>📋 Step-by-step workflow</h4>
                    ${relatedPatterns.map((pattern, index) => `
                        <div class="step-card" onclick="showPattern('${pattern.id}')">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">
                                <h5>${pattern.label}</h5>
                                <div class="step-services">
                                    ${pattern.stack.map(serviceId => {
                                        const s = knowledgeBase.services.find(srv => srv.id === serviceId);
                                        return s ? `
                                            <img src="assets/icons/${s.icon}" alt="${s.name}" width="20" height="20" title="${s.name}">
                                        ` : '';
                                    }).join('')}
                                </div>
                                <p>${pattern.summary}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="recommended-services">
                    <h4>🛠️ AWS Services you'll need</h4>
                    <div class="services-grid">
                        ${relatedServices.map(service => `
                            <div class="service-card-mini" onclick="searchService('${service.id}')">
                                <img src="assets/icons/${service.icon}" alt="${service.name}" width="32" height="32">
                                <div>
                                    <h6>${service.name}</h6>
                                    <p>${service.shortDescription}</p>
                                    <span class="cost">${service.costHint}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
};

// Global functions for onclick handlers
window.showPattern = function(patternId) {
    if (typeof handlePatternSelection === 'function' && window.knowledgeBase) {
        const pattern = window.knowledgeBase.patterns.find(p => p.id === patternId);
        if (pattern) handlePatternSelection(pattern);
    }
};

window.searchService = function(serviceId) {
    const input = document.getElementById('intent-input');
    if (input && window.knowledgeBase) {
        const service = window.knowledgeBase.services.find(s => s.id === serviceId);
        if (service) {
            input.value = service.name;
            SmartSuggestions.handleInput(service.name);
        }
    }
};