import { useKeycloak } from "@react-keycloak/web";
import { Button, Box, Typography } from "@mui/material";
import { useUser } from "../contexts/UserContext";

export default function Home() {
    const { keycloak } = useKeycloak();
    const { user } = useUser();
    const isLoggedIn = keycloak?.authenticated;
    const role = user?.role

    const dashboardPath = {
        student: "/dashboard/student",
        parent: "/dashboard/parent",
        teacher: "/dashboard/teacher",
    }[role];

    const handleLogin = () => {
        keycloak.login({ redirectUri: window.location.origin });
    };

    const handleLogout = () => {
        keycloak.logout();
    };

    const handleGoToDashboard = () => {
        if (dashboardPath) {
            window.location.href = dashboardPath;
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
            <Typography variant="h3" gutterBottom>
                Witamy w Dzienniku Elektronicznym
            </Typography>
            {!isLoggedIn ? (
                <Button variant="contained" color="primary" onClick={handleLogin}>
                    Zaloguj się przez Keycloak
                </Button>
            ) : (
                <>
                    <Typography variant="h6" gutterBottom>
                        Zalogowano jako: <b>{user?.username}</b>
                    </Typography>
                    {dashboardPath ? (
                        <Button variant="contained" color="success" onClick={handleGoToDashboard}>
                            Przejdź do swojego panelu
                        </Button>
                    ) : (
                        <Typography color="error">
                            Nie masz uprawnień do korzystania z dziennika.
                        </Typography>
                    )}
                    <Button variant="outlined" color="secondary" onClick={handleLogout}>
                        Wyloguj się
                    </Button>
                </>
            )}
        </Box>
    );
}
