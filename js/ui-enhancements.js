// UI/UX Enhancements for AWS Beginner Blueprint
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animations
    const addLoadingStates = () => {
        const buttons = document.querySelectorAll('button, .service-card, .trending-item');
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('loading')) {
                    this.classList.add('loading');
                    setTimeout(() => this.classList.remove('loading'), 1000);
                }
            });
        });
    };

    // Add smooth scroll to sections
    const addSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    };

    // Add search suggestions with autocomplete
    const addSearchSuggestions = () => {
        const searchInput = document.querySelector('#search-input, input[type="text"]');
        if (!searchInput) return;

        const suggestions = ['serverless API', 'static website', 'database', 'machine learning', 'storage', 'analytics'];
        const suggestionBox = document.createElement('div');
        suggestionBox.className = 'search-suggestions';
        searchInput.parentNode.appendChild(suggestionBox);

        searchInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            const matches = suggestions.filter(s => s.toLowerCase().includes(value));
            
            if (value && matches.length) {
                suggestionBox.innerHTML = matches.map(match => 
                    `<div class="suggestion-item" onclick="selectSuggestion('${match}')">${match}</div>`
                ).join('');
                suggestionBox.style.display = 'block';
            } else {
                suggestionBox.style.display = 'none';
            }
        });
    };

    // Add dark mode toggle
    const addDarkMode = () => {
        const toggle = document.createElement('button');
        toggle.innerHTML = '🌙';
        toggle.className = 'dark-mode-toggle';
        toggle.onclick = () => {
            document.body.classList.toggle('dark-mode');
            toggle.innerHTML = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        };
        
        // Restore saved preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            toggle.innerHTML = '☀️';
        }
        
        document.body.appendChild(toggle);
    };

    // Add floating action button for quick actions
    const addFloatingActions = () => {
        const fab = document.createElement('div');
        fab.className = 'floating-actions';
        fab.innerHTML = `
            <button class="fab-main" onclick="toggleFab()">⚡</button>
            <div class="fab-menu">
                <button onclick="scrollToTop()">⬆️</button>
                <button onclick="showQuickHelp()">❓</button>
                <button onclick="exportResults()">📤</button>
            </div>
        `;
        document.body.appendChild(fab);
    };

    // Add progress indicator for search results
    const addProgressIndicator = () => {
        const progress = document.createElement('div');
        progress.className = 'search-progress';
        progress.innerHTML = '<div class="progress-bar"></div>';
        document.body.appendChild(progress);
    };

    // Initialize all enhancements
    addLoadingStates();
    addSmoothScroll();
    addSearchSuggestions();
    addDarkMode();
    addFloatingActions();
    addProgressIndicator();
});

// Global functions for UI interactions
window.selectSuggestion = (suggestion) => {
    const searchInput = document.querySelector('#search-input, input[type="text"]');
    if (searchInput) {
        searchInput.value = suggestion;
        searchInput.dispatchEvent(new Event('input'));
        document.querySelector('.search-suggestions').style.display = 'none';
    }
};

window.toggleFab = () => {
    document.querySelector('.fab-menu').classList.toggle('active');
};

window.scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showQuickHelp = () => {
    const help = document.createElement('div');
    help.className = 'quick-help-modal';
    help.innerHTML = `
        <div class="help-content">
            <h3>Quick Help 🚀</h3>
            <p>• Type what you want to build in the search box</p>
            <p>• Click trending topics for quick ideas</p>
            <p>• Use 💰 buttons for cost estimates</p>
            <p>• Toggle 🌙 for dark mode</p>
            <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
        </div>
    `;
    document.body.appendChild(help);
    setTimeout(() => help.remove(), 5000);
};

window.exportResults = () => {
    const results = document.querySelectorAll('.service-card, .workflow-step');
    const data = Array.from(results).map(el => el.textContent.trim()).join('\n');
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aws-recommendations.txt';
    a.click();
    URL.revokeObjectURL(url);
};