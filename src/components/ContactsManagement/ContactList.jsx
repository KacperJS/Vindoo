import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const ContactList = ({ contacts, editContact, deleteContact }) => {
    return (
        <div className="contact-list">
            <h2>Lista kontaktów</h2>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id} className="contact-item">
                        <div className="contact-info">
                            <p><strong>Imię:</strong> {contact.name}</p>
                            <p><strong>Email:</strong> {contact.email}</p>
                            <p><strong>Telefon:</strong> {contact.phone}</p>
                            <p><strong>Adres:</strong> {contact.address}</p>
                            <p><strong>Miasto:</strong> {contact.city}</p>
                        </div>
                        <div className="contact-actions">
                            <button onClick={() => editContact(contact)}><FaEdit /></button>
                            <button onClick={() => deleteContact(contact.id)}><FaTrash /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactList;
