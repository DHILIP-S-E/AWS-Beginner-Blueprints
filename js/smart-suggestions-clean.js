const SmartSuggestions = {
    knowledgeBase: null,
    suggestionsContainer: null,
    searchInput: null,
    currentSuggestions: [],
    isVisible: false,

    init(kb) {
        this.knowledgeBase = kb;
        this.searchInput = document.getElementById('intent-input');
        
        if (!this.searchInput) return;
        
        const searchContainer = this.searchInput.parentElement;
        if (!searchContainer) return;
        
        searchContainer.style.position = 'relative';
        
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.className = 'smart-suggestions-dropdown';
        searchContainer.appendChild(this.suggestionsContainer);
        
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length < 2) {
                this.hideSuggestions();
                return;
            }
            
            const lower = query.toLowerCase();
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
            
            if (isComplexQuery && suggestions.length < 3) {
                this.hideSuggestions();
                return;
            }
            
            this.showSuggestions(suggestions);
        });
        
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 150);
        });
    },

    generateSuggestions(query) {
        return [];
    },

    showSuggestions(suggestions) {
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }
    },

    hideSuggestions() {
        if (this.suggestionsContainer) {
            this.suggestionsContainer.style.display = 'none';
        }
        this.isVisible = false;
    }
};