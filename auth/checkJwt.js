const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const keycloakRealm = 'gradebook';
const keycloakHost = process.env.KEYCLOAK_URL || 'http://keycloak:8080';

const checkJwt = jwt.expressjwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksUri: `${keycloakHost}/realms/${keycloakRealm}/protocol/openid-connect/certs`,
    }),
    issuer: `${keycloakHost}/realms/${keycloakRealm}`,
    algorithms: ['RS256'],
    credentialsRequired: true,
});

module.exports = checkJwt;
