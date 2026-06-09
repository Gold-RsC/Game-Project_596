import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Radio, Heart, ArrowRight, AlertTriangle, ScrollText } from 'lucide-react';
import type { GameState, ActionType } from '../types';
import DepartmentCard from './DepartmentCard';
import ExpertPanel from './ExpertPanel';
import ActionPanel from './ActionPanel';
import EventModal from './EventModal';

interface Props {
  state: GameState;
  onExecuteAction: (actionType: ActionType, params: any) => void;
  onHandleEvent: (choiceIndex: number) => void;
  onNextRound: () => void;
}

export default function GameBoard({ state, onExecuteAction, onHandleEvent, onNextRound }: Props) {
  const techProjects = Object.values(state.techProgress);
  const totalTechProgress = techProjects.reduce((sum, p) => sum + p.progress, 0);
  const maxTechProgress = techProjects.reduce((sum, p) => sum + p.maxProgress, 0);
  const overallProgress = Math.round((totalTechProgress / maxTechProgress) * 100);

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-7xl mx-auto">
      {/* 顶部状态栏 */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        {/* 回合 */}
        <div className="card-archive flex items-center gap-3">
          <Clock className="w-6 h-6 text-gobi-400" />
          <div>
            <div className="text-xs text-gobi-500">当前回合</div>
            <div className="text-xl font-bold text-gobi-100">
              {state.currentRound} / {state.maxRounds}
            </div>
          </div>
        </div>

        {/* 依赖度 */}
        <div className="card-archive">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-gobi-400" />
            <span className="text-xs text-gobi-500">外援依赖度</span>
            <span className="text-xs text-gobi-200 ml-auto">{state.dependencyRate}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-blue-500"
              animate={{ width: `${state.dependencyRate}%` }}
            />
          </div>
          {state.dependencyRate < 30 && (
            <div className="text-xs text-archive-stamp mt-1 font-bold">
              外援通道已关闭
            </div>
          )}
        </div>

        {/* 总进度 */}
        <div className="card-archive">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-gobi-400" />
            <span className="text-xs text-gobi-500">攻关总进度</span>
            <span className="text-xs text-archive-stamp ml-auto font-bold">{overallProgress}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-archive-stamp"
              animate={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* 行动次数 */}
        <div className="card-archive flex items-center justify-between">
          <div>
            <div className="text-xs text-gobi-500">剩余行动</div>
            <div className="text-xl font-bold text-gobi-100">{state.actionsLeft}</div>
          </div>
          {state.actionsLeft <= 0 && state.gamePhase === 'roundEnd' && (
            <motion.button
              onClick={onNextRound}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              下一回合
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* 失衡警告 */}
      {state.imbalanceWarning && (
        <motion.div
          className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-yellow-400 text-sm">
            警告：三部门进度严重失衡！请及时协调各部门发展。
          </span>
        </motion.div>
      )}

      {/* 部门卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.values(state.departments).map((dept, index) => {
          const techProject = techProjects.find(p => p.department === dept.id);
          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DepartmentCard
                department={dept}
                techProgress={techProject?.progress}
                techMax={techProject?.maxProgress}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 专家面板 */}
      <div className="mb-6">
        <h3 className="text-gobi-300 font-bold mb-3 font-serif-cn flex items-center gap-2">
          <span className="w-1 h-5 bg-archive-stamp rounded-full" />
          专家团队
        </h3>
        <ExpertPanel experts={state.experts} mode="display" />
      </div>

      {/* 行动面板 */}
      <div className="mb-6">
        <h3 className="text-gobi-300 font-bold mb-3 font-serif-cn flex items-center gap-2">
          <span className="w-1 h-5 bg-archive-stamp rounded-full" />
          行动指挥
        </h3>
        <ActionPanel state={state} onExecute={onExecuteAction} />
      </div>

      {/* 消息日志 */}
      {state.messageLog.length > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-gobi-300 font-bold mb-2 font-serif-cn flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-gobi-500" />
            行动记录
          </h3>
          <div className="card-archive max-h-40 overflow-y-auto space-y-1">
            <AnimatePresence initial={false}>
              {state.messageLog.slice(-5).map((msg, i) => (
                <motion.div
                  key={msg + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-gobi-300 py-1 border-b border-gobi-800/50 last:border-0"
                >
                  {msg}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* 事件弹窗 */}
      {state.currentEvent && state.gamePhase === 'event' && (
        <EventModal event={state.currentEvent} onChoice={onHandleEvent} />
      )}
    </div>
  );
}
