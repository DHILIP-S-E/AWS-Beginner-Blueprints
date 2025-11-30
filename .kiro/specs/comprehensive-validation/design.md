# Design Document

## Overview

The AWS Beginner Blueprint is a single-page web application that provides intelligent AWS service discovery through intent-based search, visual architecture diagrams, and interactive cost estimation. The application operates entirely client-side with all intelligence stored in a JSON knowledge base, enabling offline functionality. The design emphasizes elegance, speed, and completeness while solving the specific problem of "Which AWS service should I use for my use case?"

### What Makes AWS Blueprint Stand Out

1. **Instant clarity** — understands the project goal and gives the right AWS services in seconds
2. **Fear-free learning** — no billing, no confusion, no AWS account required
3. **Visual-first** — diagrams auto-generated, real AWS icons, beginner-friendly learning
4. **Static-only (no backend)** — easy deployment, reliable, cost-free
5. **Perfect scope fit** — one input → one clear recommendation

### Core Design Principles

1. **Single Source of Truth**: All service information, patterns, and relationships reside in `data/knowledge-base.json`
2. **Client-Side Intelligence**: No backend required; all processing happens in the browser
3. **Knowledge-Powered**: All recommendations driven by curated knowledge base, not AI/ML models
4. **Progressive Enhancement**: Core functionality works without JavaScript; enhanced features layer on top
5. **Offline-First**: Service workers cache all assets for offline access
6. **Performance-Focused**: Sub-300ms search responses, 60fps animations, <2s initial load

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   index.html                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │   Hero      │  │   Search    │  │   Trending   │  │  │
│  │  │   Section   │  │   Results   │  │   Topics     │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │ Recommend   │  │   Service   │  │  Calculator  │  │  │
│  │  │   Panel     │  │   Modal     │  │    Modal     │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 JavaScript Modules                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │  app.js  │  │ search.js│  │ workflow-renderer  │  │  │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │  │
│  │  │matching  │  │calculator│  │  trending-topics   │  │  │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Data Layer (In-Memory)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         knowledge-base.json (loaded)            │  │  │
│  │  │  { services: [], patterns: [], categories: [] }│  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Service Worker (Offline)                  │  │
│  │  Caches: HTML, CSS, JS, JSON, Icons                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

The application follows a modular component-based architecture:

1. **Core Application (`app.js`)**: Initializes the application, loads knowledge base, coordinates modules
2. **Search System (`search.js`, `matching.js`)**: Handles keyword and intent-based search with fuzzy matching
3. **Workflow Renderer (`workflow-renderer.js`)**: Generates AWS-style architecture diagrams
4. **Calculator (`price-calculator.js`, `calculator-modal.js`)**: Interactive cost estimation widget
5. **Trending Topics (`trending-topics.js`)**: Displays curated popular services and patterns
6. **Service Components (`components/`)**: Reusable UI components for service cards, badges, etc.

## Components and Interfaces

### 1. Knowledge Base (JSON Schema)

The `data/knowledge-base.json` file is the single source of truth for all application intelligence.

**Schema Structure:**

```json
{
  "version": "string",
  "categories": ["string"],
  "services": [
    {
      "id": "string (unique identifier)",
      "name": "string (display name)",
      "icon": "string (filename)",
      "category": "string (from categories array)",
      "tags": ["string (searchable keywords)"],
      "intentKeywords": ["string (natural language terms)"],
      "shortDescription": "string (one-line summary)",
      "documentation": "string (detailed description)",
      "billingModel": "string (pricing structure)",
      "costHint": "string (approximate cost)",
      "hasFreeTier": "boolean",
      "relatedServiceIds": ["string (service IDs)"]
    }
  ],
  "patterns": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "useCase": "string",
      "services": ["string (service IDs)"],
      "workflow": [
        {
          "from": "string (service ID)",
          "to": "string (service ID)",
          "label": "string (connection description)"
        }
      ],
      "costEstimate": "string",
      "complexity": "string (Beginner|Intermediate|Advanced)"
    }
  ]
}
```

**Interface:**

```javascript
interface KnowledgeBase {
  version: string;
  categories: string[];
  services: Service[];
  patterns?: Pattern[];
}

interface Service {
  id: string;
  name: string;
  icon: string;
  category: string;
  tags: string[];
  intentKeywords: string[];
  shortDescription: string;
  documentation: string;
  billingModel: string;
  costHint: string;
  hasFreeTier: boolean;
  relatedServiceIds: string[];
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  useCase: string;
  services: string[];
  workflow: WorkflowConnection[];
  costEstimate: string;
  complexity: string;
}

interface WorkflowConnection {
  from: string;
  to: string;
  label: string;
}
```

### 2. Search System

**Module:** `search.js`, `matching.js`

**Responsibilities:**
- Keyword-based search using service names, tags, and categories
- Intent-based search using natural language matching
- Fuzzy matching for typo tolerance
- Result ranking by relevance score

**Interface:**

