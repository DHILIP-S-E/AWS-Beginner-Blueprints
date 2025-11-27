// Main application initialization
// AWS Beginner Blueprint - Intelligent Cloud Service Selector

// Global state
let knowledgeBase = null;
let currentPattern = null;

// Initialize the application
async function initApp() {
    try {
        // Load knowledge base
        knowledgeBase = await loadKnowledgeBase();
        console.log('Knowledge base loaded:', knowledgeBase);

        // Initialize components
        initializeComponents();
        
        // Setup event listeners
        setupEventListeners();

        // Render initial content
        renderInitialContent();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        showError('Failed to load application. Please refresh the page.');
    }
}

// Load knowledge base from JSON file
async function loadKnowledgeBase() {
    try {
        const response = await fetch('data/knowledge-base.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        throw error;
    }
}

// Initialize all components
function initializeComponents() {
    // Initialize search module
    SearchModule.init(knowledgeBase);
    
    // Initialize intent search component
    IntentSearchComponent.init(handleIntentSearch);
    
    // Initialize trending topics component
    TrendingTopicsComponent.init(knowledgeBase, handlePatternSelection);
    
    // Initialize documentation panel
    DocumentationPanelComponent.init(knowledgeBase);
    
    // Initialize service index
    ServiceIndexComponent.init(knowledgeBase.services, knowledgeBase.categories);
    ServiceIndexComponent.onServiceClick(handleServiceClick);
}

// Setup global event listeners
function setupEventListeners() {
    // About modal
    const aboutBtn = document.getElementById('about-btn');
    const modal = document.getElementById('about-modal');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');

    if (aboutBtn && modal) {
        aboutBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
        });
    }

    if (modalClose && modal) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    if (modalOverlay && modal) {
        modalOverlay.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    // Export functionality
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExport);
    }

    // Comparison functionality
    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) {
        compareBtn.addEventListener('click', handleComparison);
    }

    // Service index search and filter
    const serviceSearch = document.getElementById('service-search');
    const categoryFilter = document.getElementById('category-filter');

    if (serviceSearch) {
        serviceSearch.addEventListener('input', (e) => {
            ServiceIndexComponent.filter(e.target.value);
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            ServiceIndexComponent.filterByCategory(e.target.value);
        });
    }
}

// Render initial content
function renderInitialContent() {
    // Render trending topics
    TrendingTopicsComponent.render();
    
    // Render service index
    ServiceIndexComponent.render();
}

// Handle intent search
function handleIntentSearch(query) {
    const result = SearchModule.searchByIntent(query);
    
    if (result.noMatch) {
        return result;
    }
    
    if (result.pattern) {
        handlePatternSelection(result.pattern);
    }
    
    return result;
}

// Handle pattern selection
function handlePatternSelection(pattern) {
    currentPattern = pattern;
    
    // Create services map
    const servicesMap = {};
    knowledgeBase.services.forEach(service => {
        servicesMap[service.id] = service;
    });
    
    // Render recommendation panel
    RecommendationPanelComponent.render(pattern, servicesMap);
    
    // Render workflow diagram
    const workflowContainer = document.getElementById('workflow-diagram');
    if (workflowContainer && pattern.workflowDiagram) {
        WorkflowRenderer.render(pattern.workflowDiagram, workflowContainer, servicesMap);
    }
    
    // Show/hide comparison button
    const compareBtn = document.getElementById('compare-btn');
    if (compareBtn) {
        compareBtn.style.display = ComparisonModule.hasComparison(pattern) ? 'inline-block' : 'none';
    }
    
    // Scroll to recommendation panel
    RecommendationPanelComponent.scrollTo();
}

// Handle service click from index
function handleServiceClick(serviceId) {
    const service = SearchModule.getServiceById(serviceId);
    if (service) {
        // Show documentation panel
        DocumentationPanelComponent.show(service);
        
        // Find patterns that use this service
        const patterns = SearchModule.getPatternsUsingService(serviceId);
        if (patterns.length > 0) {
            // Show first pattern as recommendation
            handlePatternSelection(patterns[0]);
        }
    }
}

// Handle export
function handleExport() {
    if (!currentPattern) return;
    
    const diagramElement = document.getElementById('workflow-diagram');
    if (diagramElement) {
        ExportModule.exportToPNG(diagramElement, currentPattern.id, currentPattern.label);
    }
}

// Handle comparison
function handleComparison() {
    if (!currentPattern) return;
    
    const comparisonSection = document.getElementById('comparison-section');
    if (comparisonSection) {
        if (comparisonSection.hidden) {
            ComparisonModule.renderComparison(currentPattern, comparisonSection);
            comparisonSection.hidden = false;
        } else {
            comparisonSection.hidden = true;
        }
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    document.body.prepend(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
}

// Global functions for onclick handlers (for backward compatibility)
window.viewServiceDetails = function(serviceId) {
    const service = SearchModule.getServiceById(serviceId);
    if (service) {
        DocumentationPanelComponent.show(service);
    }
};

window.searchTopic = function(topicId) {
    const patterns = SearchModule.getPatternsByTopic(topicId);
    if (patterns.length > 0) {
        handlePatternSelection(patterns[0]);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}