import axios from 'axios';

export async function refreshToken(req, res, next) {
    const refresh = req.cookies['refresh_token'];

    if (!refresh) return res.status(401).json({ message: 'Brak refresh_token' });

    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
        params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refresh);

        const { data } = await axios.post(
            `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
            params
        );

        res.cookie('access_token', data.access_token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure: false,
        });

        if (data.refresh_token) {
            res.cookie('refresh_token', data.refresh_token, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: false,
            });
        }

        req.cookies['access_token'] = data.access_token;
        next();
    } catch (err) {
        console.error('Błąd podczas odświeżania tokenu:', err.message);
        res.status(401).json({ message: 'Nie udało się odświeżyć tokenu' });
    }
}
