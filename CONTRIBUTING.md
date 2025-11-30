# Contributing to AWS Blueprint

Thank you for your interest in contributing to AWS Blueprint! This document provides guidelines and information for contributors.

## 📋 Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Issue Guidelines](#issue-guidelines)
7. [Coding Standards](#coding-standards)
8. [Testing Guidelines](#testing-guidelines)
9. [Documentation](#documentation)
10. [Community](#community)

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ (for development tools)
- **Git** for version control
- **Modern web browser** (Chrome 90+, Firefox 88+, Safari 14+)
- **Text editor** (VS Code recommended)

### First Contribution

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/aws-blueprint.git
   cd aws-blueprint
   ```
3. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit a pull request**

### Good First Issues

Look for issues labeled with:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community help needed
- `documentation` - Documentation improvements
- `bug` - Bug fixes

## 💻 Development Setup

### Local Environment

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/aws-blueprint.git
cd aws-blueprint

# 2. Install dependencies
npm install

# 3. Start development server
python -m http.server 8000
# or
npx http-server -p 8000

# 4. Open in browser
open http://localhost:8000
```

### Development Tools

#### Recommended VS Code Extensions
- **Live Server** - For local development
- **Prettier** - Code formatting
- **ESLint** - JavaScript linting
- **JSON Tools** - JSON validation and formatting
- **SVG Viewer** - View SVG icons

#### Browser Developer Tools
- **Chrome DevTools** - Primary debugging
- **Firefox Developer Tools** - Cross-browser testing
- **Lighthouse** - Performance auditing

### Project Structure Understanding

```
aws-blueprint/
├── index.html              # Main entry point
├── css/                    # Stylesheets (modular)
├── js/                     # JavaScript modules
│   ├── app.js             # Main application logic
│   ├── search.js          # Search functionality
│   └── components/        # UI components
├── data/                   # Static data
│   └── knowledge-base.json # AWS services database
├── assets/                 # Static assets
│   └── icons/             # AWS service icons
└── tests/                  # Test files
```

## 📝 Contributing Guidelines

### Types of Contributions

#### 🐛 Bug Fixes
- Fix broken functionality
- Resolve performance issues
- Correct documentation errors
- Improve accessibility

#### ✨ New Features
- Add new AWS services
- Create new architecture patterns
- Implement UI improvements
- Add new search capabilities

#### 📚 Documentation
- Improve existing documentation
- Add code comments
- Create tutorials and guides
- Update API documentation

#### 🎨 Design Improvements
- Enhance user interface
- Improve user experience
- Add animations and interactions
- Optimize for mobile devices

### Contribution Areas

#### High Priority
1. **AWS Services Database**
   - Add missing AWS services
   - Update service information
   - Add new service categories
   - Improve service descriptions

2. **Search Algorithm**
   - Enhance intent matching
   - Improve keyword recognition
   - Add fuzzy search capabilities
   - Optimize performance

3. **Architecture Patterns**
   - Add new solution patterns
   - Create workflow diagrams
   - Add cost information
   - Include security best practices

#### Medium Priority
1. **User Interface**
   - Mobile responsiveness
   - Accessibility improvements
   - Dark mode theme
   - Animation enhancements

2. **Features**
   - Export functionality
   - Service comparison
   - Advanced filtering
   - Voice search improvements

#### Low Priority
1. **Integrations**
   - AWS API integration
   - Real-time pricing
   - User accounts
   - Analytics integration

### Before You Start

1. **Check existing issues** to avoid duplication
2. **Discuss major changes** in an issue first
3. **Follow coding standards** outlined below
4. **Write tests** for new functionality
5. **Update documentation** as needed

## 🔄 Pull Request Process

### 1. Preparation

```bash
# Ensure your fork is up to date
git remote add upstream https://github.com/original/aws-blueprint.git
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Making Changes

```bash
# Make your changes
# Test thoroughly
npm test

# Commit with descriptive messages
git add .
git commit -m "feat: add new AWS service integration"
```

### 3. Pull Request Submission

#### PR Title Format
```
type(scope): brief description

Examples:
feat(search): add fuzzy matching algorithm
fix(ui): resolve mobile layout issues
docs(api): update search module documentation
test(search): add unit tests for intent matching
```

#### PR Description Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tests pass locally (`npm test`)
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Mobile testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### 4. Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on multiple browsers
4. **Documentation** review if applicable
5. **Approval** and merge

### 5. After Merge

```bash
# Clean up your branch
git checkout main
git pull upstream main
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 94]
- Version: [e.g. 1.0.0]

**Additional Context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 📏 Coding Standards

### JavaScript Style Guide

#### General Principles
- Use modern JavaScript (ES6+)
- Prefer `const` and `let` over `var`
- Use descriptive variable and function names
- Keep functions small and focused
- Add comments for complex logic

#### Code Examples

```javascript
// ✅ Good
const searchResults = services.filter(service => 
  service.tags.some(tag => tag.includes(keyword))
);

const handlePatternSelection = (pattern) => {
  if (!pattern) {
    console.warn('No pattern provided');
    return;
  }
  
  updateRecommendationPanel(pattern);
  renderWorkflowDiagram(pattern.workflowDiagram);
};

// ❌ Bad
var results = services.filter(function(s) {
  return s.tags.filter(function(t) {
    return t.indexOf(keyword) > -1;
  }).length > 0;
});

function handle(p) {
  updateRecommendationPanel(p);
  renderWorkflowDiagram(p.workflowDiagram);
}
```

#### Function Documentation

```javascript
/**
 * Searches for AWS services based on natural language intent
 * @param {string} query - User's natural language query
 * @param {Object} options - Search options
 * @param {boolean} options.fuzzy - Enable fuzzy matching
 * @param {number} options.limit - Maximum results to return
 * @returns {Object} Search result with pattern and services
 * @example
 * const result = searchByIntent("serverless API", { fuzzy: true, limit: 10 });
 */
function searchByIntent(query, options = {}) {
  // Implementation
}
```

### CSS Style Guide

#### Naming Convention (BEM)
```css
/* Block */
.search-box {
  display: flex;
  align-items: center;
}

/* Element */
.search-box__input {
  flex: 1;
  padding: var(--space-3);
}

/* Modifier */
.search-box--focused {
  border-color: var(--primary-color);
}
```

#### CSS Custom Properties
```css
:root {
  /* Colors */
  --primary-color: #FF9900;
  --secondary-color: #232F3E;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
}
```

#### Responsive Design
```css
/* Mobile first approach */
.service-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

/* Tablet */
@media (min-width: 768px) {
  .service-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .service-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### HTML Guidelines

#### Semantic HTML
```html
<!-- ✅ Good -->
<main class="main-content">
  <section class="hero-section">
    <h1 class="hero-title">AWS Blueprint</h1>
    <p class="hero-description">Intelligent cloud architecture</p>
  </section>
  
  <section class="search-section">
    <form class="search-form" role="search">
      <label for="search-input" class="sr-only">Search AWS services</label>
      <input 
        id="search-input" 
        type="search" 
        placeholder="Describe what you want to build..."
        aria-label="Search AWS services"
      >
    </form>
  </section>
</main>

<!-- ❌ Bad -->
<div class="content">
  <div class="hero">
    <div class="title">AWS Blueprint</div>
    <div class="desc">Intelligent cloud architecture</div>
  </div>
  
  <div class="search">
    <input type="text" placeholder="Search...">
  </div>
</div>
```

#### Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Maintain proper heading hierarchy

### JSON Data Guidelines

#### Knowledge Base Structure
```json
{
  "services": [
    {
      "id": "service-id",
      "name": "Service Name",
      "icon": "service-icon.svg",
      "category": "Category",
      "tags": ["tag1", "tag2"],
      "intentKeywords": ["keyword1", "keyword2"],
      "shortDescription": "Brief description",
      "documentation": "Detailed description",
      "billingModel": "How it charges",
      "costHint": "Approximate cost",
      "hasFreeTier": true,
      "relatedServiceIds": ["related-service"]
    }
  ]
}
```

#### Validation
- Use JSON validators
- Follow consistent naming conventions
- Include all required fields
- Validate data types

## 🧪 Testing Guidelines

### Test Structure

```javascript
// tests/search.test.js
describe('Search Module', () => {
  beforeEach(() => {
    // Setup test data
    SearchModule.init(mockKnowledgeBase);
  });

  describe('searchByIntent', () => {
    test('should find serverless API pattern', () => {
      const result = SearchModule.searchByIntent('serverless API');
      
      expect(result.pattern).toBeDefined();
      expect(result.pattern.id).toBe('serverless-api');
      expect(result.score).toBeGreaterThan(0.8);
    });

    test('should handle empty query', () => {
      const result = SearchModule.searchByIntent('');
      
      expect(result.noMatch).toBe(true);
      expect(result.score).toBe(0);
    });
  });
});
```

### Property-Based Testing

```javascript
const fc = require('fast-check');

describe('Search Properties', () => {
  test('search always returns valid results', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 100 }),
      (query) => {
        const result = SearchModule.searchByIntent(query);
        
        expect(result).toHaveProperty('score');
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(1);
        
        if (result.pattern) {
          expect(result.pattern).toHaveProperty('id');
          expect(result.pattern).toHaveProperty('label');
        }
      }
    ));
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- search.test.js

# Run tests with coverage
npm test -- --coverage
```

### Test Coverage

Aim for:
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 📚 Documentation

### Code Comments

```javascript
// ✅ Good comments
/**
 * Extracts features from user query for architecture generation
 * Uses regex patterns to identify common architectural needs
 */
function extractFeatures(query) {
  const lower = query.toLowerCase();
  
  return {
    // Check for authentication requirements
    needsAuth: /user|login|auth|account/.test(lower),
    
    // Detect API/backend needs
    needsAPI: /api|backend|server|endpoint/.test(lower),
    
    // Identify database requirements
    needsDatabase: /data|store|save|database/.test(lower)
  };
}

// ❌ Bad comments
// This function does stuff
function doStuff(x) {
  // Loop through array
  for (let i = 0; i < x.length; i++) {
    // Do something
    console.log(x[i]);
  }
}
```

### README Updates

When adding new features:
1. Update feature list
2. Add usage examples
3. Update installation instructions if needed
4. Add troubleshooting information

### API Documentation

Update `API_REFERENCE.md` when:
- Adding new public methods
- Changing method signatures
- Adding new data structures
- Modifying return values

## 🌟 Recognition

### Contributors

All contributors will be recognized in:
- `CONTRIBUTORS.md` file
- GitHub contributors page
- Release notes for significant contributions

### Contribution Types

We recognize various types of contributions:
- 💻 Code
- 📖 Documentation
- 🎨 Design
- 🐛 Bug reports
- 💡 Ideas
- 🤔 Answering questions
- ⚠️ Tests
- 🔧 Tools
- 🌍 Translation

## 💬 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General discussions and questions
- **Pull Requests** - Code review and collaboration

### Getting Help

1. **Check documentation** first
2. **Search existing issues** for similar problems
3. **Create a new issue** with detailed information
4. **Be patient and respectful** in all interactions

### Community Guidelines

- Be welcoming to newcomers
- Help others learn and grow
- Share knowledge and experiences
- Provide constructive feedback
- Celebrate successes together

## 📄 License

By contributing to AWS Blueprint, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You

Thank you for contributing to AWS Blueprint! Your efforts help make cloud architecture more accessible to everyone.

**Happy Contributing! 🚀**