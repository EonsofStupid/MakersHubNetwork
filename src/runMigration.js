
// Simple script to run the import migration
const { runMigration } = require('./scripts/migrate-imports');

console.log('Starting import migration...');
runMigration()
  .then(() => console.log('Migration completed successfully'))
  .catch(err => console.error('Migration failed:', err));
