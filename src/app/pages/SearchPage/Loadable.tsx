import { lazyLoad } from 'utils/loadable';

export const SearchPage = lazyLoad(
  () => import('./index'),
  module => module.SearchPage,
);
