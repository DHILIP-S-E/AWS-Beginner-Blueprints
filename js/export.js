// Export functionality for workflow diagrams
class ExportModule {
    constructor() {
        this.canvas = null;
    }

    // Generate filename with pattern {pattern-id}-architecture.png
    generateFilename(patternId) {
        return `${patternId}-architecture.png`;
    }

    // Add title to export
    addTitleToExport(container, title) {
        const titleElement = document.createElement('div');
        titleElement.className = 'export-title';
        titleElement.textContent = title;
        titleElement.style.cssText = `
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            padding: 10px;
            background: white;
            color: #232f3e;
        `;
        container.insertBefore(titleElement, container.firstChild);
        return titleElement;
    }

    // Export workflow diagram to PNG
    async exportToPNG(workflowContainer, patternTitle, patternId) {
        try {
            // Add title for export
            const titleElement = this.addTitleToExport(workflowContainer, patternTitle);
            
            // Create canvas from HTML element
            const canvas = await html2canvas(workflowContainer, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true
            });

            // Remove title after capture
            titleElement.remove();

            // Create download link
            const link = document.createElement('a');
            link.download = this.generateFilename(patternId);
            link.href = canvas.toDataURL('image/png');
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        } catch (error) {
            console.error('Export failed:', error);
            return false;
        }
    }

    // Add export button to workflow diagram
    addExportButton(container, patternTitle, patternId) {
        const exportBtn = document.createElement('button');
        exportBtn.className = 'export-btn';
        exportBtn.innerHTML = '📥 Export PNG';
        exportBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            background: #ff9900;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        exportBtn.addEventListener('click', () => {
            this.exportToPNG(container, patternTitle, patternId);
        });

        container.style.position = 'relative';
        container.appendChild(exportBtn);
    }
}

// Global export instance
window.exportModule = new ExportModule();