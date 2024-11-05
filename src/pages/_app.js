import "@/styles/globals.css";
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from "@/components/ui/provider"

export default function App({ Component, pageProps }) {
  return(
    <Provider>
   <Component {...pageProps} />
   </Provider>
  )
}
