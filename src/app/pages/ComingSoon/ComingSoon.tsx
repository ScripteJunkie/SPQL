import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { media } from 'styles/media';

import { auth, currentUserId } from 'utils/firebase-init';

import { Header } from 'app/components/Header/Header';
import { Footer } from 'app/components/Footer/Footer';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80vh;
  background: #000;
  padding: 1rem 0;
  h4 {
    opacity: 0.5;
    margin: 0;
    font-family: inherit;
  }
  a {
    text-decoration: none;
    color: #fff;
    font-family: inherit;
    display: block;
  }
  ${media.mobile} {
    padding: 1rem 0.5rem;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  ${media.small} {
    padding: 1rem 2rem;
    margin-bottom: 0;
    padding-bottom: 0;
  }
  ${media.medium} {
    padding: 2rem 3rem;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionWrapper = styled.div`
  display: block;
  width: auto;
  height: 100%;
  padding: 0;
  margin: 0;
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  h1 {
    padding: 0.2rem 0;
    font-size: 2rem;
  }
  p {
    font-size: 1.25rem;
  }
`;

export function ComingSoon() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (!currentUserId()) {
      window.location.href = '/';
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Coming Soon</title>
        <meta name="description" content="Data Jungle" />
      </Helmet>
      <Header {...{ showAccount: true }} />
      <Wrapper>
        <SectionWrapper>
          <h1>Coming Soon</h1>
          <p>We are currently working on this page. Please check back later.</p>
        </SectionWrapper>
      </Wrapper>
      <Footer />
    </>
  );
}
