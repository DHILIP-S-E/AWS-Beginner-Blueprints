// Dynamic search input with auto-height
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('intent-input');
    if (!searchInput) return;
    
    // Convert input to textarea for multi-line support
    const textarea = document.createElement('textarea');
    textarea.id = 'intent-input';
    textarea.className = 'search-input dynamic-input';
    textarea.placeholder = 'Describe what you want to build...';
    textarea.setAttribute('aria-label', 'Describe what you want to build');
    textarea.rows = 1;
    
    // Replace input with textarea
    searchInput.parentNode.replaceChild(textarea, searchInput);
    
    // Auto-resize function
    function autoResize() {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = 120; // Max 4-5 lines
        textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
        
        // Add scrollbar if content exceeds max height
        if (scrollHeight > maxHeight) {
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.overflowY = 'hidden';
        }
    }
    
    // Event listeners
    textarea.addEventListener('input', autoResize);
    textarea.addEventListener('paste', () => setTimeout(autoResize, 10));
    
    // Handle Enter key (without Shift)
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const query = textarea.value.trim();
            if (query && window.handleIntentSearch) {
                window.handleIntentSearch(query);
            }
        }
    });
    
    // Initial resize
    autoResize();
});

// Add CSS for dynamic input
const style = document.createElement('style');
style.textContent = `
.dynamic-input {
    resize: none !important;
    transition: height 0.2s ease !important;
    min-height: 48px !important;
    max-height: 120px !important;
    line-height: 1.4 !important;
    font-family: inherit !important;
    overflow-y: hidden !important;
    word-wrap: break-word !important;
}

.dynamic-input:focus {
    outline: none !important;
    border-color: #FF9900 !important;
    box-shadow: 0 0 0 3px rgba(255, 153, 0, 0.1) !important;
}

.search-box {
    align-items: flex-start !important;
}

.search-icon {
    margin-top: 12px !important;
}

.search-btn {
    align-self: flex-start !important;
    margin-top: 8px !important;
}

.voice-btn {
    align-self: flex-start !important;
    margin-top: 8px !important;
}
`;
document.head.appendChild(style);