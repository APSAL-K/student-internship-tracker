export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const theme = localStorage.getItem('theme-storage');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = theme ? JSON.parse(theme).state.theme === 'dark' : prefersDark;
            
            if (isDark) {
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.style.colorScheme = 'light';
            }
          } catch (e) {}
        `,
      }}
    />
  );
}