```javascript
class SearchEngine {
  constructor(knowledgeBase: KnowledgeBase)
  
  // Perform search with automatic mode detection
  search(query: string): SearchResult[]
  
  // Keyword search (exact and fuzzy matching)
  keywordSearch(query: string): SearchResult[]
  
  // Intent search (natural language understanding)
  intentSearch(query: string): SearchResult[]
  
  // Calculate relevance score for ranking
  calculateRelevance(service: Service, query: string): number
}

interface SearchResult {
  service: Service;
  relevanceScore: number;
  matchType: 'exact' | 'fuzzy' | 'intent' | 'tag';
}
```

**Algorithm:**

1. **Query Preprocessing**: Normalize query (lowercase, trim, remove special chars)
2. **Mode Detection**: Determine if query is keyword-based or intent-based
   - Keyword: Short queries, service names, abbreviations
   - Intent: Longer queries with verbs, natural language patterns
3. **Matching**:
   - Exact match: Service name or ID matches query
   - Fuzzy match: Levenshtein distance < 3 for service names
   - Tag match: Query matches any service tag
   - Intent match: Query tokens match intentKeywords
4. **Scoring**: Assign relevance scores (exact=100, fuzzy=80, tag=60, intent=40)
5. **Ranking**: Sort results by relevance score descending
6. **Filtering**: Return top 20 results

### 3. Workflow Renderer

**Module:** `workflow-renderer.js`

**Responsibilities:**
- Generate AWS-style architecture diagrams
- Render service icons and connections
- Support hover interactions and tooltips
- Export diagrams as PNG images

**Interface:**

```javascript
class WorkflowRenderer {
  constructor(containerElement: HTMLElement)
  
  // Render workflow diagram from pattern
  renderWorkflow(pattern: Pattern, services: Service[]): void
  
  // Render custom workflow from service list
  renderCustomWorkflow(services: Service[], connections: WorkflowConnection[]): void
  
  // Export diagram as PNG
  exportAsPNG(filename: string): void
  
  // Clear current diagram
  clear(): void
}

interface RenderOptions {
  layout: 'horizontal' | 'vertical' | 'grid';
  showLabels: boolean;
  showIcons: boolean;
  animate: boolean;
}
```

**Rendering Algorithm:**

1. **Layout Calculation**: Position services using force-directed layout or grid
2. **Icon Rendering**: Draw AWS service icons at calculated positions
3. **Connection Drawing**: Draw arrows between connected services
4. **Label Placement**: Position connection labels to avoid overlaps
5. **Animation**: Stagger entrance animations for visual appeal
6. **Interaction**: Add hover effects and click handlers

**Visual Style:**
- AWS official service icons (64x64px)
- Directional arrows with labels
- Left-to-right or top-to-bottom flow
- Color coding by service category
- Subtle shadows and borders

### 4. Cost Calculator

**Module:** `price-calculator.js`, `calculator-modal.js`

**Responsibilities:**
- Interactive cost estimation for AWS services
- Real-time calculation based on user inputs
- Display monthly and annual projections
- Show free tier eligibility and limits

**Interface:**

```javascript
class CostCalculator {
  constructor(service: Service)
  
  // Open calculator modal for service
  open(service: Service): void
  
  // Calculate cost based on usage parameters
  calculate(params: UsageParams): CostEstimate
  
  // Get default usage parameters for service
  getDefaultParams(service: Service): UsageParams
  
  // Close calculator modal
  close(): void
}

interface UsageParams {
  [key: string]: number; // e.g., { requests: 1000000, storage: 5 }
}

interface CostEstimate {
  monthly: number;
  annual: number;
  breakdown: CostBreakdown[];
  freeTierApplies: boolean;
  freeTierSavings: number;
}

interface CostBreakdown {
  component: string;
  quantity: number;
  unitCost: number;
  total: number;
}
```

**Calculation Logic:**

1. **Parameter Input**: User adjusts sliders or inputs for usage metrics
2. **Unit Cost Lookup**: Retrieve pricing from service costHint or pricing table
3. **Calculation**: Multiply quantity by unit cost for each component
4. **Free Tier Adjustment**: Subtract free tier allowance if applicable
5. **Aggregation**: Sum all components for total monthly cost
6. **Annual Projection**: Multiply monthly cost by 12
7. **Display**: Show breakdown with disclaimer

**Supported Parameters:**
- Compute: Hours, vCPU, memory
- Storage: GB stored, requests
- Database: Instance hours, storage, I/O
- Networking: Data transfer, requests
- AI/ML: API calls, training hours

### 5. Trending Topics

**Module:** `trending-topics.js`

**Responsibilities:**
- Display curated popular services and patterns
- Provide quick access to common use cases
- Update based on user interactions (future enhancement)

**Interface:**

