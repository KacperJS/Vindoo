import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const PinComponent = ({ pinData }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [projectDetails, setProjectDetails] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                console.error("Użytkownik nie jest zalogowany.");
                return;
            }

            const { data, error } = await supabase
                .from('projects')
                .select(`
                    id, name, product, contact_id,
                    contacts (id, name)
                `)
                .eq('user_id', user.id);

            console.log('Pobrane projekty:', data);

            if (error) {
                console.error('Error fetching projects:', error);
            } else {
                setProjects(data);
            }
        };
        fetchProjects();
    }, []);

    const handleProjectSelect = async (e) => {
        const projectId = e.target.value;
        setSelectedProjectId(projectId);

        const { data, error } = await supabase
            .from('projects')
            .select(`
                id, name, product,
                contacts (name),
                tasks (id)
            `)
            .eq('id', projectId)
            .single();

        if (error) {
            console.error('Error fetching project details:', error);
        } else {
            setProjectDetails(data);
        }
    };

    return (
        <div className="pin-component">
            <h3>Pinezka {pinData.pinId}</h3>

            <select value={selectedProjectId || ''} onChange={handleProjectSelect}>
                <option value="">Wybierz projekt</option>
                {projects.map(project => (
                    <option key={project.id} value={project.id}>
                        {project.name}
                    </option>
                ))}
            </select>

            {projectDetails && (
                <div className="project-details">
                    <h4>Projekt: {projectDetails.name}</h4>
                    <p>Kontakt: {projectDetails.contacts.name}</p>
                    <p>Produkt: {projectDetails.product}</p>
                    <p>Ilość zadań: {projectDetails.tasks.length}</p>
                </div>
            )}
        </div>
    );
};

export default PinComponent;
