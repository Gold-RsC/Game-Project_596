import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowLeftRight, HelpCircle, MessageCircle, ChevronRight } from 'lucide-react';
import type { ActionType, DepartmentId, TechBottleneck, Expert, GameState } from '../types';
import { isActionAvailable } from '../utils/gameLogic';

interface Props {
  state: GameState;
  onExecute: (actionType: ActionType, params: any) => void;
}

type SubPhase = 'selectAction' | 'selectBottleneck' | 'selectExpert' | 'selectCoordinate' | 'selectTalkTarget' | 'confirm';

export default function ActionPanel({ state, onExecute }: Props) {
  const [subPhase, setSubPhase] = useState<SubPhase>('selectAction');
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [selectedBottleneck, setSelectedBottleneck] = useState<TechBottleneck | null>(null);
  const [, setSelectedExpert] = useState<Expert | null>(null);
  const [sourceDept, setSourceDept] = useState<DepartmentId | null>(null);

  const actions = [
    {
      type: 'focus' as ActionType,
      name: '集中攻关',
      description: '派专家攻克技术卡点',
      icon: Target,
      available: isActionAvailable(state, 'focus'),
    },
    {
      type: 'coordinate' as ActionType,
      name: '协同调度',
      description: '部门间人力/设备支援',
      icon: ArrowLeftRight,
      available: isActionAvailable(state, 'coordinate'),
    },
    {
      type: 'seekHelp' as ActionType,
      name: '向外求助',
      description: '请求外部支援',
      icon: HelpCircle,
      available: isActionAvailable(state, 'seekHelp'),
    },
    {
      type: 'talk' as ActionType,
      name: '组织谈话',
      description: '安抚专家情绪',
      icon: MessageCircle,
      available: isActionAvailable(state, 'talk'),
    },
  ];

  const reset = () => {
    setSubPhase('selectAction');
    setSelectedAction(null);
    setSelectedBottleneck(null);
    setSelectedExpert(null);
    setSourceDept(null);
  };

  const handleActionSelect = (actionType: ActionType) => {
    setSelectedAction(actionType);
    switch (actionType) {
      case 'focus':
        setSubPhase('selectBottleneck');
        break;
      case 'coordinate':
        setSubPhase('selectCoordinate');
        break;
      case 'seekHelp':
        // 直接选择部门
        setSubPhase('selectCoordinate');
        break;
      case 'talk':
        setSubPhase('selectTalkTarget');
        break;
    }
  };

  const handleBottleneckSelect = (bottleneck: TechBottleneck) => {
    setSelectedBottleneck(bottleneck);
    setSubPhase('selectExpert');
  };

  const handleExpertSelect = (expert: Expert) => {
    setSelectedExpert(expert);
    if (selectedAction === 'focus' && selectedBottleneck) {
      onExecute('focus', {
        bottleneckId: selectedBottleneck.id,
        expertId: expert.id,
      });
      reset();
    } else if (selectedAction === 'talk') {
      onExecute('talk', { expertId: expert.id });
      reset();
    }
  };

  const handleDeptSelect = (dept: DepartmentId, isSource: boolean) => {
    if (selectedAction === 'seekHelp') {
      onExecute('seekHelp', { deptId: dept });
      reset();
      return;
    }

    if (isSource) {
      setSourceDept(dept);
    } else {
      // target selected
      if (sourceDept) {
        onExecute('coordinate', { sourceDept, targetDept: dept });
        reset();
        return;
      }
    }

    if (!isSource && !sourceDept) {
      // 如果只选了目标，默认用后勤做源
      onExecute('coordinate', { sourceDept: 'logistics', targetDept: dept });
      reset();
    }
  };

  const coreDepts: DepartmentId[] = ['theory', 'factory', 'testSite'];

  // 选择行动类型
  if (subPhase === 'selectAction') {
    return (
      <div className="card-archive">
        <h3 className="text-gobi-200 font-bold mb-3 font-serif-cn">
          选择行动 ({state.actionsLeft}次剩余)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.type}
                onClick={() => handleActionSelect(action.type)}
                disabled={!action.available}
                className="btn-secondary flex flex-col items-center gap-2 py-4 text-left h-full"
                whileHover={action.available ? { scale: 1.03 } : {}}
                whileTap={action.available ? { scale: 0.97 } : {}}
              >
                <Icon className={`w-6 h-6 ${action.available ? 'text-gobi-300' : 'text-gobi-600'}`} />
                <span className="font-bold text-sm">{action.name}</span>
                <span className="text-xs text-gobi-500">{action.description}</span>
                {!action.available && action.type === 'seekHelp' && (
                  <span className="text-xs text-archive-stamp mt-1">已关闭</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {state.independentBuff && (
          <div className="mt-3 p-2 bg-archive-stamp/10 border border-archive-stamp/30 rounded text-center">
            <span className="text-archive-stamp text-sm font-bold">
              【独立自主】攻关速度 +50%
            </span>
          </div>
        )}
      </div>
    );
  }

  // 选择卡点
  if (subPhase === 'selectBottleneck') {
    return (
      <div className="card-archive">
        <h3 className="text-gobi-200 font-bold mb-3 font-serif-cn flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          选择要攻关的卡点
        </h3>
        <div className="space-y-2">
          {state.currentBottlenecks.filter(b => !b.solved).map((bottleneck) => (
            <motion.button
              key={bottleneck.id}
              onClick={() => handleBottleneckSelect(bottleneck)}
              className="w-full text-left btn-secondary"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gobi-200">{bottleneck.title}</div>
                  <div className="text-sm text-gobi-400">{bottleneck.description}</div>
                </div>
                <div className="text-right text-xs text-gobi-500">
                  <div>难度: {bottleneck.difficulty}/10</div>
                  <div>进度: {bottleneck.currentProgress}/{bottleneck.requiredProgress}</div>
                </div>
              </div>
              <div className="progress-bar mt-2">
                <motion.div
                  className="progress-fill bg-archive-stamp/70"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (bottleneck.currentProgress / bottleneck.requiredProgress) * 100)}%` }}
                />
              </div>
            </motion.button>
          ))}
          {state.currentBottlenecks.filter(b => !b.solved).length === 0 && (
            <p className="text-gobi-500 text-center py-4">当前没有未解决的卡点！</p>
          )}
        </div>
        <button onClick={reset} className="mt-3 text-gobi-500 text-sm hover:text-gobi-300">
          ← 返回
        </button>
      </div>
    );
  }

  // 选择专家
  if (subPhase === 'selectExpert') {
    const relevantExperts = selectedBottleneck
      ? state.experts.filter(e => e.status === 'active' && (e.expertise === selectedBottleneck.department || e.expertise === 'general'))
      : state.experts.filter(e => e.status === 'active');

    return (
      <div className="card-archive">
        <h3 className="text-gobi-200 font-bold mb-3 font-serif-cn flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          {selectedAction === 'focus' ? '选择攻关专家' : '选择谈话对象'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {relevantExperts.map((expert) => (
            <motion.button
              key={expert.id}
              onClick={() => handleExpertSelect(expert)}
              className="btn-secondary text-left py-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="font-bold text-sm">{expert.codeName}</div>
              <div className="text-xs text-gobi-500">体力:{expert.stamina}</div>
              <div className="text-xs text-gobi-500">牵挂:{expert.familyConcern}</div>
            </motion.button>
          ))}
        </div>
        <button onClick={reset} className="mt-3 text-gobi-500 text-sm hover:text-gobi-300">
          ← 返回
        </button>
      </div>
    );
  }

  // 协同调度 / 向外求助
  if (subPhase === 'selectCoordinate') {
    const isSeekHelp = selectedAction === 'seekHelp';
    const title = isSeekHelp ? '选择需要支援的部门' : '选择调度目标';

    return (
      <div className="card-archive">
        <h3 className="text-gobi-200 font-bold mb-3 font-serif-cn flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          {title}
        </h3>
        {!isSeekHelp && sourceDept && (
          <p className="text-gobi-400 text-sm mb-2">
            已选择源部门: <span className="text-gobi-200 font-bold">{state.departments[sourceDept].name}</span>，请选择目标部门
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {coreDepts.map((deptId) => (
            <motion.button
              key={deptId}
              onClick={() => handleDeptSelect(deptId, false)}
              className="btn-secondary py-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="font-bold">{state.departments[deptId].name}</div>
              <div className="text-xs text-gobi-500">
                进度: {state.departments[deptId].progress}%
              </div>
            </motion.button>
          ))}
        </div>
        <button onClick={reset} className="mt-3 text-gobi-500 text-sm hover:text-gobi-300">
          ← 返回
        </button>
      </div>
    );
  }

  // 谈话目标
  if (subPhase === 'selectTalkTarget') {
    const targets = state.experts.filter(e => e.status === 'active' && e.familyConcern > 30);

    return (
      <div className="card-archive">
        <h3 className="text-gobi-200 font-bold mb-3 font-serif-cn flex items-center gap-2">
          <ChevronRight className="w-5 h-5" />
          选择需要谈话的专家
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {targets.map((expert) => (
            <motion.button
              key={expert.id}
              onClick={() => handleExpertSelect(expert)}
              className="btn-secondary text-left py-3"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="font-bold text-sm">{expert.codeName}</div>
              <div className="text-xs text-pink-400">牵挂度: {expert.familyConcern}</div>
            </motion.button>
          ))}
        </div>
        {targets.length === 0 && (
          <p className="text-gobi-500 text-center py-4">所有专家状态良好，无需谈话。</p>
        )}
        <button onClick={reset} className="mt-3 text-gobi-500 text-sm hover:text-gobi-300">
          ← 返回
        </button>
      </div>
    );
  }

  return null;
}
