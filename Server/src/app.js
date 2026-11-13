import express from "express"
import cors from "cors"
import helmet from "helmet"
import { keys } from "./config/env.js"

const app = express()

app.disable("x-powered-by")
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: "100kb" }))

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: keys.server.environment })
})

// 404 for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

// Central error handler
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON body" })
    }

    const status = err.status || err.statusCode || 500
    if (status >= 500) console.error(err)

    res.status(status).json({
        message: status >= 500 && keys.server.environment === "production"
            ? "Internal server error"
            : err.message
    })
})

export default app
