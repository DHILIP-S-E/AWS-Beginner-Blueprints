/**
 * Comparison Module - Handles stack comparison functionality
 */

const ComparisonModule = {
    /**
     * Check if a pattern has an alternative stack for comparison
     * @param {Object} pattern - Solution pattern
     * @returns {Object|null} Comparison data or null
     */
    getComparison(pattern) {
        if (!pattern || !pattern.alternativeStack) {
            return null;
        }

        return {
            primary: {
                label: pattern.label,
                services: pattern.stack,
                costLevel: pattern.costLevel,
                scalingModel: 'Auto (Serverless)',
                managementOverhead: 'Low - Fully managed',
                complexity: pattern.difficultyLevel
            },
            alternative: pattern.alternativeStack,
            dimensions: [
                { name: 'Cost Level', key: 'costLevel' },
                { name: 'Scaling Model', key: 'scalingModel' },
                { name: 'Management Overhead', key: 'managementOverhead' },
                { name: 'Complexity', key: 'complexity' }
            ]
        };
    },

    /**
     * Generate comparison table HTML
     * @param {Object} primary - Primary stack info
     * @param {Object} alternative - Alternative stack info
     * @param {Object[]} dimensions - Comparison dimensions
     * @returns {HTMLElement} Table element
     */
    generateComparisonTable(primary, alternative, dimensions) {
        const table = document.createElement('table');
        table.className = 'comparison-table-inner';

        // Header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        const thDimension = document.createElement('th');
        thDimension.textContent = 'Dimension';
        headerRow.appendChild(thDimension);

        const thPrimary = document.createElement('th');
        thPrimary.innerHTML = `${primary.label} <span class="recommended-badge">Recommended</span>`;
        thPrimary.className = 'recommended';
        headerRow.appendChild(thPrimary);

        const thAlternative = document.createElement('th');
        thAlternative.textContent = alternative.label;
        headerRow.appendChild(thAlternative);

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body rows
        const tbody = document.createElement('tbody');

        // Services row
        const servicesRow = document.createElement('tr');
        servicesRow.innerHTML = `
            <td><strong>Services</strong></td>
            <td class="recommended">${primary.services.join(' → ')}</td>
            <td>${alternative.services.join(' → ')}</td>
        `;
        tbody.appendChild(servicesRow);

        // Dimension rows
        dimensions.forEach(dim => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${dim.name}</strong></td>
                <td class="recommended">${primary[dim.key] || '-'}</td>
                <td>${alternative[dim.key] || '-'}</td>
            `;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    },

    /**
     * Render comparison section
     * @param {Object} pattern - Solution pattern
     * @param {HTMLElement} container - Container element
     */
    renderComparison(pattern, container) {
        const comparison = this.getComparison(pattern);
        
        if (!comparison) {
            container.innerHTML = '<p>No alternative stack available for comparison.</p>';
            return;
        }

        container.innerHTML = '';
        
        const table = this.generateComparisonTable(
            comparison.primary,
            comparison.alternative,
            comparison.dimensions
        );
        
        container.appendChild(table);

        // Add summary
        const summary = document.createElement('div');
        summary.className = 'comparison-summary';
        summary.innerHTML = `
            <p><strong>💡 Recommendation:</strong> The ${comparison.primary.label} approach is recommended for this use case 
            due to lower management overhead and automatic scaling. Consider the alternative if you need 
            more control over infrastructure or have specific compliance requirements.</p>
        `;
        container.appendChild(summary);
    },

    /**
     * Check if comparison is available for a pattern
     * @param {Object} pattern - Solution pattern
     * @returns {boolean} True if comparison available
     */
    hasComparison(pattern) {
        return pattern && pattern.alternativeStack !== undefined;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComparisonModule;
}