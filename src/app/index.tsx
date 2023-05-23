import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { HomePage } from './pages/HomePage/Loadable';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { SearchPage } from './pages/SearchPage/Loadable';
import { SchemaPage } from './pages/SchemaPage';
import { ComingSoon } from './pages/ComingSoon/ComingSoon';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';

export function App() {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - Data Jungle"
        defaultTitle="Data Jungle"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="Data Jungle" />
      </Helmet>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup/:passed" element={<SignUp />} />
        <Route path="/signup/" element={<SignUp />} />
        <Route path="/search/:appName" element={<SearchPage />} />
        <Route path="/schema" element={<SchemaPage />} />
        <Route path="/dashboard" element={<ComingSoon />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <GlobalStyle />
    </BrowserRouter>
  );
}
