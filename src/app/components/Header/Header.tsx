import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';

import { auth, currentUserId } from 'utils/firebase-init';

import { Logo } from '../Logo/Logo';

const AccountWrapper = styled.div`
  display: inline-flex;
  height: 3rem;
  align-content: center;
  white-space: nowrap;
  ${media.mobile} {
    margin: 0.5rem 0.5rem;
    margin-left: auto;
    a,
    p {
      font-size: 0.85rem;
    }
    .hide-mobile {
      display: none;
    }
  }
  ${media.small} {
    margin: 0.5rem 1.5rem;
    margin-left: auto;
    .hide-mobile {
      display: inline-flex;
    }
  }
`;

const LinksWrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0%);
  height: 4rem;
  align-content: center;
  color: #000;
  flex-direction: row;
  flex-wrap: nowrap;
  a {
    cursor: pointer;
    text-decoration: none;
    color: #000;
    font-family: inherit;
  }
  ${media.mobile} {
    margin: auto;
    display: none;
    a {
      margin: auto 0.5rem;
      font-family: inherit;
    }
  }
  ${media.small} {
    margin: auto;
    display: none;
    a {
      margin: auto 1.3rem;
      font-family: inherit;
    }
  }
  ${media.medium} {
    display: inline-flex;
    margin: auto;
  }
`;

export function Header(props: { showAccount: boolean | true }) {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null as any);

  React.useEffect(() => {
    auth.onAuthStateChanged(userInfo => {
      if (userInfo) {
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div
        style={{
          zIndex: 100,
          display: 'inline-flex',
          position: 'fixed',
          flexDirection: 'row',
          maxWidth: '100vw',
          width: '100%',
          height: '4rem',
          background: '#fff',
          boxShadow: '0px 0px 15px -5px rgba(0,0,0,0.2)',
        }}
      >
        <Logo />
        <LinksWrapper>
          <a href="#pricing">Products</a>
          <a href="#features">Solutions</a>
          <a href="#about">Pricing</a>
          <a href="#contact">Contact</a>
        </LinksWrapper>
        {props.showAccount && (
          <AccountWrapper>
            {!user && !loading && (
              <>
                <a
                  href="/signin"
                  className="hide-mobile"
                  style={{
                    fontWeight: 'bold',
                    color: '#000',
                    margin: 'auto 0.5rem',
                    borderRadius: '10px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  style={{
                    fontWeight: 'bolder',
                    color: '#000',
                    margin: 'auto 0.5rem',
                    border: '1px solid #000',
                    borderRadius: '4rem',
                    padding: '0.5rem 0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Get Started
                </a>
              </>
            )}
            {user && !loading && (
              <>
                <a
                  href="/account"
                  className="hide-mobile"
                  style={{
                    fontWeight: 'bold',
                    color: '#000',
                    margin: 'auto 0.5rem',
                    borderRadius: '10px',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Account
                </a>
                <div
                  onClick={() => {
                    auth.signOut();
                    window.location.href = '/';
                  }}
                  style={{
                    fontWeight: 'bolder',
                    color: '#000',
                    margin: 'auto 0.5rem',
                    border: '1px solid #000',
                    borderRadius: '4rem',
                    padding: '0.5rem 0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Sign Out
                </div>
              </>
            )}
          </AccountWrapper>
        )}
        <hr
          style={{
            position: 'fixed',
            width: '100%',
            margin: 0,
            border: '0.5px solid rgba(0,0,0,0.1)',
            zIndex: 100,
            transform: 'translate(0, 4rem)',
          }}
        />
      </div>
      <div
        style={{ height: '4rem', background: '#fff', scrollMarginTop: '4rem' }}
      />
    </>
  );
}
