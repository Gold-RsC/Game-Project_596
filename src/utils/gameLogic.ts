import type {
  GameState,
  DepartmentId,
  ActionType,
  Expert,
  EndingType,
  TechProject,
} from '../types';
import { initialDepartments } from '../data/departments';
import { initialExperts } from '../data/experts';
import { getRandomBottlenecks, getRandomEvent } from '../data/events';

export const MAX_ROUNDS = 20;
export const ACTIONS_PER_ROUND = 2;
export const TECH_TARGET = 100;

// 攻关项目与部门的映射
export const projectToDepartment: Record<TechProject, DepartmentId> = {
  theoryDesign: 'theory',
  fuelRefinement: 'factory',
  detonator: 'testSite',
};

// 生成初始游戏状态
export function createInitialState(): GameState {
  const experts = initialExperts.map((e) => ({
    ...e,
    familyConcern: Math.floor(Math.random() * 40) + 20, // 随机初始 20-60
  }));

  return {
    currentRound: 1,
    maxRounds: MAX_ROUNDS,
    departments: JSON.parse(JSON.stringify(initialDepartments)),
    experts,
    dependencyRate: 80,
    independentBuff: false,
    techProgress: {
      theoryDesign: {
        project: 'theoryDesign',
        name: '理论设计',
        progress: 0,
        maxProgress: TECH_TARGET,
        department: 'theory',
      },
      fuelRefinement: {
        project: 'fuelRefinement',
        name: '核燃料提纯',
        progress: 0,
        maxProgress: TECH_TARGET,
        department: 'factory',
      },
      detonator: {
        project: 'detonator',
        name: '引爆装置',
        progress: 0,
        maxProgress: TECH_TARGET,
        department: 'testSite',
      },
    },
    currentBottlenecks: getRandomBottlenecks(1, 2),
    actionsLeft: ACTIONS_PER_ROUND,
    actionsPerRound: ACTIONS_PER_ROUND,
    currentEvent: null,
    gamePhase: 'start',
    endingType: null,
    history: [],
    imbalanceWarning: false,
    totalActions: 0,
    messageLog: [],
  };
}

// 计算专家当前效率
export function calculateExpertEfficiency(expert: Expert): number {
  if (expert.status !== 'active') return 0;

  let efficiency = expert.baseEfficiency;

  // 体力影响：体力越低效率越低
  const staminaFactor = Math.max(0.3, expert.stamina / 100);
  efficiency *= staminaFactor;

  // 家庭牵挂度影响：过高会降低效率
  if (expert.familyConcern > 70) {
    efficiency *= 0.7;
  } else if (expert.familyConcern > 50) {
    efficiency *= 0.85;
  }

  // 地点影响：试验场偏远增加牵挂
  if (expert.location === 'testSite') {
    efficiency *= 0.9;
  }

  return parseFloat(efficiency.toFixed(2));
}

// 获取指定部门的最佳专家
export function getBestExpertForDepartment(
  experts: Expert[],
  dept: DepartmentId
): Expert | null {
  const available = experts.filter(
    (e) => e.status === 'active' && (e.expertise === dept || e.expertise === 'general')
  );

  if (available.length === 0) return null;

  return available.reduce((best, current) => {
    const bestEff = calculateExpertEfficiency(best);
    const currEff = calculateExpertEfficiency(current);
    return currEff > bestEff ? current : best;
  });
}

