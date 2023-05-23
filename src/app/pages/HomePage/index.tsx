import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { media } from 'styles/media';

import 'primereact/resources/themes/md-dark-deeppurple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';

import { Welcome } from 'app/components/Welcome/Welcome';
import { Pricing } from 'app/components/Pricing';
import { Footer } from 'app/components/Footer/Footer';
import { Header } from 'app/components/Header/Header';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Data Jungle Home Page" />
      </Helmet>
      <Header {...{ showAccount: true }} />
      <Welcome />
      <Pricing />
      <Footer />
    </>
  );
}
