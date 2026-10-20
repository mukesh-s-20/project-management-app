function ProjectCard({ project }) {
    return (
        <div className="project-card">
            <h3>{project.name}</h3>

            <p>Category: {project.category}</p>

            <p>Description: {project.description}</p>

            <p>Status: {project.status}</p>
        </div>
    );
}

export default ProjectCard;