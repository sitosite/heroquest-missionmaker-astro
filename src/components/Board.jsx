import React, { useEffect, useRef } from 'react';
import dragula from 'dragula';
import 'dragula/dist/dragula.min.css';

function Board() {

    const rows = 26;
    const columns = 19;

    return (
        <div className="board grid gap-[1px] grid-cols-26 bg-[url('/tablero.jpg')] bg-cover">
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div className="flex gap-[1px] flex-col" key={`row-${rowIndex}`}>
                    {Array.from({ length: columns }).map((_, columnIndex) => (
                        <div
                            className="cell w-full aspect-square"
                            key={`cell-${rowIndex}-${columnIndex}`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Board;