const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Schema
const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

// Project Model
const Project = mongoose.model("Project", projectSchema);

// Insert sample data automatically
async function insertSampleData() {
    try {
        const count = await Project.countDocuments();

        if (count === 0) {
            await Project.insertMany([
                {
                    name: "E-Commerce Website",
                    category: "Web Development",
                    description: "An online shopping platform",
                    status: "In Progress"
                },
                {
                    name: "AI Chatbot",
                    category: "AI",
                    description: "An intelligent chatbot application",
                    status: "Completed"
                },
                {
                    name: "Mobile Banking App",
                    category: "Mobile App",
                    description: "A mobile application for banking",
                    status: "In Progress"
                }
            ]);

            console.log("Sample projects inserted successfully");
        } else {
            console.log("Project data already exists");
        }
    } catch (error) {
        console.error("Sample data error:", error.message);
    }
}

// API: Home
app.get("/", (req, res) => {
    res.send("Project Management API is running");
});

// API: Get all projects
app.get("/api/projects", async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
});

// API: Get project by ID
app.get("/api/projects/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({
            message: "Invalid project ID",
            error: error.message
        });
    }
});

// API: Add a new project
app.post("/api/projects", async (req, res) => {
    try {
        const project = new Project(req.body);
        const savedProject = await project.save();

        res.status(201).json({
            message: "Project added successfully",
            project: savedProject
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to add project",
            error: error.message
        });
    }
});

// API: Update a project
app.put("/api/projects/:id", async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update project",
            error: error.message
        });
    }
});

// API: Delete a project
app.delete("/api/projects/:id", async (req, res) => {
    try {
        const deletedProject = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!deletedProject) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
});

// Connect MongoDB and start server
const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error(
                "MONGO_URI is missing. Configure your .env file."
            );
        }

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected successfully");

        await insertSampleData();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();