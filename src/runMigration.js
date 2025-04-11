
// Simple script to run the import migration
const { runMigration } = require('./scripts/migrate-imports.ts');

console.log('Starting import migration...');
runMigration()
  .then(() => console.log('Migration completed successfully'))
  .catch(err => console.error('Migration failed:', err));