```javascript
class TrendingTopics {
  constructor(containerElement: HTMLElement, knowledgeBase: KnowledgeBase)
  
  // Render trending topics section
  render(): void
  
  // Get curated trending topics
  getTrendingTopics(): TrendingTopic[]
  
  // Handle topic click
  onTopicClick(topic: TrendingTopic): void
}

interface TrendingTopic {
  type: 'service' | 'pattern';
  id: string;
  title: string;
  description: string;
  icon: string;
  popularity: number;
}
```

**Curated Topics:**
- Serverless API (Lambda + API Gateway + DynamoDB)
- Static Website (S3 + CloudFront + Route 53)
- ML Pipeline (SageMaker + S3 + Lambda)
- Real-time Chat (AppSync + DynamoDB + Lambda)
- Data Analytics (Athena + Glue + QuickSight)
- Container Deployment (ECS + Fargate + ECR)
- Microservices (EKS + RDS + ElastiCache)
- IoT Platform (IoT Core + Kinesis + Lambda)

## Data Models

### Service Model

Represents an AWS service with all metadata required for search, display, and recommendations.

```javascript
class Service {
  id: string;              // Unique identifier (e.g., "lambda")
  name: string;            // Display name (e.g., "AWS Lambda")
  icon: string;            // Icon filename (e.g., "lambda.svg")
  category: string;        // Category (e.g., "Compute")
  tags: string[];          // Searchable keywords
  intentKeywords: string[]; // Natural language terms
  shortDescription: string; // One-line summary
  documentation: string;    // Detailed description
  billingModel: string;     // Pricing structure
  costHint: string;         // Approximate cost
  hasFreeTier: boolean;     // Free tier availability
  relatedServiceIds: string[]; // Related services
  
  // Computed properties
  get complexity(): string; // Derived from tags or explicit field
  get useCases(): string[]; // Derived from intentKeywords
}
```

### Pattern Model

Represents an architecture pattern combining multiple services.

```javascript
class Pattern {
  id: string;              // Unique identifier
  name: string;            // Pattern name
  description: string;     // Detailed description
  useCase: string;         // Primary use case
  services: string[];      // Service IDs involved
  workflow: WorkflowConnection[]; // Service connections
  costEstimate: string;    // Approximate monthly cost
  complexity: string;      // Beginner|Intermediate|Advanced
  
  // Methods
  getServices(knowledgeBase: KnowledgeBase): Service[];
  getTotalCost(): number;
}
```

### Search Index Model

In-memory index for fast search performance.

