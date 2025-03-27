// src/components/Dashboard/dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Sidebar from '../Sidebar';
import './Dashboard.scss';
import L from 'leaflet';
import { supabase } from '../../supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import UploadMainImage from '../UploadMainImage';
import ImageModal from '../ImageModal';

// Definicje ikon
const activeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const finalizedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const potentialIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const defaultCenter = { lat: 50.6419, lng: 18.1777 };

const MapClickHandler = ({ onMapClick }) => {
    useMapEvent('click', (event) => {
        console.log("[MapClickHandler] Map clicked at:", event.latlng);
        onMapClick(event);
    });
    return null;
};

const Dashboard = ({ toggleSidebar, sidebarOpen }) => {
    // Dane projektów (active/finalized) oraz potencjalnych tematów
    const [projectsData, setProjectsData] = useState([]);
    const [potentialTopics, setPotentialTopics] = useState([]);
    const [tempMarker, setTempMarker] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    // Filtr: "active", "finalized", "potential"
    const [filter, setFilter] = useState("active");
    const [modalImage, setModalImage] = useState(null);
    // Stan wyszukiwania
    const [searchQuery, setSearchQuery] = useState("");
    // Stany formularza dla potencjalnych tematów
    const [newPotentialTitle, setNewPotentialTitle] = useState("");
    const [newPotentialNote, setNewPotentialNote] = useState("");

    const fetchProjects = useCallback(async () => {
        console.log("[fetchProjects] Fetching projects...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error("[fetchProjects] Użytkownik nie jest zalogowany.");
            return;
        }
        const { data, error } = await supabase
            .from('projects')
            .select(`
        id, user_id, name, lat, lng, status, main_image, product, contacts (name), tasks (id)
      `)
            .eq('user_id', user.id);
        if (error) {
            console.error("[fetchProjects] Error:", error);
        } else {
            console.log("[fetchProjects] Fetched projects:", data);
            setProjectsData(data);
        }
    }, []);

    const fetchPotentialTopics = useCallback(async () => {
        console.log("[fetchPotentialTopics] Fetching potential topics...");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.error("[fetchPotentialTopics] Użytkownik nie jest zalogowany.");
            return;
        }
        const { data, error } = await supabase
            .from('potential_topics')
            .select(`id, user_id, title, note, lat, lng, main_image`)
            .eq('user_id', user.id);
        if (error) {
            console.error("[fetchPotentialTopics] Error:", error);
        } else {
            console.log("[fetchPotentialTopics] Fetched potential topics:", data);
            setPotentialTopics(data);
        }
    }, []);

    useEffect(() => {
        if (filter === "potential") {
            fetchPotentialTopics();
        } else {
            fetchProjects();
        }
    }, [filter, fetchProjects, fetchPotentialTopics]);

    // Definicja foundRecord – rekord dla wybranego markera
    const foundRecord = filter === "potential"
        ? (selectedMarker && selectedMarker.topicId ? potentialTopics.find(topic => topic.id === selectedMarker.topicId) : null)
        : (selectedMarker && selectedMarker.projectId ? projectsData.find(project => project.id === selectedMarker.projectId) : null);

    useEffect(() => {
        if (filter === "potential" && foundRecord) {
            setNewPotentialNote(foundRecord.note || "");
        }
    }, [filter, foundRecord]);

    // Przygotowanie markerów
    const markers = filter === "potential"
        ? potentialTopics
            .filter(topic => topic.lat !== null && topic.lng !== null)
            .map(topic => ({
                id: topic.id,
                position: { lat: parseFloat(topic.lat), lng: parseFloat(topic.lng) },
                topicId: topic.id,
                title: topic.title,
                note: topic.note,
            }))
        : projectsData
            .filter(project => project.lat !== null && project.lng !== null && project.status === filter)
            .map(project => ({
                id: project.id,
                position: { lat: parseFloat(project.lat), lng: parseFloat(project.lng) },
                projectId: project.id,
                name: project.name,
                main_image: project.main_image,
                product: project.product,
                status: project.status,
                contacts: project.contacts,
            }));

    const markersToShow = [...markers];
    if (tempMarker) {
        markersToShow.push(tempMarker);
    }

    // Filtrowanie markerów wg wyszukiwanej frazy
    const filteredMarkers = markersToShow.filter(marker => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        if (filter === "potential") {
            return (marker.title && marker.title.toLowerCase().includes(query)) ||
                (marker.note && marker.note.toLowerCase().includes(query));
        } else {
            // Zakładamy, że marker.contacts może być tablicą – sprawdzamy pierwszego elementu, jeżeli istnieje
            const contactName = marker.contacts && Array.isArray(marker.contacts)
                ? marker.contacts[0]?.name
                : marker.contacts?.name;
            return (marker.name && marker.name.toLowerCase().includes(query)) ||
                (marker.product && marker.product.toLowerCase().includes(query)) ||
                (contactName && contactName.toLowerCase().includes(query));
        }
    });

    // Funkcje aktualizacji
    const updateProjectLocation = async (id, lat, lng, table = 'projects') => {
        console.log(`[updateProjectLocation] Updating record ${id} in ${table} with ${lat}, ${lng}`);
        const { data, error } = await supabase
            .from(table)
            .update({ lat, lng })
            .eq('id', id);
        if (error) {
            console.error("[updateProjectLocation] Error:", error);
            return false;
        }
        console.log("[updateProjectLocation] Success:", data);
        return true;
    };

    const removeLocation = async (id, table) => {
        console.log(`[removeLocation] Removing location for ${id} in ${table}`);
        const { data, error } = await supabase
            .from(table)
            .update({ lat: null, lng: null })
            .eq('id', id);
        if (error) {
            console.error("[removeLocation] Error:", error);
            return false;
        }
        console.log("[removeLocation] Success:", data);
        return true;
    };

    const finalizeProject = async (id) => {
        console.log("[finalizeProject] Finalizing project", id);
        const { data, error } = await supabase
            .from('projects')
            .update({ status: 'finalized' })
            .eq('id', id);
        if (error) {
            console.error("[finalizeProject] Error:", error);
            alert("Nie udało się sfinalizować projektu.");
            return false;
        }
        console.log("[finalizeProject] Success:", data);
        return true;
    };

    const restoreProject = async (id) => {
        console.log("[restoreProject] Restoring project", id);
        const { data, error } = await supabase
            .from('projects')
            .update({ status: 'active' })
            .eq('id', id);
        if (error) {
            console.error("[restoreProject] Error:", error);
            alert("Nie udało się przywrócić projektu.");
            return false;
        }
        console.log("[restoreProject] Success:", data);
        return true;
    };

    const updateRecordComment = async (id, comment, table) => {
        console.log(`[updateRecordComment] Updating comment for ${id} in ${table} to:`, comment);
        const updateField = table === 'potential_topics' ? { note: comment } : { comment: comment };
        const { data, error } = await supabase
            .from(table)
            .update(updateField)
            .eq('id', id);
        if (error) {
            console.error("[updateRecordComment] Error:", error);
            return false;
        }
        console.log("[updateRecordComment] Success:", data);
        return true;
    };

    const deleteRecord = async (id, table) => {
        console.log(`[deleteRecord] Deleting record ${id} from ${table}`);
        const { data, error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
        if (error) {
            console.error("[deleteRecord] Error:", error);
            alert("Nie udało się usunąć rekordu.");
            return false;
        }
        console.log("[deleteRecord] Success:", data);
        return true;
    };

    const createPotentialProject = async () => {
        if (!newPotentialTitle.trim()) {
            alert("Podaj nazwę tematu.");
            return;
        }
        const marker = tempMarker || selectedMarker;
        if (!marker) {
            alert("Brak wybranej lokalizacji.");
            return;
        }
        const { data, error } = await supabase
            .from('potential_topics')
            .insert([
                {
                    title: newPotentialTitle,
                    note: newPotentialNote,
                    lat: marker.position.lat,
                    lng: marker.position.lng,
                    user_id: (await supabase.auth.getUser()).data.user.id,
                }
            ])
            .select();
        if (error) {
            console.error("[createPotentialProject] Error:", error);
            alert("Nie udało się utworzyć tematu.");
        } else {
            console.log("[createPotentialProject] Success:", data);
            const newTopic = data[0];
            if (selectedMarker) {
                selectedMarker.topicId = newTopic.id;
            }
            setNewPotentialTitle("");
            setNewPotentialNote("");
            await fetchPotentialTopics();
            setTempMarker(null);
            setSelectedMarker({ ...selectedMarker });
        }
    };

    const handleMapClick = useCallback((event) => {
        console.log("[handleMapClick] Map clicked at:", event.latlng);
        const newMarker = {
            id: uuidv4(),
            position: { lat: event.latlng.lat, lng: event.latlng.lng },
        };
        setTempMarker(newMarker);
        setSelectedMarker(newMarker);
    }, []);

    const handleMarkerClick = useCallback((marker) => {
        console.log("[handleMarkerClick] Marker clicked:", marker);
        setSelectedMarker(marker);
        setTempMarker(null);
    }, []);

    const handlePopupClose = useCallback(() => {
        console.log("[handlePopupClose] Popup closed");
        setSelectedMarker(null);
        setTempMarker(null);
    }, []);

    const handleRecordSelect = useCallback(
        async (e) => {
            const recordId = e.target.value;
            console.log("[handleRecordSelect] Selected record:", recordId);
            if (!recordId) return;
            const marker = tempMarker || selectedMarker;
            if (!marker) return;
            if (filter === "potential") {
                const success = await updateProjectLocation(recordId, marker.position.lat, marker.position.lng, 'potential_topics');
                if (success) {
                    console.log(`[handleRecordSelect] Potential topic ${recordId} updated with location: ${marker.position.lat}, ${marker.position.lng}`);
                    await fetchPotentialTopics();
                    setTempMarker(null);
                    setSelectedMarker(null);
                }
            } else {
                const success = await updateProjectLocation(recordId, marker.position.lat, marker.position.lng);
                if (success) {
                    console.log(`[handleRecordSelect] Project ${recordId} updated with location: ${marker.position.lat}, ${marker.position.lng}`);
                    await fetchProjects();
                    setTempMarker(null);
                    setSelectedMarker(null);
                }
            }
        },
        [tempMarker, selectedMarker, filter, fetchProjects, fetchPotentialTopics]
    );

    const handleRemoveMarker = useCallback(async () => {
        if (!selectedMarker) return;
        if (filter === "potential") {
            if (!selectedMarker.topicId) return;
            const success = await removeLocation(selectedMarker.topicId, 'potential_topics');
            if (success) {
                await fetchPotentialTopics();
                setSelectedMarker(null);
            }
        } else {
            if (!selectedMarker.projectId) return;
            const success = await removeLocation(selectedMarker.projectId, 'projects');
            if (success) {
                await fetchProjects();
                setSelectedMarker(null);
            }
        }
    }, [selectedMarker, filter, fetchProjects, fetchPotentialTopics]);

    const handleFinalizeProject = useCallback(async () => {
        if (!selectedMarker?.projectId) return;
        const success = await finalizeProject(selectedMarker.projectId);
        if (success) {
            await fetchProjects();
            setSelectedMarker(null);
        }
    }, [selectedMarker, fetchProjects]);

    const handleRestoreProject = useCallback(async () => {
        if (!selectedMarker?.projectId) return;
        const success = await restoreProject(selectedMarker.projectId);
        if (success) {
            await fetchProjects();
            setSelectedMarker(null);
        }
    }, [selectedMarker, fetchProjects]);

    const chosenIcon = filter === "active"
        ? activeIcon
        : filter === "finalized"
            ? finalizedIcon
            : potentialIcon;

    return (
        <div className="dashboard">
            <button className="hamburger" onClick={toggleSidebar}>
                {sidebarOpen ? '✖' : '☰'}
            </button>
            {sidebarOpen && <Sidebar />}

            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1200 }}>
                <input
                    type="text"
                    placeholder="Szukaj..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ position: 'absolute', top: 60, right: 20, zIndex: 1100 }}>
                <button onClick={() => setFilter("active")}>Aktywne</button>
                <button onClick={() => setFilter("finalized")}>Zakończone</button>
                <button onClick={() => setFilter("potential")}>Potencjalne tematy</button>
            </div>

            <MapContainer
                center={defaultCenter}
                zoom={12}
                className="leaflet-container"
                style={{ width: '100%', height: '100vh' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onMapClick={handleMapClick} />
                {filteredMarkers.map(marker => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        icon={chosenIcon}
                        eventHandlers={{
                            click: () => handleMarkerClick(marker),
                        }}
                    />
                ))}
                {selectedMarker && (
                    <Popup position={selectedMarker.position} onClose={handlePopupClose}>
                        <div className="popup-content">
                            <h3 className="popup-header">
                                {filter === "potential" ? "Potencjalny temat" : "Projekt / Inwestycja"}
                            </h3>
                            {filter === "potential" ? (
                                <>
                                    {foundRecord ? (
                                        <>
                                            <p><strong>Tytuł:</strong> {foundRecord.title}</p>
                                            <p><strong>Komentarz:</strong></p>
                                            <textarea
                                                placeholder="Edytuj komentarz..."
                                                value={newPotentialNote}
                                                onChange={(e) => setNewPotentialNote(e.target.value)}
                                                style={{ width: '100%', height: '80px', marginTop: '10px', padding: '5px' }}
                                            />
                                            <div className="popup-buttons">
                                                <button
                                                    onClick={async () => {
                                                        const success = await updateRecordComment(foundRecord.id, newPotentialNote, 'potential_topics');
                                                        if (success) {
                                                            console.log("[Popup] Comment updated.");
                                                            fetchPotentialTopics();
                                                        }
                                                    }}
                                                    style={{ marginTop: '10px', padding: '8px', width: '100%' }}
                                                >
                                                    Zapisz komentarz
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm("Czy na pewno chcesz usunąć ten temat?")) {
                                                            const success = await deleteRecord(foundRecord.id, 'potential_topics');
                                                            if (success) {
                                                                await fetchPotentialTopics();
                                                                setSelectedMarker(null);
                                                            }
                                                        }
                                                    }}
                                                    style={{ marginTop: '10px', padding: '8px', width: '100%', backgroundColor: '#555', color: '#fff' }}
                                                >
                                                    Usuń temat
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p>Utwórz nowy potencjalny temat:</p>
                                            <input
                                                type="text"
                                                placeholder="Tytuł tematu"
                                                value={newPotentialTitle}
                                                onChange={(e) => setNewPotentialTitle(e.target.value)}
                                                style={{ width: '100%', marginTop: '10px', padding: '5px' }}
                                            />
                                            <textarea
                                                placeholder="Dodaj komentarz..."
                                                value={newPotentialNote}
                                                onChange={(e) => setNewPotentialNote(e.target.value)}
                                                style={{ width: '100%', height: '80px', marginTop: '10px', padding: '5px' }}
                                            />
                                            <button
                                                onClick={createPotentialProject}
                                                style={{ marginTop: '10px', padding: '8px', width: '100%' }}
                                            >
                                                Utwórz temat
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p><strong>Nazwa projektu:</strong> {foundRecord.name}</p>
                                    <p><strong>Produkt:</strong> {foundRecord.product || 'Brak'}</p>
                                    <p><strong>Kontakt:</strong> {foundRecord.contacts?.name || 'Brak'}</p>
                                    <p><strong>Liczba zadań:</strong> {foundRecord.tasks?.length || 0}</p>
                                    <p><strong>Status:</strong> {foundRecord.status}</p>
                                    {foundRecord.main_image ? (
                                        <img
                                            src={foundRecord.main_image}
                                            alt="Główne zdjęcie"
                                            style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', marginTop: '10px', cursor: 'pointer' }}
                                            onClick={() => setModalImage(foundRecord.main_image)}
                                        />
                                    ) : (
                                        <>
                                            <p><em>Brak głównego zdjęcia</em></p>
                                            <UploadMainImage
                                                projectId={foundRecord.id}
                                                onUploadComplete={(url) => {
                                                    console.log("[Popup] Upload complete, new URL:", url);
                                                    fetchProjects();
                                                }}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </Popup>
                )}
            </MapContainer>

            {modalImage && (
                <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
            )}
        </div>
    );
};

export default Dashboard;
