// Icon System Initialization
// Professional icon management using Lucide Icons

const IconSystem = {
  // Icon registry mapping semantic names to Lucide icon names
  registry: {
    // Navigation & UI
    'search': 'Search',
    'menu': 'Menu',
    'close': 'X',
    'chevron-right': 'ChevronRight',
    'chevron-down': 'ChevronDown',
    'arrow-right': 'ArrowRight',
    'external-link': 'ExternalLink',
    
    // AWS & Cloud
    'cloud': 'Cloud',
    'server': 'Server',
    'database': 'Database',
    'storage': 'HardDrive',
    'compute': 'Cpu',
    'network': 'Network',
    'security': 'Shield',
    'analytics': 'BarChart3',
    
    // Actions
    'download': 'Download',
    'upload': 'Upload',
    'copy': 'Copy',
    'check': 'Check',
    'info': 'Info',
    'alert': 'AlertCircle',
    'warning': 'AlertTriangle',
    'help': 'HelpCircle',
    
    // Content
    'trending': 'TrendingUp',
    'fire': 'Flame',
    'star': 'Star',
    'bookmark': 'Bookmark',
    'tag': 'Tag',
    
    // Cost & Pricing
    'dollar': 'DollarSign',
    'calculator': 'Calculator',
    'chart': 'PieChart',
    
    // Learning
    'book': 'BookOpen',
    'video': 'Video',
    'file': 'FileText',
    'link': 'Link',
    
    // Status
    'success': 'CheckCircle',
    'error': 'XCircle',
    'pending': 'Clock',
    
    // Workflow
    'workflow': 'GitBranch',
    'compare': 'GitCompare',
    'layers': 'Layers',
    
    // Map & Location
    'map': 'Map',
    'globe': 'Globe',
    'pin': 'MapPin',
    
    // Complexity
    'beginner': 'Smile',
    'intermediate': 'Meh',
    'advanced': 'Frown',
    
    // Prerequisites
    'checklist': 'ListChecks',
    'requirements': 'ClipboardList'
  },
  
  // Initialize all icons on page
  init() {
    if (typeof lucide === 'undefined') {
      console.error('Lucide Icons library not loaded');
      return;
    }
    
    // Create icons from data attributes
    lucide.createIcons();
    
    console.log('Icon system initialized');
  },
  
  // Create an icon element
  create(iconName, options = {}) {
    const {
      size = 20,
      color = 'currentColor',
      strokeWidth = 2,
      className = ''
    } = options;
    
    const lucideIconName = this.registry[iconName] || iconName;
    
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', lucideIconName);
    icon.setAttribute('data-lucide-size', size);
    icon.setAttribute('data-lucide-color', color);
    icon.setAttribute('data-lucide-stroke-width', strokeWidth);
    if (className) {
      icon.className = className;
    }
    
    return icon;
  },
  
  // Replace emoji with icon
  replaceEmoji(element, iconName, options = {}) {
    const icon = this.create(iconName, options);
    element.innerHTML = '';
    element.appendChild(icon);
    lucide.createIcons({ nameAttr: 'data-lucide' });
  },
  
  // Get icon HTML string
  getIconHTML(iconName, options = {}) {
    const icon = this.create(iconName, options);
    lucide.createIcons({ nameAttr: 'data-lucide' });
    return icon.outerHTML;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => IconSystem.init());
} else {
  IconSystem.init();
}

// Export for use in other modules
window.IconSystem = IconSystem;
