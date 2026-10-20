import { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useParams
} from "react-router-dom";

import ProjectCard from "./components/ProjectCard";

const API = "https://70f770e6dce4-0af40515-5300.ws6.app/proxy/5000/api/projects";

// Project List Component
function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [category, setCategory] = useState("All");

    // Fetch projects from REST API
    useEffect(() => {
        fetch(API)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch projects");
                }

                return response.json();
            })
            .then(data => setProjects(data))
            .catch(error => console.error(error));
    }, []);

    // Filter projects by category
    const filteredProjects =
        category === "All"
            ? projects
            : projects.filter(
                project => project.category === category
            );

    return (
        <div>
            <h1>Project Management Application</h1>

            <label>Select Category: </label>

            <select
                value={category}
                onChange={event => setCategory(event.target.value)}
            >
                <option value="All">All</option>
                <option value="Web Development">
                    Web Development
                </option>
                <option value="AI">AI</option>
                <option value="Mobile App">Mobile App</option>
            </select>

            <div className="project-list">
                {filteredProjects.map(project => (
                    <div key={project._id}>
                        <ProjectCard project={project} />

                        <Link to={`/projects/${project._id}`}>
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Project Details Component
function ProjectDetails() {
    const { id } = useParams();

    const [project, setProject] = useState(null);

    useEffect(() => {
        fetch(`${API}/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Project not found");
                }

                return response.json();
            })
            .then(data => setProject(data))
            .catch(error => console.error(error));
    }, [id]);

    if (!project) {
        return <p>Loading project details...</p>;
    }

    return (
        <div>
            <h1>{project.name}</h1>

            <p>Category: {project.category}</p>

            <p>Description: {project.description}</p>

            <p>Status: {project.status}</p>

            <Link to="/">Back to Project List</Link>
        </div>
    );
}

// Main App Component
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<ProjectList />}
                />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetails />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;