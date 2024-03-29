import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Title } from './components/Title';
import { SubTitle } from './components/SubTitle';
import { Form, FormSection, FormLink } from './components/FormField';
import { StageCenter } from 'app/components/StageCenter/StageCenter';
import { BsGoogle } from 'react-icons/bs';

import { useNavigate } from 'react-router-dom';

import { auth } from 'utils/firebase-init';

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

const GoogleLogin = async (navigate: any) => {
  try {
    signInWithPopup(auth, provider).then(userCredential => {
      const user = userCredential.user;
      // emptyUser(result.user.uid, result.user.displayName, result.user.email);
      navigate('/dashboard');
    });
  } catch (e) {
    console.log(e);
  }
};

export function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        navigate('/dashboard');
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <>
      <Helmet>
        <title>sign in</title>
        <meta name="description" content="the syathen sign in page" />
      </Helmet>
      <StageCenter>
        <Title>welcome back.</Title>
        <SubTitle>sign in to your account.</SubTitle>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <input
              type="email"
              placeholder="enter your email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </FormSection>
          <FormSection>
            <input
              type="password"
              placeholder="enter your password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </FormSection>
          <FormSection style={{ marginTop: '1.5rem' }}>
            <input type="submit" value="Sign In" />
          </FormSection>
        </Form>
        <FormSection>
          <button
            className="google"
            onClick={() => {
              GoogleLogin(navigate);
            }}
          >
            {' '}
            <BsGoogle className="icon" /> Sign in with Google
          </button>
        </FormSection>
        <FormLink href="/signup" title="sign up." rel="noopener noreferrer">
          don't have an account? sign up.
        </FormLink>
        <FormLink
          href="/forgotpassword"
          title="forgot password?"
          target="_blank"
          rel="noopener noreferrer"
        >
          forgot password?
        </FormLink>
      </StageCenter>
    </>
  );
}
