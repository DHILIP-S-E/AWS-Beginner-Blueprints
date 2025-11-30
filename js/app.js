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
    
    // Initialize smart suggestions
    if (typeof SmartSuggestions !== 'undefined') {
        SmartSuggestions.init(knowledgeBase);
        window.knowledgeBase = knowledgeBase;
    }
    
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
    // Search suggestions
    setupSearchSuggestions();
    
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

    // Keyboard navigation - Escape to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.style.display === 'flex') {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            }
            const docPanel = document.getElementById('documentation-panel');
            if (docPanel && docPanel.style.display === 'block') {
                DocumentationPanelComponent.hide();
            }
        }
    });

    // Keyboard navigation - Enter/Space to activate buttons
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.target.click();
        }
    });

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

    // Search results close button
    const closeResultsBtn = document.getElementById('close-results');
    const searchResults = document.getElementById('search-results');
    if (closeResultsBtn && searchResults) {
        closeResultsBtn.addEventListener('click', () => {
            searchResults.style.display = 'none';
        });
    }
}

// Render initial content
function renderInitialContent() {
    // Render trending topics
    TrendingTopicsComponent.render();
    
    // Render service index
    ServiceIndexComponent.render();
    
    // Set default selection to Static Website Hosting
    setTimeout(() => {
        setDefaultSelection();
    }, 500);
}

// Set default selection to Static Website Hosting
function setDefaultSelection() {
    if (!knowledgeBase) return;
    
    // Find Static Website Hosting pattern
    const staticWebsitePattern = knowledgeBase.patterns.find(p => 
        p.id === 'static-website' || 
        p.label.toLowerCase().includes('static website') ||
        p.label.toLowerCase().includes('website hosting')
    );
    
    if (staticWebsitePattern) {
        handlePatternSelection(staticWebsitePattern);
    }
}

// Handle intent search
function handleIntentSearch(query) {
    const lower = query.toLowerCase();
    
    // Universal architecture generator - analyze any use case
    if (query.length > 30 || lower.includes('architect') || lower.includes('platform') || lower.includes('system') || lower.includes('build') || lower.includes('create')) {
        const architecture = generateUniversalArchitecture(query);
        if (architecture.services.length > 0) {
            showSearchResults(query, architecture.services);
            return { pattern: null, score: 0.95, services: architecture.services };
        }
    }
    
    // Clean query by removing common non-service phrases
    const cleanQuery = lower.replace(/\b(but|i|got|recommended|solution|with|and|the|a|an|for|to|from|in|on|at|by|of|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|can|build|create|make|using|use|implement|deploy|setup|configure)\b/g, ' ');
    
    // Handle complex multi-service queries FIRST - before pattern matching
    const words = cleanQuery.split(/[\s,]+/).filter(w => w.length > 1);
    const serviceNames = ['s3', 'glue', 'athena', 'quicksight', 'kinesis', 'lambda', 'step', 'functions', 'cloudwatch', 'iam', 'vpc', 'kms', 'cloudtrail', 'sagemaker', 'ec2', 'rds', 'dynamodb', 'api', 'gateway', 'sns', 'sqs', 'ecs', 'ecr', 'elb', 'route53', 'cloudfront', 'cognito', 'rekognition', 'comprehend', 'textract', 'bedrock', 'redshift', 'elasticsearch', 'opensearch', 'msk', 'emr', 'batch', 'fargate', 'eks', 'amplify', 'appsync'];
    
    const mentionedServices = words.filter(word => 
        serviceNames.some(service => word.includes(service) || service.includes(word))
    );
    
    console.log('Clean query:', cleanQuery);
    console.log('Mentioned services:', mentionedServices);
    
    if (mentionedServices.length >= 3) {
        console.log('Complex multi-service query detected - bypassing pattern matching');
        // Find actual services from knowledge base
        const services = [];
        mentionedServices.forEach(mentioned => {
            const found = SearchModule.getAllServices().filter(service => 
                service.name.toLowerCase().includes(mentioned) ||
                service.id.toLowerCase().includes(mentioned) ||
                service.tags?.some(tag => tag.toLowerCase().includes(mentioned))
            );
            services.push(...found);
        });
        
        // Remove duplicates
        const uniqueServices = services.filter((service, index, self) => 
            index === self.findIndex(s => s.id === service.id)
        );
        
        console.log('Complex query services found:', uniqueServices.length, uniqueServices.map(s => s?.name));
        if (uniqueServices.length >= 3) {
            showSearchResults(query, uniqueServices);
            return { pattern: null, score: 0.9, services: uniqueServices };
        }
    }
    
    // Only do pattern matching if not a complex multi-service query
    const result = SearchModule.searchByIntent(query);
    
    if (result.noMatch) {
        // Show service search results instead
        const services = SearchModule.searchByServiceName(query);
        if (services.length > 0) {
            showSearchResults(query, services);
        }
        return result;
    }
    
    if (result.pattern) {
        handlePatternSelection(result.pattern);
    }
    
    return result;
}

