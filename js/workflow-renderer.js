/**
 * Workflow Renderer Module - Renders visual architecture diagrams
 * Creates SVG-based workflow diagrams with AWS service icons and arrows
 */

const WorkflowRenderer = {
    iconBasePath: 'assets/icons/',
    
    /**
     * Render a workflow diagram in the specified container
     * @param {Object} diagram - Workflow diagram object with nodes and edges
     * @param {HTMLElement} container - Container element for the diagram
     * @param {Object} services - Map of service IDs to service objects
     */
    render(diagram, container, services = {}) {
        if (!diagram || !container) return;
        
        container.innerHTML = '';
        container.className = 'workflow-diagram';
        
        const nodes = diagram.nodes || [];
        const edges = diagram.edges || [];
        
        // Sort nodes by position
        const sortedNodes = [...nodes].sort((a, b) => a.position - b.position);
        
        // Create workflow container
        const workflowEl = document.createElement('div');
        workflowEl.className = 'workflow-flow';
        workflowEl.style.display = 'flex';
        workflowEl.style.alignItems = 'center';
        workflowEl.style.justifyContent = 'center';
        workflowEl.style.flexWrap = 'wrap';
        workflowEl.style.gap = '8px';
        
        sortedNodes.forEach((node, index) => {
            // Add node
            const nodeEl = this.drawNode(node, services[node.serviceId]);
            workflowEl.appendChild(nodeEl);
            
            // Add arrow if not last node
            if (index < sortedNodes.length - 1) {
                const arrowEl = this.drawArrow();
                workflowEl.appendChild(arrowEl);
            }
        });
        
        container.appendChild(workflowEl);
    },

    /**
     * Draw a single node element
     * @param {Object} node - Node object
     * @param {Object} service - Service object (optional)
     * @returns {HTMLElement} Node element
     */
    drawNode(node, service) {
        const nodeEl = document.createElement('div');
        nodeEl.className = 'workflow-node';
        nodeEl.dataset.nodeId = node.id;
        nodeEl.dataset.serviceId = node.serviceId;
        
        // Icon
        const iconEl = document.createElement('div');
        iconEl.className = 'workflow-node-icon-wrapper';
        
        if (node.serviceId === 'user') {
            // User/client icon
            iconEl.innerHTML = `
                <div class="workflow-node-icon-placeholder" style="background: #232F3E;">
                    👤
                </div>
            `;
        } else {
            const iconPath = this.getIconPath(node.serviceId);
            iconEl.innerHTML = `
                <img 
                    src="${iconPath}" 
                    alt="${node.label}" 
                    class="workflow-node-icon"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >
                <div class="workflow-node-icon-placeholder" style="display: none;">
                    ${this.getServiceEmoji(service?.category)}
                </div>
            `;
        }
        
        // Label
        const labelEl = document.createElement('div');
        labelEl.className = 'workflow-node-label';
        labelEl.textContent = node.label || service?.name || node.serviceId;
        
        nodeEl.appendChild(iconEl);
        nodeEl.appendChild(labelEl);
        
        return nodeEl;
    },

    /**
     * Draw an arrow element
     * @param {string} label - Optional arrow label
     * @returns {HTMLElement} Arrow element
     */
    drawArrow(label) {
        const arrowEl = document.createElement('div');
        arrowEl.className = 'workflow-arrow';
        arrowEl.innerHTML = '→';
        
        if (label) {
            const labelEl = document.createElement('span');
            labelEl.className = 'workflow-arrow-label';
            labelEl.textContent = label;
            arrowEl.appendChild(labelEl);
        }
        
        return arrowEl;
    },

    /**
     * Get the icon path for a service
     * @param {string} serviceId - Service ID
     * @returns {string} Icon file path
     */
    getIconPath(serviceId) {
        return `${this.iconBasePath}${serviceId}.svg`;
    },

    /**
     * Get emoji fallback for service category
     * @param {string} category - Service category
     * @returns {string} Emoji character
     */
    getServiceEmoji(category) {
        const emojiMap = {
            'Compute': '⚡',
            'Storage': '📦',
            'Database': '🗄️',
            'AI/ML': '🤖',
            'Analytics': '📊',
            'Security': '🔒',
            'Networking': '🌐',
            'DevOps': '🔧',
            'Migration': '🚚',
            'IoT': '📡',
            'Business Apps': '💼',
            'Contact Center': '📞',
            'Media Services': '🎬',
            'Blockchain': '⛓️',
            'Quantum': '⚛️'
        };
        return emojiMap[category] || '☁️';
    },

    /**
     * Validate that all edge references are valid node IDs
     * @param {Object} diagram - Workflow diagram
     * @returns {boolean} True if all edges are valid
     */
    validateEdges(diagram) {
        if (!diagram || !diagram.nodes || !diagram.edges) return false;
        
        const nodeIds = new Set(diagram.nodes.map(n => n.id));
        
        for (const edge of diagram.edges) {
            if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
                return false;
            }
        }
        return true;
    },

    /**
     * Check if nodes are in correct order (user first if present)
     * @param {Object[]} nodes - Array of nodes
     * @returns {boolean} True if order is correct
     */
    validateNodeOrder(nodes) {
        if (!nodes || nodes.length === 0) return true;
        
        const sorted = [...nodes].sort((a, b) => a.position - b.position);
        const userNode = sorted.find(n => n.serviceId === 'user');
        
        if (userNode && userNode.position !== 0) {
            return false;
        }
        return true;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkflowRenderer;
}