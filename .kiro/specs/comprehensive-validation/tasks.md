# Implementation Plan

- [ ] 1. Validate and enhance JSON knowledge base
- [ ] 1.1 Verify all 200+ services have required fields (id, name, icon, category, tags, intentKeywords, shortDescription, documentation, billingModel, costHint, hasFreeTier, relatedServiceIds)
  - Scan knowledge-base.json and log any services missing required fields
  - Add missing fields or remove incomplete services
  - _Requirements: 5.2, 11.1, 22.4_

- [ ] 1.2 Add complexity ratings to services where applicable
  - Add complexity field (Beginner|Intermediate|Advanced) to services
  - Base ratings on service learning curve and prerequisites
  - _Requirements: 23.1, 23.2_

- [ ] 1.3 Ensure all services have at least 3 use cases derivable from tags/intentKeywords
  - Review services and enhance tags/intentKeywords to support use case generation
  - _Requirements: 18.1_

- [ ]* 1.4 Write property test for JSON schema compliance
  - **Property 5: JSON schema compliance**
  - **Validates: Requirements 5.2, 11.4, 12.1**

- [ ] 2. Implement and validate search system
- [ ] 2.1 Enhance keyword search with fuzzy matching
  - Implement Levenshtein distance algorithm for typo tolerance
  - Support partial name matching (minimum 3 characters)
  - Handle common abbreviations (EC2, S3, RDS, etc.)
  - _Requirements: 9.1, 16.1, 16.2, 16.4_

- [ ] 2.2 Enhance intent search with natural language matching
  - Match query tokens against intentKeywords
  - Score results based on keyword overlap
  - _Requirements: 9.2, 18.4_

- [ ] 2.3 Implement automatic search mode detection
  - Use query length and structure to determine mode
  - Short queries (<5 words) → keyword mode
  - Longer queries → intent mode
  - _Requirements: 9.3_

- [ ] 2.4 Implement result ranking by relevance score
  - Assign scores: exact=100, fuzzy=80, tag=60, intent=40
  - Sort results by score descending
  - _Requirements: 9.4, 16.3_

- [ ]* 2.5 Write property test for search response time
  - **Property 2: Search response time**
  - **Validates: Requirements 3.2, 4.2**

- [ ]* 2.6 Write property test for search result ranking
  - **Property 14: Search result ranking**
  - **Validates: Requirements 9.4, 16.3**

- [ ]* 2.7 Write property test for fuzzy matching tolerance
  - **Property 28: Fuzzy matching tolerance**
  - **Validates: Requirements 16.1**

- [ ]* 2.8 Write property test for search performance
  - **Property 30: Search performance**
  - **Validates: Requirements 16.5**

- [ ] 3. Validate and enhance UI components
- [ ] 3.1 Verify single-page navigation without page reloads
  - Test all navigation elements (links, buttons, tabs)
  - Ensure content updates dynamically without URL path changes
  - _Requirements: 2.2, 2.4_

- [ ] 3.2 Implement visual feedback for all interactions
  - Add hover states to all interactive elements
  - Add click feedback (color change, animation) within 100ms
  - Add focus indicators to all focusable elements
  - _Requirements: 4.5, 21.1, 21.3, 21.4_

- [ ] 3.3 Implement loading indicators for operations >100ms
  - Add loading spinner for search if >100ms
  - Add skeleton screens for JSON loading
  - _Requirements: 21.2, 25.3_

- [ ]* 3.4 Write property test for interaction responsiveness
  - **Property 4: Interaction responsiveness**
  - **Validates: Requirements 4.5, 21.1**

- [ ]* 3.5 Write property test for visual feedback immediacy
  - **Property 43: Visual feedback immediacy**
  - **Validates: Requirements 21.1**

- [ ] 4. Implement and validate workflow visualization
- [ ] 4.1 Enhance workflow renderer to use AWS service icons
  - Ensure all diagrams use official AWS icons (64x64px)
  - Implement icon loading with fallbacks
  - _Requirements: 7.2_

- [ ] 4.2 Implement directional arrows for service connections
  - Draw arrows between connected services
  - Add labels to arrows describing data flow
  - _Requirements: 7.3, 17.4_

- [ ] 4.3 Implement hover interactions for workflow elements
  - Highlight element and connections on hover
  - Show tooltips with additional context
  - _Requirements: 7.5_

- [ ]* 4.4 Write property test for workflow diagram completeness
  - **Property 8: Workflow diagram completeness**
  - **Validates: Requirements 7.1, 7.2, 7.3**

