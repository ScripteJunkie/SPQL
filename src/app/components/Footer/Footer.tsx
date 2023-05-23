import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';

const FooterWrapper = styled.div`
  display: inline-block;
  width: 100%;
  height: auto;
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

const LinksWrapper = styled.div`
  display: block;
  width: auto;
  height: 100%;
  padding: 0;
  margin: 0;
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  a,
  p {
    padding: 0.2rem 0;
    cursor: pointer;
  }
  ${media.mobile} {
    a,
    p {
      font-family: inherit;
      margin: auto 0;
    }
  }
  ${media.small} {
    a,
    p {
      font-family: inherit;
      margin: auto 0;
    }
  }
`;

const CopyRightWrapper = styled.div`
  display: block;
  width: 100%;
  text-align: right;
  padding: 0 1rem;
  color: #fff;
  p {
    font-family: inherit;
    margin: 0;
    font-size: 0.8rem;
    padding: 0.2rem 0;
  }
`;

const SectionWrapper = styled.section`
  display: inline-flex;
  margin: auto 2rem;
  flex-direction: column;
  ${media.mobile} {
    margin: auto 0.5rem;
  }
  ${media.small} {
    margin: auto 2rem;
  }
  ${media.medium} {
    margin: auto 4rem;
  }
`;

export function Footer(props: { text?: string }) {
  const companyLinks = {
    title: 'Company',
    links: [
      { text: 'About', link: '/about' },
      { text: 'Contact', link: '/contact' },
      { text: 'Careers', link: '/careers' },
    ],
  };

  const productLinks = {
    title: 'Product',
    links: [
      { text: 'Features', link: '/features' },
      { text: 'Pricing', link: '/pricing' },
      { text: 'FAQ', link: '/faq' },
    ],
  };

  return (
    <>
      <FooterWrapper>
        <FooterBlock {...companyLinks} />
        <FooterBlock {...productLinks} />
        <CopyRightWrapper>
          <p>© 2023 Data Jungle LLC</p>
        </CopyRightWrapper>
      </FooterWrapper>
    </>
  );
}

function FooterBlock(props: { title: string; links: any }) {
  return (
    <SectionWrapper>
      <div
        className="company-info__item"
        style={{ margin: 'auto', color: '#fff' }}
      >
        <h4
          className="company-info__item__title"
          style={{ color: '#fff', fontSize: '0.9rem' }}
        >
          {props.title}
        </h4>
        <LinksWrapper>
          {props.links.map((link: any) => (
            <a key={link.text} href={link.link}>
              {link.text}
            </a>
          ))}
        </LinksWrapper>
      </div>
    </SectionWrapper>
  );
}