// 执行"集中攻关"
export function executeFocus(
  state: GameState,
  bottleneckId: string,
  expertId?: string
): { state: GameState; message: string; progressGain: number } {
  const bottleneck = state.currentBottlenecks.find((b) => b.id === bottleneckId);
  if (!bottleneck) return { state, message: '未找到该卡点', progressGain: 0 };

  const deptId = bottleneck.department;
  const expert = expertId
    ? state.experts.find((e) => e.id === expertId)
    : getBestExpertForDepartment(state.experts, deptId);

  if (!expert) {
    return {
      state,
      message: '没有可用的专家来攻关这个卡点',
      progressGain: 0,
    };
  }

  let efficiency = calculateExpertEfficiency(expert);

  // 独立自主buff
  if (state.independentBuff) {
    efficiency *= 1.5;
  }

  // 基础进度
  let progressGain = Math.floor(8 + efficiency * 5 + Math.random() * 5);

  // 联动加成
  const dept = state.departments[deptId];
  dept.linkages.forEach((link) => {
    const sourceProgress = state.departments[link.target].progress;
    const bonus = Math.floor(sourceProgress * link.multiplier);
    progressGain += bonus;
  });

  // 更新卡点进度
  const newBottlenecks = state.currentBottlenecks.map((b) => {
    if (b.id === bottleneckId) {
      const newProgress = b.currentProgress + progressGain;
      return {
        ...b,
        currentProgress: newProgress,
        solved: newProgress >= b.requiredProgress,
      };
    }
    return b;
  });

  // 消耗专家体力
  const staminaCost = 15 + Math.floor(Math.random() * 10);
  const newExperts = state.experts.map((e) => {
    if (e.id === expert.id) {
      const newStamina = Math.max(0, e.stamina - staminaCost);
      return {
        ...e,
        stamina: newStamina,
        location: deptId,
      };
    }
    return e;
  });

  // 更新部门进度
  const newDepartments = { ...state.departments };
  if (bottleneck.solved || newBottlenecks.find((b) => b.id === bottleneckId)?.solved) {
    newDepartments[deptId] = {
      ...newDepartments[deptId],
      progress: Math.min(100, newDepartments[deptId].progress + 8),
    };
  }

  // 更新攻关项目进度
  const techProgress = { ...state.techProgress };
  Object.keys(techProgress).forEach((key) => {
    const proj = techProgress[key as TechProject];
    if (proj.department === deptId) {
      techProgress[key as TechProject] = {
        ...proj,
        progress: Math.min(TECH_TARGET, proj.progress + Math.floor(progressGain * 0.6)),
      };
    }
  });

  // 更新依赖度
  let newDependencyRate = state.dependencyRate - 15;
  if (newDependencyRate < 0) newDependencyRate = 0;

  const newIndependentBuff = !state.independentBuff && newDependencyRate < 30;

  const newState: GameState = {
    ...state,
    departments: newDepartments,
    experts: newExperts,
    currentBottlenecks: newBottlenecks,
    techProgress,
    dependencyRate: newDependencyRate,
    independentBuff: state.independentBuff || newIndependentBuff,
    actionsLeft: state.actionsLeft - 1,
    totalActions: state.totalActions + 1,
  };

  const buffMsg = newIndependentBuff ? '【独立自主】buff激活！攻关速度提升50%！' : '';

  return {
    state: newState,
    message: `${expert.codeName}集中攻关${bottleneck.title}，推进${progressGain}点。${buffMsg}`,
    progressGain,
  };
}

// 执行"协同调度"
export function executeCoordinate(
  state: GameState,
  sourceDept: DepartmentId,
  targetDept: DepartmentId
): { state: GameState; message: string } {
  if (sourceDept === targetDept) {
    return { state, message: '不能自己调度自己' };
  }

  const newDepartments = { ...state.departments };

  // 目标部门获得进度加成
  const targetGain = Math.floor(5 + Math.random() * 5);
  newDepartments[targetDept] = {
    ...newDepartments[targetDept],
    progress: Math.min(100, newDepartments[targetDept].progress + targetGain),
  };

  // 源部门进度减缓
  const sourceLoss = Math.floor(3 + Math.random() * 3);
  newDepartments[sourceDept] = {
    ...newDepartments[sourceDept],
    progress: Math.max(0, newDepartments[sourceDept].progress - sourceLoss),
  };

  // 更新攻关项目进度
  const techProgress = { ...state.techProgress };
  Object.keys(techProgress).forEach((key) => {
    const proj = techProgress[key as TechProject];
    if (proj.department === targetDept) {
      techProgress[key as TechProject] = {
        ...proj,
        progress: Math.min(TECH_TARGET, proj.progress + Math.floor(targetGain * 0.5)),
      };
    } else if (proj.department === sourceDept) {
      techProgress[key as TechProject] = {
        ...proj,
        progress: Math.max(0, proj.progress - Math.floor(sourceLoss * 0.3)),
      };
    }
  });

  const newState: GameState = {
    ...state,
    departments: newDepartments,
    techProgress,
    actionsLeft: state.actionsLeft - 1,
    totalActions: state.totalActions + 1,
  };

  return {
    state: newState,
    message: `${state.departments[sourceDept].name}支援${state.departments[targetDept].name}，目标+${targetGain}，源部门-${sourceLoss}`,
  };
}