- [ ]* 4.5 Write property test for workflow hover interactions
  - **Property 9: Workflow hover interactions**
  - **Validates: Requirements 7.5**

- [ ] 5. Implement and validate cost calculator
- [ ] 5.1 Implement calculator modal with service pre-population
  - Open modal when calculator button clicked
  - Pre-load selected service information
  - _Requirements: 14.1, 24.1, 24.2, 24.3_

- [ ] 5.2 Implement real-time cost calculation
  - Update costs within 100ms of parameter changes
  - Calculate monthly and annual projections
  - Apply free tier discounts where applicable
  - _Requirements: 14.3, 14.4, 24.4_

- [ ] 5.3 Implement cost disclaimer display
  - Show disclaimer prominently in calculator
  - Include disclaimer text about estimates and variability
  - Add link to official AWS pricing pages
  - _Requirements: 8.1, 8.3, 14.5_

- [ ]* 5.4 Write property test for calculator cost calculation
  - **Property 22: Calculator cost calculation**
  - **Validates: Requirements 13.4, 14.4**

- [ ]* 5.5 Write property test for calculator real-time updates
  - **Property 24: Calculator real-time updates**
  - **Validates: Requirements 14.3, 24.4**

- [ ] 6. Implement and validate trending topics
- [ ] 6.1 Verify trending topics section displays 8-12 topics
  - Check that trending section exists in DOM
  - Verify topic count is between 8-12
  - _Requirements: 10.1, 10.2_

- [ ] 6.2 Implement trending topic navigation
  - Clicking topic should display service/pattern details
  - Verify all topics are clickable and navigate correctly
  - _Requirements: 10.3_

- [ ] 6.3 Verify trending topic card structure
  - Each card should have icon, title, and description
  - _Requirements: 10.5_

- [ ]* 6.4 Write property test for trending topic navigation
  - **Property 15: Trending topic navigation**
  - **Validates: Requirements 10.3**

- [ ]* 6.5 Write property test for trending topic card structure
  - **Property 16: Trending topic card structure**
  - **Validates: Requirements 10.5**

- [ ] 7. Implement and validate service details display
- [ ] 7.1 Implement related services display
  - Show related services for services with non-empty relatedServiceIds
  - Make related service links clickable and navigable
  - _Requirements: 17.1, 17.3_

- [ ] 7.2 Implement use case display
  - Display at least 3 use cases per service
  - Derive use cases from tags/intentKeywords
  - Format as list or card grid
  - _Requirements: 18.1, 18.5_

- [ ] 7.3 Implement free tier indicator and limits
  - Show visual indicator for services with hasFreeTier=true
  - Display free tier limits (e.g., "750 hours per month")
  - _Requirements: 15.1, 15.2_

- [ ] 7.4 Implement billing model and cost hint display
  - Show billing model (e.g., "Pay per request")
  - Show cost hint (e.g., "$0.20 per 1M requests")
  - Add link to official AWS pricing pages
  - _Requirements: 26.1, 26.3, 26.5_

- [ ]* 7.5 Write property test for related services display
  - **Property 31: Related services display**
  - **Validates: Requirements 17.1**

- [ ]* 7.6 Write property test for use case display
  - **Property 34: Use case display**
  - **Validates: Requirements 18.1**

- [ ]* 7.7 Write property test for free tier indicator
  - **Property 25: Free tier indicator**
  - **Validates: Requirements 15.1**

- [ ] 8. Implement and validate filtering functionality
- [ ] 8.1 Implement category filtering
  - Display service count for each category
  - Filter services by selected category
  - Maintain search functionality within filtered category
  - _Requirements: 19.2, 19.3, 19.5_

- [ ] 8.2 Implement free tier filtering
  - Add filter to show only free tier services
  - Verify only services with hasFreeTier=true are shown
  - _Requirements: 15.3_

- [ ] 8.3 Implement complexity filtering
  - Add filter to show services by complexity level
  - Verify filtering works correctly
  - _Requirements: 23.3_

- [ ]* 8.4 Write property test for category filtering
  - **Property 37: Category filtering**
  - **Validates: Requirements 19.3**

- [ ]* 8.5 Write property test for free tier filtering
  - **Property 27: Free tier filtering**
  - **Validates: Requirements 15.3**

- [ ] 9. Implement and validate responsive design
- [ ] 9.1 Test responsive layout at all viewport widths (320px-1920px)
  - Verify layout adapts without horizontal scrolling
  - Test mobile (320px-767px), tablet (768px-1023px), desktop (1024px+)
  - _Requirements: 20.1, 20.2, 20.5_

