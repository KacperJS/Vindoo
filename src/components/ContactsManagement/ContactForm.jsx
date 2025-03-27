import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

const ContactForm = ({ addContact, editContact, contactToEdit }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [interest, setInterest] = useState('');
    const [installation, setInstallation] = useState(false);
    const [source, setSource] = useState('');


    useEffect(() => {
        if (contactToEdit) {
            setName(contactToEdit.name || '');
            setEmail(contactToEdit.email || '');
            setPhone(contactToEdit.phone || '');
            setAddress(contactToEdit.address || '');
            setCity(contactToEdit.city || '');
            setPostalCode(contactToEdit.postal_code || '');
            setInterest(contactToEdit.interest || '');
            setInstallation(contactToEdit.installation || false);
            setSource(contactToEdit.source || '');
        }
    }, [contactToEdit]);

    const handleSubmit = async (event) => {
        event.preventDefault();


        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("Użytkownik nie jest zalogowany.");
            return;
        }


        const contact = {
            name,
            email,
            phone,
            address,
            city,
            postal_code: postalCode,
            interest,
            installation,
            source,
            user_id: user.id
        };

        if (contactToEdit) {

            editContact({ ...contact, id: contactToEdit.id });
        } else {

            addContact(contact);
        }


        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setCity('');
        setPostalCode('');
        setInterest('');
        setInstallation(false);
        setSource('');
    };

    return (
        <div className="contact-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Imię i nazwisko"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Telefon"
                    required
                />
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Adres"
                />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Miasto"
                />
                <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Kod pocztowy"
                />
                <input
                    type="text"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="Zainteresowanie"
                />
                <label>
                    <input
                        type="checkbox"
                        checked={installation}
                        onChange={(e) => setInstallation(e.target.checked)}
                    />
                    Zainteresowanie instalacją
                </label>
                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="Źródło"
                />
                <button type="submit">
                    {contactToEdit ? 'Zapisz zmiany' : 'Dodaj kontakt'}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
