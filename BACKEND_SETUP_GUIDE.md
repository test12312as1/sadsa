# Backend Setup Guide (No Coding Required)

This guide will help you set up the backend for GamStart. Follow each step carefully.

---

## Step 1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project (or create one)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the ENTIRE contents of `DATABASE_SCHEMA.sql` and paste it
6. Click **Run** (green button)
7. You should see "Success" message

---

## Step 2: Get Your API Keys

### Supabase Keys
1. In Supabase, go to **Settings** → **API**
2. Copy these 3 values (keep them in a notepad):
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_KEY`

### Alchemy Key
1. Go to [alchemy.com](https://alchemy.com) and sign in
2. Click **Create App**
3. Name it "GamStart", select **Ethereum** and **Mainnet**
4. Click **Create App**
5. Click on your new app, then **API Key**
6. Copy the key → This is your `ALCHEMY_KEY`

---

## Step 3: Update Files on GitHub

### Files to Upload/Update:

Go to your GitHub repository and update these files:

#### 1. `app/api/scan/route.js` (NEW FILE)
- In GitHub, click **Add file** → **Create new file**
- Type: `app/api/scan/route.js`
- Copy the entire contents from your local `app/api/scan/route.js`
- Click **Commit new file**

#### 2. `app/api/platforms/route.js` (UPDATE if exists, or CREATE)
- Navigate to `app/api/platforms/route.js`
- If it exists, click the pencil icon to edit
- If not, create it: **Add file** → **Create new file** → type `app/api/platforms/route.js`
- This file should already exist from before

#### 3. `package.json` (UPDATE)
- Click on `package.json` in your repo
- Click the pencil icon to edit
- Find the `"dependencies"` section
- Make sure it includes:
```json
"dependencies": {
  "@supabase/supabase-js": "^2.39.0",
  "lucide-react": "^0.294.0",
  "next": "14.0.4",
  "react": "^18",
  "react-dom": "^18"
}
```
- Click **Commit changes**

---

## Step 4: Add Environment Variables to Vercel

1. Go to [vercel.com](https://vercel.com) and open your project
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)
4. Add these 4 variables one by one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Your Supabase service_role key |
| `ALCHEMY_KEY` | Your Alchemy API key |

For each one:
- Type the name in "Key"
- Paste the value in "Value"
- Make sure all 3 environments are checked (Production, Preview, Development)
- Click **Save**

---

## Step 5: Redeploy

1. In Vercel, go to **Deployments**
2. Click the **...** menu on your latest deployment
3. Click **Redeploy**
4. Wait for it to complete (2-3 minutes)

---

## Step 6: Run the Proxy Indexer (One Time)

This populates your database with casino deposit addresses.

### Option A: Run Locally (if you have Node.js)
```bash
cd your-project-folder
npm install @supabase/supabase-js
node scripts/index-proxies.js
```

### Option B: Manual Entry (if no Node.js)
1. Go to Supabase → **SQL Editor**
2. Run this to add some test proxies:
```sql
INSERT INTO known_proxies (address, casino_name) VALUES
  ('0x68416debc20d13e5ef694cdcac9506f4c1a20184', '500 Casino'),
  ('0x014435b1e39945cf4f5f0c3cbb5833195a95cc9b', 'Duelbits'),
  ('0x580450dff316ae00d0fbef9621a304020a046ce2', 'Gamdom'),
  ('0x7b09fc3bdd9a1eb0059f0c9d391f5d684e0f9918', 'Duel'),
  ('0xcbd6832ebc203e49e2b771897067fce3c58575ac', 'Rollbit'),
  ('0xc94ebb328ac25b95db0e0aa968371885fa516215', 'Roobet'),
  ('0xa26148ae51fa8e787df319c04137602cc018b521', 'Roobet')
ON CONFLICT (address) DO NOTHING;
```

---

## Step 7: Test It!

1. Go to your deployed site
2. Enter a wallet address that has gambled on Stake/Rollbit/etc
3. It should scan and show results!

---

## Troubleshooting

### "Internal Server Error"
- Check Vercel → **Logs** to see the error
- Make sure all 4 environment variables are set correctly

### "No gambling transactions found"
- The wallet hasn't deposited to any casinos we track
- Or the proxy indexer hasn't run yet

### Build fails
- Make sure `package.json` has `@supabase/supabase-js` in dependencies
- Check that all files are in the correct folders

---

## File Structure After Setup

Your GitHub should look like this:

```
your-repo/
├── app/
│   ├── api/
│   │   ├── platforms/
│   │   │   └── route.js
│   │   └── scan/
│   │       └── route.js
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── scripts/
│   └── index-proxies.js (optional, for local use)
├── DATABASE_SCHEMA.sql
├── ENV_SETUP.md
├── package.json
└── ... other files
```

---

## Need Help?

If something doesn't work:
1. Check Vercel logs for errors
2. Make sure environment variables are spelled exactly right
3. Verify Supabase tables were created (check Table Editor)
