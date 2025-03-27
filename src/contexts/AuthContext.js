import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Załóżmy, że twoja konfiguracja Supabase znajduje się tutaj

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        const currentSession = supabase.auth.session();
        setSession(currentSession);

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        return () => {
            listener.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
