const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const router = express.Router();
dotenv.config();

const {
  KEYCLOAK_INTERNAL_URL,
  KEYCLOAK_PUBLIC_URL,
  ADMIN_KEYCLOAK_REALM,
  ADMIN_KEYCLOAK_CLIENT_ID,
  ADMIN_KEYCLOAK_CLIENT_SECRET
} = process.env;

const authEndpoint = `${KEYCLOAK_PUBLIC_URL}/realms/${ADMIN_KEYCLOAK_REALM}/protocol/openid-connect/auth`;
const tokenEndpoint = `${KEYCLOAK_INTERNAL_URL}/realms/${ADMIN_KEYCLOAK_REALM}/protocol/openid-connect/token`;
const redirectUrl = "http://localhost:4000/auth";

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCodeChallenge(codeVerifier) {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

const authRequest = `${authEndpoint}?
response_type=code&
client_id=${ADMIN_KEYCLOAK_CLIENT_ID}&
state=1234&
redirect_uri=${redirectUrl}&
code_challenge=${codeChallenge}&
code_challenge_method=S256&
scope=openid offline_access`;

router.get('/', (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    isAuthenticated: !!req.session.access_token
  });
});

router.get('/login', (req, res) => {
  res.render('login', { authRequest: authRequest });
});

router.get('/auth', async (req, res) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', redirectUrl);
  params.append('client_id', ADMIN_KEYCLOAK_CLIENT_ID);
  params.append('client_secret', ADMIN_KEYCLOAK_CLIENT_SECRET);
  params.append('code_verifier', codeVerifier);
  params.append('code', req.query.code);

  axios.post(tokenEndpoint, params)
    .then(result => {
      const { access_token, refresh_token, expires_in, id_token } = result.data;

      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      req.session.id_token = id_token;
      req.session.token_expires_at = Date.now() + expires_in * 1000;
      req.session.user = jwt.decode(access_token);

      const userRoles =
        req.session.user &&
        (req.session.user.realm_access?.roles || req.session.user.resource_access?.['account']?.roles);

      if (!userRoles || !userRoles.includes('admin')) {
        res.redirect('/logout');
        return;
      }

      req.session.save((err) => {
        if (err) {
          console.error('Błąd podczas zapisu sesji:', err);
        }
      });
      res.redirect("/");
    })
    .catch(error => {
      console.error('Error fetching token:', error);
      return res.status(500).send('Error fetching token');
    });
});

router.get('/logout', async (req, res) => {
  const idToken = req.session.id_token;
  req.session.destroy(() => {
    const redirectUri = 'http://localhost:4000/';
    let logoutUrl = `${KEYCLOAK_PUBLIC_URL}/realms/${ADMIN_KEYCLOAK_REALM}/protocol/openid-connect/logout?post_logout_redirect_uri=${redirectUri}`;
    if (idToken) {
      logoutUrl += `&id_token_hint=${idToken}`;
    }
    res.redirect(logoutUrl);
  });
});

module.exports = router;
