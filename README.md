# LockArena - Deadlock Community Hub

The ultimate Deadlock community platform. Vote on hero rankings, track esports, predict outcomes, and open cases.

## 🎮 Features

### Live Features
- **Hero Ranker** - Facemash-style voting on hero matchups across categories like "Most Likely to Get Nerfed", "Best Design", and more. ELO-based community rankings.
- **Esports Hub** - Tournament calendar, match schedules, team rankings, and live match tracking.

### Coming Soon
- **Prediction Markets** - Free-to-play betting on patches, tournaments, and community milestones with weekly prizes.
- **Case Opening** - The first Deadlock case opening platform with community skins and provably fair drops.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🛠 Tech Stack

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Fonts:** Orbitron, Rajdhani, Share Tech Mono

## 📁 Project Structure

```
app/
├── page.js              # Homepage
├── rank/page.js         # Hero Ranker
├── esports/page.js      # Esports Hub
├── predictions/page.js  # Predictions (Coming Soon)
├── cases/page.js        # Cases (Coming Soon)
├── components/
│   ├── Navbar.js        # Navigation
│   ├── Footer.js        # Footer
│   └── EmailCapture.js  # Email signup component
├── globals.css          # Global styles & CSS variables
└── layout.js            # Root layout
```

## 🎨 Design System

The app uses a custom design system inspired by Deadlock's aesthetic:

- **Primary Color:** Electric Cyan (#00f0ff)
- **Secondary Color:** Hot Orange (#ff6b2c)
- **Tertiary Color:** Purple (#a855f7)
- **Background:** Deep navy/black (#06080c)

## 📱 Mobile First

The app is designed mobile-first with:
- Touch-friendly voting interactions
- Swipe gestures for hero selection
- Responsive layouts for all screen sizes
- Optimized for mobile sharing

## 🔗 Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

No environment variables required for the frontend-only version.

## 📄 License

Community project. Not affiliated with Valve Corporation.

---

Built with ❤️ for the Deadlock community
