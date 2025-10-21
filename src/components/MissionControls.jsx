import React, { useState } from 'react';
import { useMission } from '../context/MissionContext.jsx';

function MissionControls() {
    const {
        clearBoard,
        saveMission,
        loadMission,
        getSavedMissions,
        exportMission,
        importMission
    } = useMission();

    const [missionName, setMissionName] = useState('mission');
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showLoadDialog, setShowLoadDialog] = useState(false);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [importText, setImportText] = useState('');
    const [message, setMessage] = useState('');

    const handleSave = () => {
        if (!missionName.trim()) {
            setMessage('Error: El nom de la missió no pot estar buit');
            return;
        }

        saveMission(missionName);
        setMessage(`Missió "${missionName}" guardada correctament!`);
        setShowSaveDialog(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleLoad = (name) => {
        const success = loadMission(name);
        if (success) {
            setMessage(`Missió "${name}" carregada correctament!`);
        } else {
            setMessage(`Error: No s'ha pogut carregar la missió "${name}"`);
        }
        setShowLoadDialog(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleClear = () => {
        if (confirm('Estàs segur que vols esborrar tot el tauler? Aquesta acció no es pot desfer.')) {
            clearBoard();
            setMessage('Tauler esborrat correctament');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleExport = () => {
        const json = exportMission();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `heroquest_mission_${missionName}_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMessage('Missió exportada correctament!');
        setTimeout(() => setMessage(''), 3000);
    };

    const handleImport = () => {
        try {
            const success = importMission(importText);
            if (success) {
                setMessage('Missió importada correctament!');
                setShowImportDialog(false);
                setImportText('');
            } else {
                setMessage('Error: Format JSON invàlid');
            }
        } catch (error) {
            setMessage('Error: No s\'ha pogut importar la missió');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const savedMissions = getSavedMissions();

    return (
        <div className="mb-4 p-4 bg-white border-2 border-gray-800 rounded">
            <h2 className="text-xl font-bold mb-3">Controls de Missió</h2>

            {/* Missatge de feedback */}
            {message && (
                <div className={`mb-3 p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {/* Botons principals */}
            <div className="flex flex-wrap gap-2 mb-3">
                <button
                    onClick={() => setShowSaveDialog(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Guardar Missió
                </button>

                <button
                    onClick={() => setShowLoadDialog(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    disabled={savedMissions.length === 0}
                >
                    Carregar Missió
                </button>

                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                    Exportar JSON
                </button>

                <button
                    onClick={() => setShowImportDialog(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                    Importar JSON
                </button>

                <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                    Esborrar Tot
                </button>
            </div>

            {/* Diàleg de guardar */}
            {showSaveDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-3">Guardar Missió</h3>
                        <input
                            type="text"
                            value={missionName}
                            onChange={(e) => setMissionName(e.target.value)}
                            placeholder="Nom de la missió"
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-3"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel·lar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Diàleg de carregar */}
            {showLoadDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-3">Carregar Missió</h3>
                        {savedMissions.length === 0 ? (
                            <p className="text-gray-600 mb-3">No hi ha missions guardades</p>
                        ) : (
                            <div className="space-y-2 mb-3">
                                {savedMissions.map(name => (
                                    <button
                                        key={name}
                                        onClick={() => handleLoad(name)}
                                        className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-left"
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => setShowLoadDialog(false)}
                            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Cancel·lar
                        </button>
                    </div>
                </div>
            )}

            {/* Diàleg d'importar */}
            {showImportDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-bold mb-3">Importar Missió des de JSON</h3>
                        <textarea
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            placeholder="Enganxa el JSON aquí..."
                            className="w-full h-32 px-3 py-2 border border-gray-300 rounded mb-3 font-mono text-sm"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleImport}
                                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Importar
                            </button>
                            <button
                                onClick={() => {
                                    setShowImportDialog(false);
                                    setImportText('');
                                }}
                                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel·lar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MissionControls;
