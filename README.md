# 🎮 Triqui (Tic-Tac-Toe) - Mini Juego Web

Un clásico juego de Tres en Raya (Triqui) interactivo y responsivo. Este proyecto destaca por su implementación de lógica algorítmica pura, ofreciendo desde un modo multijugador local hasta una inteligencia artificial imbatible basada en el algoritmo Minimax. 

## 🚀 Características Principales

* **Modo 1 vs 1 (Local):** Dos jugadores compiten en la misma pantalla alternando turnos.
* **Modo 1 vs PC:** Enfréntate a la computadora con tres niveles de dificultad:
  * 🟢 **Fácil:** La computadora realiza movimientos 100% aleatorios en las casillas disponibles.
  * 🟡 **Normal:** Lógica condicional híbrida; la PC bloquea tus intentos directos de ganar y realiza movimientos aleatorios si no hay peligro.
  * 🔴 **Difícil:** Implementación matemática del algoritmo **Minimax**. La computadora evalúa todos los escenarios posibles, haciéndola invencible (siempre ganará o forzará un empate).
* **Marcador Dinámico:** Registro de puntuación en tiempo real para las victorias de "X", de "O" y los empates.
* **Diseño UI/UX:** Interfaz limpia construida con componentes nativos de Bootstrap 5.

## 📂 Estructura del Proyecto

El código está modularizado para mantener buenas prácticas de desarrollo:

```text
/
├── index.html    # Estructura principal del documento, el tablero de juego y la interfaz de usuario.
├── style.css     # Estilos personalizados, diseño de la cuadrícula de 3x3 (Grid/Flexbox) y animaciones de los símbolos.
└── script.js     # Lógica central del juego, validación de victorias, control de turnos y la IA del PC.
