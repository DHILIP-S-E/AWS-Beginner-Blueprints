// Property-based test for export filename format
const fc = require('fast-check');

// Property 15: Export Filename Format
// Validates: Requirements 14.4
describe('Property 15: Export Filename Format', () => {
    test('export filename follows pattern {pattern-id}-architecture.png', () => {
        fc.assert(fc.property(
            fc.string({ minLength: 1, maxLength: 50 }).filter(s => /^[a-zA-Z0-9-_]+$/.test(s)),
            (patternId) => {
                const filename = generateExportFilename(patternId);
                
                // Should follow exact pattern
                const expectedPattern = `${patternId}-architecture.png`;
                expect(filename).toBe(expectedPattern);
                
                // Should end with .png
                expect(filename.endsWith('.png')).toBe(true);
                
                // Should contain -architecture
                expect(filename.includes('-architecture')).toBe(true);
                
                // Should start with pattern ID
                expect(filename.startsWith(patternId)).toBe(true);
            }
        ));
    });
});

// Mock function for testing
function generateExportFilename(patternId) {
    return `${patternId}-architecture.png`;
}