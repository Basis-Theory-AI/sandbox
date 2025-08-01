import Script from 'next/script'
import './globals.css'

export const metadata = {
    title: 'BT AI Demo',
    description: 'BT AI Demo',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <Script
                    src="https://js.basistheory.com"
                    strategy="beforeInteractive"
                />
            </head>
            <body>{children}</body>
        </html>
    )
} 