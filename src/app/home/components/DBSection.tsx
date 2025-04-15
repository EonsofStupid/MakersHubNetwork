
// Fix the type issue with null vs undefined in map function
// Convert null to undefined for compatibility
const items = data?.map(item => ({
  id: item.id,
  name: item.name,
  description: item.description || undefined
})) || [];