```javascript
class SearchIndex {
  servicesByName: Map<string, Service>;
  servicesByTag: Map<string, Service[]>;
  servicesByCategory: Map<string, Service[]>;
  servicesByIntent: Map<string, Service[]>;
  
  // Build index from knowledge base
  build(knowledgeBase: KnowledgeBase): void;
  
  // Query index
  findByName(name: string): Service | null;
  findByTag(tag: string): Service[];
  findByCategory(category: string): Service[];
  findByIntent(keyword: string): Service[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing all testable criteria from the prework analysis, I've identified several areas of redundancy:

**Redundant Properties to Consolidate:**
- Properties 5.2, 11.4, 12.1, 15.4, 17.2, 19.4, 22.4, 26.2 all test JSON schema compliance - can be combined into one comprehensive schema validation property
- Properties 8.1, 8.3, 14.5, 15.5, 26.4 all test cost disclaimer presence - can be combined into one property
- Properties 9.4, 16.3 both test result ranking - redundant
- Properties 13.1-13.5 test module existence which is already covered by functional properties
- Properties 14.1, 24.1 both test calculator button presence - redundant
- Properties 14.3, 24.4 both test calculator interactivity - redundant
- Properties 21.4, 30.1 both test focus indicators - redundant
- Properties 4.1, 25.1 both test initial load time - redundant
- Properties 7.3, 17.4 both test workflow arrows - redundant

**Consolidated Property Set:**
After removing redundancies, we have approximately 60 unique testable properties covering:
- Search functionality (keyword, intent, fuzzy matching, ranking)
- UI behavior (SPA navigation, visual feedback, responsiveness)
- Data integrity (JSON schema, extensibility, error handling)
- Performance (search speed, load time, interaction responsiveness)
- Workflow visualization (diagrams, icons, connections, hover states)
- Cost calculator (inputs, calculations, disclaimers)
- Accessibility (keyboard navigation, ARIA, contrast, reduced motion)

### Correctness Properties

Property 1: Single-page navigation preservation
*For any* user interaction with navigation elements, the application should update content without triggering full page reloads or changing the URL path
**Validates: Requirements 2.2, 2.4**

Property 2: Search response time
*For any* search query, the application should return results within 300 milliseconds
**Validates: Requirements 3.2, 4.2**

Property 3: Search result completeness
*For any* search result, the result should include service name, icon, description, billing model, and cost hint
**Validates: Requirements 3.3, 9.5**

Property 4: Interaction responsiveness
*For any* user interaction (click, hover, focus), the application should provide visual feedback within 100 milliseconds
**Validates: Requirements 4.5, 21.1**

Property 5: JSON schema compliance
*For any* service in the knowledge base, the service should have all required fields: id, name, icon, category, tags, intentKeywords, shortDescription, documentation, billingModel, costHint, hasFreeTier, relatedServiceIds
**Validates: Requirements 5.2, 11.4, 12.1, 15.4, 17.2, 19.4, 22.4, 26.2**

Property 6: JSON extensibility
*For any* new service added to the JSON knowledge base, the service should be searchable and displayable without code changes
**Validates: Requirements 5.5, 11.4, 12.2**

Property 7: Offline operation
*For any* core operation (search, cost calculation, diagram generation), the application should not make external network requests
**Validates: Requirements 6.4**

Property 8: Workflow diagram completeness
*For any* architecture pattern, the workflow diagram should include AWS service icons and directional arrows for all connections
**Validates: Requirements 7.1, 7.2, 7.3, 17.4**

Property 9: Workflow hover interactions
*For any* workflow element, hovering should highlight the element and its connections
**Validates: Requirements 7.5**

Property 10: Cost disclaimer presence
*For any* display of pricing information (service details, calculator, patterns), a cost disclaimer should be visible in the same viewport
**Validates: Requirements 8.1, 8.3, 14.5, 15.5, 26.4**

Property 11: Keyword search accuracy
*For any* AWS service name or abbreviation, searching for that name should return the corresponding service in the results
**Validates: Requirements 9.1, 16.4**

Property 12: Intent search relevance
*For any* natural language query describing a use case, the search should return services whose intentKeywords match the query terms
**Validates: Requirements 9.2, 18.4**

Property 13: Search mode detection
*For any* search query, the application should automatically select keyword mode for short queries (<5 words) and intent mode for longer queries
**Validates: Requirements 9.3**

Property 14: Search result ranking
*For any* search results, the results should be sorted by relevance score in descending order with exact matches first
**Validates: Requirements 9.4, 16.3**

Property 15: Trending topic navigation
*For any* trending topic card, clicking the card should display detailed information about that service or pattern
**Validates: Requirements 10.3**

Property 16: Trending topic card structure
*For any* trending topic card, the card should include an icon, title, and brief description
**Validates: Requirements 10.5**

Property 17: Major service coverage
*For any* major AWS service (Lambda, S3, EC2, RDS, DynamoDB, etc.), searching for the service name should return that service
**Validates: Requirements 11.2**

Property 18: JSON schema consistency
*For any* two services in the knowledge base, both services should have the same set of field names (though values may differ)
**Validates: Requirements 12.1**

Property 19: Optional field handling
*For any* service with missing optional fields (complexity, patterns), the application should display the service without errors
**Validates: Requirements 12.3**

Property 20: Incomplete data resilience
*For any* service with missing required fields, the application should log a warning but continue functioning
**Validates: Requirements 12.4, 22.5**

Property 21: JSON field extensibility
*For any* new field added to service objects in JSON, existing functionality should continue working without code changes
**Validates: Requirements 12.5**

Property 22: Calculator cost calculation
*For any* set of usage parameters, the calculator should produce a monthly cost estimate and an annual cost estimate (monthly × 12)
**Validates: Requirements 13.4, 14.4**

Property 23: Calculator accessibility
*For any* service, a calculator button or link should be accessible from the service details view
**Validates: Requirements 14.1, 24.1**

Property 24: Calculator real-time updates
*For any* adjustment to calculator input parameters, the cost estimates should update within 100 milliseconds
**Validates: Requirements 14.3, 24.4**

Property 25: Free tier indicator
*For any* service with hasFreeTier=true, the service display should include a visual indicator of free tier availability
**Validates: Requirements 15.1**

Property 26: Free tier limits display
*For any* service with hasFreeTier=true, the service display should show the free tier limits
**Validates: Requirements 15.2**

Property 27: Free tier filtering
*For any* application of the free tier filter, only services with hasFreeTier=true should be displayed
**Validates: Requirements 15.3**

Property 28: Fuzzy matching tolerance
*For any* service name with a single character typo (insertion, deletion, substitution, transposition), the search should return the correct service
**Validates: Requirements 16.1**

Property 29: Partial name matching
*For any* service name prefix (minimum 3 characters), the search should return services whose names start with that prefix
**Validates: Requirements 16.2**

Property 30: Search performance
*For any* search query over the complete 200+ service dataset, the search algorithm should execute in under 100 milliseconds
**Validates: Requirements 16.5**

Property 31: Related services display
*For any* service with non-empty relatedServiceIds, the service details should display the related services
**Validates: Requirements 17.1**

Property 32: Related service navigation
*For any* related service link, clicking the link should navigate to that service's details
**Validates: Requirements 17.3**

Property 33: Relationship indicators
*For any* service relationship, the display should indicate whether the relationship is common or recommended
**Validates: Requirements 17.5**

Property 34: Use case display
*For any* service, the service details should display at least 3 use cases derived from tags or intentKeywords
**Validates: Requirements 18.1**

Property 35: Use case formatting
*For any* use case display, the use cases should be presented as a list or card grid
**Validates: Requirements 18.5**

Property 36: Category service counts
*For any* category, the category display should show the count of services in that category
**Validates: Requirements 19.2**

Property 37: Category filtering
*For any* category selection, only services in that category should be displayed
**Validates: Requirements 19.3**

Property 38: Category search combination
*For any* active category filter, search functionality should return only results within that category
**Validates: Requirements 19.5**

Property 39: Responsive layout adaptation
*For any* viewport width between 320px and 1920px, the layout should adapt appropriately without horizontal scrolling
**Validates: Requirements 20.1, 20.2**

Property 40: Touch target sizing
*For any* interactive element (button, link, input), the element should have minimum dimensions of 44x44 pixels
**Validates: Requirements 20.3**

Property 41: Mobile diagram optimization
*For any* workflow diagram viewed on mobile (<768px width), the diagram should be viewable via horizontal scrolling or simplified layout
**Validates: Requirements 20.4**

Property 42: Tablet layout optimization
*For any* viewport width between 768px and 1024px, the layout should use a tablet-optimized design
**Validates: Requirements 20.5**

Property 43: Visual feedback immediacy
*For any* button or link click, visual feedback (color change, animation) should appear within 100 milliseconds
**Validates: Requirements 21.1**

Property 44: Loading indicator display
*For any* operation taking longer than 100 milliseconds, a loading indicator should be displayed
**Validates: Requirements 21.2, 25.3**

Property 45: Hover state styling
*For any* interactive element, hovering should change the cursor to pointer and apply hover styles
**Validates: Requirements 21.3**

Property 46: Focus indicator visibility
*For any* form input or interactive element, focusing should display a visible focus indicator
**Validates: Requirements 21.4, 30.1**

Property 47: Action confirmation feedback
*For any* completed action (search, filter, navigation), visual feedback should confirm the action
**Validates: Requirements 21.5**

Property 48: No hardcoded service data
*For any* service information displayed in the UI, the information should come from the JSON knowledge base, not hardcoded in JS/HTML
**Validates: Requirements 22.2**

Property 49: JSON hot-reload
*For any* update to the JSON knowledge base, reloading the application should reflect the changes
**Validates: Requirements 22.3**

Property 50: Complexity indicator display
*For any* service with a complexity rating, the service display should show the complexity indicator
**Validates: Requirements 23.1**

Property 51: Complexity filtering
*For any* complexity filter selection, only services matching that complexity level should be displayed
**Validates: Requirements 23.3**

Property 52: Complexity explanation
*For any* service with a complexity rating, the display should include a brief explanation of the rating
**Validates: Requirements 23.4**

Property 53: Beginner service highlighting
*For any* beginner-level service with hasFreeTier=true, the service should be visually highlighted
**Validates: Requirements 23.5**

Property 54: Calculator modal opening
*For any* calculator button click, the calculator modal should open with the selected service pre-loaded
**Validates: Requirements 24.2, 24.3**

Property 55: Calculator context preservation
*For any* calculator close action, the previous view should be restored without losing context
**Validates: Requirements 24.5**

Property 56: Async JSON loading
*For any* JSON knowledge base load, the UI should remain responsive and not block user interactions
**Validates: Requirements 25.2**

Property 57: Billing model display
*For any* service, the service details should display the billing model
**Validates: Requirements 26.1**

Property 58: Cost hint display
*For any* service, the service details should display the cost hint
**Validates: Requirements 26.3**

Property 59: Pricing page links
*For any* service with pricing information, a link to official AWS pricing pages should be provided
**Validates: Requirements 26.5**

Property 60: Pattern diagram rendering
*For any* architecture pattern selection, a workflow diagram should be rendered showing all services in the pattern
**Validates: Requirements 27.2**

Property 61: Pattern description display
*For any* architecture pattern, the pattern display should include a description of the use case and benefits
**Validates: Requirements 27.3**

Property 62: Pattern service list
*For any* architecture pattern, the pattern display should list all services involved with links to service details
**Validates: Requirements 27.4**

Property 63: Pattern cost guidance
*For any* architecture pattern, the pattern display should include cost guidance for the overall architecture
**Validates: Requirements 27.5**

Property 64: Suggestion chip execution
*For any* suggestion chip click, the application should execute a search with the suggestion query
**Validates: Requirements 28.3**

Property 65: JSON load error handling
*For any* JSON knowledge base load failure, a friendly error message with retry options should be displayed
**Validates: Requirements 29.1**

Property 66: Empty search state
*For any* search returning zero results, an empty state with alternative search suggestions should be displayed
**Validates: Requirements 29.2**

Property 67: Error logging
*For any* error encountered during operation, the error should be logged to the browser console
**Validates: Requirements 29.3**

Property 68: Error resilience
*For any* error encountered during operation, the application should continue functioning without crashing
**Validates: Requirements 29.4**

Property 69: Error guidance
*For any* error displayed to the user, clear guidance on how to proceed should be provided
**Validates: Requirements 29.5**

Property 70: ARIA labeling
*For any* interactive element, appropriate ARIA labels and roles should be provided for screen readers
**Validates: Requirements 30.3**

Property 71: Color contrast compliance
*For any* text content, the color contrast ratio should be at least 4.5:1 against its background
**Validates: Requirements 30.4**

Property 72: Reduced motion support
*For any* user with prefers-reduced-motion enabled, animations should be disabled or significantly reduced
**Validates: Requirements 30.5**

## Error Handling

### Error Categories

1. **Data Loading Errors**
   - JSON fetch failure
   - JSON parse error
   - Invalid JSON schema
   - Missing required fields

2. **Search Errors**
   - Empty query
   - No results found
   - Search timeout
   - Invalid search parameters

3. **Rendering Errors**
   - Missing service icons
   - Workflow diagram generation failure
   - Calculator rendering error
   - Modal display issues

4. **User Input Errors**
   - Invalid calculator parameters
   - Out-of-range values
   - Malformed queries

### Error Handling Strategy

**Graceful Degradation:**
- Display partial results when possible
- Show fallback content for missing data
- Provide default values for optional fields
- Continue operation despite non-critical errors

**User Communication:**
- Friendly error messages in plain language
- Actionable suggestions for recovery
- Visual indicators (icons, colors) for error severity
- Console logging for developer debugging

**Recovery Mechanisms:**
- Retry buttons for failed operations
- Alternative search suggestions for no results
- Fallback to cached data when offline
- Reset to default state option

### Error Handling Implementation

```javascript
class ErrorHandler {
  // Handle JSON loading errors
  handleJSONError(error: Error): void {
    console.error('JSON Load Error:', error);
    displayErrorMessage({
      title: 'Unable to Load Service Data',
      message: 'The application data could not be loaded. Please check your connection and try again.',
      actions: [
        { label: 'Retry', handler: () => retryJSONLoad() },
        { label: 'Use Cached Data', handler: () => loadCachedData() }
      ]
    });
  }
  
