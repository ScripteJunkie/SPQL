import { func } from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';

const QueryBox = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  ${media.small} {
    width: max(30rem, 80%);
  }
  ${media.medium} {
    max-width: 50rem;
  }
  h3 {
    font-size: 1.2rem;
    ${media.medium} {
      font-size: 1.2rem;
    }
  }
  p {
    font-size: 1rem;
    ${media.medium} {
      font-size: 1.1rem;
    }
  }
  code {
    font-size: 1rem;
    background-color: #7b7b7b2c;
    padding: 5px;
    border-radius: 5px;
    min-width: 6rem;
    ${media.medium} {
      font-size: 1.1rem;
    }
  }
  .error {
    color: red;
  }
`;

export const Query = props => {
  return (
    <QueryBox>
      {props.result.query !== '' && (
        <>
          <h3>Query:</h3>
          <code>{props.result.query}</code>
          <h3>Notes:</h3>
          <p>{props.result.notes}</p>
        </>
      )}
      {props.result.error !== '' && (
        <>
          <h3>Error:</h3>
          <p className="error">{props.result.error}</p>
        </>
      )}
      {props.result.query === '' && props.result.error === '' && (
        <>
          <h3>Error:</h3>
          <p className="error">No query was generated. Please try again.</p>
        </>
      )}
    </QueryBox>
  );
};
