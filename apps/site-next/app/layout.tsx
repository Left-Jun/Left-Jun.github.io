import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leftjun.com"),
  title: {
    default: "Left Jun",
    template: "%s | Left Jun"
  },
  description: "Left Jun 的个人游戏开发作品集，也是阈限开拓者的项目档案。",
  openGraph: {
    title: "Left Jun",
    description: "游戏原型、交互系统与软硬件项目。",
    url: "https://leftjun.com/",
    siteName: "Left Jun",
    images: ["/img/avatar.jpg"],
    type: "website"
  },
  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `
    try {
      var stored = localStorage.getItem('LeftJunColorScheme') || localStorage.getItem('LeftJunAstroColorScheme') || 'light';
      document.documentElement.dataset.scheme = stored === 'dark' ? 'dark' : 'light';
    } catch (_) {}
  `;
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