  // Handle search errors
  handleSearchError(query: string, error: Error): void {
    console.error('Search Error:', error);
    if (error instanceof NoResultsError) {
      displayEmptyState({
        message: `No results found for "${query}"`,
        suggestions: getSimilarQueries(query)
      });
    } else {
      displayErrorMessage({
        title: 'Search Failed',
        message: 'An error occurred while searching. Please try again.',
        actions: [{ label: 'Retry', handler: () => retrySearch(query) }]
      });
    }
  }
  
  // Handle rendering errors
  handleRenderError(component: string, error: Error): void {
    console.error(`Render Error (${component}):`, error);
    displayFallbackContent(component);
  }
  
  // Validate JSON schema
  validateService(service: any): ValidationResult {
    const requiredFields = ['id', 'name', 'icon', 'category', 'tags', 
                           'intentKeywords', 'shortDescription', 'documentation',
                           'billingModel', 'costHint', 'hasFreeTier', 'relatedServiceIds'];
    const missing = requiredFields.filter(field => !(field in service));
    
    if (missing.length > 0) {
      console.warn(`Service ${service.id} missing fields:`, missing);
      return { valid: false, missing };
    }
    return { valid: true, missing: [] };
  }
}
```

## Testing Strategy

### Dual Testing Approach

The application requires both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests** verify specific examples, edge cases, and integration points:
- Specific search queries return expected results
- Calculator produces correct costs for known inputs
- UI components render with expected structure
- Error handlers display appropriate messages

**Property-Based Tests** verify universal properties across all inputs:
- Search performance under 100ms for any query
- All services have required JSON fields
- All interactive elements provide visual feedback
- Workflow diagrams render for any pattern

### Unit Testing

**Framework:** Jest or Vitest

**Test Coverage:**
- Search engine: Keyword search, intent search, fuzzy matching
- Calculator: Cost calculations, parameter validation
- Workflow renderer: Diagram generation, icon placement
- UI components: Service cards, modals, trending topics
- Error handlers: JSON load failure, search errors, rendering errors

**Example Unit Tests:**

```javascript
describe('Search Engine', () => {
  test('should return Lambda for "serverless function" query', () => {
    const results = searchEngine.search('serverless function');
    expect(results).toContainService('lambda');
  });
  
  test('should return S3 for "s3" abbreviation', () => {
    const results = searchEngine.search('s3');
    expect(results[0].service.id).toBe('s3');
  });
  
  test('should handle empty query gracefully', () => {
    const results = searchEngine.search('');
    expect(results).toEqual([]);
  });
});

