import type { GameEvent, TechBottleneck } from '../types';

// 技术卡点事件库
export const bottleneckTemplates: Omit<TechBottleneck, 'id' | 'currentProgress' | 'solved'>[] = [
  // 理论部卡点
  {
    title: '临界方程算不出来',
    description: '手摇计算机精度不够，关键方程的收敛速度太慢',
    department: 'theory',
    difficulty: 7,
    requiredProgress: 15,
  },
  {
    title: '中子输运模型偏差',
    description: '理论预测与实验数据存在系统性偏差',
    department: 'theory',
    difficulty: 6,
    requiredProgress: 12,
  },
  {
    title: '状态方程不完整',
    description: '高压下物质的状态方程缺少关键数据点',
    department: 'theory',
    difficulty: 5,
    requiredProgress: 10,
  },
  {
    title: '爆轰波传播计算卡壳',
    description: '爆轰波在复杂介质中的传播规律难以精确描述',
    department: 'theory',
    difficulty: 8,
    requiredProgress: 18,
  },
  {
    title: '材料力学参数缺失',
    description: '核心部件材料的力学参数在高温高压下未知',
    department: 'theory',
    difficulty: 6,
    requiredProgress: 12,
  },
  // 工厂卡点
  {
    title: '铀纯度卡在80%',
    description: '化学提纯工艺遇到瓶颈，纯度无法继续提升',
    department: 'factory',
    difficulty: 7,
    requiredProgress: 15,
  },
  {
    title: '精密零件公差超标',
    description: '核心部件加工精度达不到设计要求',
    department: 'factory',
    difficulty: 6,
    requiredProgress: 12,
  },
  {
    title: '设备老化故障',
    description: '关键加工设备磨损严重，影响生产质量',
    department: 'factory',
    difficulty: 5,
    requiredProgress: 10,
  },
  {
    title: '材料供应不稳定',
    description: '特殊合金材料的供应出现波动',
    department: 'factory',
    difficulty: 4,
    requiredProgress: 8,
  },
  {
    title: '装配工艺不成熟',
    description: '多个精密部件的装配顺序和力度难以把控',
    department: 'factory',
    difficulty: 6,
    requiredProgress: 12,
  },
  // 试验场卡点
  {
    title: '起爆同步有误差',
    description: '多路起爆的同步精度不达标',
    department: 'testSite',
    difficulty: 8,
    requiredProgress: 18,
  },
  {
    title: '测量仪器精度不足',
    description: '高速摄影和压力传感器的分辨率不够',
    department: 'testSite',
    difficulty: 6,
    requiredProgress: 12,
  },
  {
    title: '戈壁气候干扰',
    description: '风沙和温差影响试验设备的稳定性',
    department: 'testSite',
    difficulty: 4,
    requiredProgress: 8,
  },
  {
    title: '缩比试验外推困难',
    description: '小尺寸试验结果难以准确外推到全尺寸',
    department: 'testSite',
    difficulty: 7,
    requiredProgress: 15,
  },
  {
    title: '安全起爆距离难以确定',
    description: '试验场的安全防护距离计算有争议',
    department: 'testSite',
    difficulty: 5,
    requiredProgress: 10,
  },
  // 后勤卡点
  {
    title: '淡水供应紧张',
    description: '水源地枯竭，基地饮水配给需要压缩',
    department: 'logistics',
    difficulty: 4,
    requiredProgress: 8,
  },
  {
    title: '粮食运输受阻',
    description: '补给线遭遇沙尘暴，粮食运输延迟',
    department: 'logistics',
    difficulty: 3,
    requiredProgress: 6,
  },
  {
    title: '医疗保障不足',
    description: '多名人员患病，医疗物资短缺',
    department: 'logistics',
    difficulty: 5,
    requiredProgress: 10,
  },
  {
    title: '建筑材料短缺',
    description: '试验工事的加固材料库存告急',
    department: 'logistics',
    difficulty: 4,
    requiredProgress: 8,
  },
];

