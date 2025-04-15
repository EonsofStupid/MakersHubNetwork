
// This is a partial update to fix the specific issue with data access
const response = await layoutSkeletonService.getById(id);
if (!response.success || !response.data) return null;
return response.data;
