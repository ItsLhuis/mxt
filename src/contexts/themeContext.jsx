import { createContext, useContext, useEffect, useState } from "react"

const ThemeProviderContext = createContext()

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme)

  useEffect(() => {
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, theme)
    }

    document.documentElement.setAttribute("data-theme", theme)

    if (localStorage.getItem(storageKey) === "system") {
      const handleSystemThemeChange = (event) => {
        const systemTheme = event.matches ? "dark" : "light"
        document.documentElement.setAttribute("data-theme", systemTheme)
        setTheme(systemTheme)
      }

      const systemMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      systemMediaQuery.addEventListener("change", handleSystemThemeChange)

      handleSystemThemeChange(systemMediaQuery)

      return () => {
        systemMediaQuery.removeEventListener("change", handleSystemThemeChange)
      }
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme) => {
      setTheme(theme)
    }
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