// 执行"向外求助"
export function executeSeekHelp(state: GameState, deptId: DepartmentId): { state: GameState; message: string } {
  if (state.dependencyRate < 30) {
    return {
      state,
      message: '依赖度已降至30%以下，外援通道已关闭，必须自力更生！',
    };
  }

  const gain = Math.floor(3 + Math.random() * 5);
  const newDepartments = { ...state.departments };
  newDepartments[deptId] = {
    ...newDepartments[deptId],
    progress: Math.min(100, newDepartments[deptId].progress + gain),
  };

  // 更新攻关项目进度
  const techProgress = { ...state.techProgress };
  Object.keys(techProgress).forEach((key) => {
    const proj = techProgress[key as TechProject];
    if (proj.department === deptId) {
      techProgress[key as TechProject] = {
        ...proj,
        progress: Math.min(TECH_TARGET, proj.progress + Math.floor(gain * 0.4)),
      };
    }
  });

  const newState: GameState = {
    ...state,
    departments: newDepartments,
    techProgress,
    dependencyRate: Math.max(0, state.dependencyRate - 5),
    actionsLeft: state.actionsLeft - 1,
    totalActions: state.totalActions + 1,
  };

  return {
    state: newState,
    message: `向外界请求支援，${state.departments[deptId].name}进度+${gain}，依赖度-5%`,
  };
}

// 执行"组织关怀"
export function executeTalk(state: GameState, expertId: string): { state: GameState; message: string } {
  const expert = state.experts.find((e) => e.id === expertId);
  if (!expert) return { state, message: '未找到该专家' };

  const newExperts = state.experts.map((e) => {
    if (e.id === expertId) {
      return {
        ...e,
        familyConcern: Math.max(0, e.familyConcern - 15),
        stamina: Math.min(e.maxStamina, e.stamina + 5),
      };
    }
    return e;
  });

  const newState: GameState = {
    ...state,
    experts: newExperts,
    actionsLeft: state.actionsLeft - 1,
    totalActions: state.totalActions + 1,
  };

  return {
    state: newState,
    message: `与${expert.codeName}谈心，家庭牵挂度-15，体力+5`,
  };
}

// 检查部门失衡
export function checkImbalance(state: GameState): { imbalanced: boolean; maxGap: number } {
  const coreDepts = ['theory', 'factory', 'testSite'] as DepartmentId[];
  const progresses = coreDepts.map((d) => state.departments[d].progress);
  const max = Math.max(...progresses);
  const min = Math.min(...progresses);
  const gap = max - min;

  return {
    imbalanced: gap > 30,
    maxGap: gap,
  };
}

// 检查胜负条件
export function checkEnding(state: GameState): EndingType | null {
  // 胜利：三项攻关全部完成
  const allComplete = Object.values(state.techProgress).every(
    (p) => p.progress >= TECH_TARGET
  );
  if (allComplete) return 'victory';

  // 时间耗尽
  if (state.currentRound >= MAX_ROUNDS) return 'timeOut';

  // 专家集体病倒
  const activeExperts = state.experts.filter((e) => e.status === 'active');
  if (activeExperts.length <= 1) return 'expertsCollapsed';

  // 部门严重失衡
  const { imbalanced } = checkImbalance(state);
  if (imbalanced && state.currentRound >= 15) return 'imbalance';

  return null;
}

