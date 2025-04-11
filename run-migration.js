
const { execSync } = require('child_process');

console.log('Running migration script...');
try {
  execSync('node -r ts-node/register src/utils/run-migration.ts', { stdio: 'inherit' });
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Error running migration:', error);
  process.exit(1);
}
