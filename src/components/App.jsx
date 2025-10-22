import React from 'react';
import { MissionProvider } from '../context/MissionContext.jsx';
import Board from './Board.jsx';
import ObjectItem from './ObjectItem.jsx';
import MissionControls from './MissionControls.jsx';
import MissionMetadataEditor from './MissionMetadataEditor.jsx';

function App() {
    return (
        <MissionProvider>
            <div className="container mx-auto my-4 px-4">
                <h1 className="text-4xl font-bold text-center mb-4">HeroQuest Creador de Missions</h1>

                <MissionMetadataEditor />

                <MissionControls />

                <div className="mb-4">
                    <Board />
                </div>

                <div className="mb-4 p-4 border-2 border-gray-800 rounded bg-white">
                    <h2 className="text-2xl font-bold mb-3">Enemics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem title="Orcos" type="orco" size="1x1" quantity={6} />
                        <ObjectItem title="Goblins" type="goblin" size="1x1" quantity={8} />
                        <ObjectItem title="Esqueletos" type="esqueleto" size="1x1" quantity={4} />
                        <ObjectItem title="Zombies" type="zombie" size="1x1" quantity={2} />
                        <ObjectItem title="Abominaciones" type="abominaciones" size="1x1" quantity={3} />
                        <ObjectItem title="Guerreros del terror" type="caos" size="1x1" quantity={3} />
                        <ObjectItem title="Gargola" type="gargola" size="1x1" quantity={1} />
                        <ObjectItem title="Mòmia" type="momia" size="1x1" quantity={1} />
                    </div>
                </div>

                <div className="mb-4 p-4 border-2 border-gray-800 rounded bg-white">
                    <h2 className="text-2xl font-bold mb-3">Portes</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem title="Porta" type="puerta" size="1x1" quantity={8} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">💡 Les portes es poden rotar amb clic dret</p>
                </div>

                <div className="mb-4 p-4 border-2 border-gray-800 rounded bg-white">
                    <h2 className="text-2xl font-bold mb-3">Mobles</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem title="Taula" type="mesa" size="1x1" quantity={4} />
                        <ObjectItem title="Armari" type="armario" size="1x1" quantity={4} />
                        <ObjectItem title="Llibreria" type="estanteria" size="1x1" quantity={2} />
                        <ObjectItem title="Llar de foc" type="chimenea" size="1x1" quantity={2} />
                        <ObjectItem title="Banc" type="banco" size="1x1" quantity={4} />
                        <ObjectItem title="Altar" type="altar" size="1x1" quantity={2} />
                    </div>
                </div>

                <div className="mb-4 p-4 border-2 border-gray-800 rounded bg-white">
                    <h2 className="text-2xl font-bold mb-3">Tresors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem title="Cofre" type="cofre" size="1x1" quantity={6} />
                    </div>
                </div>

                <div className="mb-4 p-4 border-2 border-gray-800 rounded bg-white">
                    <h2 className="text-2xl font-bold mb-3">Trampes / Obstacles</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem
                            title="Casillas Dobles Bloqueadas"
                            type="pared-doble"
                            size="2x1"
                            quantity={6}
                        />
                        <ObjectItem title="Fossa trampa" type="foso" size="1x1" quantity={4} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">💡 Els obstacles rotables es poden rotar amb clic dret</p>
                </div>

                <div className="mb-4 p-4 border-2 border-gray-800 rounded bg-white">
                    <h2 className="text-2xl font-bold mb-3">Escales</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <ObjectItem title="Escales" type="escaleras" size="2x2" quantity={2} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">💡 Les escales es poden rotar amb clic dret</p>
                </div>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                    <h3 className="font-bold mb-2">Instruccions:</h3>
                    <ul className="text-sm space-y-1">
                        <li>🖱️ <strong>Arrossegar:</strong> Agafa una peça i arrossega-la al tauler</li>
                        <li>🖱️ <strong>Clic esquerre:</strong> Elimina una peça del tauler</li>
                        <li>🖱️ <strong>Clic dret:</strong> Rota les peces rotables (portes, obstacles, escales)</li>
                        <li>💾 <strong>Guardar:</strong> Desa la teva missió per carregar-la més tard</li>
                        <li>📤 <strong>Exportar:</strong> Descarrega un fitxer JSON per compartir</li>
                    </ul>
                </div>
            </div>
        </MissionProvider>
    );
}

export default App;
