To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

## JWT Verification for External Services

The SSO exposes a JWKS endpoint so other API services can verify user JWTs locally — no round-trip to the SSO needed.

### Flow

1. User signs in via the SSO
2. Client calls `GET /api/auth/get-session` (with session cookie or Bearer token) → response includes a `set-auth-jwt` header containing a signed JWT
3. Client sends the JWT to other API services via `Authorization: Bearer <jwt>`
4. API service verifies the JWT locally using the SSO's public keys

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/jwks` | GET | Public keys for JWT verification |
| `/api/auth/token` | GET | Get current session JWT |

### Verifying JWTs with `jose`

```ts
import { createRemoteJWKSet, jwtVerify } from "jose";

const SSO_URL = "https://sso.example.com";
const JWKS = createRemoteJWKSet(new URL(`${SSO_URL}/api/auth/jwks`));

async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, JWKS);
  return payload; // { sub: "<user-id>", email: "...", ... }
}
```

`createRemoteJWKSet` caches the keys automatically — no extra caching logic needed.