// Universal architecture generator - analyzes any use case
function generateUniversalArchitecture(query) {
    const lower = query.toLowerCase();
    const allServices = SearchModule.getAllServices();
    const selectedServices = [];
    const features = extractFeatures(lower);
    
    // Core infrastructure (always needed)
    if (features.needsAuth) addService('cognito', 'User authentication');
    if (features.needsAPI) addService('api-gateway', 'API management');
    if (features.needsCompute) addService('lambda', 'Serverless compute');
    
    // Frontend/Hosting
    if (features.needsWebsite) {
        addService('amplify', 'Web hosting');
        addService('cloudfront', 'Content delivery');
    }
    if (features.needsStorage) addService('s3', 'File storage');
    
    // Database selection
    if (features.needsDatabase) {
        if (features.needsSQL) addService('rds', 'SQL database');
        else addService('dynamodb', 'NoSQL database');
    }
    
    // Real-time features
    if (features.needsRealtime) addService('appsync', 'Real-time data sync');
    if (features.needsNotifications) addService('sns', 'Push notifications');
    if (features.needsMessaging) addService('sqs', 'Message queuing');
    
    // Video streaming specific services
    if (features.needsVideoProcessing) {
        addService('mediaconvert', 'Video processing');
        addService('medialive', 'Live streaming');
        addService('mediapackage', 'Video packaging');
        addService('mediastore', 'Media storage');
    }
    if (features.needsTranscoding) addService('mediaconvert', 'Video transcoding');
    if (features.needsLiveStreaming) addService('medialive', 'Live streaming');
    if (features.needsSubtitles) addService('transcribe', 'Auto subtitles');
    if (features.needsContentModeration) addService('rekognition', 'Content moderation');
    
    // AI/ML services
    if (features.needsAI || features.needsRecommendations) {
        if (features.needsImageAI) addService('rekognition', 'Image analysis');
        if (features.needsTextAI) addService('comprehend', 'Text analysis');
        if (features.needsMLPlatform) addService('sagemaker', 'Machine learning');
        if (features.needsRecommendations) addService('personalize', 'Recommendations');
    }
    
    // Analytics and monitoring
    if (features.needsAnalytics) {
        addService('kinesis', 'Real-time analytics');
        addService('quicksight', 'Business intelligence');
        if (features.needsVideoProcessing) addService('kinesis-video-streams', 'Video analytics');
    }
    if (features.needsSearch) addService('opensearch', 'Search engine');
    
    // Payment and billing
    if (features.needsPayments) {
        addService('marketplace', 'Payment processing');
        addService('billing', 'Subscription management');
    }
    
    // Location services
    if (features.needsLocation) addService('location', 'Location services');
    
    // Email services
    if (features.needsEmail) addService('ses', 'Email service');
    
    // Monitoring (always recommended)
    addService('cloudwatch', 'Monitoring');
    
    function addService(id, reason) {
        const service = allServices.find(s => s.id === id);
        if (service && !selectedServices.find(s => s.id === id)) {
            selectedServices.push({ ...service, reason });
        }
    }
    
    return { services: selectedServices, features };
}

