# HeroQuest Mission Maker

Una aplicació web per crear missions personalitzades del joc de taula HeroQuest. Construïda amb Astro, React, Tailwind CSS i Dragula.

![HeroQuest Mission Maker](https://img.shields.io/badge/HeroQuest-Mission%20Maker-blue)
![Astro](https://img.shields.io/badge/Astro-3.5-orange)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Funcionalitats

### Gestió de Missions
- **Drag & Drop**: Arrossega peces des de l'inventari al tauler
- **Rotació de peces**: Click dret per rotar portes, obstacles i escales
- **Inventari intel·ligent**: Mostra peces disponibles/utilitzades en temps real
- **Metadata de missions**: Afegeix nom, descripció, dificultat i autor

### Tipus de Peces Disponibles
- **Enemics** (8 tipus): Orcos, Goblins, Esqueletos, Zombies, Abominacions, Guerrers del Terror, Gàrgola, Mòmia
- **Portes** (8 unitats): Portes rotables
- **Mobles** (6 tipus): Taules, Armaris, Llibreries, Llars de foc, Bancs, Altars
- **Tresors**: Cofres (6 unitats)
- **Trampes i Obstacles**: Parets dobles bloquejades, Fosses trampa
- **Escales** (2 unitats, mida 2x2, rotables)

### Persistència i Compartició
- **Guardar/Carregar**: Desa missions a localStorage
- **Exportar JSON**: Descarrega missions com a fitxer JSON
- **Importar JSON**: Carrega missions d'altres usuaris
- **Esborrar tot**: Reinicia el tauler (amb confirmació)

### Interfície
- Indicadors visuals d'inventari (verd/vermell)
- Peces utilitzades es mostren en gris
- Instruccions integrades
- Organització per categories

## 🚀 Estructura del Projecte

```text
/
├── public/
│   ├── items/          # Imatges SVG de les peces
│   └── tablero.jpg     # Imatge de fons del tauler
├── src/
│   ├── components/
│   │   ├── App.jsx                    # Component principal
│   │   ├── Board.jsx                  # Tauler amb drag & drop
│   │   ├── ObjectItem.jsx             # Peça d'inventari
│   │   ├── MissionControls.jsx        # Controls de missió
│   │   └── MissionMetadataEditor.jsx  # Editor de metadata
│   ├── context/
│   │   └── MissionContext.jsx         # Gestió d'estat global
│   └── pages/
│       └── index.astro                # Pàgina principal
└── package.json
```

## 🧞 Comandaments

Tots els comandaments s'executen des de l'arrel del projecte, des d'un terminal:

| Comandament               | Acció                                                |
| :------------------------ | :--------------------------------------------------- |
| `npm install`             | Instal·la les dependències                           |
| `npm run dev`             | Inicia el servidor de desenvolupament a `localhost:4321` |
| `npm run build`           | Compila el lloc per producció a `./dist/`            |
| `npm run preview`         | Previsualitza la compilació localment                |

## 🎮 Com Utilitzar l'Aplicació

1. **Iniciar el servidor**
   ```bash
   npm install
   npm run dev
   ```

2. **Crear una missió**
   - Omple la metadata de la missió (nom, autor, dificultat, descripció)
   - Arrossega peces des de l'inventari al tauler
   - Fes clic dret sobre peces rotables per rotar-les
   - Fes clic esquerre per eliminar peces del tauler

3. **Guardar la missió**
   - Click a "Guardar Missió"
   - Introdueix un nom per la missió
   - La missió es desa a localStorage

4. **Compartir la missió**
   - Click a "Exportar JSON"
   - Comparteix el fitxer JSON amb altres usuaris
   - Altres usuaris poden usar "Importar JSON" per carregar-la

## 🛠️ Tecnologies

- **Astro 3.5** - Framework web modern
- **React 18.2** - Components interactius
- **Tailwind CSS 3.3** - Estils
- **Dragula 3.7** - Funcionalitat drag & drop

## 📝 Llicència

Aquest projecte està sota llicència MIT.

## 🙏 Crèdits

Basat en el joc de taula HeroQuest de Hasbro/Avalon Hill.
