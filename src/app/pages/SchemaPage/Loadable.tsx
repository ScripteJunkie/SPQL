import { lazyLoad } from 'utils/loadable';

export const SchemaPage = lazyLoad(
  () => import('./index'),
  module => module.SchemaPage,
);
