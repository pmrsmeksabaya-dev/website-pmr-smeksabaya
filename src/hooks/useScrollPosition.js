// ========== BASIC ==========
import { useScrollPosition } from '../hooks/useScrollPosition';

const MyComponent = () => {
  const { scrollY, direction, isScrolledPast } = useScrollPosition();

  return (
    <div className={isScrolledPast ? 'bg-pmi' : 'bg-transparent'}>
      <p>Scroll: {scrollY}px</p>
      <p>Direction: {direction}</p>
    </div>
  );
};

// ========== WITH OPTIONS ==========
const { scrollY, direction } = useScrollPosition({
  throttle: 200,
  threshold: 100,
});

// ========== SCROLL TO TOP ==========
import { useScrollToTop } from '../hooks/useScrollPosition';

const BackToTop = () => {
  const scrollToTop = useScrollToTop();
  
  return (
    <button onClick={() => scrollToTop('smooth')}>
      ⬆ Back to Top
    </button>
  );
};

// ========== INFINITE SCROLL ==========
import { useInfiniteScroll } from '../hooks/useScrollPosition';

const MyList = () => {
  const loadMore = async () => {
    // Fetch more data
    console.log('Loading more...');
  };

  const { isLoading, hasMore } = useInfiniteScroll(loadMore, {
    threshold: 200,
  });

  return (
    <div>
      {items.map(item => <div key={item.id}>{item.name}</div>)}
      {isLoading && <p>Loading...</p>}
      {!hasMore && <p>No more items</p>}
    </div>
  );
};