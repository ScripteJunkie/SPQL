import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Title } from './components/Title';
import { SubTitle } from './components/SubTitle';
import { Form, FormSection, FormLink } from './components/FormField';
import { StageCenter } from 'app/components/StageCenter/StageCenter';
import { BsGoogle } from 'react-icons/bs';
import { useNavigate, NavigateFunction, useParams } from 'react-router-dom';

import { createUser } from 'utils/dbUtils';

import { auth } from 'utils/firebase-init';

import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

const GoogleLogin = async (navigate: NavigateFunction) => {
  try {
    signInWithPopup(auth, provider).then(result => {
      createUser(
        result.user.uid,
        result.user.email ? result.user.email : 'no email',
        result.user.displayName
          ? result.user.displayName.split(' ')[0]
          : 'no name',
        result.user.displayName ? result.user.displayName.split(' ')[1] : null,
        null,
        null,
        null,
      );
      navigate('/dashboard');
    });
  } catch (e) {
    console.log(e);
  }
};

export function SignUp() {
  const emailParam = useParams()['passed']?.split('=')[1];
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState(emailParam ? emailParam : '');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        const user = userCredential.user;
        createUser(user.uid, email, firstName, null, null, null, null);
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
        <title>sign up</title>
        <meta name="description" content="the syathen sign up page" />
      </Helmet>
      <StageCenter>
        <Title>create an account.</Title>
        <SubTitle>it's free and only takes a minute.</SubTitle>
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <input
              type="text"
              placeholder="enter your first name"
              id="first-name"
              name="first-name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </FormSection>
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
              placeholder="create a password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </FormSection>
          {/* <FormSection>
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <input type="password" id="confirm-password" required />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="business">Business</FormLabel>
            <input type="text" id="business" />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="phone">Phone</FormLabel>
            <input type="tel" id="phone" />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="website">Website</FormLabel>
            <input type="url" id="website" />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="description">Description</FormLabel>
            <textarea id="description" />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="terms">Terms</FormLabel>
            <FormCheckbox type="checkbox" id="terms" required />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="privacy">Privacy</FormLabel>
            <FormCheckbox type="checkbox" id="privacy" required />
          </FormSection>
          <FormSection>
            <FormLabel htmlFor="marketing">Marketing</FormLabel>
            <FormCheckbox id="marketing" />
          </FormSection> */}
          <FormSection style={{ marginTop: '1.5rem' }}>
            <input type="submit" value="Sign Up" />
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
            <BsGoogle className="icon" /> Sign up with Google
          </button>
        </FormSection>
        <FormLink href="/signin" title="sign in." rel="noopener noreferrer">
          have an account? sign in.
        </FormLink>
      </StageCenter>
    </>
  );
}
