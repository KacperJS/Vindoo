import React, { useState, useEffect } from 'react';
import ProjectForm from './TaskManagement/ProjectForm';
import ProjectList from './TaskManagement/ProjectList';
import { supabase } from '../supabaseClient';
import './TaskManagement/TaskManagement.scss'
const TaskManagement = () => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    contacts (id, name, email, phone)
                `);

            if (error) {
                console.error('Error fetching projects:', error);
            } else {
                console.log('Fetched projects with contacts:', data);
                setProjects(data);
            }
        };
        fetchProjects();
    }, []);

    const handleSave = async (projectData) => {
        const { id, contact_id, installationPrice, ...rest } = projectData;
        const projectDataToSave = { ...rest, installation_price: installationPrice, contact_id };

        try {
            let data, error;
            if (id) {
                ({ data, error } = await supabase
                    .from('projects')
                    .update(projectDataToSave)
                    .match({ id }));
            } else {
                ({ data, error } = await supabase
                    .from('projects')
                    .insert([projectDataToSave]));
            }

            if (error) {
                console.error('Error saving project:', error);
                alert('Failed to save project: ' + error.message);
            } else if (Array.isArray(data)) {
                setProjects([...projects, ...data]);
                alert('Project saved successfully!');
            } else {
                console.warn('Unexpected response format:', data);
                alert('Project saved, but response format was unexpected.');
            }
        } catch (err) {
            console.error('Failed to save project:', err);
        }
    };

    const handleProjectSelect = (project) => {
        setCurrentProject(project);
    };

    const handleDeleteProject = async (projectId) => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .match({ id: projectId });

            if (error) {
                console.error('Error deleting project:', error);
            } else {
                // Odśwież listę projektów po usunięciu
                const updatedProjects = await supabase
                    .from('projects')
                    .select(`
                        *,
                        contacts (id, name, email, phone)
                    `);  // Pobieranie projektów z kontaktami po usunięciu
                setProjects(updatedProjects.data);
                alert('Project deleted successfully!');
            }
        } catch (err) {
            console.error('Failed to delete project:', err);
        }
    };

    const handleAddTask = async (projectId, taskTitle) => {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ title: taskTitle, project_id: projectId }]);

            if (error) {
                console.error('Error adding task:', error);
            } else {
                const updatedProjects = await supabase
                    .from('projects')
                    .select('*, tasks(id, title, description, status, project_id)');
                setProjects(updatedProjects.data);
                alert('Task added successfully!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteTask = async (taskId, projectId) => {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .match({ id: taskId });

            if (error) {
                console.error('Error deleting task:', error);
            } else {
                const updatedProjects = await supabase
                    .from('projects')
                    .select('*, tasks(id, title, description, status, project_id)');
                setProjects(updatedProjects.data);
            }
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    return (
        <div className="task-management">
            <ProjectForm onSave={handleSave} project={currentProject} />
            <ProjectList
                projects={projects}
                onEdit={handleProjectSelect}
                onDelete={handleDeleteProject}  // Przekazanie funkcji usuwania projektu
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
            />
        </div>
    );
};

export default TaskManagement;
