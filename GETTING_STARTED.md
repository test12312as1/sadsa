# Getting Started - Running Your Site

This guide assumes you have **zero coding experience**. Follow these steps exactly.

## Step 1: Install Node.js (if you don't have it)

1. **Check if you already have Node.js:**
   - Open **Terminal** (on Mac) or **Command Prompt** (on Windows)
   - Type: `node --version`
   - Press Enter
   - If you see a version number (like `v18.17.0`), you're good! Skip to Step 2.
   - If you see "command not found", continue below.

2. **Download and install Node.js:**
   - Go to: https://nodejs.org/
   - Click the big green "Download" button (it will download the LTS version)
   - Run the installer file you downloaded
   - Click "Next" through all the prompts (use default settings)
   - Restart your computer after installation
   - Open Terminal/Command Prompt again and type `node --version` to verify

## Step 2: Open Terminal/Command Prompt

**On Mac:**
- Press `Cmd + Space` (Command key + Spacebar)
- Type "Terminal"
- Press Enter

**On Windows:**
- Press `Windows key + R`
- Type "cmd"
- Press Enter

## Step 3: Navigate to Your Project Folder

In Terminal/Command Prompt, type these commands one at a time (press Enter after each):

```bash
cd ~/Downloads/icarus13-main\ 2
```

**Note:** If your project is in a different location, you'll need to change the path. For example:
- If it's on your Desktop: `cd ~/Desktop/icarus13-main\ 2`
- If it's in Documents: `cd ~/Documents/icarus13-main\ 2`

**Tip:** You can also drag the folder into Terminal/Command Prompt to automatically paste the path.

## Step 4: Install Dependencies

This downloads all the code libraries your project needs. Type:

```bash
npm install
```

Press Enter and wait. This might take 2-5 minutes. You'll see lots of text scrolling by - that's normal!

**If you see errors:**
- Make sure you're in the correct folder (Step 3)
- Make sure Node.js is installed (Step 1)

## Step 5: Start the Development Server

Type this command:

```bash
npm run dev
```

Press Enter. You should see something like:

```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
```

## Step 6: View Your Site

1. Open your web browser (Chrome, Safari, Firefox, etc.)
2. Go to: `http://localhost:3000`
3. You should see your Whale Audit site!

## What You'll See

- **Landing page** with mock statistics (casino market share, recent searches, top wallets)
- **Search box** at the top
- Type "demo" in the search box and click "Scan" to see example results

## Stopping the Server

When you're done:
- Go back to Terminal/Command Prompt
- Press `Ctrl + C` (on Mac or Windows)
- Type `Y` and press Enter if it asks

## Troubleshooting

**"npm: command not found"**
- Node.js isn't installed or isn't in your PATH
- Reinstall Node.js from nodejs.org

**"Cannot find module" errors**
- Run `npm install` again (Step 4)

**Port 3000 already in use**
- Another app is using that port
- Close other apps or change the port: `npm run dev -- -p 3001`
- Then visit: `http://localhost:3001`

**Site looks broken/styled wrong**
- Make sure you ran `npm install` (Step 4)
- Try stopping the server (Ctrl+C) and running `npm run dev` again

## Next Steps

Once you see the site working:
- The design is complete and ready
- When you're ready to connect the real backend, the code is already set up
- For now, use "demo" or "test" in the search box to see mock results
