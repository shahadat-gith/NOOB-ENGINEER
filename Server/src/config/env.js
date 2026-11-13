import { config } from "dotenv"
config()

export const keys = {
    server:{
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || "development"
    },
    db:{
        uri: process.env.MONGODB_URI
    },
    jwt:{
        secret:process.env.JWT_SECRET,
        // Access tokens are short-lived; the refresh token keeps the session alive.
        expiresIn: process.env.JWT_EXPIRES_IN || "15m"
    },
    admin:{
        email: (process.env.ADMIN_EMAIL || "").toLowerCase().trim() || undefined,
        password: process.env.ADMIN_PASSWORD || undefined
    },
    auth:{
        frontendUrl: process.env.FRONTEND_URL || "",
        google:{
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl: process.env.GOOGLE_CALLBACK_URL
        },
        github:{
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackUrl: process.env.GITHUB_CALLBACK_URL
        }
    }
}