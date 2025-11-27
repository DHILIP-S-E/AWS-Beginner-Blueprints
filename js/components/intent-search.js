/**
 * Intent Search Component - Handles user intent input and search
 */

const IntentSearchComponent = {
    searchCallback: null,

    /**
     * Initialize the intent search component
     * @param {Function} callback - Function to call when search is performed
     */
    init(callback) {
        this.searchCallback = callback;
        this.setupEventListeners();
    },

    /**
     * Setup event listeners for search input and button
     */
    setupEventListeners() {
        const input = document.getElementById('intent-input');
        const button = document.getElementById('search-btn');
        const hint = document.getElementById('search-hint');

        if (input && button) {
            // Handle Enter key
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(input.value.trim());
                }
            });

            // Handle search button click
            button.addEventListener('click', () => {
                this.performSearch(input.value.trim());
            });

            // Clear hint when user starts typing
            input.addEventListener('input', () => {
                if (hint) hint.textContent = '';
            });
        }
    },

    /**
     * Perform search with user input
     * @param {string} query - User search query
     */
    performSearch(query) {
        const hint = document.getElementById('search-hint');
        
        if (!query) {
            if (hint) {
                hint.textContent = 'Please enter what you want to build';
            }
            return;
        }

        if (this.searchCallback) {
            const result = this.searchCallback(query);
            
            if (result && result.noMatch) {
                this.showNoMatchMessage();
            } else if (hint) {
                hint.textContent = '';
            }
        }
    },

    /**
     * Show no match guidance message
     */
    showNoMatchMessage() {
        const hint = document.getElementById('search-hint');
        if (hint) {
            hint.textContent = 'Try adding key terms such as API, database, storage, analytics, AI, streaming, etc.';
            hint.style.color = '#FF9900';
        }
    },

    /**
     * Clear search input and results
     */
    clear() {
        const input = document.getElementById('intent-input');
        const hint = document.getElementById('search-hint');
        
        if (input) input.value = '';
        if (hint) hint.textContent = '';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntentSearchComponent;
}