// Extract features from user query
function extractFeatures(query) {
    const features = {
        needsAuth: /user|login|auth|account|profile|sign|register|subscription/.test(query),
        needsAPI: /api|backend|server|endpoint/.test(query) || query.length > 50,
        needsCompute: /process|compute|function|logic/.test(query) || query.length > 50,
        needsWebsite: /website|web|frontend|ui|interface|app|platform/.test(query),
        needsStorage: /upload|file|image|video|media|document|storage|content/.test(query),
        needsDatabase: /data|store|save|database|record|information|user|content/.test(query) || query.length > 50,
        needsSQL: /transaction|financial|order|payment|complex|billing/.test(query),
        needsRealtime: /real.?time|live|instant|chat|message|feed|notification|streaming/.test(query),
        needsNotifications: /notification|alert|push|notify|message/.test(query),
        needsMessaging: /message|chat|communication|queue/.test(query),
        needsAI: /ai|intelligent|smart|recommend|analyze|detect|recognize|personalize/.test(query),
        needsImageAI: /image|photo|picture|visual|face|object|thumbnail/.test(query),
        needsTextAI: /text|sentiment|language|nlp|content|subtitle|caption/.test(query),
        needsMLPlatform: /machine.?learning|ml|model|train|predict|recommendation/.test(query),
        needsRecommendations: /recommend|suggest|personalize|similar|netflix|youtube/.test(query),
        needsAnalytics: /analytic|report|dashboard|metric|track|insight|view|watch/.test(query),
        needsSearch: /search|find|query|index|elasticsearch|discover/.test(query),
        needsLocation: /location|gps|map|track|delivery|geo/.test(query),
        needsEmail: /email|mail|notification|confirm/.test(query),
        
        // Video streaming specific features
        needsVideoProcessing: /video|stream|media|netflix|youtube|content|movie|show/.test(query),
        needsTranscoding: /video|stream|media|transcode|encode|format/.test(query),
        needsCDN: /global|worldwide|fast|delivery|stream|video|content/.test(query),
        needsLiveStreaming: /live|broadcast|stream|real.?time/.test(query),
        needsContentModeration: /content|moderation|filter|safe|appropriate/.test(query),
        needsSubtitles: /subtitle|caption|transcribe|accessibility/.test(query),
        needsPayments: /payment|subscription|billing|premium|paid/.test(query),
        needsUserProfiles: /profile|user|account|preference|history/.test(query),
        needsContentManagement: /content|manage|upload|library|catalog/.test(query),
        needsScaling: /scale|scalable|millions|thousands|high.?traffic/.test(query)
    };
    
    // Auto-enable related features for video streaming
    if (features.needsVideoProcessing) {
        features.needsCDN = true;
        features.needsStorage = true;
        features.needsAuth = true;
        features.needsDatabase = true;
        features.needsAnalytics = true;
        features.needsRecommendations = true;
    }
    
    return features;
}

// Show search results
function showSearchResults(query, services) {
    const searchResults = document.getElementById('search-results');
    const searchTitle = document.getElementById('search-query-title');
    const searchContent = document.getElementById('search-results-content');
    
    if (!searchResults || !searchContent) return;
    
    // Update title
    if (searchTitle) {
        searchTitle.textContent = `Custom Architecture: "${query}"`;
    }
    
    // Clear previous results
    searchContent.innerHTML = '';
    
    // Add architecture guidance
    const guidance = createArchitectureGuidance(query, services);
    searchContent.appendChild(guidance);
    
    // Create services and workflow container
    const servicesWorkflowContainer = document.createElement('div');
    servicesWorkflowContainer.className = 'services-workflow-container';
    
    // Create services section
    const servicesSection = document.createElement('div');
    servicesSection.className = 'services-section';
    
    // Create service grid with 6 per row
    const serviceGrid = document.createElement('div');
    serviceGrid.className = 'service-grid';
    
    services.forEach(service => {
        const card = ServiceCardComponent.createCard(service, (clickedService) => {
            // Find patterns that use this service and select the first one
            const patterns = SearchModule.getPatternsUsingService(clickedService.id);
            if (patterns.length > 0) {
                handlePatternSelection(patterns[0]);
            } else {
                DocumentationPanelComponent.show(clickedService);
            }
        });
        serviceGrid.appendChild(card);
    });
    
    servicesSection.appendChild(serviceGrid);
    servicesSection.className = 'service-grid-section';
    servicesWorkflowContainer.appendChild(servicesSection);
    
    // Add workflow diagram
    const workflowSection = createWorkflowSection(services);
    servicesWorkflowContainer.appendChild(workflowSection);
    
    searchContent.appendChild(servicesWorkflowContainer);
    
    // Show search results section
    searchResults.style.display = 'block';
    searchResults.scrollIntoView({ behavior: 'smooth' });
}

