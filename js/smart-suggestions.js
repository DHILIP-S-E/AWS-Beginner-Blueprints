const SmartSuggestions = {
    knowledgeBase: null,
    suggestionsContainer: null,
    searchInput: null,
    currentSuggestions: [],
    isVisible: false,

    init(kb) {
        console.log('SmartSuggestions init called with:', kb);
        this.knowledgeBase = kb;
        this.searchInput = document.getElementById('intent-input');
        
        if (!this.searchInput) {
            console.error('Search input not found');
            return;
        }
        
        const searchContainer = this.searchInput.parentElement;
        if (!searchContainer) {
            console.error('Search container not found');
            return;
        }
        
        searchContainer.style.position = 'relative';
        
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.className = 'smart-suggestions-dropdown';
        searchContainer.appendChild(this.suggestionsContainer);
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            console.log('Input query:', query);
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }
            
            // Detect complex multi-service queries and let main search handle them
            const lower = query.toLowerCase();
            
            // Dynamic service detection from knowledge base + common keywords
            let matchedServices = 0;
            if (this.knowledgeBase?.services) {
                matchedServices = this.knowledgeBase.services.filter(service => {
                    return service.name.toLowerCase().split(' ').some(word => lower.includes(word)) ||
                           service.id.toLowerCase().includes(lower.replace(/[^a-z0-9]/g, '')) ||
                           service.tags?.some(tag => lower.includes(tag.toLowerCase())) ||
                           service.intentKeywords?.some(keyword => lower.includes(keyword.toLowerCase()));
                }).length;
            }
            
            const isComplexQuery = matchedServices >= 2 || lower.split(' ').length > 6;
            
            const suggestions = this.generateSuggestions(query);
            
            // For complex queries, prefer main search over suggestions
            if (isComplexQuery && suggestions.length < 3) {
                this.hideSuggestions();
                return;
            }
            
            console.log('Generated suggestions:', suggestions);
            this.showSuggestions(suggestions);
        });
        
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 150);
        });
        
        console.log('SmartSuggestions initialized successfully');
    },

    generateSuggestions(query) {
        const lowerQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
        const suggestions = [];

        // Enhanced question matching with scoring
        if (typeof QuestionBank !== 'undefined') {
            const queryWords = lowerQuery.split(' ').filter(w => w.length > 2);
            const questionMatches = QuestionBank.questions
                .map(q => {
                    const qText = q.q.toLowerCase();
                    let score = 0;
                    
                    // Exact phrase match gets highest score
                    if (qText.includes(lowerQuery)) score += 10;
                    
                    // Word matches
                    queryWords.forEach(word => {
                        if (qText.includes(word)) score += 3;
                        // Special boost for key terms
                        if ((word === 'deploy' || word === 'website') && qText.includes(word)) score += 5;
                    });
                    
                    return { question: q, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(item => ({
                    type: 'question',
                    title: item.question.answer,
                    subtitle: `Step-by-step guide with ${item.question.services.length} AWS services`,
                    icon: 'aws-cloud.svg',
                    data: item.question
                }));
            suggestions.push(...questionMatches);
        }

        // Trending topics suggestions
        if (typeof TrendingTopics !== 'undefined') {
            const trendingMatches = TrendingTopics.search(lowerQuery);
            suggestions.push(...trendingMatches);
        }

        // Service suggestions
        if (this.knowledgeBase?.services) {
            const services = this.knowledgeBase.services
                .filter(s => s.name.toLowerCase().includes(lowerQuery) || 
                           s.shortDescription.toLowerCase().includes(lowerQuery))
                .slice(0, 2)
                .map(s => ({
                    type: 'service',
                    title: s.name,
                    subtitle: s.shortDescription,
                    icon: s.icon,
                    data: s
                }));
            suggestions.push(...services);
        }

        return suggestions.slice(0, 6);
    },

    showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        this.currentSuggestions = suggestions;
        const html = suggestions.map((s, i) => `
            <div class="suggestion-item" data-index="${i}">
                <div class="suggestion-icon">
                    <img src="assets/icons/${s.icon}" alt="${s.title}" width="20" height="20">
                </div>
                <div class="suggestion-content">
                    <div class="suggestion-title">${s.title}</div>
                    <div class="suggestion-subtitle">${s.subtitle}</div>
                </div>
                <div class="suggestion-category">${s.type}</div>
            </div>
        `).join('');

        this.suggestionsContainer.innerHTML = html;
        this.suggestionsContainer.style.display = 'block';
        this.isVisible = true;

        // Bind click events
        this.suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const index = parseInt(item.dataset.index);
                const suggestion = this.currentSuggestions[index];
                console.log('Clicked suggestion:', suggestion);
                
                this.hideSuggestions();
                this.searchInput.value = suggestion.title;
                
                if (suggestion.type === 'question') {
                    console.log('Showing question answer');
                    this.showAnswer(suggestion.data);
                } else if (suggestion.type === 'trending') {
                    console.log('Showing trending answer');
                    this.showTrendingAnswer(suggestion.data);
                } else if (suggestion.type === 'service') {
                    console.log('Showing service details');
                    this.showServiceDetails(suggestion.data);
                } else {
                    console.log('Unknown suggestion type:', suggestion.type);
                    // Fallback - trigger regular search
                    if (typeof handleIntentSearch === 'function') {
                        handleIntentSearch(suggestion.title);
                    }
                }
            });
        });
    },

    showAnswer(questionData) {
        console.log('showAnswer called with:', questionData);
        console.log('Knowledge base services:', this.knowledgeBase?.services?.length);
        
        const services = questionData.services
            .map(id => this.knowledgeBase.services.find(s => s.id === id))
            .filter(Boolean);
        
        console.log('Found services:', services);
        
        const resultsSection = document.getElementById('search-results');
        const queryTitle = document.getElementById('search-query-title');
        const resultsContent = document.getElementById('search-results-content');
        
        console.log('Results elements found:', !!resultsSection, !!queryTitle, !!resultsContent);
        
        if (!resultsSection) {
            console.error('Results section not found');
            return;
        }

        queryTitle.textContent = questionData.answer;
        resultsContent.innerHTML = `
            <div class="question-answer">
                <h3>${questionData.answer}</h3>
                <h4>Required AWS Services:</h4>
                <div class="services-grid">
                    ${services.length > 0 ? services.map(s => `
                        <div class="service-card-clickable">
                            <img src="assets/icons/${s.icon}" alt="${s.name}" width="32" height="32">
                            <div>
                                <h5>${s.name}</h5>
                                <p>${s.shortDescription}</p>
                            </div>
                        </div>
                    `).join('') : '<p>No services found for this question.</p>'}
                </div>
            </div>
        `;

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        console.log('Results displayed');
    },

    showTrendingAnswer(trendingData) {
        const services = trendingData.services
            .map(id => this.knowledgeBase.services.find(s => s.id === id))
            .filter(Boolean);
        
        const resultsSection = document.getElementById('search-results');
        const queryTitle = document.getElementById('search-query-title');
        const resultsContent = document.getElementById('search-results-content');
        
        if (!resultsSection) return;

        queryTitle.textContent = trendingData.answer;
        resultsContent.innerHTML = `
            <div class="question-answer">
                <h3>${trendingData.trend} ${trendingData.answer}</h3>
                <p>This is a trending solution pattern in cloud architecture.</p>
                <h4>Required AWS Services:</h4>
                <div class="services-grid">
                    ${services.map(s => `
                        <div class="service-card-clickable">
                            <img src="assets/icons/${s.icon}" alt="${s.name}" width="32" height="32">
                            <div>
                                <h5>${s.name}</h5>
                                <p>${s.shortDescription}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    },

    showServiceDetails(serviceData) {
        const resultsSection = document.getElementById('search-results');
        const queryTitle = document.getElementById('search-query-title');
        const resultsContent = document.getElementById('search-results-content');
        
        if (!resultsSection) return;

        queryTitle.textContent = serviceData.name;
        resultsContent.innerHTML = `
            <div class="question-answer">
                <div class="service-detail-header">
                    <img src="assets/icons/${serviceData.icon}" alt="${serviceData.name}" width="48" height="48">
                    <div>
                        <h3>${serviceData.name}</h3>
                        <p>${serviceData.shortDescription}</p>
                    </div>
                </div>
                <div class="service-info-grid">
                    <div class="info-card">
                        <h4>Category</h4>
                        <p>${serviceData.category}</p>
                    </div>
                    <div class="info-card">
                        <h4>Use Cases</h4>
                        <p>${serviceData.useCases ? serviceData.useCases.join(', ') : 'Various cloud applications'}</p>
                    </div>
                    <div class="info-card">
                        <h4>Free Tier</h4>
                        <p>${serviceData.freeTier || 'Check AWS Free Tier for details'}</p>
                    </div>
                </div>
            </div>
        `;

        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    },

    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
        this.isVisible = false;
    }
};