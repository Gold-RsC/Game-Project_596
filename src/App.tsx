import { AnimatePresence } from 'framer-motion';
import { useGameState } from './hooks/useGameState';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import EndingScreen from './components/EndingScreen';

function App() {
  const { state, startGame, executeAction, handleEvent, nextRound, restartGame } =
    useGameState();

  return (
    <div className="min-h-screen bg-gobi-950">
      <AnimatePresence mode="wait">
        {state.gamePhase === 'start' && (
          <StartScreen key="start" onStart={startGame} />
        )}

        {(state.gamePhase === 'playing' ||
          state.gamePhase === 'event' ||
          state.gamePhase === 'roundEnd') && (
          <GameBoard
            key="game"
            state={state}
            onExecuteAction={executeAction}
            onHandleEvent={handleEvent}
            onNextRound={nextRound}
          />
        )}

        {state.gamePhase === 'ending' && state.endingType && (
          <EndingScreen
            key="ending"
            endingType={state.endingType}
            rounds={state.currentRound}
            totalActions={state.totalActions}
            onRestart={restartGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
