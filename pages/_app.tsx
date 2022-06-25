import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ApolloProvider } from "@apollo/client";
import client from "../apollo";
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import ThemeProviderWrapper from '../theme/ThemeProvider';
import AuthProvider from '../hocs/providers/AuthProvider';
import createEmotionCache from '../config/emotionCache';
import AppWrapper from "../hocs/layout";

const clientSideEmotionCache = createEmotionCache();

interface CustojmAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function MyApp(props: CustojmAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProviderWrapper>
        <CssBaseline />
        <AuthProvider>
          <ApolloProvider client={client}>
            <AppWrapper>
              <Component {...pageProps} />
            </AppWrapper>
          </ApolloProvider>
        </AuthProvider>
      </ThemeProviderWrapper>
    </CacheProvider>
  )
}

export default MyApp