// Create architecture guidance
function createArchitectureGuidance(query, services) {
    const lower = query.toLowerCase();
    const guidance = document.createElement('div');
    guidance.className = 'architecture-guidance';
    
    // Generate dynamic guidance based on detected features
    const features = extractFeatures(lower);
    const steps = [];
    
    if (features.needsAuth) steps.push({ title: 'Authentication', desc: 'Cognito for user management' });
    if (features.needsWebsite) steps.push({ title: 'Frontend', desc: 'Amplify + CloudFront for web hosting' });
    if (features.needsDatabase) steps.push({ title: 'Database', desc: features.needsSQL ? 'RDS for structured data' : 'DynamoDB for flexible data' });
    if (features.needsRealtime) steps.push({ title: 'Real-time', desc: 'AppSync for live updates' });
    if (features.needsAI) steps.push({ title: 'AI/ML', desc: 'AI services for intelligent features' });
    if (features.needsAnalytics) steps.push({ title: 'Analytics', desc: 'Kinesis + QuickSight for insights' });
    
    if (steps.length > 0) {
        const stepsHtml = steps.map((step, i) => `
            <div class="architecture-step">
                <strong>${i + 1}. ${step.title}</strong>
                <small>${step.desc}</small>
            </div>
        `).join('');
        
        guidance.innerHTML = `
            <h3>🎯 Custom Architecture Solution</h3>
            <p>Intelligent architecture with ${services.length} AWS services tailored to your specific requirements:</p>
            <div class="architecture-steps">${stepsHtml}</div>
        `;
    } else if (lower.includes('data lake') || (lower.includes('s3') && lower.includes('glue'))) {
        guidance.innerHTML = `
            <h3>🏗️ Enterprise Data Lake Architecture</h3>
            <p>Complete data lake solution with ${services.length} AWS services for ingestion, processing, analytics, and visualization:</p>
            <div class="architecture-steps">
                <div class="architecture-step">
                    <strong>1. Storage</strong>
                    <small>S3 for data lake storage</small>
                </div>
                <div class="architecture-step">
                    <strong>2. Processing</strong>
                    <small>Glue + Lambda for ETL</small>
                </div>
                <div class="architecture-step">
                    <strong>3. Analytics</strong>
                    <small>Athena for SQL queries</small>
                </div>
                <div class="architecture-step">
                    <strong>4. Visualization</strong>
                    <small>QuickSight for dashboards</small>
                </div>
            </div>
        `;
    } else if (lower.includes('ecommerce') || lower.includes('e-commerce')) {
        guidance.innerHTML = `
            <h3>🛒 E-Commerce Platform Architecture</h3>
            <p>Scalable e-commerce solution with ${services.length} AWS services for web hosting, databases, caching, and payments:</p>
            <div class="architecture-steps">
                <div class="architecture-step">
                    <strong>1. Frontend</strong>
                    <small>CloudFront + S3 for web hosting</small>
                </div>
                <div class="architecture-step">
                    <strong>2. Backend</strong>
                    <small>EC2 + API Gateway + Lambda</small>
                </div>
                <div class="architecture-step">
                    <strong>3. Database</strong>
                    <small>RDS + ElastiCache for data</small>
                </div>
                <div class="architecture-step">
                    <strong>4. Security</strong>
                    <small>Cognito + IAM for auth</small>
                </div>
            </div>
        `;
    } else {
        guidance.innerHTML = `
            <h3>⚡ Custom Multi-Service Architecture</h3>
            <p>Your custom solution using ${services.length} AWS services for a comprehensive cloud architecture:</p>
        `;
    }
    
    return guidance;
}

// Create workflow section with diagram
function createWorkflowSection(services) {
    const section = document.createElement('div');
    section.className = 'workflow-section';
    
    const title = document.createElement('h3');
    title.innerHTML = '🔄 Architecture Workflow';
    section.appendChild(title);
    
    // Create workflow diagram
    const diagram = createCustomWorkflowDiagram(services);
    section.appendChild(diagram);
    
    return section;
}

