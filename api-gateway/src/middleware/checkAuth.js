import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import axios from 'axios';

const {
    KEYCLOAK_URL,
    KEYCLOAK_REALM,
    KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET,
} = process.env;

const client = jwksClient({
    jwksUri: `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/certs`,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

export async function checkAuth(req, res, next) {
    const accessToken = req.cookies['access_token'];

    if (!accessToken) return res.status(401).json({ message: 'Brak tokenu logowania' });

    jwt.verify(accessToken, getKey, { algorithms: ['RS256'] }, async (err, decoded) => {
        if (!err) {
            req.user = decoded;
            return next();
        }

        // Jeśli token wygasł, następuje próbua odświeżenia go
        if (err.name === 'TokenExpiredError') {
            const refreshToken = req.cookies['refresh_token'];
            if (!refreshToken) return res.status(401).json({ message: 'Brak refresh tokenu' });

            try {
                const params = new URLSearchParams();
                params.append('client_id', KEYCLOAK_CLIENT_ID);
                params.append('client_secret', KEYCLOAK_CLIENT_SECRET);
                params.append('grant_type', 'refresh_token');
                params.append('refresh_token', refreshToken);

                const { data } = await axios.post(
                    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
                    params
                );

                res.cookie('access_token', data.access_token, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: false,
                });

                res.cookie('refresh_token', data.refresh_token, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    secure: false,
                });

                jwt.verify(data.access_token, getKey, { algorithms: ['RS256'] }, (verifyErr, decodedNew) => {
                    if (verifyErr) return res.status(403).json({ message: 'Błąd weryfikacji nowego tokenu' });
                    req.user = decodedNew;
                    next();
                });
            } catch (refreshErr) {
                console.error('Błąd przy odświeżaniu tokenu:', refreshErr.response?.data || refreshErr.message);
                return res.status(401).json({ message: 'Nie udało się odświeżyć tokenu' });
            }
        } else {
            console.warn('Token nieprawidłowy:', err.message);
            return res.status(403).json({ message: 'Token nieprawidłowy' });
        }
    });
}
