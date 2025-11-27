# Requirements Document

## Introduction

AWS Beginner Blueprint is a single-page educational web application designed to help beginners choose the correct AWS services for their projects. The application provides intelligent service recommendations, visual architecture workflows, and approximate cost guidance using a static JSON knowledge base. It runs entirely on the front-end with no backend, database, or live AWS API calls required.

## Glossary

- **Blueprint**: The web application system that provides AWS service recommendations
- **Solution Pattern**: A predefined combination of AWS services that solve a common use case (e.g., "Serverless API with Database")
- **Intent Keywords**: Words or phrases users might type to describe their project needs
- **Workflow Diagram**: A visual representation of AWS services connected with directional arrows showing data/request flow
- **Knowledge Base**: The static JSON file containing all AWS services, solution patterns, and trending topics data
- **Trending Topic**: Modern cloud computing concepts like GenAI, Serverless, Containers that group related solution patterns
- **Cost Hint**: Static text approximation of service costs for educational purposes only
- **Free Tier**: AWS services that offer limited free usage

---

## Requirements

### Requirement 1: Use-Case Intent Search

**User Story:** As a beginner developer, I want to describe what I want to build in plain text, so that I can receive relevant AWS service recommendations without knowing AWS terminology.

#### Acceptance Criteria

1. WHEN a user enters a project description in the intent input field, THE Blueprint SHALL extract keywords and match them against solution pattern intent keywords in the Knowledge Base.
2. WHEN multiple solution patterns match the user input, THE Blueprint SHALL select the pattern with the highest keyword match score.
3. WHEN two or more patterns have equal match scores, THE Blueprint SHALL select the pattern with more specific tags.
4. WHEN no solution patterns match the user input, THE Blueprint SHALL display a guidance message suggesting example keywords such as "API, database, storage, analytics, AI, streaming".
5. WHEN a match is found, THE Blueprint SHALL display the recommendation panel with the selected solution pattern details.

---

### Requirement 2: AWS Service Name Search

**User Story:** As a user who knows specific AWS service names, I want to search by service name directly, so that I can quickly find documentation and workflows for that service.

#### Acceptance Criteria

1. WHEN a user enters an AWS service name in the search field, THE Blueprint SHALL match the input against service IDs and names in the Knowledge Base using case-insensitive comparison.
2. WHEN a service match is found, THE Blueprint SHALL display the service details including icon, category badge, short description, documentation, cost model, and example workflows.
3. WHEN partial service names are entered, THE Blueprint SHALL return services whose names contain the search term.
4. WHEN no service matches the search term, THE Blueprint SHALL display a message indicating no results found with suggestions to try different terms.

---

### Requirement 3: Trending Topics Browser

**User Story:** As a beginner exploring modern cloud concepts, I want to browse trending topics like GenAI and Serverless, so that I can discover relevant AWS services and solution patterns for current technology trends.

#### Acceptance Criteria

1. WHEN the user views the trending topics section, THE Blueprint SHALL display selectable topic cards for concepts including Generative AI, Serverless, Containers, Real-Time Streaming, Data Lake, Zero Trust Security, Edge/CDN, and IoT.
2. WHEN a user selects a trending topic, THE Blueprint SHALL display all solution patterns associated with that topic from the Knowledge Base.
3. WHEN a trending topic is selected, THE Blueprint SHALL scroll to the recommendation panel showing the first related solution pattern.

---

### Requirement 4: Recommendation Panel Display

**User Story:** As a user who has searched for a solution, I want to see a clear recommendation with service details and visual workflow, so that I can understand which AWS services to use and how they connect.

#### Acceptance Criteria

1. WHEN a solution pattern is selected, THE Blueprint SHALL display the pattern title and summary description.
2. WHEN displaying a solution pattern, THE Blueprint SHALL show 1-5 recommended AWS services with their icons, names, and one-line purpose descriptions.
3. WHEN displaying a solution pattern, THE Blueprint SHALL render a visual workflow diagram using AWS-style SVG icons connected with directional arrows.
4. WHEN a service card in the recommendation panel is clicked, THE Blueprint SHALL expand to show that service's documentation panel.

