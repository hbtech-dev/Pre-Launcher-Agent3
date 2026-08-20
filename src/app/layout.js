import './globals.css';
import './pre-launcher.css';

export const metadata = {
  metadataBase: new URL('https://agent3.pk'),
  title: {
    default: "Agent3 — Pakistan's Next-Gen Real Estate Ecosystem",
    template: "%s | Agent3 Pre-Launcher"
  },
  description: "Join Pakistan's premier PropTech ecosystem. Verified real estate agents, interactive society plot masterplans, AI valuations, and early access VIP perks.",
  keywords: [
    "Agent3",
    "Real Estate Pakistan",
    "Islamabad Real Estate",
    "Rawalpindi Properties",
    "Lahore Properties",
    "Karachi Properties",
    "Verified Real Estate Agents",
    "PropTech Pakistan",
    "Agent KYC Registration",
    "Plot Masterplans",
    "Society Dimension Maps"
  ],
  authors: [{ name: "True Prop Agents", url: "https://truepropagents.com/" }],
  creator: "True Prop Agents",
  publisher: "True Prop Agents",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' }
    ],
    apple: [
      { url: '/icon.png' }
    ],
    shortcut: ['/favicon.ico']
  },
  openGraph: {
    title: "Agent3 — Early Access Pre-Launcher Portal",
    description: "Join Pakistan's smartest real estate network. Verified agents, instant buyer leads, and interactive society maps.",
    url: "https://agent3.pk",
    siteName: "Agent3 PropTech",
    images: [
      {
        url: "/LOGO COLOR.png",
        width: 1200,
        height: 630,
        alt: "Agent3 Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent3 — Next-Gen Real Estate Early Access",
    description: "Pakistan's Next-Gen Real Estate Ecosystem. Complete KYC, verified listings, and early perks.",
    images: ["/LOGO COLOR.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  }
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#07090e' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('pl_theme');
                  var theme = saved ? saved : 'light';
                  document.documentElement.classList.remove('pl-theme-dark', 'pl-theme-light');
                  document.documentElement.classList.add('pl-theme-' + theme);
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
