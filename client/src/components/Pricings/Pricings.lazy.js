import React, { lazy, Suspense } from 'react';

const LazyPricings = lazy(() => import('./Pricings'));

const Pricings = props => (
  <Suspense fallback={null}>
    <LazyPricings {...props} />
  </Suspense>
);

export default Pricings;
