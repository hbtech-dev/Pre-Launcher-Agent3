import './globals.css';
import './pre-launcher.css';

export const metadata = {
  title: 'Agent3 — Pre-Launcher App',
  description: "Pakistan's Smartest Real Estate Platform Pre-Launch Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
