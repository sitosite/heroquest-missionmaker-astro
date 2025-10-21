import React from 'react';
import { MissionProvider } from '../context/MissionContext.jsx';
import Board from './Board.jsx';
import ObjectItem from './ObjectItem.jsx';
import MissionControls from './MissionControls.jsx';

function App() {
    return (
        <MissionProvider>
            <div className="container mx-auto my-4">
                <h1 className="text-4xl font-bold text-center mb-4">HeroQuest Creador de Missions</h1>

                <MissionControls />

                <Board />

                <div className="container mx-auto my-4 border border-black p-4 mb-4">
                    <h2 className="text-2xl font-bold mb-2">Enemics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem title="Orcos" type="orco" size="1x1" quantity={6} />
                        <ObjectItem title="Goblins" type="goblin" size="1x1" quantity={8} />
                        <ObjectItem title="Esqueletos" type="esqueleto" size="1x1" quantity={4} />
                        <ObjectItem title="Zombies" type="zombie" size="1x1" quantity={2} />
                        <ObjectItem title="Abominaciones" type="abominaciones" size="1x1" quantity={3} />
                        <ObjectItem title="Guerreros del terror" type="caos" size="1x1" quantity={3} />
                        <ObjectItem title="Gargola" type="gargola" size="1x1" quantity={1} />
                    </div>
                </div>

                <div className="container mx-auto my-4 border border-black p-4 mb-4">
                    <h2 className="text-2xl font-bold mb-2">Trampes / Obstacles</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem
                            title="Casillas Dobles Bloqueadas"
                            type="pared-doble"
                            size="2x1"
                            quantity={6}
                        />
                    </div>
                </div>
            </div>
        </MissionProvider>
    );
}

export default App;
