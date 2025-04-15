
// Adjust the editor to handle the updated user metadata structure
const userMetadata = user?.user_metadata || {};
const displayName = profile?.name || userMetadata.full_name || '';
const bio = userMetadata.bio || '';
const avatarUrl = profile?.avatar_url || userMetadata.avatar_url || '';
const location = userMetadata.location || '';
const website = userMetadata.website || '';

// And in the onSubmit function, ensure we're updating the metadata correctly
await updateProfile({
  name: data.displayName,
  user_metadata: {
    ...userMetadata,
    full_name: data.displayName,
    bio: data.bio || '',
    avatar_url: data.avatarUrl || '',
    location: data.location || '',
    website: data.website || ''
  }
});
