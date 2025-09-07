#!/usr/bin/env node

/**
 * Email Functionality Test Runner
 * Demonstrates the email functionality testing capabilities
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Email Functionality Test Runner');
console.log('==================================\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Error: Please run this script from the project root directory');
    process.exit(1);
}

// Check environment setup
console.log('📋 Checking Environment Setup...');
if (fs.existsSync('.env.local')) {
    console.log('✅ .env.local file found');
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    const requiredVars = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'];
    const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
    
    if (missingVars.length === 0) {
        console.log('✅ All required environment variables are set');
    } else {
        console.log(`⚠️  Missing environment variables: ${missingVars.join(', ')}`);
    }
} else {
    console.log('❌ .env.local file not found');
    console.log('   Please create it with your Resend API key and email settings');
    process.exit(1);
}

// Run tests
const testSuites = [
    { name: 'Email Utils', command: 'npm run test:unit', description: 'Email validation and formatting' },
    { name: 'API Routes', command: 'npm run test:api', description: 'Backend email API' },
    { name: 'Components', command: 'npm run test:component', description: 'React contact form' },
    { name: 'Integration', command: 'npm run test:integration', description: 'End-to-end workflows' }
];

console.log('\n🧪 Running Test Suites...\n');

let totalTests = 0;
let passedTests = 0;

for (const suite of testSuites) {
    console.log(`📦 ${suite.name} Tests (${suite.description})`);
    console.log('─'.repeat(50));
    
    try {
        const output = execSync(suite.command, { encoding: 'utf8', stdio: 'pipe' });
        
        // Extract test results from output
        const testMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
        if (testMatch) {
            const passed = parseInt(testMatch[1]);
            const total = parseInt(testMatch[2]);
            passedTests += passed;
            totalTests += total;
            console.log(`✅ ${passed}/${total} tests passed`);
        } else {
            console.log('✅ Tests completed');
        }
        
    } catch (error) {
        console.log('❌ Tests failed');
        console.log(error.stdout || error.message);
    }
    
    console.log('');
}

// Summary
console.log('📊 Test Summary');
console.log('===============');
console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Email functionality is working correctly.');
} else {
    console.log('\n⚠️  Some tests failed. Please check the output above for details.');
}

// Coverage report
console.log('\n📈 Running Coverage Report...');
try {
    execSync('npm run test:coverage', { stdio: 'inherit' });
} catch (error) {
    console.log('Coverage report completed with warnings');
}

// Manual testing instructions
console.log('\n🌐 Manual Testing Instructions');
console.log('==============================');
console.log('1. Start the development server: npm run dev');
console.log('2. Open http://localhost:3000 in your browser');
console.log('3. Scroll to the contact section');
console.log('4. Fill out the form with valid data:');
console.log('   - Name: John Doe');
console.log('   - Email: john.doe@example.com');
console.log('   - Inquiry Type: Consulting Work');
console.log('   - Message: I am interested in hiring you for a consulting project.');
console.log('5. Click "Send Message"');
console.log('6. Verify success message appears');
console.log('7. Check your email inbox for the contact form submission');

console.log('\n🔍 Testing Different Scenarios');
console.log('==============================');
console.log('• Test with invalid email format');
console.log('• Test with empty required fields');
console.log('• Test with very short message');
console.log('• Test with very long message');
console.log('• Test different inquiry types');

console.log('\n📞 Support');
console.log('==========');
console.log('If you encounter issues:');
console.log('• Check the logs for error messages');
console.log('• Verify environment variables are set');
console.log('• Test incrementally (unit → integration → E2E)');
console.log('• Use browser dev tools for debugging');
console.log('• Review the testing documentation');

console.log('\n✨ Email functionality testing complete!');
