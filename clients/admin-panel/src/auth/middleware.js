import { keycloak } from './keycloak.js';

export const protect = (role) => (req, res, next) => {
  keycloak.protect(`realm:${role}`)(req, res, next);
};
