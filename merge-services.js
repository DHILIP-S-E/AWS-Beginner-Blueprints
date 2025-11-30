// Script to merge additional services into knowledge base
const fs = require('fs');

// Read the main knowledge base
const knowledgeBase = JSON.parse(fs.readFileSync('data/knowledge-base.json', 'utf8'));

// Read all additional services
const additionalServices = JSON.parse(fs.readFileSync('data/additional-services.json', 'utf8'));
const extendedServices = JSON.parse(fs.readFileSync('data/extended-services.json', 'utf8'));
const moreServices = JSON.parse(fs.readFileSync('data/more-services.json', 'utf8'));
const finalServices = JSON.parse(fs.readFileSync('data/final-services.json', 'utf8'));

// Add all additional services to the main knowledge base
knowledgeBase.services.push(...additionalServices, ...extendedServices, ...moreServices, ...finalServices);

// Update version
knowledgeBase.version = "1.1.0";

// Write back to knowledge base
fs.writeFileSync('data/knowledge-base.json', JSON.stringify(knowledgeBase, null, 2));

console.log(`✅ Merged ${additionalServices.length} additional services`);
console.log(`📊 Total services: ${knowledgeBase.services.length}`);
console.log(`🎯 Target: 200+ services`);

if (knowledgeBase.services.length >= 200) {
    console.log('🎉 Target achieved!');
} else {
    console.log(`📈 Need ${200 - knowledgeBase.services.length} more services to reach 200+`);
}