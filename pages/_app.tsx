import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createTheme, NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Layout } from '../components/layout/layout';

const lightTheme = createTheme({ type: 'light', theme: { colors: {} } });
const darkTheme = createTheme({ type: 'dark', theme: { colors: {} } });

type MyAppProps = AppProps & {
  Component: { noLayout?: boolean };
};

function MyApp({ Component, pageProps }: MyAppProps) {
   console.log(Component.noLayout)
  return (
    <NextThemesProvider
      defaultTheme="system"
      attribute="class"
      value={{ light: lightTheme.className, dark: darkTheme.className }}
    >
      <NextUIProvider>
        {Component.noLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </NextUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
