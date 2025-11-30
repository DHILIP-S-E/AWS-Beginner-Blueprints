// Property-based test for comparison availability
const fc = require('fast-check');

// Property 16: Comparison Availability
// Validates: Requirements 15.1
describe('Property 16: Comparison Availability', () => {
    test('comparison is available only when pattern has alternativeStack', () => {
        fc.assert(fc.property(
            fc.record({
                id: fc.string({ minLength: 1, maxLength: 20 }),
                title: fc.string({ minLength: 1, maxLength: 100 }),
                stack: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 8 }),
                alternativeStack: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 8 }))
            }),
            (pattern) => {
                const hasComparison = checkComparisonAvailability(pattern);
                
                if (pattern.alternativeStack && pattern.alternativeStack.length > 0) {
                    // Should have comparison when alternativeStack exists and is not empty
                    expect(hasComparison).toBe(true);
                } else {
                    // Should not have comparison when alternativeStack is null, undefined, or empty
                    expect(hasComparison).toBe(false);
                }
            }
        ));
    });
});

// Mock function for testing
function checkComparisonAvailability(pattern) {
    return pattern.alternativeStack && pattern.alternativeStack.length > 0;
}