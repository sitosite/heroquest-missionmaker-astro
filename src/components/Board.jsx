import React, { useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.min.css';
import { useMission } from '../context/MissionContext.jsx';

function Board() {
    const { placedPieces, addPieceToBoard, removePieceFromBoard, rotatePiece } = useMission();
    const boardRef = useRef(null);
    const dragulaRef = useRef(null);

    const rows = 26;
    const columns = 19;

    // Funció per obtenir les classes de mida
    function getSizeClasses(size) {
        const sizeMap = {
            "1x1": "w-full h-full",
            "2x1": "w-[200%] h-full",
            "3x1": "w-[300%] h-full",
            "2x2": "w-[200%] h-[200%]",
            "3x3": "w-[300%] h-[300%]",
        };
        return sizeMap[size] || "w-full h-full";
    }

    useEffect(() => {
        if (!boardRef.current) return;

        // Obtenir totes les cel·les del tauler i els contenidors d'objectes
        const cells = Array.from(boardRef.current.querySelectorAll('.cell'));
        const objectContainers = Array.from(document.querySelectorAll('.object-item'));

        // Inicialitzar Dragula
        dragulaRef.current = dragula([...cells, ...objectContainers], {
            copy: function (el, source) {
                // Copiar només des dels contenidors d'objectes (no des del tauler)
                return source.classList.contains('object-item');
            },
            accepts: function (el, target) {
                // Només acceptar en cel·les del tauler i que estiguin buides
                if (!target.classList.contains('cell')) return false;

                // Verificar si la cel·la ja té una peça
                const cellId = target.dataset.cellId;
                return !placedPieces[cellId];
            },
            removeOnSpill: false
        });

        // Event quan es deixa anar una peça
        dragulaRef.current.on('drop', function (el, target, source) {
            if (target && target.classList.contains('cell')) {
                const cellId = target.dataset.cellId;
                const pieceType = el.dataset.type;

                // Intentar afegir la peça al tauler
                const success = addPieceToBoard(cellId, pieceType);

                if (!success) {
                    // Si no s'ha pogut afegir, eliminar l'element
                    el.remove();
                }
            }
        });

        // Netejar Dragula quan el component es desmunta
        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
            }
        };
    }, [placedPieces, addPieceToBoard]);

    // Funció per gestionar el clic en una peça col·locada (per eliminar-la)
    const handlePieceClick = (cellId, event) => {
        event.stopPropagation();
        removePieceFromBoard(cellId);
    };

    // Funció per gestionar el clic dret (rotar peça)
    const handlePieceRightClick = (cellId, event) => {
        event.preventDefault();
        event.stopPropagation();
        rotatePiece(cellId);
    };

    return (
        <div className="border-2 border-gray-800 p-2 bg-gray-100">
            <div ref={boardRef} className="board grid gap-[1px] grid-cols-26 bg-[url('/tablero.jpg')] bg-cover">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div className="flex gap-[1px] flex-col" key={`row-${rowIndex}`}>
                        {Array.from({ length: columns }).map((_, columnIndex) => {
                            const cellId = `${rowIndex}-${columnIndex}`;
                            const piece = placedPieces[cellId];

                            return (
                                <div
                                    className="cell w-full aspect-square border border-gray-400/20 relative"
                                    key={`cell-${rowIndex}-${columnIndex}`}
                                    data-cell-id={cellId}
                                >
                                    {piece && (
                                        <img
                                            src={`/items/${piece.type}.svg`}
                                            className={`${getSizeClasses(piece.size)} absolute top-0 left-0 object-contain cursor-pointer hover:opacity-80 transition-transform`}
                                            style={{ transform: `rotate(${piece.rotation || 0}deg)` }}
                                            alt={piece.title}
                                            onClick={(e) => handlePieceClick(cellId, e)}
                                            onContextMenu={(e) => handlePieceRightClick(cellId, e)}
                                            title={`${piece.title} - Clic esquerre: eliminar | Clic dret: rotar`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Board;