// Create custom workflow diagram
function createCustomWorkflowDiagram(services) {
    const container = document.createElement('div');
    container.className = 'workflow-diagram';
    
    const flow = document.createElement('div');
    flow.className = 'workflow-flow';
    
    // Group services by typical workflow order
    const orderedServices = orderServicesForWorkflow(services);
    
    orderedServices.forEach((service, index) => {
        // Add service node
        const node = createWorkflowNode(service);
        flow.appendChild(node);
        
        // Add arrow if not last
        if (index < orderedServices.length - 1) {
            const arrow = document.createElement('div');
            arrow.className = 'workflow-arrow';
            arrow.innerHTML = '→';
            flow.appendChild(arrow);
        }
    });
    
    container.appendChild(flow);
    return container;
}

// Order services for logical workflow
function orderServicesForWorkflow(services) {
    const order = {
        'user': 0, 'cloudfront': 1, 's3': 2, 'api-gateway': 3, 'lambda': 4, 
        'ec2': 5, 'rds': 6, 'dynamodb': 7, 'elasticache': 8, 'glue': 9,
        'athena': 10, 'quicksight': 11, 'sagemaker': 12, 'kinesis': 13,
        'sns': 14, 'sqs': 15, 'step-functions': 16, 'cloudwatch': 17,
        'iam': 18, 'vpc': 19, 'kms': 20, 'cloudtrail': 21
    };
    
    return services.sort((a, b) => {
        const aOrder = order[a.id] ?? 999;
        const bOrder = order[b.id] ?? 999;
        return aOrder - bOrder;
    }).slice(0, 8); // Limit to 8 services for clean display
}

// Create workflow node
function createWorkflowNode(service) {
    const node = document.createElement('div');
    node.className = 'workflow-node';
    
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'workflow-node-icon-wrapper';
    
    const iconPath = `assets/icons/${service.id}.svg`;
    iconWrapper.innerHTML = `
        <img 
            src="${iconPath}" 
            alt="${service.name}" 
            class="workflow-node-icon"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <div class="workflow-node-icon-placeholder" style="display: none;">
            ${getServiceEmoji(service.category)}
        </div>
    `;
    
    const label = document.createElement('div');
    label.className = 'workflow-node-label';
    label.textContent = service.name;
    
    node.appendChild(iconWrapper);
    node.appendChild(label);
    
    return node;
}

// Get service emoji
function getServiceEmoji(category) {
    const emojiMap = {
        'Compute': '⚡', 'Storage': '📦', 'Database': '🗄️', 'AI/ML': '🤖',
        'Analytics': '📊', 'Security': '🔒', 'Networking': '🌐', 'DevOps': '🔧',
        'Migration': '🚚', 'IoT': '📡', 'Business Apps': '💼', 'Contact Center': '📞',
        'Media Services': '🎬', 'Blockchain': '⛓️', 'Quantum': '⚛️'
    };
    return emojiMap[category] || '☁️';
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
        compareBtn.style.display = (typeof ComparisonModule !== 'undefined' && ComparisonModule.hasComparison && ComparisonModule.hasComparison(pattern)) ? 'inline-block' : 'none';
    }
    
    // Show and scroll to recommendation panel
    const panel = document.getElementById('recommendation-panel');
    if (panel) {
        panel.style.display = 'block';
        panel.classList.add('active');
    }
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

window.startVoiceSearch = function() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Voice search not supported in this browser');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const searchInput = document.getElementById('intent-input');
        if (searchInput) {
            searchInput.value = transcript;
            handleIntentSearch(transcript);
        }
    };
    
    recognition.start();
};

// Setup search suggestions functionality
function setupSearchSuggestions() {
    const suggestions = document.querySelectorAll('.suggestion-chip');
    const searchInput = document.getElementById('intent-input');
    
    suggestions.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.textContent.trim();
            if (searchInput) {
                searchInput.value = query;
                handleIntentSearch(query);
            }
        });
    });
    
    // Add smooth focus animation
    if (searchInput) {
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('focused');
        });
        
        // Enter key search
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleIntentSearch(searchInput.value);
            }
        });
    }
    
    // Search button click
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                handleIntentSearch(query);
            }
        });
    }
}

// Make handleIntentSearch globally available
window.handleIntentSearch = handleIntentSearch;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}