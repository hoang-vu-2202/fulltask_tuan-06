const { pool } = require('../config/database');

/**
 * Migration script to update products table schema
 * Adds: views, discount_percent, is_on_sale fields and FULLTEXT index
 */
const migrateProductSchema = async () => {
    const connection = await pool.getConnection();
    try {
        console.log('🔄 Starting products table migration...');

        // Check if columns already exist
        const [columns] = await connection.query(
            "SHOW COLUMNS FROM products WHERE Field IN ('views', 'discount_percent', 'is_on_sale')"
        );

        if (columns.length === 0) {
            // Add new columns
            await connection.query(`
        ALTER TABLE products
        ADD COLUMN views INT DEFAULT 0,
        ADD COLUMN discount_percent DECIMAL(5, 2) DEFAULT 0,
        ADD COLUMN is_on_sale BOOLEAN DEFAULT FALSE
      `);
            console.log('✅ Added new columns: views, discount_percent, is_on_sale');
        } else {
            console.log('ℹ️  Columns already exist, skipping ALTER TABLE');
        }

        // Check if FULLTEXT index exists
        const [indexes] = await connection.query(
            "SHOW INDEX FROM products WHERE Key_name = 'idx_search'"
        );

        if (indexes.length === 0) {
            // Create FULLTEXT index
            await connection.query(`
        ALTER TABLE products
        ADD FULLTEXT INDEX idx_search (name, description)
      `);
            console.log('✅ Created FULLTEXT index on name and description');
        } else {
            console.log('ℹ️  FULLTEXT index already exists');
        }

        // Update existing products with sample data
        const [products] = await connection.query('SELECT id FROM products');
        if (products.length > 0) {
            console.log(`🔄 Updating ${products.length} existing products with sample data...`);

            const updates = products.map((product, index) => {
                const views = Math.floor(Math.random() * 200) + 50; // 50-250
                const discount = [0, 0, 5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 8)];
                const isOnSale = discount > 0;

                return connection.query(
                    'UPDATE products SET views = ?, discount_percent = ?, is_on_sale = ? WHERE id = ?',
                    [views, discount, isOnSale, product.id]
                );
            });

            await Promise.all(updates);
            console.log('✅ Updated all existing products');
        }

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        connection.release();
    }
};

// Run migration if this file is executed directly
if (require.main === module) {
    (async () => {
        try {
            await migrateProductSchema();
            process.exit(0);
        } catch (error) {
            console.error('Migration error:', error);
            process.exit(1);
        }
    })();
}

module.exports = { migrateProductSchema };
