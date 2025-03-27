import React, { useState, useEffect } from 'react';
import ContactForm from './ContactsManagement/ContactForm';
import ContactList from './ContactsManagement/ContactList';
import { supabase } from '../supabaseClient';
import './ContactsManagement/ContactsManagement.scss';

const ContactsManagement = () => {
    const [contacts, setContacts] = useState([]);
    const [contactToEdit, setContactToEdit] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            const { data, error } = await supabase.from('contacts').select('*');
            if (error) {
                console.error('Error fetching contacts:', error);
            } else {
                setContacts(data);
            }
        };

        fetchContacts();
    }, []);

    const addContact = async (contact) => {
        const { data, error } = await supabase.from('contacts').insert([contact]);
        if (error) {
            console.error('Error adding contact:', error);
            alert('Failed to add contact: ' + error.message);
        } else {
            setContacts([...contacts, ...data]);
        }
    };

    const editContact = async (contact) => {
        const { id, ...updatedContact } = contact;
        const { error } = await supabase
            .from('contacts')
            .update(updatedContact)
            .eq('id', id);

        if (error) {
            console.error('Error updating contact:', error);
            alert('Failed to update contact: ' + error.message);
        } else {
            setContacts(contacts.map(c => c.id === id ? { ...c, ...contact } : c));
            setContactToEdit(null); // Resetuj formularz po edycji
        }
    };

    const deleteContact = async (id) => {
        const { error } = await supabase.from('contacts').delete().eq('id', id);
        if (error) {
            console.error('Error deleting contact:', error);
        } else {
            setContacts(contacts.filter(contact => contact.id !== id));
        }
    };

    const handleEditClick = (contact) => {
        setContactToEdit(contact); // Ustaw dane kontaktu do edycji
    };

    return (
        <div className="contacts-management">
            <ContactForm addContact={addContact} editContact={editContact} contactToEdit={contactToEdit} />
            <ContactList contacts={contacts} editContact={handleEditClick} deleteContact={deleteContact} />
        </div>
    );
};

export default ContactsManagement;
