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
    // Estat de les peces col·locades al tauler (amb rotació i mida)
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

    // Funció per convertir mida "2x1" a {width: 2, height: 1}
    const parseSizeString = (sizeStr) => {
        const [width, height] = sizeStr.split('x').map(Number);
        return { width, height };
    };

    // Funció per obtenir dimensions amb rotació aplicada
    const getDimensionsWithRotation = (size, rotation) => {
        const { width, height } = parseSizeString(size);
        // Si rotació és 90 o 270 graus, intercanviem amplada i altura
        if (rotation === 90 || rotation === 270) {
            return { width: height, height: width };
        }
        return { width, height };
    };

    // Funció per convertir cellId "row-col" a {row, col}
    const parseCellId = (cellId) => {
        const [row, col] = cellId.split('-').map(Number);
        return { row, col };
    };

    // Funció per obtenir totes les cel·les que ocupa una peça
    const getOccupiedCells = (cellId, size, rotation) => {
        const { row, col } = parseCellId(cellId);
        const { width, height } = getDimensionsWithRotation(size, rotation);
        const cells = [];

        for (let r = row; r < row + height; r++) {
            for (let c = col; c < col + width; c++) {
                cells.push(`${r}-${c}`);
            }
        }

        return cells;
    };

    // Funció per verificar si es pot col·locar una peça
    const canPlacePiece = (cellId, size, rotation, excludePieceId = null) => {
        const occupiedCells = getOccupiedCells(cellId, size, rotation);

        // Verificar que totes les cel·les estiguin dins del tauler
        for (const cell of occupiedCells) {
            const { row, col } = parseCellId(cell);
            if (row < 0 || row >= 26 || col < 0 || col >= 19) {
                return false;
            }
        }

        // Verificar que totes les cel·les estiguin lliures (o siguin del excludePieceId)
        for (const cell of occupiedCells) {
            const pieceAtCell = placedPieces[cell];
            if (pieceAtCell && pieceAtCell !== excludePieceId) {
                return false;
            }
        }

        return true;
    };

    // Afegir una peça al tauler
    const addPieceToBoard = (cellId, pieceType) => {
        const piece = inventory[pieceType];

        if (!piece || piece.available <= 0) {
            console.warn(`No hi ha peces disponibles del tipus ${pieceType}`);
            return false;
        }

        const pieceInfo = INITIAL_INVENTORY[pieceType];
        const rotation = 0;

        // Verificar que es pot col·locar
        if (!canPlacePiece(cellId, pieceInfo.size, rotation)) {
            console.warn(`No es pot col·locar la peça a aquesta posició`);
            return false;
        }

        // Generar ID únic per la peça
        const pieceId = `${pieceType}-${Date.now()}-${Math.random()}`;

        // Obtenir totes les cel·les que ocuparà
        const occupiedCells = getOccupiedCells(cellId, pieceInfo.size, rotation);

        // Actualitzar peces col·locades
        setPlacedPieces(prev => {
            const newPieces = { ...prev };

            // Guardar la referència del pieceId a totes les cel·les ocupades
            occupiedCells.forEach(cell => {
                newPieces[cell] = pieceId;
            });

            // Guardar la informació de la peça amb la cel·la d'origen
            newPieces[pieceId] = {
                id: pieceId,
                type: pieceType,
                cellId: cellId, // Cel·la d'origen (top-left)
                rotation: rotation,
                ...pieceInfo,
                occupiedCells
            };

            return newPieces;
        });

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
        const pieceId = placedPieces[cellId];
        if (!pieceId || typeof pieceId !== 'string' || !pieceId.includes('-')) return false;

        const piece = placedPieces[pieceId];
        if (!piece) return false;

        // Només rotar si la peça és rotable
        const pieceInfo = INITIAL_INVENTORY[piece.type];
        if (!pieceInfo || !pieceInfo.rotatable) {
            console.warn(`La peça ${piece.type} no es pot rotar`);
            return false;
        }

        // Calcular nova rotació
        const newRotation = (piece.rotation + 90) % 360;

        // Verificar que amb la nova rotació cap en l'espai
        if (!canPlacePiece(piece.cellId, piece.size, newRotation, pieceId)) {
            console.warn(`No hi ha espai per rotar la peça`);
            return false;
        }

        // Actualitzar peces col·locades
        setPlacedPieces(prev => {
            const newPieces = { ...prev };

            // Esborrar referències antigues
            piece.occupiedCells.forEach(cell => {
                delete newPieces[cell];
            });

            // Calcular noves cel·les ocupades
            const newOccupiedCells = getOccupiedCells(piece.cellId, piece.size, newRotation);

            // Afegir noves referències
            newOccupiedCells.forEach(cell => {
                newPieces[cell] = pieceId;
            });

            // Actualitzar informació de la peça
            newPieces[pieceId] = {
                ...piece,
                rotation: newRotation,
                occupiedCells: newOccupiedCells
            };

            return newPieces;
        });

        return true;
    };

    // Eliminar una peça del tauler
    const removePieceFromBoard = (cellId) => {
        const pieceId = placedPieces[cellId];
        if (!pieceId || typeof pieceId !== 'string' || !pieceId.includes('-')) return false;

        const piece = placedPieces[pieceId];
        if (!piece) return false;

        // Eliminar del tauler
        setPlacedPieces(prev => {
            const newPieces = { ...prev };

            // Esborrar totes les referències
            piece.occupiedCells.forEach(cell => {
                delete newPieces[cell];
            });

            // Esborrar la informació de la peça
            delete newPieces[pieceId];

            return newPieces;
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

    // Moure una peça ja col·locada al tauler
    const movePieceOnBoard = (oldCellId, newCellId) => {
        const pieceId = placedPieces[oldCellId];
        if (!pieceId || typeof pieceId !== 'string' || !pieceId.includes('-')) return false;

        const piece = placedPieces[pieceId];
        if (!piece) return false;

        // Verificar que es pot moure a la nova posició
        if (!canPlacePiece(newCellId, piece.size, piece.rotation, pieceId)) {
            console.warn(`No es pot moure la peça a aquesta posició`);
            return false;
        }

        // Actualitzar peces col·locades
        setPlacedPieces(prev => {
            const newPieces = { ...prev };

            // Esborrar referències antigues
            piece.occupiedCells.forEach(cell => {
                delete newPieces[cell];
            });

            // Calcular noves cel·les ocupades
            const newOccupiedCells = getOccupiedCells(newCellId, piece.size, piece.rotation);

            // Afegir noves referències
            newOccupiedCells.forEach(cell => {
                newPieces[cell] = pieceId;
            });

            // Actualitzar informació de la peça
            newPieces[pieceId] = {
                ...piece,
                cellId: newCellId,
                occupiedCells: newOccupiedCells
            };

            return newPieces;
        });

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
        movePieceOnBoard,
        rotatePiece,
        clearBoard,
        updateMissionMetadata,
        saveMission,
        loadMission,
        getSavedMissions,
        exportMission,
        importMission,
        INITIAL_INVENTORY,
        getDimensionsWithRotation
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
