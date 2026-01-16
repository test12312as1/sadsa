# Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Alchemy (Ethereum)
ALCHEMY_KEY=your-alchemy-api-key

# Helius (Solana) - for future use
HELIUS_KEY=your-helius-api-key
```

## Where to get these:

### Supabase
1. Go to [supabase.com](https://supabase.com) and create a project
2. Go to **Settings → API**
3. Copy the `URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy the `anon public` key → `NEXT_PUBLIC_SUPABASE_KEY`
5. Copy the `service_role` key → `SUPABASE_SERVICE_KEY`

### Alchemy
1. Go to [alchemy.com](https://alchemy.com) and create an account
2. Create a new app for **Ethereum Mainnet**
3. Copy the API key → `ALCHEMY_KEY`

### Helius (Solana - Optional for now)
1. Go to [helius.dev](https://helius.dev) and create an account
2. Create an API key
3. Copy it → `HELIUS_KEY`

---

## Vercel Deployment

When deploying to Vercel, add these as **Environment Variables** in:
- Project Settings → Environment Variables

Make sure to add them for **Production**, **Preview**, and **Development** environments.

---

## Important Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for public keys)
- `SUPABASE_SERVICE_KEY` and `ALCHEMY_KEY` are server-only (never exposed to client)
- Never commit `.env.local` to git (it's in `.gitignore`)
