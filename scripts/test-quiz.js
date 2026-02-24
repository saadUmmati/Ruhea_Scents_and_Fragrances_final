const fetch = require('node-fetch');

async function testQuiz() {
    try {
        const response = await fetch('http://localhost:3000/api/quiz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answers: {
                    gender: 'men',
                    fragranceFamily: ['woody', 'spicy'],
                    intensity: 'moderate', // EDP
                    budget: '10000-20000'
                }
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Quiz Submission Successful!');
            console.log('Match Summary:', data.matchSummary);
            console.log('Fallback Mode:', data.isFallback);
            console.log('\nRecommended Products:');
            data.recommendations.forEach((rec, i) => {
                console.log(`${i + 1}. ${rec.product.name} (${rec.matchScore}% Match)`);
                console.log(`   Reasons: ${rec.matchReasons.join(', ')}`);
            });
        } else {
            console.log('❌ Quiz Submission Failed:', data);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

testQuiz();
