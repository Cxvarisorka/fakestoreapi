import express from "express";

// Utils
import readFile from "../utils/readFile.js";
import changeFile from "../utils/changeFile.js";
import generateVerificationCode from "../utils/genereateCode.js";
import sendEmail from "../utils/sendEmail.js";

const adminsRoutes = express.Router();

const adminsPath = "admins.json";


// Admin registration

adminsRoutes.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admins = await readFile(adminsPath);
        const adminExists = admins.find(admin => admin.email === email);

        if(adminExists) {
            return res.status(409).json({ error: "Admin already exists" });
        }

        const verificationCode = generateVerificationCode()

        const admin = { email, password, id: Date.now(), isVerified: false, verificationCode };

        await changeFile(adminsPath, admin, "add");

        res.json({ message: "Registration successful. Please verify your email" });

    } catch(err) {
        return res.status(500).json({ error: "Failed to register admin" });
    }
})

adminsRoutes.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admins = await readFile(adminsPath);
        const adminExists = admins.find(admin => admin.email === email && admin.password === password);

        if(!adminExists) {
            return res.status(409).json({ error: "Invalid Credentials" });
        }

        return res.json(adminExists);

    } catch(err) {
        return res.status(500).json({ error: "Failed to register admin" });
    }
})

export default adminsRoutes;