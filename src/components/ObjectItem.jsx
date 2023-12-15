import React from 'react';

function ObjectItem({ title, type, size, quantity = 1 }) {
    // Función para calcular clases de tamaño
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

    return (
        <div className="object-item">
            <p className="text-sm font-bold uppercase mb-1">{title}:</p>
            <div className="flex flex-wrap gap-1">
                {Array.from({ length: quantity }).map((_, i) => (
                    <img
                        key={i}
                        src={`/items/${type}.svg`}
                        className={sizeClasses}
                        alt={`${title} ${i + 1}`}
                        draggable="true"
                    />
                ))}
            </div>
        </div>
    );
}

export default ObjectItem;