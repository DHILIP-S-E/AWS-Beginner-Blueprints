// Enhanced Search with Fuzzy Matching and Autocomplete

class EnhancedSearch {
  constructor() {
    this.searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    this.popularSearches = ['serverless api', 'static website', 'database', 'machine learning', 'storage'];
    this.init();
  }

  init() {
    this.setupAdvancedSearch();
    this.setupSearchFilters();
    this.setupSearchAnalytics();
  }

  // Advanced Search with Fuzzy Matching
  setupAdvancedSearch() {
    const searchInput = document.getElementById('intent-input');
    if (!searchInput) return;

    let searchTimeout;
    let suggestionIndex = -1;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performAdvancedSearch(e.target.value);
      }, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
      const suggestions = document.querySelectorAll('.suggestion-item');
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        suggestionIndex = Math.min(suggestionIndex + 1, suggestions.length - 1);
        this.highlightSuggestion(suggestions, suggestionIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        suggestionIndex = Math.max(suggestionIndex - 1, -1);
        this.highlightSuggestion(suggestions, suggestionIndex);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (suggestionIndex >= 0 && suggestions[suggestionIndex]) {
          suggestions[suggestionIndex].click();
        } else {
          this.executeSearch(e.target.value);
        }
      } else if (e.key === 'Escape') {
        this.hideSuggestions();
        suggestionIndex = -1;
      }
    });
  }

  performAdvancedSearch(query) {
    if (query.length < 2) {
      this.hideSuggestions();
      return;
    }

    const suggestions = this.generateSmartSuggestions(query);
    this.showSuggestions(suggestions);
  }

  generateSmartSuggestions(query) {
    const allSuggestions = [
      ...this.searchHistory,
      ...this.popularSearches,
      'serverless web application',
      'REST API with authentication',
      'real-time chat application',
      'image processing pipeline',
      'data analytics dashboard',
      'microservices architecture',
      'content delivery network',
      'database backup solution',
      'monitoring and logging',
      'CI/CD pipeline'
    ];

    return allSuggestions
      .filter(suggestion => this.fuzzyMatch(query.toLowerCase(), suggestion.toLowerCase()))
      .slice(0, 8)
      .map(suggestion => ({
        text: suggestion,
        type: this.searchHistory.includes(suggestion) ? 'history' : 'suggestion',
        icon: this.getSuggestionIcon(suggestion)
      }));
  }

  fuzzyMatch(query, target) {
    const queryWords = query.split(' ');
    return queryWords.every(word => 
      target.includes(word) || 
      this.levenshteinDistance(word, target) <= Math.floor(word.length * 0.3)
    );
  }

  levenshteinDistance(a, b) {
    const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    
    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[b.length][a.length];
  }

  getSuggestionIcon(suggestion) {
    const iconMap = {
      'serverless': '⚡',
      'api': '🔌',
      'database': '🗄️',
      'storage': '📦',
      'machine learning': '🤖',
      'analytics': '📊',
      'monitoring': '📈',
      'security': '🔒',
      'network': '🌐',
      'compute': '💻'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (suggestion.toLowerCase().includes(key)) {
        return icon;
      }
    }
    return '🔍';
  }

  showSuggestions(suggestions) {
    let container = document.querySelector('.search-suggestions-dropdown');
    if (!container) {
      container = document.createElement('div');
      container.className = 'search-suggestions-dropdown';
      const searchContainer = document.querySelector('.search-container') || document.querySelector('.search-box');
      if (searchContainer) {
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(container);
      }
    }

    if (suggestions.length === 0) {
      this.hideSuggestions();
      return;
    }

    container.innerHTML = suggestions.map((suggestion, index) => `
      <div class="suggestion-item" data-index="${index}" onclick="selectAdvancedSuggestion('${suggestion.text}')">
        <span class="suggestion-icon">${suggestion.icon}</span>
        <span class="suggestion-text">${suggestion.text}</span>
        <span class="suggestion-type ${suggestion.type}">${suggestion.type === 'history' ? '↺' : '→'}</span>
      </div>
    `).join('');

    container.style.display = 'block';

    window.selectAdvancedSuggestion = (text) => {
      this.executeSearch(text);
      this.hideSuggestions();
    };
  }

  highlightSuggestion(suggestions, index) {
    suggestions.forEach((item, i) => {
      item.classList.toggle('highlighted', i === index);
    });
  }

  hideSuggestions() {
    const container = document.querySelector('.search-suggestions-dropdown');
    if (container) {
      container.style.display = 'none';
    }
  }

  executeSearch(query) {
    if (query.trim()) {
      this.addToSearchHistory(query);
      // Trigger existing search functionality
      if (window.performSearch) {
        window.performSearch(query);
      }
      announceToScreenReader(`Searching for ${query}`);
    }
  }

  addToSearchHistory(query) {
    this.searchHistory = this.searchHistory.filter(item => item !== query);
    this.searchHistory.unshift(query);
    this.searchHistory = this.searchHistory.slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

  // Search Filters
  setupSearchFilters() {
    const filtersContainer = document.createElement('div');
    filtersContainer.className = 'search-filters';
    filtersContainer.innerHTML = `
      <div class="filter-group">
        <label class="filter-label">Category:</label>
        <select class="filter-select" id="category-filter">
          <option value="">All Categories</option>
          <option value="compute">Compute</option>
          <option value="storage">Storage</option>
          <option value="database">Database</option>
          <option value="networking">Networking</option>
          <option value="security">Security</option>
          <option value="analytics">Analytics</option>
          <option value="ml">Machine Learning</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Pricing:</label>
        <select class="filter-select" id="pricing-filter">
          <option value="">All Pricing</option>
          <option value="free">Free Tier</option>
          <option value="pay-as-you-go">Pay as you go</option>
          <option value="reserved">Reserved instances</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Complexity:</label>
        <select class="filter-select" id="complexity-filter">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
    `;

    const searchSection = document.querySelector('.search-container') || document.querySelector('.search-box');
    if (searchSection && searchSection.parentNode) {
      searchSection.parentNode.insertBefore(filtersContainer, searchSection.nextSibling);
    }

    // Add filter event listeners
    filtersContainer.addEventListener('change', () => {
      this.applyFilters();
    });
  }

  applyFilters() {
    const category = document.getElementById('category-filter')?.value;
    const pricing = document.getElementById('pricing-filter')?.value;
    const complexity = document.getElementById('complexity-filter')?.value;

    // Apply filters to visible content
    document.querySelectorAll('.service-card, .pattern-card').forEach(card => {
      let visible = true;

      if (category && !card.dataset.category?.includes(category)) {
        visible = false;
      }
      if (pricing && !card.dataset.pricing?.includes(pricing)) {
        visible = false;
      }
      if (complexity && !card.dataset.complexity?.includes(complexity)) {
        visible = false;
      }

      card.style.display = visible ? 'block' : 'none';
    });

    // Update results count
    const visibleCards = document.querySelectorAll('.service-card:not([style*="display: none"]), .pattern-card:not([style*="display: none"])');
    announceToScreenReader(`${visibleCards.length} results found`);
  }

  // Search Analytics
  setupSearchAnalytics() {
    window.trackSearch = (query, results) => {
      const analytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
      analytics[query] = (analytics[query] || 0) + 1;
      localStorage.setItem('searchAnalytics', JSON.stringify(analytics));
    };

    window.getPopularSearches = () => {
      const analytics = JSON.parse(localStorage.getItem('searchAnalytics') || '{}');
      return Object.entries(analytics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([query]) => query);
    };
  }
}

// Initialize enhanced search
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedSearch();
});