// Debug smart suggestions
console.log('Debug script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, checking components...');
    
    // Check if elements exist
    const searchInput = document.getElementById('intent-input');
    console.log('Search input found:', !!searchInput);
    
    // Check if modules are loaded
    console.log('QuestionBank loaded:', typeof QuestionBank !== 'undefined');
    console.log('TrendingTopics loaded:', typeof TrendingTopics !== 'undefined');
    console.log('SmartSuggestions loaded:', typeof SmartSuggestions !== 'undefined');
    
    // Test search input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            console.log('Input event:', e.target.value);
        });
    }
    
    // Test QuestionBank
    if (typeof QuestionBank !== 'undefined') {
        const testResults = QuestionBank.search('deploy website');
        console.log('QuestionBank test results:', testResults);
    }
    
    // Test TrendingTopics
    if (typeof TrendingTopics !== 'undefined') {
        const testResults = TrendingTopics.search('mcp');
        console.log('TrendingTopics test results:', testResults);
    }
});