# AWS Blueprint - API Reference

## 📚 Core Modules

### SearchModule

The SearchModule is the heart of the application, handling all search functionality and pattern matching.

#### Methods

##### `init(knowledgeBase)`
Initializes the search module with the knowledge base data.

**Parameters:**
- `knowledgeBase` (Object): The complete knowledge base containing services and patterns

**Example:**
```javascript
SearchModule.init(knowledgeBase);
```

##### `searchByIntent(query)`
Searches for patterns and services based on natural language intent.

**Parameters:**
- `query` (string): Natural language query from user

**Returns:**
- `Object`: Search result with pattern, score, and services
  - `pattern` (Object|null): Matched architecture pattern
  - `score` (number): Confidence score (0-1)
  - `services` (Array): Array of matched services
  - `noMatch` (boolean): True if no good match found

**Example:**
```javascript
const result = SearchModule.searchByIntent("serverless API with database");
// Returns: { pattern: {...}, score: 0.95, services: [...], noMatch: false }
```

##### `searchByServiceName(query)`
Searches for services by name or keywords.

**Parameters:**
- `query` (string): Service name or keyword

**Returns:**
- `Array`: Array of matching service objects

**Example:**
```javascript
const services = SearchModule.searchByServiceName("lambda");
// Returns: [{ id: "lambda", name: "AWS Lambda", ... }]
```

##### `getServiceById(serviceId)`
Retrieves a specific service by its ID.

**Parameters:**
- `serviceId` (string): Unique service identifier

**Returns:**
- `Object|null`: Service object or null if not found

**Example:**
```javascript
const service = SearchModule.getServiceById("lambda");
// Returns: { id: "lambda", name: "AWS Lambda", ... }
```

##### `getPatternsUsingService(serviceId)`
Finds all patterns that use a specific service.

**Parameters:**
- `serviceId` (string): Service ID to search for

**Returns:**
- `Array`: Array of pattern objects

**Example:**
```javascript
const patterns = SearchModule.getPatternsUsingService("lambda");
// Returns: [{ id: "serverless-api", ... }, { id: "ai-image-analysis", ... }]
```

##### `getAllServices()`
Returns all available services.

**Returns:**
- `Array`: Complete array of service objects

**Example:**
```javascript
const allServices = SearchModule.getAllServices();
```

---

### WorkflowRenderer

Handles the rendering of visual workflow diagrams.

#### Methods

##### `render(workflowDiagram, container, servicesMap)`
Renders a workflow diagram into a DOM container.

**Parameters:**
- `workflowDiagram` (Object): Workflow definition with nodes and edges
- `container` (HTMLElement): DOM element to render into
- `servicesMap` (Object): Map of service ID to service object

**Example:**
```javascript
const container = document.getElementById('workflow-diagram');
const servicesMap = {};
knowledgeBase.services.forEach(service => {
  servicesMap[service.id] = service;
});

WorkflowRenderer.render(pattern.workflowDiagram, container, servicesMap);
```

**Workflow Diagram Structure:**
```javascript
{
  "nodes": [
    {
      "id": "user",
      "serviceId": "user",
      "label": "Client",
      "position": 0
    },
    {
      "id": "apigw",
      "serviceId": "api-gateway",
      "label": "API Gateway",
      "position": 1
    }
  ],
  "edges": [
    {
      "from": "user",
      "to": "apigw"
    }
  ]
}
```

---

### RecommendationPanelComponent

Manages the display of architecture recommendations.

#### Methods

##### `render(pattern, servicesMap)`
Renders the recommendation panel with pattern details.

**Parameters:**
- `pattern` (Object): Architecture pattern object
- `servicesMap` (Object): Map of service ID to service object

**Example:**
```javascript
RecommendationPanelComponent.render(pattern, servicesMap);
```

##### `scrollTo()`
Scrolls the page to the recommendation panel.

**Example:**
```javascript
RecommendationPanelComponent.scrollTo();
```

---

### ServiceCardComponent

Creates service display cards.

#### Methods

##### `createCard(service, onClickCallback)`
Creates a service card DOM element.

**Parameters:**
- `service` (Object): Service object
- `onClickCallback` (Function): Callback when card is clicked

**Returns:**
- `HTMLElement`: Service card DOM element

**Example:**
```javascript
const card = ServiceCardComponent.createCard(service, (clickedService) => {
  console.log('Service clicked:', clickedService.name);
});
```

---

### DocumentationPanelComponent

Handles service documentation display.

#### Methods

##### `init(knowledgeBase)`
Initializes the documentation panel.