describe('Cost Calculator', () => {
  test('should calculate Lambda cost correctly', () => {
    const cost = calculator.calculate('lambda', { requests: 1000000, duration: 100 });
    expect(cost.monthly).toBeCloseTo(0.20, 2);
  });
  
  test('should apply free tier discount', () => {
    const cost = calculator.calculate('lambda', { requests: 500000, duration: 100 });
    expect(cost.freeTierApplies).toBe(true);
    expect(cost.freeTierSavings).toBeGreaterThan(0);
  });
});
```

### Property-Based Testing

**Framework:** fast-check (JavaScript property-based testing library)

**Configuration:** Each property test should run a minimum of 100 iterations to ensure thorough coverage of the input space.

**Test Tagging:** Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format: `**Feature: comprehensive-validation, Property {number}: {property_text}**`

**Property Test Coverage:**
- Search properties (1-16): Performance, accuracy, ranking, fuzzy matching
- UI properties (17-47): Navigation, feedback, responsiveness, accessibility
- Data properties (48-72): JSON schema, extensibility, error handling

**Example Property Tests:**

```javascript
import fc from 'fast-check';

describe('Property-Based Tests', () => {
  /**
   * Feature: comprehensive-validation, Property 2: Search response time
   * For any search query, the application should return results within 300 milliseconds
   */
  test('search response time under 300ms', () => {
    fc.assert(
      fc.property(fc.string(), (query) => {
        const start = performance.now();
        searchEngine.search(query);
        const duration = performance.now() - start;
        return duration < 300;
      }),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: comprehensive-validation, Property 5: JSON schema compliance
   * For any service in the knowledge base, the service should have all required fields
   */
  test('all services have required fields', () => {
    const requiredFields = ['id', 'name', 'icon', 'category', 'tags', 
                           'intentKeywords', 'shortDescription', 'documentation',
                           'billingModel', 'costHint', 'hasFreeTier', 'relatedServiceIds'];
    
    fc.assert(
      fc.property(fc.constantFrom(...knowledgeBase.services), (service) => {
        return requiredFields.every(field => field in service);
      }),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: comprehensive-validation, Property 14: Search result ranking
   * For any search results, the results should be sorted by relevance score in descending order
   */
  test('search results ranked by relevance', () => {
    fc.assert(
      fc.property(fc.string(), (query) => {
        const results = searchEngine.search(query);
        for (let i = 0; i < results.length - 1; i++) {
          if (results[i].relevanceScore < results[i + 1].relevanceScore) {
            return false;
          }
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: comprehensive-validation, Property 28: Fuzzy matching tolerance
   * For any service name with a single character typo, the search should return the correct service
   */
  test('fuzzy matching handles single character typos', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...knowledgeBase.services),
        fc.integer({ min: 0, max: 3 }), // typo type: 0=insert, 1=delete, 2=substitute, 3=transpose
        fc.integer({ min: 0, max: 10 }), // position
        (service, typoType, position) => {
          const name = service.name.toLowerCase();
          if (name.length < 3) return true; // skip very short names
          
          const pos = position % name.length;
          let typoName = name;
          
          switch (typoType) {
            case 0: // insert random char
              typoName = name.slice(0, pos) + 'x' + name.slice(pos);
              break;
            case 1: // delete char
              typoName = name.slice(0, pos) + name.slice(pos + 1);
              break;
            case 2: // substitute char
              typoName = name.slice(0, pos) + 'x' + name.slice(pos + 1);
              break;
            case 3: // transpose adjacent chars
              if (pos < name.length - 1) {
                typoName = name.slice(0, pos) + name[pos + 1] + name[pos] + name.slice(pos + 2);
              }
              break;
          }
          
          const results = searchEngine.search(typoName);
          return results.some(r => r.service.id === service.id);
        }
      ),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: comprehensive-validation, Property 39: Responsive layout adaptation
   * For any viewport width between 320px and 1920px, the layout should adapt without horizontal scrolling
   */
  test('responsive layout adapts to all viewport widths', () => {
    fc.assert(
      fc.property(fc.integer({ min: 320, max: 1920 }), (width) => {
        setViewportWidth(width);
        const bodyWidth = document.body.scrollWidth;
        return bodyWidth <= width;
      }),
      { numRuns: 100 }
    );
  });
  
  /**
   * Feature: comprehensive-validation, Property 43: Visual feedback immediacy
   * For any button or link click, visual feedback should appear within 100 milliseconds
   */
  test('click feedback within 100ms', () => {
    fc.assert(
      fc.property(fc.constantFrom(...getAllInteractiveElements()), (element) => {
        const start = performance.now();
        element.click();
        const feedbackTime = performance.now() - start;
        return feedbackTime < 100;
      }),
      { numRuns: 100 }
    );
  });
});
```

### Test Generators

For property-based testing, we need smart generators that constrain the input space intelligently:

```javascript
// Generate valid service objects
const serviceGenerator = fc.record({
  id: fc.stringOf(fc.char().filter(c => /[a-z0-9-]/.test(c)), { minLength: 2, maxLength: 20 }),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  icon: fc.string({ minLength: 5, maxLength: 20 }).map(s => s + '.svg'),
  category: fc.constantFrom('Compute', 'Storage', 'Database', 'Networking', 'Security', 'Analytics', 'AI/ML', 'DevOps'),
  tags: fc.array(fc.string({ minLength: 2, maxLength: 15 }), { minLength: 1, maxLength: 10 }),
  intentKeywords: fc.array(fc.string({ minLength: 3, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
  shortDescription: fc.string({ minLength: 10, maxLength: 100 }),
  documentation: fc.string({ minLength: 50, maxLength: 500 }),
  billingModel: fc.constantFrom('Pay per request', 'Pay per hour', 'Pay per GB', 'Pay per month'),
  costHint: fc.string({ minLength: 5, maxLength: 50 }),
  hasFreeTier: fc.boolean(),
  relatedServiceIds: fc.array(fc.string({ minLength: 2, maxLength: 20 }), { maxLength: 5 })
});

// Generate search queries
const searchQueryGenerator = fc.oneof(
  fc.string({ minLength: 1, maxLength: 50 }), // general queries
  fc.constantFrom(...knowledgeBase.services.map(s => s.name)), // service names
  fc.constantFrom('serverless', 'database', 'storage', 'compute', 'ml', 'ai'), // common keywords
  fc.string({ minLength: 10, maxLength: 100 }) // natural language queries
);

// Generate calculator parameters
const calculatorParamsGenerator = fc.record({
  requests: fc.integer({ min: 0, max: 10000000 }),
  storage: fc.integer({ min: 0, max: 1000 }),
  hours: fc.integer({ min: 0, max: 744 }), // max hours in a month
  dataTransfer: fc.integer({ min: 0, max: 10000 })
});
```

### Integration Testing

**Test Scenarios:**
- End-to-end user flows (search → view service → open calculator → estimate cost)
- Offline mode functionality
- Service worker caching
- JSON hot-reload
- Error recovery flows

### Performance Testing

**Metrics to Track:**
- Initial page load time (target: <2s)
- Search response time (target: <300ms)
- Calculator update time (target: <100ms)
- Interaction feedback time (target: <100ms)
- Animation frame rate (target: 60fps)

**Tools:**
- Lighthouse for overall performance score
- Chrome DevTools Performance panel
- Custom performance marks and measures

## Implementation Notes

### Technology Stack

- **HTML5**: Semantic markup, accessibility features
- **CSS3**: Modern layout (Flexbox, Grid), animations, responsive design
- **Vanilla JavaScript**: No framework dependencies for simplicity and performance
- **Service Workers**: Offline caching and PWA capabilities
- **Local Storage**: Caching JSON data for offline access

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

### Performance Optimizations

1. **Lazy Loading**: Load service icons on demand
2. **Debouncing**: Debounce search input to reduce unnecessary searches
3. **Memoization**: Cache search results and calculations
4. **Virtual Scrolling**: For large service lists (future enhancement)
5. **Code Splitting**: Separate modules for calculator, workflow renderer
6. **Asset Optimization**: Minify CSS/JS, compress images, use SVG icons

### Accessibility Considerations

1. **Keyboard Navigation**: All features accessible via keyboard
2. **Screen Reader Support**: ARIA labels, semantic HTML, live regions
3. **Color Contrast**: WCAG AA compliance (4.5:1 minimum)
4. **Focus Management**: Visible focus indicators, logical tab order
5. **Reduced Motion**: Respect prefers-reduced-motion preference
6. **Text Scaling**: Support up to 200% zoom without breaking layout

### Security Considerations

1. **XSS Prevention**: Sanitize all user input, use textContent instead of innerHTML
2. **CSP**: Content Security Policy headers to prevent injection attacks
3. **HTTPS**: Serve application over HTTPS in production
4. **Data Validation**: Validate JSON schema on load
5. **No External Dependencies**: Minimize attack surface by avoiding third-party libraries

### Deployment Strategy

1. **Static Hosting**: Deploy to S3 + CloudFront, GitHub Pages, or Netlify
2. **CDN**: Use CDN for fast global delivery
3. **Caching**: Aggressive caching with cache-busting for updates
4. **Monitoring**: Track errors with console logging, analytics for usage patterns
5. **Updates**: Version JSON knowledge base, provide update notifications

## Future Enhancements

1. **User Accounts**: Save favorite services, custom patterns
2. **Pattern Builder**: Visual drag-and-drop architecture designer
3. **Cost Comparison**: Compare costs across different service combinations
4. **Regional Pricing**: Show pricing variations by AWS region
5. **Service Recommendations**: ML-based recommendations based on usage patterns
6. **Community Patterns**: User-submitted architecture patterns
7. **Integration Guides**: Step-by-step tutorials for implementing patterns
8. **API Access**: Programmatic access to knowledge base
9. **Multi-Cloud Support**: Extend to Azure, GCP services
10. **Localization**: Support multiple languages
