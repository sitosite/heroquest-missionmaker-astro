import React, { useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.min.css';
import { useMission } from '../context/MissionContext.jsx';

function Board() {
    const { placedPieces, addPieceToBoard, removePieceFromBoard, movePieceOnBoard, rotatePiece, getDimensionsWithRotation } = useMission();
    const boardRef = useRef(null);
    const dragulaRef = useRef(null);

    const rows = 26;
    const columns = 19;

    // Funció per obtenir l'amplada i altura en percentatge segons les dimensions
    function getSizeStyle(size, rotation) {
        const dimensions = getDimensionsWithRotation(size, rotation);
        return {
            width: `calc(${dimensions.width * 100}% + ${(dimensions.width - 1) * 1}px)`,
            height: `calc(${dimensions.height * 100}% + ${(dimensions.height - 1) * 1}px)`
        };
    }

    // Funció per verificar si una cel·la conté la informació d'una peça (no és només una referència)
    const isPieceData = (data) => {
        return data && typeof data === 'object' && data.hasOwnProperty('id');
    };

    useEffect(() => {
        if (!boardRef.current) return;

        // Obtenir totes les cel·les del tauler i els contenidors d'objectes
        const cells = Array.from(boardRef.current.querySelectorAll('.cell'));
        const objectContainers = Array.from(document.querySelectorAll('.object-item'));

        // Combinar tots els contenidors
        const allContainers = [...cells, ...objectContainers];

        // Inicialitzar Dragula amb tots els contenidors
        dragulaRef.current = dragula(allContainers, {
            copy: function (el, source) {
                // Copiar si l'element és una imatge amb data-type (des de l'inventari)
                // Si ve del tauler, moure (no copiar)
                return el.hasAttribute('data-type') && !el.hasAttribute('data-piece-id');
            },
            accepts: function (el, target, source, sibling) {
                // Només acceptar en cel·les del tauler
                return target && target.classList.contains('cell');
            },
            moves: function (el, source, handle, sibling) {
                // Permetre arrossegar imatges de l'inventari (amb data-type)
                // o peces del tauler (amb data-piece-id)
                return el.tagName === 'IMG' && (el.hasAttribute('data-type') || el.hasAttribute('data-piece-id'));
            },
            removeOnSpill: function (el, source) {
                // Si ve del tauler i es tira fora, eliminar-la
                return el.hasAttribute('data-piece-id');
            },
            revertOnSpill: true
        });

        // Event quan es deixa anar una peça
        dragulaRef.current.on('drop', function (el, target, source, sibling) {
            if (target && target.classList.contains('cell')) {
                const targetCellId = target.dataset.cellId;
                const pieceId = el.getAttribute('data-piece-id');
                const pieceType = el.getAttribute('data-type');

                if (pieceId) {
                    // Moure peça existent
                    const sourceCellId = source.dataset.cellId;
                    const success = movePieceOnBoard(sourceCellId, targetCellId);

                    // Eliminar l'element que Dragula ha creat
                    el.remove();

                    if (!success) {
                        console.warn(`No s'ha pogut moure la peça`);
                    }
                } else if (pieceType) {
                    // Col·locar nova peça
                    const success = addPieceToBoard(targetCellId, pieceType);

                    // Eliminar l'element que Dragula ha creat
                    el.remove();

                    if (!success) {
                        console.warn(`No s'ha pogut col·locar la peça ${pieceType}`);
                    }
                } else {
                    console.error('No s\'ha pogut determinar el tipus de peça');
                    el.remove();
                }
            } else {
                // Si no s'ha deixat anar en una cel·la vàlida, eliminar l'element
                el.remove();
            }
        });

        // Event quan es tira una peça fora del tauler
        dragulaRef.current.on('remove', function (el, container, source) {
            const pieceId = el.getAttribute('data-piece-id');
            if (pieceId) {
                const sourceCellId = source.dataset.cellId;
                removePieceFromBoard(sourceCellId);
            }
        });

        // Netejar Dragula quan el component es desmunta
        return () => {
            if (dragulaRef.current) {
                dragulaRef.current.destroy();
            }
        };
    }, [placedPieces, addPieceToBoard, movePieceOnBoard, removePieceFromBoard]);

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
                            const cellData = placedPieces[cellId];

                            // Només renderitzar la peça si aquesta cel·la és l'origen de la peça
                            const piece = isPieceData(cellData) ? cellData : null;
                            const sizeStyle = piece ? getSizeStyle(piece.size, piece.rotation || 0) : {};

                            return (
                                <div
                                    className="cell w-full aspect-square border border-gray-400/20 relative"
                                    key={`cell-${rowIndex}-${columnIndex}`}
                                    data-cell-id={cellId}
                                >
                                    {piece && (
                                        <img
                                            src={`/items/${piece.type}.svg`}
                                            className="absolute top-0 left-0 object-contain cursor-move hover:opacity-80 transition-transform pointer-events-auto"
                                            style={{
                                                ...sizeStyle,
                                                transform: `rotate(${piece.rotation || 0}deg)`,
                                                transformOrigin: 'top left'
                                            }}
                                            alt={piece.title}
                                            data-piece-id={piece.id}
                                            data-type={piece.type}
                                            onClick={(e) => handlePieceClick(cellId, e)}
                                            onContextMenu={(e) => handlePieceRightClick(cellId, e)}
                                            title={`${piece.title} - Arrossegar: moure | Clic esquerre: eliminar | Clic dret: rotar`}
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