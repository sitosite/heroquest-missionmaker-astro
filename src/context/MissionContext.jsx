import React, { createContext, useContext, useState, useEffect } from 'react';

// Definició de l'inventari inicial de peces
const INITIAL_INVENTORY = {
    // Enemics
    orco: { title: "Orcos", type: "orco", size: "1x1", total: 6, category: "enemies" },
    goblin: { title: "Goblins", type: "goblin", size: "1x1", total: 8, category: "enemies" },
    esqueleto: { title: "Esqueletos", type: "esqueleto", size: "1x1", total: 4, category: "enemies" },
    zombie: { title: "Zombies", type: "zombie", size: "1x1", total: 2, category: "enemies" },
    abominaciones: { title: "Abominaciones", type: "abominaciones", size: "1x1", total: 3, category: "enemies" },
    caos: { title: "Guerreros del terror", type: "caos", size: "1x1", total: 3, category: "enemies" },
    gargola: { title: "Gargola", type: "gargola", size: "1x1", total: 1, category: "enemies" },
    momia: { title: "Mòmia", type: "momia", size: "1x1", total: 1, category: "enemies" },

    // Portes
    puerta: { title: "Porta", type: "puerta", size: "1x1", total: 8, category: "doors", rotatable: true },

    // Mobles
    mesa: { title: "Taula", type: "mesa", size: "1x1", total: 4, category: "furniture" },
    armario: { title: "Armari", type: "armario", size: "1x1", total: 4, category: "furniture" },
    estanteria: { title: "Llibreria", type: "estanteria", size: "1x1", total: 2, category: "furniture" },
    chimenea: { title: "Llar de foc", type: "chimenea", size: "1x1", total: 2, category: "furniture" },
    banco: { title: "Banc", type: "banco", size: "1x1", total: 4, category: "furniture" },
    altar: { title: "Altar", type: "altar", size: "1x1", total: 2, category: "furniture" },

    // Tresors
    cofre: { title: "Cofre", type: "cofre", size: "1x1", total: 6, category: "treasure" },

    // Trampes i obstacles
    "pared-doble": { title: "Casillas Dobles Bloqueadas", type: "pared-doble", size: "2x1", total: 6, category: "traps", rotatable: true },
    foso: { title: "Fossa trampa", type: "foso", size: "1x1", total: 4, category: "traps" },

    // Escales
    escaleras: { title: "Escales", type: "escaleras", size: "2x2", total: 2, category: "stairs", rotatable: true }
};

const MissionContext = createContext();

export function MissionProvider({ children }) {
    // Estat de les peces col·locades al tauler (amb rotació)
    const [placedPieces, setPlacedPieces] = useState({});

    // Inventari de peces disponibles
    const [inventory, setInventory] = useState(() => {
        const inv = {};
        Object.keys(INITIAL_INVENTORY).forEach(key => {
            inv[key] = { ...INITIAL_INVENTORY[key], available: INITIAL_INVENTORY[key].total };
        });
        return inv;
    });

    // Metadata de la missió
    const [missionMetadata, setMissionMetadata] = useState({
        name: '',
        description: '',
        difficulty: 'medium',
        author: '',
        createdAt: new Date().toISOString()
    });

    // Afegir una peça al tauler
    const addPieceToBoard = (cellId, pieceType) => {
        const piece = inventory[pieceType];

        if (!piece || piece.available <= 0) {
            console.warn(`No hi ha peces disponibles del tipus ${pieceType}`);
            return false;
        }

        // Actualitzar peces col·locades (amb rotació inicial de 0°)
        setPlacedPieces(prev => ({
            ...prev,
            [cellId]: {
                type: pieceType,
                rotation: 0,
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

    // Rotar una peça al tauler
    const rotatePiece = (cellId) => {
        const piece = placedPieces[cellId];

        if (!piece) return false;

        // Només rotar si la peça és rotable
        const pieceInfo = INITIAL_INVENTORY[piece.type];
        if (!pieceInfo || !pieceInfo.rotatable) {
            console.warn(`La peça ${piece.type} no es pot rotar`);
            return false;
        }

        // Rotar 90 graus (0 -> 90 -> 180 -> 270 -> 0)
        setPlacedPieces(prev => ({
            ...prev,
            [cellId]: {
                ...prev[cellId],
                rotation: (prev[cellId].rotation + 90) % 360
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

    // Actualitzar metadata de la missió
    const updateMissionMetadata = (updates) => {
        setMissionMetadata(prev => ({
            ...prev,
            ...updates
        }));
    };

    // Guardar missió a localStorage
    const saveMission = (missionName = 'mission') => {
        const mission = {
            name: missionName,
            placedPieces,
            inventory,
            metadata: {
                ...missionMetadata,
                name: missionName
            },
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
        if (mission.metadata) {
            setMissionMetadata(mission.metadata);
        }

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
            metadata: missionMetadata,
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
            if (mission.metadata) {
                setMissionMetadata(mission.metadata);
            }
            return true;
        } catch (error) {
            console.error('Error important missió:', error);
            return false;
        }
    };

    const value = {
        placedPieces,
        inventory,
        missionMetadata,
        addPieceToBoard,
        removePieceFromBoard,
        rotatePiece,
        clearBoard,
        updateMissionMetadata,
        saveMission,
        loadMission,
        getSavedMissions,
        exportMission,
        importMission,
        INITIAL_INVENTORY
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
