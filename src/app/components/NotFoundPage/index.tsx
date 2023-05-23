import * as React from 'react';
import styled from 'styled-components/macro';
import { P } from './P';
import { Helmet } from 'react-helmet-async';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <Header {...{ showAccount: true }} />
      <Wrapper>
        <Title>
          4
          <span role="img" aria-label="Crying Face">
            😅
          </span>
          4
        </Title>
        <P>We're working hard to get this page up and running.</P>
      </Wrapper>
      <Footer />
    </>
  );
}

const Wrapper = styled.div`
  color: #fff;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: #fff;
  font-size: 5rem;

  span {
    font-size: 4.5rem;
  }
`;
