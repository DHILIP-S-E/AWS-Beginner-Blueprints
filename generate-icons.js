// Generate placeholder SVG icons for all AWS services
const fs = require('fs');
const path = require('path');

// Load knowledge base
const knowledgeBase = JSON.parse(fs.readFileSync('data/knowledge-base.json', 'utf8'));

// Color palette for different categories
const categoryColors = {
    'Compute': '#FF9900',
    'Storage': '#569A31', 
    'Database': '#3F48CC',
    'AI/ML': '#FF6B6B',
    'Analytics': '#4ECDC4',
    'Security': '#45B7D1',
    'Networking': '#8C4FFF',
    'DevOps': '#FFA726',
    'Migration': '#66BB6A',
    'IoT': '#AB47BC',
    'Business Apps': '#26A69A',
    'Contact Center': '#EF5350',
    'Media Services': '#FF7043',
    'Blockchain': '#5C6BC0',
    'Quantum': '#9C27B0'
};

// Generate SVG icon template
function generateIcon(serviceName, category, serviceId) {
    const color = categoryColors[category] || '#FF9900';
    const initials = serviceName.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
    
    return `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" rx="4" fill="${color}"/>
<text x="24" y="30" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${initials}</text>
</svg>`;
}

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'assets', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons for all services
knowledgeBase.services.forEach(service => {
    const iconPath = path.join(iconsDir, service.icon);
    
    // Only create if doesn't exist
    if (!fs.existsSync(iconPath)) {
        const svgContent = generateIcon(service.name, service.category, service.id);
        fs.writeFileSync(iconPath, svgContent);
        console.log(`Generated icon: ${service.icon}`);
    }
});

console.log('Icon generation complete!');