/**
 * Export Module - Handles diagram export to PNG
 */

const ExportModule = {
    /**
     * Export workflow diagram to PNG
     * @param {HTMLElement} diagramElement - The diagram container element
     * @param {string} patternId - Pattern ID for filename
     * @param {string} patternTitle - Pattern title to include in export
     */
    async exportToPNG(diagramElement, patternId, patternTitle) {
        if (!diagramElement) {
            console.error('No diagram element provided');
            return;
        }

        try {
            // Create a canvas from the diagram
            const canvas = await this.createCanvas(diagramElement, patternTitle);
            
            // Generate filename
            const filename = this.generateFilename(patternId);
            
            // Download the image
            this.downloadCanvas(canvas, filename);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export diagram. Please try again.');
        }
    },

    /**
     * Create a canvas from the diagram element
     * @param {HTMLElement} element - Element to capture
     * @param {string} title - Title to add to the canvas
     * @returns {HTMLCanvasElement} Canvas element
     */
    async createCanvas(element, title) {
        // Get element dimensions
        const rect = element.getBoundingClientRect();
        const padding = 40;
        const titleHeight = title ? 50 : 0;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = rect.width + (padding * 2);
        canvas.height = rect.height + (padding * 2) + titleHeight;
        
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add title if provided
        if (title) {
            ctx.fillStyle = '#232F3E';
            ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(title, canvas.width / 2, 35);
        }
        
        // Draw the diagram content
        await this.drawElementToCanvas(ctx, element, padding, padding + titleHeight);
        
        // Add watermark
        ctx.fillStyle = '#879596';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('AWS Beginner Blueprint - Educational Tool', canvas.width - 10, canvas.height - 10);
        
        return canvas;
    },

    /**
     * Draw element content to canvas (simplified version)
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {HTMLElement} element - Element to draw
     * @param {number} x - X offset
     * @param {number} y - Y offset
     */
    async drawElementToCanvas(ctx, element, x, y) {
        // Get all workflow nodes
        const nodes = element.querySelectorAll('.workflow-node');
        const arrows = element.querySelectorAll('.workflow-arrow');
        
        let currentX = x;
        const nodeWidth = 80;
        const nodeHeight = 80;
        const arrowWidth = 40;
        const centerY = y + 40;
        
        // Draw nodes and arrows
        nodes.forEach((node, index) => {
            // Draw node background
            ctx.fillStyle = '#F2F3F3';
            ctx.strokeStyle = '#D5DBDB';
            ctx.lineWidth = 1;
            
            const nodeX = currentX;
            const nodeY = centerY;
            
            // Draw rounded rectangle
            this.roundRect(ctx, nodeX, nodeY, nodeWidth, nodeHeight, 8);
            ctx.fill();
            ctx.stroke();
            
            // Draw icon placeholder (circle)
            ctx.fillStyle = '#232F3E';
            ctx.beginPath();
            ctx.arc(nodeX + nodeWidth/2, nodeY + 30, 20, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw label
            const label = node.querySelector('.workflow-node-label');
            if (label) {
                ctx.fillStyle = '#16191F';
                ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(
                    label.textContent.substring(0, 12), 
                    nodeX + nodeWidth/2, 
                    nodeY + nodeHeight - 10
                );
            }
            
            currentX += nodeWidth;
            
            // Draw arrow if not last node
            if (index < nodes.length - 1) {
                ctx.fillStyle = '#545B64';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('→', currentX + arrowWidth/2, centerY + 35);
                currentX += arrowWidth;
            }
        });
    },

    /**
     * Draw a rounded rectangle
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} radius - Corner radius
     */
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    /**
     * Generate filename for export
     * @param {string} patternId - Pattern ID
     * @returns {string} Filename
     */
    generateFilename(patternId) {
        const sanitizedId = (patternId || 'diagram')
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '-');
        return `${sanitizedId}-architecture.png`;
    },

    /**
     * Download canvas as PNG file
     * @param {HTMLCanvasElement} canvas - Canvas to download
     * @param {string} filename - Filename for download
     */
    downloadCanvas(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportModule;
}