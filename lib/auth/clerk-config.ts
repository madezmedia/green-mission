import type { ClerkProviderProps } from "@clerk/nextjs"

export const clerkConfig: Partial<ClerkProviderProps> = {
  appearance: {
    baseTheme: undefined, // Will be set dynamically based on theme
    variables: {
      colorPrimary: "hsl(174, 55%, 40%)",
      colorBackground: "hsl(0, 0%, 100%)",
      colorInputBackground: "hsl(165, 15%, 96%)",
      colorInputText: "hsl(195, 35%, 15%)",
      colorText: "hsl(195, 35%, 15%)",
      colorTextSecondary: "hsl(195, 25%, 45%)",
      colorDanger: "hsl(0, 84.2%, 60.2%)",
      colorSuccess: "hsl(158, 70%, 40%)",
      colorWarning: "hsl(45, 90%, 50%)",
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
        backgroundColor: "hsl(0, 0%, 100%)",
        border: "1px solid hsl(165, 15%, 94%)",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      },
      headerTitle: {
        color: "hsl(195, 35%, 15%)",
      },
      headerSubtitle: {
        color: "hsl(195, 25%, 45%)",
      },
      socialButtonsBlockButton: {
        backgroundColor: "hsl(165, 50%, 85%)",
        border: "1px solid hsl(165, 15%, 94%)",
        color: "hsl(195, 35%, 10%)",
        "&:hover": {
          backgroundColor: "hsl(165, 50%, 85%)",
          opacity: 0.8,
        },
      },
      formFieldInput: {
        backgroundColor: "hsl(165, 15%, 96%)",
        border: "1px solid hsl(165, 15%, 94%)",
        color: "hsl(195, 35%, 15%)",
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
