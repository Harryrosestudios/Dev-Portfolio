import { addProject } from '../services/projectService.js';
import { myProjects } from '../constants/index.js';

// Migration script to move existing projects to Firebase
export const migrateProjectsToFirebase = async () => {
  try {
    console.log('Starting project migration to Firebase...');
    
    const migrationPromises = myProjects.map(async (project, index) => {
      const projectData = {
        ...project,
        order: index + 1, // Add order field for sorting
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const projectId = await addProject(projectData);
      console.log(`Migrated project: ${project.title} (ID: ${projectId})`);
      return projectId;
    });

    const results = await Promise.all(migrationPromises);
    console.log(`Successfully migrated ${results.length} projects to Firebase`);
    return results;
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProjectsToFirebase()
    .then(() => {
      console.log('Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}
