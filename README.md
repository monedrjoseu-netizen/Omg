# BOSQUE 99 — prototipo

Juego web 3D de supervivencia retro estilo PSX. Incluye movimiento en primera persona, bosque low-poly, fogata, ciclo día/noche, recolección de madera, combustible de fogata y sincronización básica de jugadores por WebSocket.

## Requisitos
- Node.js 18 o superior
- Conexión a internet para cargar Three.js desde CDN

## Ejecutar en tu PC
1. Descomprime el proyecto.
2. Abre una terminal dentro de la carpeta `bosque_99`.
3. Ejecuta `npm install`
4. Ejecuta `npm start`
5. Abre `http://localhost:3000`

Para probar multijugador en la misma red, abre esa dirección desde otros dispositivos usando la IP local del PC que ejecuta el servidor.

## Publicar online
Sube esta carpeta a un hosting que permita ejecutar Node.js y WebSockets (por ejemplo, un servicio de hosting de aplicaciones Node). Configura el comando de inicio `npm start`. Un hosting estático no sirve para el multijugador.

## Controles
- WASD o flechas: moverse
- Mouse: mirar
- E: recoger madera
- F: alimentar la fogata
- En móvil: botones táctiles en pantalla

## Estado del prototipo
Es una primera base jugable, no una copia exacta de ningún juego. La sincronización online actual cubre posiciones y recolección compartida. La persistencia, enemigos, inventario avanzado, construcción, chat, seguridad anti-trampas y salas dedicadas quedan para próximas versiones.
