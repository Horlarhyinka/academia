import crypto from "crypto";

export const genUid = () => crypto.randomBytes(12).toString("hex") + crypto.randomUUID().replace(/[-]/g, Math.floor(Math.random()*10000).toString() + Date.now().toString())
