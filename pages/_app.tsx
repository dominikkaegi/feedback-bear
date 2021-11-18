// pages/_app.js
import type { AppProps } from 'next/app'
import { ChakraProvider } from "@chakra-ui/react"
import { Provider } from "next-auth/client";
import {Navigation} from "../components/landing/Navigation";

function MyApp({ Component, pageProps: { session, ...pageProps }, }: AppProps) {
  return (
    <>
      <Provider>
        <ChakraProvider>
            <Component {...pageProps} />
        </ChakraProvider>
      </Provider>
    </>
  )
}

export default MyApp