// 回合结束处理
export function processRoundEnd(state: GameState): GameState {
  // 恢复专家体力
  const newExperts = state.experts.map((e) => {
    if (e.status === 'sick') {
      return {
        ...e,
        sickRounds: e.sickRounds - 1,
        status: e.sickRounds <= 1 ? ('active' as const) : ('sick' as const),
        stamina: e.sickRounds <= 1 ? 50 : e.stamina,
        location: 'base' as const,
      };
    }

    if (e.status === 'resting') {
      return {
        ...e,
        sickRounds: e.sickRounds - 1,
        status: e.sickRounds <= 1 ? ('active' as const) : ('resting' as const),
        stamina: e.sickRounds <= 1 ? 70 : e.stamina,
        location: 'base' as const,
      };
    }

    // 体力低于30有概率病倒
    if (e.stamina < 30 && Math.random() < 0.4) {
      return {
        ...e,
        status: 'sick' as const,
        sickRounds: 2 + Math.floor(Math.random() * 2),
        location: 'base' as const,
      };
    }

    // 正常恢复少量体力
    return {
      ...e,
      stamina: Math.min(e.maxStamina, e.stamina + 8),
      location: 'base' as const,
    };
  });

  // 生成下一回合卡点和事件
  const nextRound = state.currentRound + 1;
  const newBottlenecks = getRandomBottlenecks(nextRound, 2);

  // 检查特殊事件
  const newEvent = getRandomEvent(nextRound, state);

  const newState: GameState = {
    ...state,
    currentRound: nextRound,
    experts: newExperts,
    currentBottlenecks: newBottlenecks,
    actionsLeft: ACTIONS_PER_ROUND,
    currentEvent: newEvent,
    gamePhase: newEvent ? 'event' : 'playing',
    imbalanceWarning: checkImbalance(state).imbalanced,
  };

  // 检查结局
  const ending = checkEnding(newState);
  if (ending) {
    return {
      ...newState,
      gamePhase: 'ending',
      endingType: ending,
    };
  }

  return newState;
}

// 处理事件选择
export function handleEventChoice(state: GameState, choiceIndex: number): GameState {
  if (!state.currentEvent) return state;

  const choice = state.currentEvent.choices[choiceIndex];
  if (!choice) return state;

  let outcome: Partial<GameState> = {};
  if (typeof choice.outcome === 'function') {
    outcome = choice.outcome(state);
  } else {
    outcome = choice.outcome;
  }

  return {
    ...state,
    ...outcome,
    currentEvent: null,
    gamePhase: 'playing',
  };
}

// 判断行动是否可用
export function isActionAvailable(state: GameState, actionType: ActionType): boolean {
  if (state.actionsLeft <= 0) return false;

  switch (actionType) {
    case 'seekHelp':
      return state.dependencyRate >= 30;
    case 'talk':
      return state.experts.some((e) => e.status === 'active' && e.familyConcern > 30);
    default:
      return true;
  }
}

// 结局文本
export const endingTexts: Record<EndingType, { title: string; text: string }> = {
  victory: {
    title: '原子弹爆炸成功！',
    text:
      '1964年10月16日15时，中国第一颗原子弹在罗布泊试验场成功爆炸。\n\n' +
      '巨大的蘑菇云腾空而起，标志着中国成为世界上第五个拥有核武器的国家。\n\n' +
      '这一切，源于无数科研工作者的自力更生、大力协同和无私奉献。他们隐姓埋名，\n' +
      '在茫茫戈壁中默默耕耘，用算盘和手摇计算机完成了世界顶级的科学计算。',
  },
  timeOut: {
    title: '时间耗尽',
    text:
      '20轮已过，外部压力越来越大，项目面临被撤销的风险。\n\n' +
      '虽然这次模拟没有成功，但在真实的历史中，先辈们顶住重重压力，\n' +
      '于1964年10月16日成功爆破了第一颗原子弹。你的每一次决策，\n' +
      '都在靠近那个历史性的瞬间。',
  },
  expertsCollapsed: {
    title: '专家团队透支',
    text:
      '过度的高强度攻关让专家团队集体倒下，项目陷入停滞。\n\n' +
      '在那个艰苦的年代，科研人员确实付出了巨大的身体代价。\n' +
      '许多人隐姓埋名几十年，甚至献出了自己的生命。\n\n' +
      '真实的历史中，先辈们用坚强的意志克服了这一切，\n' +
      '于1964年10月16日完成了不可能完成的任务。',
  },
  imbalance: {
    title: '三部门严重失衡',
    text:
      '三个核心部门的发展严重失衡，形成了不可逆的技术瓶颈。\n\n' +
      '这提醒我们，"大力协同"不是平均用力，而是像拧螺丝一样——\n' +
      '每次只拧一点，但三个点轮流拧，整体才能往前走。\n\n' +
      '真实的历史中，正是这种协同精神，让中国在1964年10月16日\n' +
      '成功爆破了第一颗原子弹。',
  },
};
