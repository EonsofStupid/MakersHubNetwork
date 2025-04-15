
// Replace the code that's causing issues with string | null vs string | undefined
const featuredPost = {
  id: post?.id || '',
  title: post?.title || '',
  excerpt: post?.excerpt || '',
  slug: post?.slug || '',
  thumbnail_url: post?.thumbnail_url || ''
};
