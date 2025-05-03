import axios from 'axios';
import crypto from 'crypto';

const {
  KEYCLOAK_PUBLIC_URL,
  KEYCLOAK_INTERNAL_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET,
} = process.env;

const REDIRECT_URI = 'http://localhost:8081/auth/redirect';

const AUTH_ENDPOINT = `${KEYCLOAK_PUBLIC_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`;
const TOKEN_ENDPOINT = `${KEYCLOAK_INTERNAL_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;
const LOGOUT_ENDPOINT = `${KEYCLOAK_INTERNAL_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`;

// Tymczasowy storage na code_verifier
const codeVerifiers = new Map();

export function login(req, res) {
  const state = crypto.randomBytes(8).toString('hex');
  const codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  codeVerifiers.set(state, codeVerifier);

  const authUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=openid offline_access`;

  res.redirect(authUrl);
}

export async function handleRedirect(req, res) {
  const { code, state } = req.query;

  const codeVerifier = codeVerifiers.get(state);
  if (!codeVerifier) {
    return res.status(400).json({ message: 'Nieprawidłowy state lub code_verifier' });
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', KEYCLOAK_CLIENT_ID);
    params.append('client_secret', KEYCLOAK_CLIENT_SECRET);
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);
    params.append('code_verifier', codeVerifier);

    const { data } = await axios.post(TOKEN_ENDPOINT, params);

    res.cookie('access_token', data.access_token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    res.cookie('refresh_token', data.refresh_token, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });

    res.send(`<h2>Uwierzytelniono poprawnie!</h2><p>Możesz teraz korzystać z aplikacji.</p>`);
  } catch (err) {
    console.error('Błąd przy wymianie tokenu:', err.response?.data || err.message);
    res.status(500).send('<h2>Błąd podczas logowania.</h2>');
  }
}

export async function logout(req, res) {
  const refreshToken = req.cookies['refresh_token'];
  const params = new URLSearchParams();
  params.append('client_id', KEYCLOAK_CLIENT_ID);
  params.append('client_secret', KEYCLOAK_CLIENT_SECRET);
  params.append('refresh_token', refreshToken);

  try {
    await axios.post(LOGOUT_ENDPOINT, params);
  } catch (err) {
    console.warn('Błąd podczas wylogowywania:', err.response?.data || err.message);
  }

  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.send('Wylogowano.');
}
