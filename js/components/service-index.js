/**
 * Service Index Component
 * Renders the full service browser with search and filtering
 */

const ServiceIndexComponent = {
    services: [],
    filteredServices: [],
    currentCategory: null,
    currentSearch: '',

    /**
     * Initialize the component
     * @param {Object[]} services - Array of all services
     * @param {string[]} categories - Array of category names
     */
    init(services, categories) {
        this.services = services || [];
        this.filteredServices = [...this.services];
        this.populateCategoryFilter(categories);
        this.render();
    },

    /**
     * Render the service grid
     */
    render() {
        const container = document.getElementById('service-grid');
        if (!container) return;

        container.innerHTML = '';

        this.filteredServices.forEach(service => {
            const card = ServiceCardComponent.createCard(service, (service) => {
                this.handleServiceClick(service.id);
            });
            container.appendChild(card);
        });

        this.updateCount();
    },

    /**
     * Filter services by search query
     * @param {string} query - Search query
     */
    filter(query) {
        this.currentSearch = query?.toLowerCase() || '';
        this.applyFilters();
    },

    /**
     * Filter services by category
     * @param {string} category - Category name or empty for all
     */
    filterByCategory(category) {
        this.currentCategory = category || null;
        this.applyFilters();
    },

    /**
     * Apply all current filters
     */
    applyFilters() {
        this.filteredServices = this.services.filter(service => {
            // Category filter
            if (this.currentCategory && service.category !== this.currentCategory) {
                return false;
            }

            // Search filter
            if (this.currentSearch) {
                const searchLower = this.currentSearch;
                const nameMatch = service.name.toLowerCase().includes(searchLower);
                const idMatch = service.id.toLowerCase().includes(searchLower);
                const descMatch = service.shortDescription?.toLowerCase().includes(searchLower);
                const tagMatch = service.tags?.some(tag => 
                    tag.toLowerCase().includes(searchLower)
                );
                
                if (!nameMatch && !idMatch && !descMatch && !tagMatch) {
                    return false;
                }
            }

            return true;
        });

        this.render();
    },

    /**
     * Populate category filter dropdown
     * @param {string[]} categories - Array of category names
     */
    populateCategoryFilter(categories) {
        const select = document.getElementById('category-filter');
        if (!select || !categories) return;

        // Keep the "All Categories" option
        select.innerHTML = '<option value="">All Categories</option>';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            select.appendChild(option);
        });
    },

    /**
     * Update service count display
     */
    updateCount() {
        const countEl = document.getElementById('service-count');
        if (countEl) {
            const count = this.filteredServices.length;
            countEl.textContent = `Showing ${count} service${count !== 1 ? 's' : ''}`;
        }
    },

    /**
     * Handle service card click
     * @param {string} serviceId - Service ID
     */
    handleServiceClick(serviceId) {
        // This will be overridden by the main app
        console.log('Service clicked:', serviceId);
    },

    /**
     * Set click handler for service cards
     * @param {Function} callback - Click callback
     */
    onServiceClick(callback) {
        this.handleServiceClick = callback;
    },

    /**
     * Get currently filtered services
     * @returns {Object[]} Array of filtered services
     */
    getFilteredServices() {
        return this.filteredServices;
    },

    /**
     * Reset all filters
     */
    resetFilters() {
        this.currentCategory = null;
        this.currentSearch = '';
        this.filteredServices = [...this.services];
        
        // Reset UI
        const searchInput = document.getElementById('service-search');
        const categorySelect = document.getElementById('category-filter');
        
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';
        
        this.render();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ServiceIndexComponent;
}