- [ ] 9.2 Verify touch target sizing (minimum 44x44px)
  - Measure all interactive elements
  - Adjust sizing where needed
  - _Requirements: 20.3_

- [ ] 9.3 Optimize workflow diagrams for mobile
  - Enable horizontal scrolling or simplified layout for mobile
  - _Requirements: 20.4_

- [ ]* 9.4 Write property test for responsive layout adaptation
  - **Property 39: Responsive layout adaptation**
  - **Validates: Requirements 20.1, 20.2**

- [ ]* 9.5 Write property test for touch target sizing
  - **Property 40: Touch target sizing**
  - **Validates: Requirements 20.3**

- [ ] 10. Implement and validate accessibility features
- [ ] 10.1 Add ARIA labels and roles to all interactive elements
  - Add aria-label to buttons, links, inputs
  - Add appropriate ARIA roles
  - _Requirements: 30.3_

- [ ] 10.2 Verify color contrast ratios (minimum 4.5:1)
  - Test all text against backgrounds
  - Adjust colors where needed
  - _Requirements: 30.4_

- [ ] 10.3 Implement reduced motion support
  - Detect prefers-reduced-motion setting
  - Disable or reduce animations when enabled
  - _Requirements: 30.5_

- [ ] 10.4 Verify semantic HTML structure
  - Use header, nav, main, section, article elements
  - _Requirements: 30.2_

- [ ]* 10.5 Write property test for ARIA labeling
  - **Property 70: ARIA labeling**
  - **Validates: Requirements 30.3**

- [ ]* 10.6 Write property test for color contrast compliance
  - **Property 71: Color contrast compliance**
  - **Validates: Requirements 30.4**

- [ ]* 10.7 Write property test for reduced motion support
  - **Property 72: Reduced motion support**
  - **Validates: Requirements 30.5**

- [ ] 11. Implement and validate error handling
- [ ] 11.1 Implement JSON load error handling
  - Display friendly error message on JSON load failure
  - Provide retry button
  - Offer cached data fallback if available
  - _Requirements: 29.1_

- [ ] 11.2 Implement empty search state
  - Display empty state when search returns no results
  - Show alternative search suggestions
  - _Requirements: 29.2_

- [ ] 11.3 Implement error logging
  - Log all errors to browser console
  - Include error context and stack traces
  - _Requirements: 29.3_

- [ ] 11.4 Implement error resilience
  - Ensure app continues functioning after errors
  - Display partial results when possible
  - _Requirements: 29.4_

- [ ] 11.5 Implement error guidance
  - Provide clear guidance on how to proceed after errors
  - Include actionable suggestions
  - _Requirements: 29.5_

- [ ]* 11.6 Write property test for JSON load error handling
  - **Property 65: JSON load error handling**
  - **Validates: Requirements 29.1**

- [ ]* 11.7 Write property test for empty search state
  - **Property 66: Empty search state**
  - **Validates: Requirements 29.2**

- [ ]* 11.8 Write property test for error resilience
  - **Property 68: Error resilience**
  - **Validates: Requirements 29.4**

- [ ] 12. Implement and validate offline functionality
- [ ] 12.1 Verify no external API calls for core operations
  - Test search, calculator, diagram generation
  - Ensure no fetch/XHR calls during core operations
  - _Requirements: 6.4_

- [ ] 12.2 Implement service worker for offline caching
  - Cache HTML, CSS, JS, JSON, icons
  - Enable offline access
  - _Requirements: 6.1, 6.2_

- [ ] 12.3 Implement offline indicator
  - Display subtle indicator when offline
  - _Requirements: 6.5_

- [ ]* 12.4 Write property test for offline operation
  - **Property 7: Offline operation**
  - **Validates: Requirements 6.4**

- [ ] 13. Implement and validate architecture patterns
- [ ] 13.1 Verify pre-defined patterns exist
  - Check for Serverless API, Static Website, ML Pipeline, etc.
  - _Requirements: 27.1_

- [ ] 13.2 Implement pattern diagram rendering
  - Render workflow diagram for selected patterns
  - Show all services involved
  - _Requirements: 27.2_

- [ ] 13.3 Implement pattern description and service list
  - Display pattern description with use case and benefits
  - List all services with links to details
  - _Requirements: 27.3, 27.4_

- [ ] 13.4 Implement pattern cost guidance
  - Display cost guidance for overall architecture
  - _Requirements: 27.5_

