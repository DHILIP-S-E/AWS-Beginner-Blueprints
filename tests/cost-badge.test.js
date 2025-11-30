/**
 * Property 20: Cost Badge Assignment Test
 * Validates: Requirements 20.2, 20.3
 */

// Mock DOM for testing
if (typeof document === 'undefined') {
    global.document = {
        createElement: (tag) => ({
            className: '',
            textContent: '',
            title: ''
        })
    };
}

const BadgeComponents = require('../js/components/badges.js');

describe('Property 20: Cost Badge Assignment', () => {
    test('low cost badge shown for Low costLevel', () => {
        const badge = BadgeComponents.renderCostBadge('Low');
        expect(badge).not.toBeNull();
        expect(badge.textContent).toContain('Low Cost');
    });

    test('cost sensitive badge shown for High costLevel', () => {
        const badge = BadgeComponents.renderCostBadge('High');
        expect(badge).not.toBeNull();
        expect(badge.textContent).toContain('Cost Sensitive');
    });

    test('no badge for Medium costLevel', () => {
        const badge = BadgeComponents.renderCostBadge('Medium');
        expect(badge).toBeNull();
    });
});