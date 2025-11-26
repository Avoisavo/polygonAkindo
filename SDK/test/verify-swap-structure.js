const { X402Client } = require('../src/client');

try {
    console.log('Testing X402Client import...');
    const client = new X402Client('0x0123456789012345678901234567890123456789012345678901234567890123', '0x0000000000000000000000000000000000000000');

    if (typeof client.swap === 'function') {
        console.log('✅ swap method exists');
    } else {
        console.error('❌ swap method missing');
        process.exit(1);
    }

    console.log('✅ X402Client instantiated successfully');
} catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
}
