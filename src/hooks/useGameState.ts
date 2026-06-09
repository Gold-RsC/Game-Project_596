import { useReducer, useCallback } from 'react';
import type { GameState, ActionType, DepartmentId } from '../types';
import {
  createInitialState,
  executeFocus,
  executeCoordinate,
  executeSeekHelp,
  executeTalk,
  processRoundEnd,
  handleEventChoice,
  isActionAvailable,
  checkEnding,
} from '../utils/gameLogic';

export type GameAction =
  | { type: 'START_GAME' }
  | {
      type: 'EXECUTE_ACTION';
      actionType: ActionType;
      params: {
        bottleneckId?: string;
        expertId?: string;
        sourceDept?: DepartmentId;
        targetDept?: DepartmentId;
        deptId?: DepartmentId;
      };
    }
  | { type: 'HANDLE_EVENT'; choiceIndex: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'RESTART_GAME' }
  | { type: 'SET_PHASE'; phase: GameState['gamePhase'] };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...createInitialState(),
        gamePhase: 'playing',
      };

    case 'EXECUTE_ACTION': {
      if (state.actionsLeft <= 0) return state;
      if (state.gamePhase !== 'playing') return state;

      const { actionType, params } = action;

      if (!isActionAvailable(state, actionType)) return state;

      let result: { state: GameState; message: string } = { state, message: '' };

      switch (actionType) {
        case 'focus':
          if (params.bottleneckId) {
            const focusResult = executeFocus(state, params.bottleneckId, params.expertId);
            result = { state: focusResult.state, message: focusResult.message };
          }
          break;

        case 'coordinate':
          if (params.sourceDept && params.targetDept) {
            result = executeCoordinate(state, params.sourceDept, params.targetDept);
          }
          break;

        case 'seekHelp':
          if (params.deptId) {
            result = executeSeekHelp(state, params.deptId);
          }
          break;

        case 'talk':
          if (params.expertId) {
            result = executeTalk(state, params.expertId);
          }
          break;
      }

      // 添加消息到日志
      const newState = {
        ...result.state,
        messageLog: result.message
          ? [...result.state.messageLog.slice(-9), `第${result.state.currentRound}轮: ${result.message}`]
          : result.state.messageLog,
      };

      // 检查是否本回合行动用完
      if (newState.actionsLeft <= 0) {
        const ending = checkEnding(newState);
        if (ending) {
          return {
            ...newState,
            gamePhase: 'ending',
            endingType: ending,
          };
        }
        return {
          ...newState,
          gamePhase: 'roundEnd',
        };
      }

      return newState;
    }

    case 'HANDLE_EVENT': {
      if (!state.currentEvent) return state;
      const newState = handleEventChoice(state, action.choiceIndex);
      return newState;
    }

    case 'NEXT_ROUND': {
      if (state.gamePhase !== 'roundEnd') return state;
      return processRoundEnd(state);
    }

    case 'RESTART_GAME':
      return createInitialState();

    case 'SET_PHASE':
      return {
        ...state,
        gamePhase: action.phase,
      };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState());

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const executeAction = useCallback(
    (
      actionType: ActionType,
      params: {
        bottleneckId?: string;
        expertId?: string;
        sourceDept?: DepartmentId;
        targetDept?: DepartmentId;
        deptId?: DepartmentId;
      }
    ) => {
      dispatch({ type: 'EXECUTE_ACTION', actionType, params });
    },
    []
  );

  const handleEvent = useCallback((choiceIndex: number) => {
    dispatch({ type: 'HANDLE_EVENT', choiceIndex });
  }, []);

  const nextRound = useCallback(() => {
    dispatch({ type: 'NEXT_ROUND' });
  }, []);

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  return {
    state,
    startGame,
    executeAction,
    handleEvent,
    nextRound,
    restartGame,
  };
}
