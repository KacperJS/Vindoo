import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ProjectList = ({ onEdit, onAddTask, onDeleteTask, onDelete }) => {
    const [newTask, setNewTask] = useState('');
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [projectsData, setProjectsData] = useState([]);


    const toggleDetails = (projectId) => {
        setActiveProjectId(activeProjectId === projectId ? null : projectId);
    };


    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.error("Użytkownik nie jest zalogowany.");
                return;
            }

            const { data, error } = await supabase
                .from('projects')
                .select('*, contacts (name), tasks (id, title)')
                .eq('user_id', user.id);  // Filtrowanie projektów na podstawie user_id

            if (error) {
                console.error('Error fetching projects:', error);
            } else {
                setProjectsData(data);
            }
        };

        fetchProjects();
    }, []);


    const handleAddTask = async (projectId) => {
        if (newTask.trim()) {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{ title: newTask, project_id: projectId }]);  // Dodawanie nowego zadania

            if (error) {
                console.error('Error adding task:', error);
            } else {
                setNewTask('');
                const { data: updatedProjects } = await supabase
                    .from('projects')
                    .select('*, contacts (name), tasks (id, title)')
                    .eq('user_id', (await supabase.auth.getUser()).data.user.id);
                setProjectsData(updatedProjects);
            }
        }
    };

    return (
        <div className="project-list">
            {projectsData.length > 0 ? (
                projectsData.map(project => (
                    <div key={project.id} className="project-item">
                        <div className="project-item-title" onClick={() => onEdit(project)}>
                            {project.name}
                        </div>
                        <div className={`project-item-details ${activeProjectId === project.id ? 'active' : ''}`}>
                            <p>Lokalizacja: {project.location}</p>
                            <p>Produkt: {project.product}</p>
                            <p>Cena: {project.price}</p>
                            <p>Cena instalacji: {project.installation_price}</p>
                            <p>VAT: {project.vat}</p>


                            <h4>Dane kontaktowe:</h4>
                            {project.contacts ? (
                                <div>
                                    <p>Imię i nazwisko: {project.contacts.name}</p>
                                </div>
                            ) : (
                                <p>Brak danych kontaktowych</p>
                            )}


                            <h4>Zadania:</h4>
                            {project.tasks && project.tasks.length > 0 ? (
                                project.tasks.map((task, index) => (
                                    <div key={index} className="task-item">
                                        <p>{task.title}</p>
                                        <button onClick={() => onDeleteTask(task.id, project.id)}>
                                            Usuń zadanie
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>Brak zadań</p>
                            )}


                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Nowe zadanie"
                            />
                            <button onClick={() => handleAddTask(project.id)}>Dodaj zadanie</button>
                        </div>

                        <button onClick={() => toggleDetails(project.id)}>Szczegóły</button>

                        <button onClick={() => onDelete(project.id)}>Usuń projekt</button>
                    </div>
                ))
            ) : (
                <p>Brak projektów</p>
            )}
        </div>
    );
};

export default ProjectList;
