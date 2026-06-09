// 部门类型
export type DepartmentId = 'theory' | 'factory' | 'testSite' | 'logistics';

export interface Department {
  id: DepartmentId;
  name: string;
  description: string;
  icon: string; // lucide icon name
  progress: number; // 0-100
  maxProgress: number;
  status: 'normal' | 'bottleneck' | 'critical';
  linkages: {
    target: DepartmentId;
    effect: string;
    multiplier: number;
  }[];
}

// 专家专长领域
export type Expertise = 'theory' | 'factory' | 'testSite' | 'general';

export interface Expert {
  id: string;
  codeName: string; // 代号，隐去真实姓名
  realName?: string; // 可选的真实姓名提示
  expertise: Expertise;
  stamina: number; // 体力 0-100
  maxStamina: number;
  familyConcern: number; // 家庭牵挂度 0-100
  baseEfficiency: number; // 基础效率系数 0.8-1.5
  status: 'active' | 'sick' | 'resting';
  sickRounds: number; // 病倒剩余回合
  location: DepartmentId | 'base';
  description: string;
}

// 技术卡点
export interface TechBottleneck {
  id: string;
  title: string;
  description: string;
  department: DepartmentId;
  difficulty: number; // 1-10
  requiredProgress: number; // 需要多少进度才能突破
  currentProgress: number;
  solved: boolean;
}

// 行动类型
export type ActionType = 'focus' | 'coordinate' | 'seekHelp' | 'talk';

export interface Action {
  type: ActionType;
  name: string;
  description: string;
  icon: string;
  cost: number; // 消耗行动点数
}

// 随机事件
export type EventType = 'beijingCall' | 'supplyIssue' | 'breakthrough' | 'espionage' | 'moraleBoost';

export interface GameEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  choices: {
    text: string;
    effect: string;
    outcome: Partial<GameState> | ((state: GameState) => Partial<GameState>);
  }[];
  condition?: (state: GameState) => boolean;
}

// 攻关项目
export type TechProject = 'theoryDesign' | 'fuelRefinement' | 'detonator';

export interface TechProgress {
  project: TechProject;
  name: string;
  progress: number;
  maxProgress: number;
  department: DepartmentId;
}

// 游戏阶段
export type GamePhase = 'start' | 'playing' | 'event' | 'roundEnd' | 'ending';

// 结局类型
export type EndingType = 'victory' | 'timeOut' | 'expertsCollapsed' | 'imbalance';

// 决策历史
export interface DecisionRecord {
  round: number;
  action: ActionType;
  target: string;
  result: string;
  timestamp: number;
}

// 完整游戏状态
export interface GameState {
  currentRound: number;
  maxRounds: number;
  departments: Record<DepartmentId, Department>;
  experts: Expert[];
  dependencyRate: number; // 外援依赖度 0-100
  independentBuff: boolean; // 独立自主buff是否激活
  techProgress: Record<TechProject, TechProgress>;
  currentBottlenecks: TechBottleneck[];
  actionsLeft: number;
  actionsPerRound: number;
  currentEvent: GameEvent | null;
  gamePhase: GamePhase;
  endingType: EndingType | null;
  history: DecisionRecord[];
  imbalanceWarning: boolean;
  totalActions: number;
  messageLog: string[];
}

// 行动结果
export interface ActionResult {
  success: boolean;
  message: string;
  progressChange: number;
  staminaCost: number;
  dependencyChange: number;
}
