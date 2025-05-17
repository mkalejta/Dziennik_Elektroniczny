import Keycloak from 'keycloak-connect';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({
  store: memoryStore,
}, {
  clientId: process.env.ADMIN_KEYCLOAK_CLIENT_ID,
  serverUrl: process.env.ADMIN_KEYCLOAK_URL,
  realm: process.env.ADMIN_KEYCLOAK_REALM,
  credentials: {
    secret: process.env.ADMIN_KEYCLOAK_CLIENT_SECRET
  }
});


export { keycloak, memoryStore };
