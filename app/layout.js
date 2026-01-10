import './globals.css'

export const metadata = {
  title: 'GambleScan - Gambling Behavior Diagnostic',
  description: 'A diagnostic tool that scans cryptocurrency wallets to detect patterns of compulsive gambling behavior',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

