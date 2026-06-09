import type { Department } from '../types';

export const initialDepartments: Record<string, Department> = {
  theory: {
    id: 'theory',
    name: '理论部',
    description: '用算盘和手摇计算机计算核爆临界值，构建理论模型',
    icon: 'Calculator',
    progress: 0,
    maxProgress: 100,
    status: 'normal',
    linkages: [
      {
        target: 'factory',
        effect: '理论成果指导工厂加工精度',
        multiplier: 0.3,
      },
    ],
  },
  factory: {
    id: 'factory',
    name: '工厂',
    description: '铀提纯、部件精密加工，将图纸转化为实物',
    icon: 'Factory',
    progress: 0,
    maxProgress: 100,
    status: 'normal',
    linkages: [
      {
        target: 'testSite',
        effect: '工厂产出保障试验场试验',
        multiplier: 0.3,
      },
    ],
  },
  testSite: {
    id: 'testSite',
    name: '试验场',
    description: '在戈壁滩进行爆轰物理试验，验证引爆方案',
    icon: 'Flame',
    progress: 0,
    maxProgress: 100,
    status: 'normal',
    linkages: [
      {
        target: 'theory',
        effect: '试验数据修正理论模型',
        multiplier: 0.2,
      },
    ],
  },
  logistics: {
    id: 'logistics',
    name: '后勤保障',
    description: '保障水、粮、建材和医疗，维持基地运转',
    icon: 'Truck',
    progress: 0,
    maxProgress: 100,
    status: 'normal',
    linkages: [],
  },
};

export const departmentNames: Record<string, string> = {
  theory: '理论部',
  factory: '工厂',
  testSite: '试验场',
  logistics: '后勤保障',
};

export const departmentDescriptions: Record<string, string> = {
  theory: '算盘计算，方程推导',
  factory: '铀提纯，精密加工',
  testSite: '爆轰试验，数据采集',
  logistics: '水粮建材，医疗保障',
};
