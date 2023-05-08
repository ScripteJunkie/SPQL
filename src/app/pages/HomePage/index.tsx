import * as React from 'react';
import { Helmet } from 'react-helmet-async';

import 'primereact/resources/themes/soho-dark/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import { Pricing } from 'app/components/Pricing';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>HomePage</title>
        <meta name="description" content="A Boilerplate application homepage" />
      </Helmet>
      <Pricing />
    </>
  );
}