---

### Requirement 5: Visual Workflow Diagram

**User Story:** As a visual learner, I want to see architecture diagrams with AWS icons and arrows, so that I can understand how services connect in a solution.

#### Acceptance Criteria

1. WHEN rendering a workflow diagram, THE Blueprint SHALL display AWS service icons in the order specified by the workflow template nodes.
2. WHEN rendering a workflow diagram, THE Blueprint SHALL draw directional arrows between nodes as specified by the workflow template edges.
3. WHEN rendering a workflow diagram, THE Blueprint SHALL use locally stored SVG icons from the assets/icons folder.
4. WHEN a workflow contains a user/client node, THE Blueprint SHALL display it as the starting point of the diagram.

---

### Requirement 6: Cost Guidance Section

**User Story:** As a cost-conscious beginner, I want to see approximate cost information for recommended services, so that I can make informed decisions about AWS service selection.

#### Acceptance Criteria

1. WHEN displaying a solution pattern, THE Blueprint SHALL show the billing model text for each recommended service from the Knowledge Base.
2. WHEN displaying a solution pattern, THE Blueprint SHALL show the cost hint text for each recommended service from the Knowledge Base.
3. WHEN displaying a solution pattern, THE Blueprint SHALL indicate which services have free tier availability.
4. WHEN displaying cost information, THE Blueprint SHALL show the mandatory disclaimer: "This is a challenge educational tool using static data. Not real pricing. Please check AWS Pricing pages for production workloads."

---

### Requirement 7: Expandable Documentation Panel

**User Story:** As a user learning about AWS services, I want to read short documentation and see related services, so that I can deepen my understanding of each service.

#### Acceptance Criteria

1. WHEN a service documentation panel is expanded, THE Blueprint SHALL display the short static documentation text from the Knowledge Base.
2. WHEN a service documentation panel is expanded, THE Blueprint SHALL display up to 3 related services with their icons and names.
3. WHEN a related service is clicked, THE Blueprint SHALL navigate to that service's documentation panel.
4. WHEN displaying service documentation, THE Blueprint SHALL show the service icon, name, and category badge.

---

### Requirement 8: Full Service Index Browser

**User Story:** As a user exploring AWS services, I want to browse all available services with filtering options, so that I can discover services I might not have known about.

#### Acceptance Criteria

1. WHEN the user views the service index section, THE Blueprint SHALL display a searchable grid of all 200+ AWS services from the Knowledge Base.
2. WHEN the user enters text in the service index search box, THE Blueprint SHALL filter the grid to show only services matching the search term.
3. WHEN the user selects a category filter, THE Blueprint SHALL display only services belonging to that category.
4. WHEN a service card in the index is clicked, THE Blueprint SHALL scroll to the recommendation panel and display that service's documentation and associated workflows.
5. WHEN displaying service cards, THE Blueprint SHALL show the service name, icon, and one-line description.

---

### Requirement 9: Knowledge Base JSON Structure

**User Story:** As a developer maintaining this application, I want a well-structured JSON knowledge base, so that I can easily add new services and solution patterns.

#### Acceptance Criteria

1. THE Knowledge Base SHALL contain entries for 200+ AWS services with fields: id, name, icon reference, category, tags, intentKeywords, shortDescription, documentation, billingModel, costHint, hasFreeTier, relatedServiceIds, and workflowTemplates.
2. THE Knowledge Base SHALL contain entries for 50+ solution patterns with fields: id, label, intentKeywords, stack (service IDs), summary, workflowDiagram (nodes and edges), costSummary, and trendTags.
3. THE Knowledge Base SHALL contain trending topics with fields: id, label, relatedPatterns (pattern IDs), and description.
4. THE Knowledge Base SHALL include services across all major AWS categories: Compute, Storage, Database, AI/ML, Analytics, Security, Networking, DevOps, Migration, IoT, Business Apps, Contact Center, Media Services, Blockchain, and Quantum.
5. THE Knowledge Base SHALL be parseable as valid JSON and loadable without external API calls.
6. THE Knowledge Base SHALL be serializable to JSON format for storage and distribution.

