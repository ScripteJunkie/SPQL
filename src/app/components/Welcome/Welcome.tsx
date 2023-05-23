// Page that says "Welcome to the Jungle"
// All black background

import * as React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';

import { RxCaretDown } from 'react-icons/rx';

const WelcomeBlock = styled.div`
  width: 100%;
  height: 100%;
  min-height: 80vh;
  margin: auto;
  background: #fff;
  padding: 1rem 0;
  h1,
  h3,
  p {
    color: #000;
    opacity: 1;
    margin: 0;
    font-family: inherit;
  }
  p {
    font-size: 1.25rem;
    max-width: 50rem;
  }
  ${media.mobile} {
    font-size: 0.95rem;
    padding: 1rem 0.5rem;
    h1 {
      margin-top: 1rem;
      font-size: 2rem;
    }
    p {
      padding: 0 0.5rem;
      padding-right: 10%;
      margin: 1rem 0;
      font-size: 1rem;
    }
  }
  ${media.small} {
    font-size: 1.5rem;
    padding: 1rem 2rem;
    h1 {
      margin-top: 2rem;
      font-size: 3.5rem;
    }
    p {
      padding: initial;
      margin: 0;
      font-size: 1.2rem;
    }
  }
  ${media.medium} {
    padding: 2rem 3rem;
  }
`;

const ActionForm = styled.form`
  display: inline-flex;
  border: 1px solid #000;
  border-radius: 4rem;
  cursor: pointer;
  text-decoration: none;
  margin: 1rem 0;
  background: #fff;
  ${media.mobile} {
    margin-top: 2rem;
    width: 100%;
    min-width: 0;
    max-width: 100%;
  }
  ${media.small} {
    margin-top: 2rem;
    width: 50%;
    min-width: 25rem;
    max-width: 30rem;
  }
  input {
    background: transparent;
    width: 100%;
    font-weight: 600;
    font-size: 1rem;
    margin: 0;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 4rem;
    outline: none;
    color: #000;
    font-family: inherit;
    &::placeholder {
      color: #000;
      opacity: 0.5;
    }
  }
  input[type='submit'] {
    width: auto;
    font-weight: 600;
    font-size: 1rem;
    margin: 0;
    padding: 0.8rem 1.2rem;
    border: none;
    border-radius: 4rem;
    outline: none;
    color: #fff;
    font-family: inherit;
    background: #000;
    cursor: pointer;
  }
`;

const Bounce = styled.div`
  background: #fff;
  width: 100%;
  height: 4rem;
  padding-top: 0rem;
  text-align: center;
  svg {
    animation: bounce 2s infinite ease-in-out;
    transform: translateY(-2rem);
  }
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-1.2rem);
    }
    100% {
      transform: translateY(0);
    }
  }
`;

export function Welcome() {
  return (
    <>
      <WelcomeBlock>
        <h1 style={{ fontWeight: '600' }}>
          If your data could talk, <br />
          what would it say?
        </h1>
        <p>
          {' '}
          Data Jungle allows you to create, edit, and share data reports and
          dashboards all powered by AI, allowing you to focus on the important
          stuff.
        </p>
        <ActionForm
          onSubmit={e => {
            e.preventDefault();
            window.location.href = '/signup/email=' + e.target[0].value;
          }}
        >
          <input type="email" name="email" placeholder="Enter your email" />
          <input type="submit" value="Get Started" />
        </ActionForm>
      </WelcomeBlock>
      <Bounce
        id="bounce"
        onClick={() =>
          document
            .getElementById('bounce')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
      >
        <RxCaretDown
          style={{
            fontSize: '5rem',
            color: '#000',
          }}
        />
      </Bounce>
    </>
  );
}
