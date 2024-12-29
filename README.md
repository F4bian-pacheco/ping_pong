# Ping Pong Game

Este es un simple juego de Ping Pong implementado en React utilizando el API de `canvas`. El jugador compite contra una IA cuyo nivel y velocidad aumentan con el tiempo. El objetivo del juego es evitar que la pelota pase por tu lado y ganar puntos cuando la pelota pasa por el lado de la IA.

## Características

- Control del paddle del jugador con el ratón.
- IA con niveles de dificultad crecientes.
- Puntuación tanto para el jugador como para la IA.
- Control de pausa y reinicio del juego.
- Actualización de la velocidad de la pelota y el nivel de IA cada 10 segundos.
- Se muestran los FPS y el nivel de la IA en pantalla.

## Requisitos

Este proyecto utiliza `React`. Asegúrate de tener instalado `Node.js` y `npm` o `yarn` antes de comenzar.

### Instalación

1. Clona este repositorio:
   ```bash
   git clone 
   ```
2. Instala dependencias:
   ```bash
    cd ping-pong-game
    pnpm install
   ```
2. Ejecuta la aplicación:
   ```bash
    pnpm run dev
   ```
La aplicación debería abrirse automáticamente en tu navegador en http://localhost:3000.

## Controles del Juego
* Mueve el ratón para controlar el paddle del jugador.
* Haz clic en Pause para pausar el juego.
* Haz clic en Reset para reiniciar la partida (esto también reinicia las puntuaciones y la dificultad de la IA).
## IA del juego
La IA del juego sigue una estrategia básica de movimiento para golpear la pelota:

* La IA predice la posición de la pelota basándose en la dirección y velocidad actuales.
* El nivel de dificultad de la IA se incrementa cada 10 segundos, aumentando su velocidad de movimiento y reduciendo el margen de error.

## Personalización

Puedes ajustar ciertos parámetros para modificar la dificultad del juego:

* Velocidad de la pelota: Ajustada dinámicamente cada 10 segundos, pero puedes modificar el valor inicial en la variable ballSpeed.
* Nivel de la IA: Puedes cambiar la velocidad inicial de la IA ajustando el estado aiLevel.

> **Nota**: Este proyecto nacio de una idea para un roadmap de arquitecto de software o de portafolio backend, desde este foro
> [Reddit](https://www.reddit.com/r/devsarg/comments/usl2o1/el_portfolio_para_programadores_backend_es_algo/)

> **Nota**: Me ayude con ia para lograr implementar la inteligencia artificial en el juego, que en realidad es falsa inteligencia artificial, pero es un buen comienzo para entender como funciona la inteligencia artificial en los juegos.