/**
 * Route fallback utility for handling SPA routing issues
 */

export const handleRouteFallback = () => {
  // Check if we're on a legal page route
  const legalRoutes = [
    '/privacy-policy',
    '/terms-conditions', 
    '/cancellation-refund',
    '/shipping-delivery',
    '/contact-us',
    '/legal-compliance'
  ];

  const currentPath = window.location.pathname;
  
  if (legalRoutes.includes(currentPath)) {
    // If we're on a legal page and it's not loading properly,
    // redirect to the main app with the route
    console.log('Legal route detected:', currentPath);
    
    // Force a page reload to ensure React Router picks up the route
    if (window.location.search === '') {
      window.location.reload();
    }
  }
};

export const checkRouteAccessibility = () => {
  // Check if the current route is accessible
  const currentPath = window.location.pathname;
  
  // If we get a 404 for a legal page, try to navigate programmatically
  if (currentPath.includes('privacy-policy') || 
      currentPath.includes('terms-conditions') ||
      currentPath.includes('cancellation-refund') ||
      currentPath.includes('shipping-delivery') ||
      currentPath.includes('contact-us') ||
      currentPath.includes('legal-compliance')) {
    
    console.log('Legal page route detected, ensuring proper navigation');
    return true;
  }
  
  return false;
};
