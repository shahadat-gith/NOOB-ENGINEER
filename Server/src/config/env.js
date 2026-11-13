import { config } from "dotenv"
config()

export const keys = {
    server:{
        port: process.env.PORT || 5000,
        environment: process.env.NODE_ENV || "development"
    },
    db:{
        uri: process.env.MONGODB_URI
    },
    jwt:{
        secret:process.env.JWT_SECRET
    }
}