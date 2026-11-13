import { keys } from "./config/env.js"
import { connectToDB } from "./lib/mongodb.js"
import app from "./app.js"

const port = Number(keys.server.port)

async function start() {
    await connectToDB()
    console.log("MongoDB connected")

    const server = app.listen(port, () => {
        console.log(`Server running on port ${port} (${keys.server.environment})`)
    })

    const shutdown = (signal) => {
        console.log(`${signal} received, shutting down`)
        server.close(async () => {
            const mongoose = (await import("mongoose")).default
            await mongoose.connection.close()
            process.exit(0)
        })
    }

    process.on("SIGINT", () => shutdown("SIGINT"))
    process.on("SIGTERM", () => shutdown("SIGTERM"))
}

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason)
})

start().catch((error) => {
    console.error("Failed to start server:", error.message)
    process.exit(1)
})
