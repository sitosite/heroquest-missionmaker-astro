import React from 'react';
import { useMission } from '../context/MissionContext.jsx';

function ObjectItem({ title, type, size, quantity = 1 }) {
    const { inventory } = useMission();

    // Funció per calcular classes de mida
    function getSizeClasses(size) {
        const sizeMap = {
            "1x1": "w-8 h-8",
            "2x1": "w-16 h-8",
            "3x1": "w-24 h-8",
            "2x2": "w-16 h-16",
            "3x3": "w-24 h-24",
        };
        return sizeMap[size] || "w-8 h-8";
    }

    const sizeClasses = getSizeClasses(size);
    const itemInventory = inventory[type] || { available: 0, total: quantity };
    const available = itemInventory.available;

    return (
        <div className="p-2 border border-gray-300 rounded">
            <p className="text-sm font-bold uppercase mb-1">
                {title}
                <span className={`ml-2 ${available === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ({available}/{itemInventory.total})
                </span>
            </p>
            <div className="object-item flex flex-wrap gap-1">
                {Array.from({ length: available }).map((_, i) => (
                    <img
                        key={i}
                        src={`/items/${type}.svg`}
                        className={`${sizeClasses} cursor-grab active:cursor-grabbing`}
                        alt={`${title} ${i + 1}`}
                        data-type={type}
                    />
                ))}
                {/* Mostrar peces utilitzades com a grises */}
                {Array.from({ length: itemInventory.total - available }).map((_, i) => (
                    <img
                        key={`used-${i}`}
                        src={`/items/${type}.svg`}
                        className={`${sizeClasses} opacity-30 cursor-not-allowed pointer-events-none`}
                        alt={`${title} utilitzat ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ObjectItem;