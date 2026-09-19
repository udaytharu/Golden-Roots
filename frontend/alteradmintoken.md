# Admin token

## Change from the admin panel

1. Open `http://localhost:5173/admin`.
2. Sign in with the current token.
3. Select the **Settings** tab.
4. Enter and confirm a new token of at least 8 characters.
5. Select **Update admin token**.

The backend saves the active token to `backend/data/admin-token.json`, and the current browser session updates automatically.

## Manual change

Edit the `token` value in `backend/data/admin-token.json`, then restart the backend:

```json
{
  "token": "your-new-private-token"
}
```

Do not commit a real production token to source control.

## Development access

The admin page is available at `http://localhost:5173/admin`.

The fallback development token is `golden-roots-admin` when no saved token file exists. Change it before deploying publicly.
