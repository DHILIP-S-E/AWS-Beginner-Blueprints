# AWS Beginner Blueprint

An intelligent cloud service selector that helps beginners choose the right AWS services for their projects.

## Features

- 🔍 Intent-based search - describe what you want to build
- 📊 Visual architecture workflows
- 💰 Cost guidance with free tier information
- 🔒 Security best practices
- 📚 Learning resources
- 🗂️ Browse 50+ AWS services by category
- 🔥 Trending cloud solution patterns

## How to Run

### Option 1: Using a Local Web Server (Recommended)

Since the project loads JSON data, you need to run it through a web server:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js (if you have it installed):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Project Structure

```
├── index.html              # Main HTML file
├── css/
│   ├── styles.css         # Main styles
│   ├── components.css     # Component styles
│   └── responsive.css     # Responsive design
├── js/
│   ├── app.js            # Main application logic
│   ├── matching.js       # Keyword matching algorithm
│   ├── search.js         # Search functionality
│   ├── workflow-renderer.js
│   ├── export.js
│   ├── comparison.js
│   └── components/       # UI components
├── data/
│   └── knowledge-base.json  # AWS services and patterns data
├── assets/
│   └── icons/           # AWS service icons
└── tests/
    └── properties.test.js  # Property-based tests
```

## How to Use

1. **Search by Intent**: Type what you want to build (e.g., "serverless API", "static website", "image processing")
2. **Browse Trending Topics**: Click on pre-defined use cases
3. **Explore Services**: Scroll down to browse all AWS services by category
4. **View Recommendations**: Get matched solution patterns with architecture diagrams
5. **Learn More**: Access cost guidance, security notes, and learning resources

## Example Searches

- "serverless web application"
- "REST API with database"
- "static website hosting"
- "image processing with AI"
- "real-time notifications"
- "data analytics pipeline"

## Technologies Used

- Pure HTML, CSS, and JavaScript (no frameworks)
- Static JSON knowledge base
- Property-based testing with fast-check
- Responsive design for mobile and desktop

## Educational Purpose

This tool was created for the Kairo AI for Bharat Challenge. It uses static educational data and is not connected to real AWS services or pricing. Always check official AWS documentation for production use.



