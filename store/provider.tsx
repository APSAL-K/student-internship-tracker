'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from './store';

export function ReduxThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  );
}



