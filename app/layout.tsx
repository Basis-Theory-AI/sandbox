import "./globals.css";
import { SnackbarContainer } from "./components/shared/Snackbar";

export const metadata = {
  title: "BT AI Playground",
  description: "Application for demonstrating the BT AI platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <SnackbarContainer />
      </body>
    </html>
  );
}
