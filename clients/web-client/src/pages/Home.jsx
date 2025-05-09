import { useKeycloak } from "@react-keycloak/web"

export default function Home() {
    const { keycloak } = useKeycloak();

    const handleLogin = () => {
        keycloak.login({ redirectUri: window.location.origin });
    };

    const handleLogout = () => {
        keycloak?.logout();
    }

    return <>
        <h1>Witamy w Dzienniku Elektronicznym</h1>
        <button onClick={handleLogin} className="btn btn-primary">
            Zaloguj sie przez keycloak
        </button>
        <button>
            <a href="/dashboard/student">
                Dashboard Student
            </a>
        </button>
        <button onClick={handleLogout}>Logout</button>
    </>
}
  