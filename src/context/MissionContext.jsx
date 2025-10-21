import React, { createContext, useContext, useState, useEffect } from 'react';

// Definició de l'inventari inicial de peces
const INITIAL_INVENTORY = {
    orco: { title: "Orcos", type: "orco", size: "1x1", total: 6 },
    goblin: { title: "Goblins", type: "goblin", size: "1x1", total: 8 },
    esqueleto: { title: "Esqueletos", type: "esqueleto", size: "1x1", total: 4 },
    zombie: { title: "Zombies", type: "zombie", size: "1x1", total: 2 },
    abominaciones: { title: "Abominaciones", type: "abominaciones", size: "1x1", total: 3 },
    caos: { title: "Guerreros del terror", type: "caos", size: "1x1", total: 3 },
    gargola: { title: "Gargola", type: "gargola", size: "1x1", total: 1 },
    "pared-doble": { title: "Casillas Dobles Bloqueadas", type: "pared-doble", size: "2x1", total: 6 }
};

const MissionContext = createContext();

export function MissionProvider({ children }) {
    // Estat de les peces col·locades al tauler
    const [placedPieces, setPlacedPieces] = useState({});

    // Inventari de peces disponibles
    const [inventory, setInventory] = useState(() => {
        const inv = {};
        Object.keys(INITIAL_INVENTORY).forEach(key => {
            inv[key] = { ...INITIAL_INVENTORY[key], available: INITIAL_INVENTORY[key].total };
        });
        return inv;
    });

    // Afegir una peça al tauler
    const addPieceToBoard = (cellId, pieceType) => {
        const piece = inventory[pieceType];

        if (!piece || piece.available <= 0) {
            console.warn(`No hi ha peces disponibles del tipus ${pieceType}`);
            return false;
        }

        // Actualitzar peces col·locades
        setPlacedPieces(prev => ({
            ...prev,
            [cellId]: {
                type: pieceType,
                ...INITIAL_INVENTORY[pieceType]
            }
        }));

        // Reduir inventari
        setInventory(prev => ({
            ...prev,
            [pieceType]: {
                ...prev[pieceType],
                available: prev[pieceType].available - 1
            }
        }));

        return true;
    };

    // Eliminar una peça del tauler
    const removePieceFromBoard = (cellId) => {
        const piece = placedPieces[cellId];

        if (!piece) return false;

        // Eliminar del tauler
        setPlacedPieces(prev => {
            const newState = { ...prev };
            delete newState[cellId];
            return newState;
        });

        // Retornar a l'inventari
        setInventory(prev => ({
            ...prev,
            [piece.type]: {
                ...prev[piece.type],
                available: prev[piece.type].available + 1
            }
        }));

        return true;
    };

    // Esborrar tot el tauler
    const clearBoard = () => {
        setPlacedPieces({});

        // Reiniciar inventari
        const newInventory = {};
        Object.keys(INITIAL_INVENTORY).forEach(key => {
            newInventory[key] = { ...INITIAL_INVENTORY[key], available: INITIAL_INVENTORY[key].total };
        });
        setInventory(newInventory);
    };

    // Guardar missió a localStorage
    const saveMission = (missionName = 'mission') => {
        const mission = {
            name: missionName,
            placedPieces,
            inventory,
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(`heroquest_mission_${missionName}`, JSON.stringify(mission));

        // Guardar també la llista de missions guardades
        const savedMissions = JSON.parse(localStorage.getItem('heroquest_saved_missions') || '[]');
        if (!savedMissions.includes(missionName)) {
            savedMissions.push(missionName);
            localStorage.setItem('heroquest_saved_missions', JSON.stringify(savedMissions));
        }

        return true;
    };

    // Carregar missió des de localStorage
    const loadMission = (missionName = 'mission') => {
        const savedMission = localStorage.getItem(`heroquest_mission_${missionName}`);

        if (!savedMission) {
            console.warn(`No s'ha trobat la missió ${missionName}`);
            return false;
        }

        const mission = JSON.parse(savedMission);
        setPlacedPieces(mission.placedPieces || {});
        setInventory(mission.inventory || {});

        return true;
    };

    // Obtenir llista de missions guardades
    const getSavedMissions = () => {
        return JSON.parse(localStorage.getItem('heroquest_saved_missions') || '[]');
    };

    // Exportar missió com a JSON
    const exportMission = () => {
        const mission = {
            placedPieces,
            inventory,
            exportedAt: new Date().toISOString()
        };
        return JSON.stringify(mission, null, 2);
    };

    // Importar missió des de JSON
    const importMission = (jsonString) => {
        try {
            const mission = JSON.parse(jsonString);
            setPlacedPieces(mission.placedPieces || {});
            setInventory(mission.inventory || {});
            return true;
        } catch (error) {
            console.error('Error important missió:', error);
            return false;
        }
    };

    const value = {
        placedPieces,
        inventory,
        addPieceToBoard,
        removePieceFromBoard,
        clearBoard,
        saveMission,
        loadMission,
        getSavedMissions,
        exportMission,
        importMission
    };

    return (
        <MissionContext.Provider value={value}>
            {children}
        </MissionContext.Provider>
    );
}

export function useMission() {
    const context = useContext(MissionContext);
    if (!context) {
        throw new Error('useMission ha de ser usat dins d\'un MissionProvider');
    }
    return context;
}
