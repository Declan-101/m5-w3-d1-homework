import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { prepareFacebookLogin } from './facebookSdk';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const appId = (import.meta.env.VITE_FACEBOOK_APP_ID || '').trim();
const graphVersion = (import.meta.env.VITE_FACEBOOK_GRAPH_VERSION || '24.0').replace(/^v/, '');
const facebookEnabled = Boolean(appId) && window.location.protocol === 'https:';
const demoEmail = 'student@example.com';
const demoPassword = 'classroom-demo';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== demoEmail || password !== demoPassword) {
      setError('Use the classroom demo email and password shown below.');
      return;
    }
    onLogin({ name: 'Demo Student', email: demoEmail, provider: 'Classroom demo' });
  }

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" value={email} autoComplete="username" required
          onChange={event => setEmail(event.target.value)} />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" value={password} autoComplete="current-password" required
          onChange={event => setPassword(event.target.value)} />
      </Form.Group>
      <Button block type="submit">Sign in</Button>
      <Form.Text className="demo-help">
        Demo account: <code>{demoEmail}</code> / <code>{demoPassword}</code>
      </Form.Text>
    </Form>
  );
}

function Home({ profile, onLogout }) {
  return (
    <>
      {profile.picture && <img className="profile-picture" src={profile.picture}
        alt="" width="72" height="72" referrerPolicy="no-referrer" />}
      <h1 className="h3">Welcome, {profile.name}</h1>
      {profile.email && <p>{profile.email}</p>}
      <p className="text-muted">Signed in with {profile.provider}.</p>
      <Button variant="outline-primary" onClick={onLogout}>Sign out</Button>
    </>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    let active = true;
    if (facebookEnabled) prepareFacebookLogin()
      .then(() => { if (active) setSdkReady(true); })
      .catch(reason => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, []);
  const [error, setError] = useState('');

  function responseFacebook(response) {
    if (!response?.id || !response?.accessToken) {
      setError('Facebook sign-in did not complete. Please try again.');
      return;
    }
    setError('');
    setProfile({
      name: response.name || 'Facebook user',
      email: response.email,
      picture: response.picture?.data?.url,
      provider: 'Facebook',
    });
  }

  function signOut() {
    setProfile(null);
    setError('');
  }

  return (
    <main className="login-page">
      <Container>
        <Card className="login-card">
          <Card.Body>
            {profile ? <Home profile={profile} onLogout={signOut} /> : (
              <>
                <h1 className="h3">Sign in</h1>
                <p className="text-muted">Use the classroom demo or your Facebook account.</p>
                <LoginForm onLogin={setProfile} />
                <div className="divider"><span>or</span></div>
                {error && <Alert variant="danger" role="alert">{error}</Alert>}
                {facebookEnabled && sdkReady ? (
                  <FacebookLogin
                    appId={appId}
                    version={graphVersion}
                    fields="name,picture"
                    scope="public_profile"
                    disableMobileRedirect
                    callback={responseFacebook}
                    onFailure={() => setError('Facebook sign-in is unavailable. Please try again.')}
                    render={({ onClick, isDisabled, isProcessing, isSdkLoaded }) => (
                      <Button block variant="outline-primary" type="button" onClick={onClick}
                        disabled={!isSdkLoaded || isDisabled || isProcessing}>
                        {isProcessing ? 'Connecting to Facebook…' : 'Continue with Facebook'}
                      </Button>
                    )}
                  />
                ) : (
                  <>
                    <Button block variant="outline-primary" disabled>Continue with Facebook</Button>
                    <Form.Text className="text-muted">
                      {facebookEnabled ? (error ? 'Facebook could not load. Refresh to try again.' : 'Loading Facebook login…')
                        : appId ? 'Open this app over HTTPS to use Facebook login.'
                        : 'Set your Facebook App ID to enable this button.'}
                    </Form.Text>
                  </>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
}