// 特殊事件库
export const specialEvents: GameEvent[] = [
  {
    id: 'evt_beijing_1',
    type: 'beijingCall',
    title: '北京来电',
    description: '老算盘的老母亲病重，组织问他是否需要回家探望。',
    choices: [
      {
        text: '批准回家',
        effect: '老算盘回家3轮，理论攻关效率大幅下降',
        outcome: (state) => {
          const experts = state.experts.map(e =>
            e.codeName === '老算盘'
              ? { ...e, status: 'resting' as const, sickRounds: 3, location: 'base' as const }
              : e
          );
          return { experts };
        },
      },
      {
        text: '完成任务再说',
        effect: '老算盘留下继续工作，但家庭牵挂度上升',
        outcome: (state) => {
          const experts = state.experts.map(e =>
            e.codeName === '老算盘'
              ? { ...e, familyConcern: Math.min(100, e.familyConcern + 25) }
              : e
          );
          return { experts };
        },
      },
    ],
    condition: (state) => state.currentRound >= 5 && state.currentRound <= 15,
  },
  {
    id: 'evt_beijing_2',
    type: 'beijingCall',
    title: '北京来电',
    description: '铀师傅的妻子来信说孩子生病住院了，问他能不能回一趟。',
    choices: [
      {
        text: '批准回家',
        effect: '铀师傅回家2轮，工厂进度放缓',
        outcome: (state) => {
          const experts = state.experts.map(e =>
            e.codeName === '铀师傅'
              ? { ...e, status: 'resting' as const, sickRounds: 2, location: 'base' as const }
              : e
          );
          return { experts };
        },
      },
      {
        text: '完成任务再说',
        effect: '铀师傅留下，但心中牵挂影响效率',
        outcome: (state) => {
          const experts = state.experts.map(e =>
            e.codeName === '铀师傅'
              ? { ...e, familyConcern: Math.min(100, e.familyConcern + 30) }
              : e
          );
          return { experts };
        },
      },
    ],
    condition: (state) => state.currentRound >= 8 && state.currentRound <= 18,
  },
  {
    id: 'evt_supply',
    type: 'supplyIssue',
    title: '补给困难',
    description: '连续沙尘暴导致补给线中断，基地物资紧张。',
    choices: [
      {
        text: '动用战备储备',
        effect: '解决燃眉之急，但消耗后勤进度',
        outcome: {
          departments: {} as any,
        },
      },
      {
        text: '组织人员自救',
        effect: '全体人员体力消耗增加，但维持了士气',
        outcome: (state) => {
          const experts = state.experts.map(e =>
            e.status === 'active'
              ? { ...e, stamina: Math.max(0, e.stamina - 10) }
              : e
          );
          return { experts };
        },
      },
    ],
    condition: (state) => state.currentRound >= 3,
  },
  {
    id: 'evt_breakthrough',
    type: 'breakthrough',
    title: '意外突破',
    description: '一位年轻技术员提出了一个创新的思路，可能解决当前的卡壳问题！',
    choices: [
      {
        text: '立即验证',
        effect: '获得额外的攻关进度',
        outcome: (state) => {
          const techProgress = { ...state.techProgress };
          Object.keys(techProgress).forEach((key) => {
            techProgress[key as keyof typeof techProgress] = {
              ...techProgress[key as keyof typeof techProgress],
              progress: Math.min(
                100,
                techProgress[key as keyof typeof techProgress].progress + 5
              ),
            };
          });
          return { techProgress };
        },
      },
      {
        text: '谨慎评估',
        effect: '进度增加较少但更稳妥',
        outcome: (state) => {
          const techProgress = { ...state.techProgress };
          Object.keys(techProgress).forEach((key) => {
            techProgress[key as keyof typeof techProgress] = {
              ...techProgress[key as keyof typeof techProgress],
              progress: Math.min(
                100,
                techProgress[key as keyof typeof techProgress].progress + 2
              ),
            };
          });
          return { techProgress };
        },
      },
    ],
    condition: (state) => state.currentRound >= 6 && state.currentRound <= 16,
  },
  {
    id: 'evt_espionage',
    type: 'espionage',
    title: '敌特情报',
    description: '发现境外势力试图刺探项目情报，需要加强保密措施。',
    choices: [
      {
        text: '加强警戒',
        effect: '消耗一次行动，但保障了安全',
        outcome: {},
      },
      {
        text: '保持现状',
        effect: '不消耗行动，但有泄密风险（攻关速度-10%）',
        outcome: {},
      },
    ],
    condition: (state) => state.currentRound >= 4 && state.currentRound <= 14,
  },
  {
    id: 'evt_morale',
    type: 'moraleBoost',
    title: '精神鼓舞',
    description: '领导来视察，带来了全国人民的慰问和鼓励。',
    choices: [
      {
        text: '组织学习讨论',
        effect: '全体人员家庭牵挂度下降',
        outcome: (state) => {
          const experts = state.experts.map(e => ({
            ...e,
            familyConcern: Math.max(0, e.familyConcern - 15),
          }));
          return { experts };
        },
      },
      {
        text: '抓紧攻关不停歇',
        effect: '全体体力恢复',
        outcome: (state) => {
          const experts = state.experts.map(e => ({
            ...e,
            stamina: Math.min(e.maxStamina, e.stamina + 20),
          }));
          return { experts };
        },
      },
    ],
    condition: (state) => state.currentRound === 10 || state.currentRound === 15,
  },
];

export const getRandomBottlenecks = (round: number, count: number = 2): TechBottleneck[] => {
  // 根据回合数选择合适难度的卡点
  const available = bottleneckTemplates.filter(b => {
    if (round <= 5) return b.difficulty <= 5;
    if (round <= 10) return b.difficulty <= 7;
    return true;
  });

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((b, idx) => ({
    ...b,
    id: `bn_${round}_${idx}`,
    currentProgress: 0,
    solved: false,
  }));
};

export const getRandomEvent = (_round: number, state: any): GameEvent | null => {
  const available = specialEvents.filter(e => {
    if (!e.condition) return true;
    return e.condition(state);
  });

  if (available.length === 0) return null;

  // 特殊事件概率：每回合20%
  if (Math.random() > 0.2) return null;

  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled[0];
};