**Parameters:**
- `knowledgeBase` (Object): Complete knowledge base

##### `show(service)`
Shows documentation for a specific service.

**Parameters:**
- `service` (Object): Service object to display

**Example:**
```javascript
DocumentationPanelComponent.show(service);
```

##### `hide()`
Hides the documentation panel.

**Example:**
```javascript
DocumentationPanelComponent.hide();
```

---

### IntentSearchComponent

Manages the main search interface.

#### Methods

##### `init(searchCallback)`
Initializes the search component.

**Parameters:**
- `searchCallback` (Function): Function to call when search is performed

**Example:**
```javascript
IntentSearchComponent.init(handleIntentSearch);
```

---

### TrendingTopicsComponent

Handles trending topics display and interaction.

#### Methods

##### `init(knowledgeBase, selectionCallback)`
Initializes trending topics.

**Parameters:**
- `knowledgeBase` (Object): Complete knowledge base
- `selectionCallback` (Function): Callback when topic is selected

##### `render()`
Renders the trending topics section.

**Example:**
```javascript
TrendingTopicsComponent.init(knowledgeBase, handlePatternSelection);
TrendingTopicsComponent.render();
```

---

### ServiceIndexComponent

Manages the service browser/index.

#### Methods

##### `init(services, categories)`
Initializes the service index.

**Parameters:**
- `services` (Array): Array of all services
- `categories` (Array): Array of service categories

##### `render()`
Renders the service index.

##### `filter(query)`
Filters services by search query.

**Parameters:**
- `query` (string): Search query

##### `filterByCategory(category)`
Filters services by category.

**Parameters:**
- `category` (string): Category name

##### `onServiceClick(callback)`
Sets callback for service clicks.

**Parameters:**
- `callback` (Function): Function to call when service is clicked

**Example:**
```javascript
ServiceIndexComponent.init(services, categories);
ServiceIndexComponent.onServiceClick(handleServiceClick);
ServiceIndexComponent.render();
```

---

## 🔧 Utility Functions

### Global Functions

#### `handleIntentSearch(query)`
Main search handler function.

**Parameters:**
- `query` (string): User search query

**Returns:**
- `Object`: Search result object

#### `generateUniversalArchitecture(query)`
Generates custom architecture for complex queries.

**Parameters:**
- `query` (string): Complex user query

**Returns:**
- `Object`: Generated architecture with services and features

#### `extractFeatures(query)`
Extracts features from user query for architecture generation.

**Parameters:**
- `query` (string): User query (lowercase)

**Returns:**
- `Object`: Features object with boolean flags

**Example:**
```javascript
const features = extractFeatures("build a video streaming platform");
// Returns: { needsVideoProcessing: true, needsAuth: true, ... }
```

#### `startVoiceSearch()`
Initiates voice search using Web Speech API.

**Example:**
```javascript
// Called when microphone button is clicked
startVoiceSearch();
```

---

## 📊 Data Structures

### Service Object
```javascript
{
  "id": "lambda",                    // Unique identifier
  "name": "AWS Lambda",              // Display name
  "icon": "lambda.svg",              // Icon filename
  "category": "Compute",             // Service category
  "tags": ["serverless", "functions"], // Search tags
  "intentKeywords": ["function", "serverless"], // Intent matching keywords
  "shortDescription": "Run code without provisioning servers",
  "documentation": "Detailed description...",
  "billingModel": "Pay per request and compute duration",
  "costHint": "~$0.20 per 1M requests",
  "hasFreeTier": true,               // Free tier availability
  "relatedServiceIds": ["api-gateway", "dynamodb"]
}
```

### Pattern Object
```javascript
{
  "id": "serverless-api",            // Unique identifier
  "label": "Serverless REST API with Database",
  "intentKeywords": ["api", "backend", "serverless"],
  "stack": ["api-gateway", "lambda", "dynamodb"], // Required services
  "summary": "Build a scalable REST API...",
  "workflowDiagram": {               // Visual workflow definition
    "nodes": [...],
    "edges": [...]
  },
  "costSummary": "Very low cost for low-medium traffic",
  "costLevel": "Low",                // Low, Medium, High
  "trendTags": ["Serverless", "Event-Driven"],
  "popularityScore": 95,             // 0-100 popularity score
  "difficultyLevel": "Beginner",     // Beginner, Intermediate, Advanced
  "estimatedBuildTime": "1-2 days",
  "prerequisiteKnowledge": ["REST APIs", "JSON"],
  "securityNotes": [...],            // Security recommendations
  "learningResources": [...],        // Learning materials
  "alternativeStack": {              // Alternative approach
    "label": "Traditional API (EC2 + RDS)",
    "services": ["ec2", "rds", "elb"],
    "costLevel": "Medium"
  }
}
```

