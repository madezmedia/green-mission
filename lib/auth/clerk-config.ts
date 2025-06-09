import type { ClerkProviderProps } from "@clerk/nextjs"

export const clerkConfig: Partial<ClerkProviderProps> = {
  appearance: {
    baseTheme: undefined, // Will be set dynamically based on theme
    variables: {
      colorPrimary: "hsl(174, 55%, 40%)", // Green Mission primary color
      colorBackground: "hsl(var(--background))",
      colorInputBackground: "hsl(var(--input))",
      colorInputText: "hsl(var(--foreground))",
      colorText: "hsl(var(--foreground))",
      colorTextSecondary: "hsl(var(--muted-foreground))",
      colorDanger: "hsl(var(--destructive))",
      colorSuccess: "hsl(var(--color-gm-success))",
      colorWarning: "hsl(var(--color-gm-warning))",
      borderRadius: "0.75rem",
      fontFamily: "Inter, sans-serif",
    },
    elements: {
      formButtonPrimary: {
        backgroundColor: "hsl(174, 55%, 40%)",
        "&:hover": {
          backgroundColor: "hsl(174, 55%, 35%)",
        },
      },
      card: {
        backgroundColor: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      },
      headerTitle: {
        color: "hsl(var(--foreground))",
      },
      headerSubtitle: {
        color: "hsl(var(--muted-foreground))",
      },
      socialButtonsBlockButton: {
        backgroundColor: "hsl(var(--secondary))",
        border: "1px solid hsl(var(--border))",
        color: "hsl(var(--secondary-foreground))",
        "&:hover": {
          backgroundColor: "hsl(var(--secondary))",
          opacity: 0.8,
        },
      },
      formFieldInput: {
        backgroundColor: "hsl(var(--input))",
        border: "1px solid hsl(var(--border))",
        color: "hsl(var(--foreground))",
        "&:focus": {
          borderColor: "hsl(174, 55%, 40%)",
          boxShadow: "0 0 0 2px hsl(174, 55%, 40%, 0.2)",
        },
      },
      footerActionLink: {
        color: "hsl(174, 55%, 40%)",
        "&:hover": {
          color: "hsl(174, 55%, 35%)",
        },
      },
    },
  },
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/onboarding",
}

// Custom sign-in/sign-up page configurations
export const signInConfig = {
  ...clerkConfig,
  appearance: {
    ...clerkConfig.appearance,
    elements: {
      ...clerkConfig.appearance?.elements,
      rootBox: {
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
      },
      card: {
        ...clerkConfig.appearance?.elements?.card,
        padding: "2rem",
      },
    },
  },
}

export const signUpConfig = {
  ...clerkConfig,
  appearance: {
    ...clerkConfig.appearance,
    elements: {
      ...clerkConfig.appearance?.elements,
      rootBox: {
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto",
      },
      card: {
        ...clerkConfig.appearance?.elements?.card,
        padding: "2rem",
      },
    },
  },
}
