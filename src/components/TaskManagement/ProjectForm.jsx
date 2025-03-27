import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './TaskManagement.scss'
const ProjectForm = ({ onSave, project }) => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        product: '',
        price: '',
        installationPrice: '',
        vat: '23',
        contact_id: ''
    });

    const [contacts, setContacts] = useState([]);


    useEffect(() => {
        const fetchContacts = async () => {
            const { data, error } = await supabase
                .from('contacts')
                .select('id, name');

            if (error) {
                console.error('Error fetching contacts:', error);
            } else {
                setContacts(data);
            }
        };
        fetchContacts();
    }, []);

    useEffect(() => {
        if (project) {
            setFormData({
                name: project?.name ?? '',
                location: project?.location ?? '',
                product: project?.product ?? '',
                price: project?.price?.toString() ?? '',
                installationPrice: project?.installation_price?.toString() ?? '',
                vat: project?.vat?.toString() ?? '23',
                contact_id: project?.contact_id ?? ''
            });
        }
    }, [project]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            console.error("Użytkownik nie jest zalogowany.");
            return;
        }

        const projectData = {
            ...formData,
            user_id: user.id
        };

        try {

            const { data, error } = await supabase
                .from('projects')
                .insert([projectData]);

            if (error) {
                console.error('Error saving project:', error);
                alert('Failed to save project: ' + error.message);
            } else {

                alert('Project saved successfully!');
                onSave();
            }
        } catch (err) {
            console.error('Failed to save project:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <label>
                Tytuł projektu
                <input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Nazwa projektu" required />
            </label>
            <label>
                Lokalizacja
                <input name="location" type="text" value={formData.location} onChange={handleChange} placeholder="Lokalizacja" required />
            </label>
            <label>
                Produkt
                <input name="product" type="text" value={formData.product} onChange={handleChange} placeholder="Produkt" required />
            </label>
            <label>
                Cena
                <input name="price" type="text" value={formData.price} onChange={handleChange} placeholder="Cena" required />
            </label>
            <label>
                Cena instalacji
                <input name="installationPrice" type="text" value={formData.installationPrice} onChange={handleChange} placeholder="Cena instalacji" required />
            </label>
            <label>
                VAT
                <input name="vat" type="text" value={formData.vat} onChange={handleChange} placeholder="VAT" required />
            </label>
            <label>
                Wybierz Kontakt
                <select name="contact_id" value={formData.contact_id} onChange={handleChange} required>
                    <option value="">Wybierz Kontakt</option>
                    {contacts.map(contact => (
                        <option key={contact.id} value={contact.id}>
                            {contact.name}
                        </option>
                    ))}
                </select>
            </label>
            <button type="submit">Zapisz zmiany</button>
        </form>
    );
};

export default ProjectForm;
