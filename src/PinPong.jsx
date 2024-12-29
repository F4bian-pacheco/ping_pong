import { useRef, useEffect, useState, useCallback } from "react";

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const [paddleY, setPaddleY] = useState(200);
  const [aiPaddleY, setAiPaddleY] = useState(200);
  const [ball, setBall] = useState({ x: 400, y: 300, dx: -2, dy: 2 });
  const [playerScore, setPlayerScore] = useState(0); // Score del jugador
  const [aiScore, setAiScore] = useState(0); // Score de la IA
  const [isPaused, setIsPaused] = useState(false);
  const [ballSpeed, setBallSpeed] = useState(2);
  const [aiLevel, setAiLevel] = useState(1); // Nivel de la IA
  const animationFrameRef = useRef(null);
  const ballRef = useRef(ball);
  const paddleYRef = useRef(paddleY);
  const aiPaddleYRef = useRef(aiPaddleY);
  const lastTimeRef = useRef(0);
  const FPS = 60;
  const frameDelay = 1000 / FPS;

  // Actualizar las referencias cuando cambian los estados
  useEffect(() => {
    ballRef.current = ball;
  }, [ball]);

  useEffect(() => {
    paddleYRef.current = paddleY;
  }, [paddleY]);

  useEffect(() => {
    aiPaddleYRef.current = aiPaddleY;
  }, [aiPaddleY]);

  const resetGame = useCallback(() => {
    const newBall = { x: 400, y: 300, dx: -2, dy: 2 };
    setBall(newBall);
    ballRef.current = newBall;
    setPlayerScore(0);
    setAiScore(0);
    setBallSpeed(5);
    setPaddleY(200);
    setAiPaddleY(200);
    setAiLevel(1);
  }, []);

  const resetBall = useCallback((direction = -1) => {
    const newBall = { x: 400, y: 300, dx: direction * 2, dy: 2 };
    setBall(newBall);
    ballRef.current = newBall;
  }, []);

  // Función para actualizar la posición del paddle de la IA
  const updateAiPaddle = () => {
    const targetY = ballRef.current.y - 50;
    const currentY = aiPaddleYRef.current;
    const baseSpeed = 5;
    const aiSpeed = baseSpeed + (aiLevel - 1) * 2; // La velocidad aumenta con el nivel

    // Predicción más precisa según el nivel
    const predictionFactor = Math.min(0.2 * aiLevel, 0.8); // Máximo 80% de precisión
    const predictedY = targetY + ballRef.current.dy * predictionFactor;

    // Aplicar error artificial que disminuye con el nivel
    const maxError = Math.max(50 - aiLevel * 5, 0);
    const randomError = (Math.random() - 0.5) * maxError;
    const finalTargetY = predictedY + randomError;

    let newY;
    if (Math.abs(finalTargetY - currentY) < aiSpeed) {
      newY = finalTargetY;
    } else if (finalTargetY > currentY) {
      newY = currentY + aiSpeed;
    } else {
      newY = currentY - aiSpeed;
    }

    newY = Math.max(0, Math.min(newY, canvasRef.current.height - 100));
    setAiPaddleY(newY);
    aiPaddleYRef.current = newY;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let frameCount = 0;
    let lastFPSUpdate = 0;
    let currentFPS = 0;

    const updateBallPosition = () => {
      if (isPaused) return;

      const currentBall = ballRef.current;
      let { x, y, dx, dy } = currentBall;

      x += dx * ballSpeed;
      y += dy * ballSpeed;

      // Colisiones con bordes verticales
      if (y + 10 > canvas.height || y - 10 < 0) dy = -dy;

      // Colisión con paddle jugador
      if (x - 10 < 20 && y > paddleYRef.current && y < paddleYRef.current + 100) {
        dx = -dx;
        const relativeIntersectY = (y - (paddleYRef.current + 50)) / 50;
        dy = relativeIntersectY * 3;
      }

      // Colisión con paddle IA
      if (x + 10 > canvas.width - 20 && y > aiPaddleYRef.current && y < aiPaddleYRef.current + 100) {
        dx = -dx;
        const relativeIntersectY = (y - (aiPaddleYRef.current + 50)) / 50;
        dy = relativeIntersectY * 3;
      }

      // Puntuación
      if (x - 10 < 0) {
        setAiScore(prev => prev + 1);
        resetBall(1); // Pelota va hacia la izquierda
        return;
      }
      if (x + 10 > canvas.width) {
        setPlayerScore(prev => prev + 1);
        resetBall(-1); // Pelota va hacia la derecha
        return;
      }

      const newBall = { x, y, dx, dy };
      setBall(newBall);
      ballRef.current = newBall;
    };

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar línea central
      context.setLineDash([5, 15]);
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.strokeStyle = 'white';
      context.stroke();
      context.setLineDash([]);

      // Dibujar paddle jugador
      context.fillStyle = "white";
      context.fillRect(10, paddleYRef.current, 10, 100);

      // Dibujar paddle IA
      context.fillStyle = `rgb(255, ${Math.max(0, 255 - aiLevel * 20)}, ${Math.max(0, 255 - aiLevel * 20)})`;
      context.fillRect(canvas.width - 20, aiPaddleYRef.current, 10, 100);

      // Dibujar pelota
      context.beginPath();
      context.arc(ballRef.current.x, ballRef.current.y, 10, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
      context.closePath();

      // Dibujar scores
      context.font = "32px Arial";
      context.fillStyle = "white";
      context.fillText(`${playerScore}`, canvas.width / 4, 50);
      context.fillText(`${aiScore}`, (canvas.width * 3) / 4, 50);

      // Dibujar nivel de IA
      context.font = "16px Arial";
      context.fillText(`AI Level: ${aiLevel}`, canvas.width - 150, 80);
      context.fillText(`FPS: ${currentFPS}`, 10, 20);
    };

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;

      frameCount++;
      if (timestamp - lastFPSUpdate >= 1000) {
        currentFPS = frameCount;
        frameCount = 0;
        lastFPSUpdate = timestamp;
      }

      if (deltaTime >= frameDelay) {
        updateBallPosition();
        updateAiPaddle();
        draw();
        lastTimeRef.current = timestamp - (deltaTime % frameDelay);
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, ballSpeed, playerScore, aiScore, resetBall, aiLevel]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isPaused) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const paddleHeight = 100;
      const maxY = canvas.height - paddleHeight;
      const newY = Math.max(0, Math.min(
        event.clientY - rect.top,
        maxY
      ));

      setPaddleY(newY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPaused]);

  // Incrementar nivel de IA y velocidad cada 10 segundos
  useEffect(() => {
    let upgradeInterval;

    if (!isPaused) {
      upgradeInterval = setInterval(() => {
        setAiLevel(prev => Math.min(prev + 1, 10)); // Máximo nivel 10
        setBallSpeed(prev => prev + 0.5);
      }, 10000); // 10 segundos
    }

    return () => clearInterval(upgradeInterval);
  }, [isPaused]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="bg-black"
      />
      <div className="text-white text-xl flex gap-8">
        <span>Player: {playerScore}</span>
        <span>AI: {aiScore}</span>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PingPongGame;