- [ ]* 13.5 Write property test for pattern diagram rendering
  - **Property 60: Pattern diagram rendering**
  - **Validates: Requirements 27.2**

- [ ]* 13.6 Write property test for pattern service list
  - **Property 62: Pattern service list**
  - **Validates: Requirements 27.4**

- [ ] 14. Implement and validate search suggestions
- [ ] 14.1 Verify suggestion chips display
  - Check that 4-6 suggestion chips are displayed
  - Verify suggestions include common queries
  - _Requirements: 28.1, 28.2, 28.5_

- [ ] 14.2 Implement suggestion chip click behavior
  - Clicking chip should execute search with that query
  - _Requirements: 28.3_

- [ ]* 14.3 Write property test for suggestion chip execution
  - **Property 64: Suggestion chip execution**
  - **Validates: Requirements 28.3**

- [ ] 15. Validate data integrity and extensibility
- [ ] 15.1 Verify no hardcoded service data in JS/HTML
  - Search codebase for hardcoded service names/data
  - Ensure all data comes from JSON
  - _Requirements: 22.2_

- [ ] 15.2 Test JSON hot-reload
  - Update JSON, reload app, verify changes reflected
  - _Requirements: 22.3_

- [ ] 15.3 Test JSON extensibility
  - Add new service to JSON
  - Verify service is searchable without code changes
  - Add new field to services
  - Verify existing functionality continues working
  - _Requirements: 5.5, 11.4, 12.2, 12.5_

- [ ] 15.4 Test optional field handling
  - Test services with missing optional fields
  - Verify app displays services without errors
  - _Requirements: 12.3_

- [ ]* 15.5 Write property test for JSON extensibility
  - **Property 6: JSON extensibility**
  - **Validates: Requirements 5.5, 11.4, 12.2**

- [ ]* 15.6 Write property test for optional field handling
  - **Property 19: Optional field handling**
  - **Validates: Requirements 12.3**

- [ ]* 15.7 Write property test for incomplete data resilience
  - **Property 20: Incomplete data resilience**
  - **Validates: Requirements 12.4, 22.5**

- [ ] 16. Update branding and messaging
- [ ] 16.1 Replace "AI-Powered" with "Knowledge-Powered"
  - Update hero section badge text
  - Update any references to AI in UI
  - _Requirements: Design document branding_

- [ ] 16.2 Add "What Makes AWS Blueprint Stand Out" section
  - Add section to about modal or landing page
  - Include 5 bullet points:
    - Instant clarity — understands the project goal and gives the right AWS services in seconds
    - Fear-free learning — no billing, no confusion, no AWS account required
    - Visual-first — diagrams auto-generated, real AWS icons, beginner-friendly learning
    - Static-only (no backend) — easy deployment, reliable, cost-free
    - Perfect scope fit — one input → one clear recommendation
  - _Requirements: Design document branding_

- [ ] 17. Performance optimization and validation
- [ ] 17.1 Verify initial load time <2 seconds
  - Test on standard broadband connection
  - Optimize if needed
  - _Requirements: 4.1, 25.1_

- [ ] 17.2 Verify async JSON loading doesn't block UI
  - Test UI responsiveness during JSON load
  - _Requirements: 25.2_

- [ ] 17.3 Minimize HTTP requests
  - Bundle CSS and JS files
  - Verify minimal request count
  - _Requirements: 25.4_

- [ ]* 17.4 Write property test for async JSON loading
  - **Property 56: Async JSON loading**
  - **Validates: Requirements 25.2**

- [ ] 18. Final validation and testing
- [ ] 18.1 Run all property-based tests
  - Execute all property tests with 100 iterations each
  - Fix any failures
  - _Requirements: All correctness properties_

- [ ]* 18.2 Run unit tests for core modules
  - Test search engine, calculator, workflow renderer
  - Test UI components
  - Test error handlers
  - _Requirements: Testing strategy_

- [ ] 18.3 Perform manual testing of all user flows
  - Test search → view service → calculator → estimate cost
  - Test trending topics → pattern → diagram
  - Test filtering and navigation
  - Test offline mode
  - Test responsive design on multiple devices
  - _Requirements: All requirements_

- [ ] 18.4 Verify all 30 requirements are met
  - Go through requirements document
  - Check each acceptance criterion
  - Document any gaps
  - _Requirements: All requirements_

- [ ] 19. Checkpoint - Ensure all tests pass
- Ensure all tests pass, ask the user if questions arise.
