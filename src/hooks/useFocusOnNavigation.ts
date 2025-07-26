'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * This hook is used for users who rely on keyboard navigation
 * Next.js (for now) lacks the ability to re-focus on the page when navigating pages
 * Which causes the screen reader to not react to page transitions
 */
export function useFocusOnNavigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleRouteChange = () => {
      document.body.tabIndex = -1;
      document.body.focus();
    };

    handleRouteChange();
  }, [pathname, searchParams]);
}
