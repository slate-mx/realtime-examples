import '@/styles/globals.css'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useMemo } from 'react'

import { RealtimeProvider } from '@/realtime.config'
import { inter } from '@/styles/fonts'

dayjs.extend(utc)

export default function App({ Component, pageProps }: AppProps) {
  const startOfHour = useMemo(() => dayjs().utc().format('YYMMDDHH').toString(), [])
  return (
    <>
      {/* https://github.com/vercel/next.js/issues/43674 */}
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
        }
      `}</style>

      <Head>
        <title>Realtime Example | Block text editor</title>
      </Head>

      <RealtimeProvider
        documentId={startOfHour}
        publicAuthKey={process.env.NEXT_PUBLIC_REALTIME_PUBLIC_AUTH_KEY}
      >
        <main className={`${inter.variable} font-sans relative`}>
          <Component {...pageProps} />
        </main>
      </RealtimeProvider>
    </>
  )
}
