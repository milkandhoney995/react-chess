import './globals.scss'
import { Inter } from 'next/font/google'
import { ReduxProvider } from '@/providers/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'React Chess',
  description: 'A chess game built with Next.js and React',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  )
}
