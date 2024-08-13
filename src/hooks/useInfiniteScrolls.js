import { useEffect } from 'react';
import { debounce } from '@/lib/utils'; // Import debounce from lodash

const useInfiniteScroll = ({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const documentHeight = document.documentElement.offsetHeight;
      const threshold = documentHeight * 0.75;
      if (scrollPosition >= threshold && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    const debouncedHandleScroll = debounce(handleScroll, 300);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
};

export default useInfiniteScroll;
