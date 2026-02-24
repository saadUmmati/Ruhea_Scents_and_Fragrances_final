#!/usr/bin/env node

/**
 * Comprehensive Website Testing Script
 * Tests all routes and documents issues
 */

const routes = {
    public: [
        '/',
        '/shop',
        '/about',
        '/contact',
        '/quiz',
        '/cart',
        '/login',
        '/register',
        '/terms',
        '/privacy',
        '/shipping',
        '/faq',
        '/blog'
    ],
    account: [
        '/account/dashboard',
        '/account/orders',
        '/account/profile',
        '/account/settings',
        '/account/wishlist',
        '/account/addresses'
    ],
    admin: [
        '/admin',
        '/admin/products',
        '/admin/products/new',
        '/admin/orders',
        '/admin/users',
        '/admin/settings'
    ]
};

async function testRoute(url) {
    try {
        const response = await fetch(`http://localhost:3000${url}`);
        return {
            url,
            status: response.status,
            ok: response.ok,
            statusText: response.statusText
        };
    } catch (error) {
        return {
            url,
            status: 'ERROR',
            ok: false,
            error: error.message
        };
    }
}

async function runTests() {
    console.log('🧪 Starting Comprehensive Website Test...\n');

    const results = {
        public: [],
        account: [],
        admin: [],
        issues: []
    };

    // Test Public Routes
    console.log('📄 Testing Public Routes...');
    for (const route of routes.public) {
        const result = await testRoute(route);
        results.public.push(result);

        const icon = result.ok ? '✅' : '❌';
        console.log(`${icon} ${route} - ${result.status}`);

        if (!result.ok) {
            results.issues.push({
                route,
                type: 'public',
                status: result.status,
                error: result.error || result.statusText
            });
        }
    }

    // Test Account Routes (will be 401/403 if not logged in)
    console.log('\n👤 Testing Account Routes (expect 307 redirects if not logged in)...');
    for (const route of routes.account) {
        const result = await testRoute(route);
        results.account.push(result);

        const icon = result.status === 307 || result.ok ? '✅' : '❌';
        console.log(`${icon} ${route} - ${result.status}`);
    }

    // Test Admin Routes (will be 401/403 if not logged in as admin)
    console.log('\n🔐 Testing Admin Routes (expect 307 redirects if not admin)...');
    for (const route of routes.admin) {
        const result = await testRoute(route);
        results.admin.push(result);

        const icon = result.status === 307 || result.ok ? '✅' : '❌';
        console.log(`${icon} ${route} - ${result.status}`);
    }

    // Summary
    console.log('\n📊 Test Summary:');
    console.log(`Public Routes: ${results.public.filter(r => r.ok).length}/${results.public.length} passing`);
    console.log(`Account Routes: ${results.account.length} tested (auth required)`);
    console.log(`Admin Routes: ${results.admin.length} tested (admin auth required)`);

    if (results.issues.length > 0) {
        console.log(`\n❌ Found ${results.issues.length} issues:`);
        results.issues.forEach(issue => {
            console.log(`   - ${issue.route}: ${issue.status} - ${issue.error}`);
        });
    } else {
        console.log('\n✅ All public routes passing!');
    }

    return results;
}

runTests().catch(console.error);