---

### Requirement 10: Keyword Matching Algorithm

**User Story:** As a user searching by intent, I want accurate matching of my description to solution patterns, so that I receive the most relevant recommendations.

#### Acceptance Criteria

1. WHEN processing user input, THE Blueprint SHALL convert the input text to lowercase before matching.
2. WHEN calculating match scores, THE Blueprint SHALL count the number of user input words that match intent keywords in each solution pattern.
3. WHEN multiple patterns have equal scores, THE Blueprint SHALL prefer patterns with more specific tags.
4. WHEN no keywords match any pattern, THE Blueprint SHALL return a no-match result with guidance suggestions.

---

### Requirement 11: User Interface Design

**User Story:** As a user, I want a professional and accessible interface, so that I can easily navigate and understand the application.

#### Acceptance Criteria

1. THE Blueprint SHALL render as a single-page application with no page navigation required.
2. THE Blueprint SHALL use an AWS-style professional grey theme with card layouts.
3. THE Blueprint SHALL implement smooth transitions between UI state changes.
4. THE Blueprint SHALL be fully responsive and mobile-friendly.
5. THE Blueprint SHALL use clean typography with appropriate spacing.
6. THE Blueprint SHALL display the mandatory footer disclaimer: "Disclaimer: This is an educational prototype created for Kairo AI for Bharat Challenge. All cost values are static text approximations and may be inaccurate. Not official AWS billing. Not intended for production financial planning. Check AWS documentation for real pricing."

---

### Requirement 12: Offline Operation

**User Story:** As a user with limited connectivity, I want the application to work fully offline, so that I can use it without an internet connection after initial load.

#### Acceptance Criteria

1. THE Blueprint SHALL load all data from a local JSON knowledge base file bundled with the application.
2. THE Blueprint SHALL load all AWS service icons from local SVG files in the assets/icons folder.
3. THE Blueprint SHALL function without any external API calls or network requests after initial page load.
4. THE Blueprint SHALL not require user authentication or login.

---

### Requirement 13: About Section

**User Story:** As a user or judge, I want to understand the purpose of this application, so that I can evaluate it in the context of the challenge.

#### Acceptance Criteria

1. THE Blueprint SHALL include an About section accessible from the main interface.
2. WHEN the About section is displayed, THE Blueprint SHALL show the purpose statement: "This tool is built for Kairo — AI for Bharat Challenge. It helps students and beginners choose AWS services quickly with architecture diagrams and high-level cost guidance using static JSON educational data."

---

### Requirement 14: Export Architecture Diagram

**User Story:** As a student, I want to download the workflow diagram as an image, so that I can include it in my project reports and presentations.

#### Acceptance Criteria

1. WHEN a workflow diagram is displayed, THE Blueprint SHALL show an "Export" button near the diagram.
2. WHEN the user clicks the Export button, THE Blueprint SHALL generate a downloadable PNG image of the current workflow diagram.
3. WHEN exporting, THE Blueprint SHALL include the solution pattern title in the exported image.
4. WHEN exporting, THE Blueprint SHALL name the downloaded file using the pattern: "{solution-pattern-id}-architecture.png".

---

### Requirement 15: Stack Comparison Mode

**User Story:** As a beginner learning AWS, I want to compare alternative architecture stacks, so that I can understand trade-offs between different approaches like Serverless vs Traditional.

#### Acceptance Criteria

