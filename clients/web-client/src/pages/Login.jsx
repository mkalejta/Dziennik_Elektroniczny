import { useKeycloak } from "@react-keycloak/web";

const Login = () => {
    const { keycloak } = useKeycloak();

    const handleLogin = () => {
        keycloak.login({ redirectUri: window.location.origin });
    };

    return (
        <button onClick={handleLogin} className="btn btn-primary">
            Zaloguj się
        </button>
    );
}

export default Login;