import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ApolloProvider } from "@apollo/client";
import client from "../apollo";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';

import theme from "../theme";
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
      <AuthProvider>
        <ApolloProvider client={client}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppWrapper>
              <Component {...pageProps} />
            </AppWrapper>
          </ThemeProvider>
        </ApolloProvider>
      </AuthProvider>
    </CacheProvider>
  )
}

export default MyApp