1. WHEN a solution pattern has an alternative stack defined in the Knowledge Base, THE Blueprint SHALL display a "Compare with alternative" button.
2. WHEN the user clicks the compare button, THE Blueprint SHALL display a side-by-side comparison table showing both stacks.
3. WHEN displaying comparison, THE Blueprint SHALL show differences across dimensions: Cost Level, Scaling Model, Management Overhead, and Complexity.
4. WHEN displaying comparison, THE Blueprint SHALL highlight the recommended stack based on the use case.

---

### Requirement 16: Prerequisite Knowledge Section

**User Story:** As a beginner, I want to know what skills I need before attempting a solution pattern, so that I can assess if I'm ready or need to learn prerequisites first.

#### Acceptance Criteria

1. WHEN displaying a solution pattern, THE Blueprint SHALL show a "Prerequisites" section with required knowledge items.
2. WHEN displaying prerequisites, THE Blueprint SHALL show estimated time to build the solution.
3. WHEN displaying prerequisites, THE Blueprint SHALL show a difficulty level badge (Beginner, Intermediate, Advanced).
4. THE Knowledge Base SHALL include prerequisiteKnowledge, estimatedBuildTime, and difficultyLevel fields for each solution pattern.

---

### Requirement 17: Learning Resources Links

**User Story:** As a student learning AWS, I want to access curated learning resources for each pattern, so that I can deepen my understanding through tutorials and documentation.

#### Acceptance Criteria

1. WHEN displaying a solution pattern, THE Blueprint SHALL show a "Learning Resources" section with static links.
2. WHEN displaying learning resources, THE Blueprint SHALL include links to relevant AWS documentation pages.
3. WHEN displaying learning resources, THE Blueprint SHALL include links to recommended tutorial videos where available.
4. THE Knowledge Base SHALL include a learningResources array with title and URL for each solution pattern.
5. THE Blueprint SHALL open all learning resource links in a new browser tab.

---

### Requirement 18: Pattern Popularity Badges

**User Story:** As a user exploring patterns, I want to see which patterns are trending or popular for college projects, so that I can make informed choices based on community adoption.

#### Acceptance Criteria

1. THE Knowledge Base SHALL include a popularityScore field (1-100) for each solution pattern.
2. WHEN a solution pattern has popularityScore above 80, THE Blueprint SHALL display a "🔥 Trending" badge.
3. WHEN a solution pattern has popularityScore between 60-80 and includes "college" or "student" tags, THE Blueprint SHALL display a "⭐ Popular for Projects" badge.
4. WHEN displaying the solution pattern grid, THE Blueprint SHALL sort patterns by popularityScore in descending order by default.

---

### Requirement 19: Security Notes

**User Story:** As a beginner building on AWS, I want to see basic security guidance for each pattern, so that I can follow best practices and avoid common security mistakes.

#### Acceptance Criteria

1. WHEN displaying a solution pattern, THE Blueprint SHALL show a "Security Notes" section with 1-3 security tips.
2. THE Knowledge Base SHALL include a securityNotes array with brief security recommendations for each solution pattern.
3. WHEN displaying security notes, THE Blueprint SHALL use warning-style formatting to draw attention to security guidance.
4. THE Blueprint SHALL include common security tips such as IAM role usage, credential protection, and HTTPS enablement.

---

### Requirement 20: Cost Awareness Badges

**User Story:** As a cost-conscious student, I want to quickly identify low-cost and cost-sensitive architectures, so that I can choose solutions that fit my budget constraints.

#### Acceptance Criteria

1. THE Knowledge Base SHALL include a costLevel field (Low, Medium, High) for each solution pattern.
2. WHEN a solution pattern has costLevel "Low", THE Blueprint SHALL display a "💰 Low Cost Setup" badge.
3. WHEN a solution pattern has costLevel "High", THE Blueprint SHALL display a "⚠️ Cost Sensitive" badge with a tooltip explaining potential costs.
4. WHEN displaying cost badges, THE Blueprint SHALL position them prominently near the pattern title.
