import React, { useState } from 'react';
import { useMission } from '../context/MissionContext.jsx';

function MissionMetadataEditor() {
    const { missionMetadata, updateMissionMetadata } = useMission();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (field, value) => {
        updateMissionMetadata({ [field]: value });
    };

    return (
        <div className="mb-4 p-4 bg-white border-2 border-gray-800 rounded">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">Informació de la Missió</h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded transition"
                >
                    {isExpanded ? 'Amagar' : 'Mostrar'}
                </button>
            </div>

            {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Nom de la Missió
                        </label>
                        <input
                            type="text"
                            value={missionMetadata.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="Ex: La Torre del Bruixot"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Autor
                        </label>
                        <input
                            type="text"
                            value={missionMetadata.author}
                            onChange={(e) => handleChange('author', e.target.value)}
                            placeholder="El teu nom"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">
                            Dificultat
                        </label>
                        <select
                            value={missionMetadata.difficulty}
                            onChange={(e) => handleChange('difficulty', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="easy">Fàcil</option>
                            <option value="medium">Mitjana</option>
                            <option value="hard">Difícil</option>
                            <option value="very_hard">Molt Difícil</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-1">
                            Descripció
                        </label>
                        <textarea
                            value={missionMetadata.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Descriu la missió, objectius, història..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            )}

            {/* Resum quan està tancat */}
            {!isExpanded && missionMetadata.name && (
                <div className="mt-2 text-sm text-gray-600">
                    <strong>{missionMetadata.name}</strong>
                    {missionMetadata.difficulty && (
                        <span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
                            {missionMetadata.difficulty === 'easy' && 'Fàcil'}
                            {missionMetadata.difficulty === 'medium' && 'Mitjana'}
                            {missionMetadata.difficulty === 'hard' && 'Difícil'}
                            {missionMetadata.difficulty === 'very_hard' && 'Molt Difícil'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default MissionMetadataEditor;
