// Script to delete all products and reseed with new data
require('dotenv').config();
const { connectDB } = require('./src/config/database');
const { Product, sampleProducts } = require('./src/models/productModel');

(async () => {
    try {
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Delete all products
        const deleteResult = await Product.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} old products`);

        // Insert new sample products
        const inserted = await Product.insertMany(sampleProducts);
        console.log(`✅ Inserted ${inserted.length} new products with fixed images`);

        console.log('\n📋 Products in database:');
        inserted.forEach(p => {
            console.log(`  - ${p.name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
