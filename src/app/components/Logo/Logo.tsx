import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';

const LogoBlock = styled.div`
  display: inline-block;
  img {
    width: auto;
    height: 4rem;
    margin: 0 1rem;
    cursor: pointer;
  }
  .largeLogo {
    display: none;
  }
  ${media.mobile} {
    .smallLogo {
      display: block;
      margin: 0 0.5rem;
    }
    .largeLogo {
      display: none;
    }
  }
  ${media.small} {
    .smallLogo {
      display: none;
    }
    .largeLogo {
      display: block;
    }
  }
`;

export function Logo(props: { text?: string }) {
  return (
    <>
      <LogoBlock onClick={() => (window.location.href = '/')}>
        <img className="smallLogo" src="/DJ.png" alt="logo" />
        <img className="largeLogo" src="/BannerLarge.png" alt="logo" />
      </LogoBlock>
    </>
  );
}
