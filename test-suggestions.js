#!/usr/bin/env node

/**
 * Test script for proactive suggestions feature
 * Tests 5 different queries to verify suggestion relevance
 */

const testQueries = [
  {
    query: "Show me a backend project",
    expectedContext: "backend",
    description: "Should suggest frontend or full-stack projects after showing backend"
  },
  {
    query: "What's Humza's best DevOps project?",
    expectedContext: "devops",
    description: "Should suggest other DevOps or infrastructure projects"
  },
  {
    query: "Show me a React app",
    expectedContext: "react",
    description: "Should suggest other frontend or full-stack projects"
  },
  {
    query: "What AI projects does Humza have?",
    expectedContext: "ai",
    description: "Should suggest other AI or portfolio projects"
  },
  {
    query: "Show me something with CI/CD",
    expectedContext: "cicd",
    description: "Should suggest other DevOps or automation projects"
  }
];

async function testSuggestionRelevance() {
  console.log('🧪 Testing Proactive Suggestions Relevance\n');
  
  let totalTests = 0;
  let relevantSuggestions = 0;
  
  for (const testCase of testQueries) {
    console.log(`📝 Test: ${testCase.query}`);
    console.log(`   Expected context: ${testCase.expectedContext}`);
    console.log(`   Description: ${testCase.description}`);
    
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: testCase.query }],
          sessionId: `test-${Date.now()}`,
          ctaClicked: null
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.suggestions && data.suggestions.length > 0) {
        console.log(`   ✅ Got ${data.suggestions.length} suggestions:`);
        
        data.suggestions.forEach((suggestion, index) => {
          console.log(`      ${index + 1}. ${suggestion}`);
          
          // Check if suggestion contains expected context or related terms
          const suggestionText = suggestion.toLowerCase();
          const isRelevant = checkRelevance(suggestionText, testCase.expectedContext);
          
          if (isRelevant) {
            relevantSuggestions++;
            console.log(`         ✅ Relevant`);
          } else {
            console.log(`         ❌ Not relevant`);
          }
        });
        
        totalTests += data.suggestions.length;
      } else {
        console.log(`   ⚠️  No suggestions returned`);
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Calculate relevance percentage
  const relevancePercentage = totalTests > 0 ? (relevantSuggestions / totalTests) * 100 : 0;
  
  console.log('📊 Test Results:');
  console.log(`   Total suggestions tested: ${totalTests}`);
  console.log(`   Relevant suggestions: ${relevantSuggestions}`);
  console.log(`   Relevance percentage: ${relevancePercentage.toFixed(1)}%`);
  
  if (relevancePercentage >= 90) {
    console.log('   ✅ PASS: Relevance meets ≥90% requirement');
  } else {
    console.log('   ❌ FAIL: Relevance below 90% requirement');
  }
  
  return relevancePercentage >= 90;
}

function checkRelevance(suggestionText, expectedContext) {
  // Define related terms for each context
  const contextMap = {
    backend: ['backend', 'api', 'server', 'database', 'postgresql', 'supabase', 'node', 'express'],
    frontend: ['frontend', 'react', 'next', 'ui', 'interface', 'website', 'portfolio'],
    devops: ['devops', 'ci/cd', 'pipeline', 'docker', 'kubernetes', 'eks', 'terraform', 'gitops', 'automation'],
    react: ['react', 'frontend', 'ui', 'component', 'next', 'website'],
    ai: ['ai', 'artificial intelligence', 'openai', 'gpt', 'rag', 'assistant', 'portfolio'],
    cicd: ['ci/cd', 'pipeline', 'devops', 'automation', 'deployment', 'github', 'actions']
  };
  
  const relatedTerms = contextMap[expectedContext] || [expectedContext];
  
  // Check if suggestion contains any related terms
  return relatedTerms.some(term => suggestionText.includes(term));
}

// Run the test
if (require.main === module) {
  testSuggestionRelevance()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testSuggestionRelevance, checkRelevance };
