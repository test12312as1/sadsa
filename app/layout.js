import './globals.css'

export const metadata = {
  title: 'LockArena - Deadlock Community Hub',
  description: 'Your competitive edge in Deadlock. Vote on hero rankings, track esports, predict outcomes, and open cases.',
  keywords: ['Deadlock', 'Valve', 'hero ranking', 'esports', 'gaming', 'community'],
  metadataBase: new URL('https://lockarena.com'),
  openGraph: {
    title: 'LockArena - Deadlock Community Hub',
    description: 'Vote on hero matchups, track esports, and compete in prediction markets.',
    type: 'website',
    siteName: 'LockArena',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LockArena',
    description: 'Your competitive edge in Deadlock',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#33FF33',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