### Trending Topic Object
```javascript
{
  "id": "genai",                     // Unique identifier
  "label": "Generative AI & ML",     // Display name
  "description": "Build intelligent applications...",
  "relatedPatterns": ["genai-chatbot", "ai-image-analysis"],
  "icon": "ai"                       // Icon identifier
}
```

---

## 🎯 Event System

### Custom Events

The application uses a custom event system for component communication.

#### Search Events
```javascript
// Fired when search is initiated
document.dispatchEvent(new CustomEvent('search:start', {
  detail: { query: 'user query' }
}));

// Fired when search completes
document.dispatchEvent(new CustomEvent('search:complete', {
  detail: { result: searchResult }
}));

// Fired when pattern is selected
document.dispatchEvent(new CustomEvent('pattern:selected', {
  detail: { pattern: patternObject }
}));
```

#### UI Events
```javascript
// Fired when service is clicked
document.dispatchEvent(new CustomEvent('service:clicked', {
  detail: { service: serviceObject }
}));

// Fired when documentation panel opens
document.dispatchEvent(new CustomEvent('docs:opened', {
  detail: { service: serviceObject }
}));
```

### Event Listeners

#### Setting up Event Listeners
```javascript
// Listen for search events
document.addEventListener('search:complete', (event) => {
  const result = event.detail.result;
  console.log('Search completed:', result);
});

// Listen for pattern selection
document.addEventListener('pattern:selected', (event) => {
  const pattern = event.detail.pattern;
  updateUI(pattern);
});
```

---

## 🔍 Search Algorithm Details

### Intent Matching Algorithm

The search algorithm uses multiple strategies:

1. **Exact Pattern Matching**: Direct keyword matches with patterns
2. **Service Name Matching**: Fuzzy matching on service names
3. **Universal Architecture Generation**: AI-like feature extraction for complex queries
4. **Multi-service Detection**: Recognition of complex architectures

#### Scoring System
```javascript
// Pattern matching scores
const scores = {
  exactMatch: 1.0,        // Perfect keyword match
  partialMatch: 0.8,      // Partial keyword match
  serviceMatch: 0.6,      // Service name match
  categoryMatch: 0.4,     // Category match
  tagMatch: 0.3          // Tag match
};
```

#### Feature Extraction
```javascript
const features = {
  needsAuth: /user|login|auth|account/.test(query),
  needsAPI: /api|backend|server|endpoint/.test(query),
  needsDatabase: /data|store|save|database/.test(query),
  needsRealtime: /real.?time|live|instant/.test(query),
  needsAI: /ai|intelligent|smart|recommend/.test(query)
  // ... more features
};
```

---

## 🎨 Styling API

### CSS Custom Properties

The application uses CSS custom properties for theming:

```css
:root {
  /* Colors */
  --primary-color: #FF9900;
  --secondary-color: #232F3E;
  --accent-color: #FF6B35;
  --text-color: #333333;
  --text-light: #666666;
  --background-color: #FFFFFF;
  --surface-color: #F8F9FA;
  --border-color: #E1E5E9;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Borders */
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-width: 1px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Component Classes

#### Service Cards
```css
.service-card {
  /* Base service card styles */
}

.service-card--featured {
  /* Featured service card modifier */
}

.service-card__icon {
  /* Service card icon element */
}

.service-card__title {
  /* Service card title element */
}
```

#### Search Interface
```css
.search-box {
  /* Search container */
}

.search-box--focused {
  /* Focused state */
}

.search-input {
  /* Search input field */
}

.search-suggestions {
  /* Suggestion chips container */
}
```

---

## 🔧 Configuration

### Application Configuration

The application can be configured through global variables:

```javascript
// Debug mode
window.DEBUG = true;

// API endpoints (if using external APIs)
window.CONFIG = {
  API_BASE_URL: 'https://api.example.com',
  ENABLE_ANALYTICS: false,
  ENABLE_VOICE_SEARCH: true
};
```

### Feature Flags

```javascript
// Feature flags for enabling/disabling features
const FEATURES = {
  VOICE_SEARCH: true,
  EXPORT_DIAGRAMS: true,
  SERVICE_COMPARISON: true,
  ADVANCED_SEARCH: false
};
```

---

This API reference provides comprehensive documentation for all public methods, data structures, and configuration options in the AWS Blueprint application.