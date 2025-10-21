const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://robotics-production-8060.up.railway.app/api';
const BACKEND_BASE_URL = API_BASE_URL.replace('/api', '');

export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) {
    return '/api/placeholder/400/300';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  return `${BACKEND_BASE_URL}/${imagePath}`;
};

export const getCategoryImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) {
    return '/api/placeholder/400/300';
  }
  
  return getImageUrl(imagePath);
};

export const getProductImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) {
    return '/api/placeholder/400/300';
  }
  
  return getImageUrl(imagePath);
};