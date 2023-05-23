import { createGlobalStyle } from 'styled-components';
import { media } from './media';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    overflow-x: hidden;
    font-family: 'Open Sans', sans-serif;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
    scroll-margin-top: 8rem;
    .p-dropdown-label {
      padding: 0.5rem;
      font-size: 1rem;
    }
    .p-dropdown, .dialectSelect {
      margin: 0.5rem 0 !important;
      width: 100% !important;
      ${media.small} {
        margin: 1rem 0 !important;
        width: min(100%, 20rem) !important;
      }
    }

    .p-inputgroup .p-textinput {
        padding: 0.5rem !important;
        color: #000;
    }
  }

  .p-inputgroup .p-textinput {
        padding: 0.5rem !important;
    }

  .p-dropdown-item, .p-highlight, .p-dropdown-item-empty {
      font-size: 0.8rem;
      padding: 0.5rem !important;
    }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }
`;
