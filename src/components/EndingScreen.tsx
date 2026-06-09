import { motion } from 'framer-motion';
import { Trophy, Clock, AlertTriangle, Scale } from 'lucide-react';
import type { EndingType } from '../types';
import { endingTexts } from '../utils/gameLogic';

interface Props {
  endingType: EndingType;
  rounds: number;
  totalActions: number;
  onRestart: () => void;
}

const endingConfig: Record<EndingType, { icon: typeof Trophy; color: string; bgColor: string }> = {
  victory: {
    icon: Trophy,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
  },
  timeOut: {
    icon: Clock,
    color: 'text-gobi-400',
    bgColor: 'bg-gobi-700/30',
  },
  expertsCollapsed: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/20',
  },
  imbalance: {
    icon: Scale,
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
  },
};

export default function EndingScreen({ endingType, rounds, totalActions, onRestart }: Props) {
  const config = endingConfig[endingType];
  const text = endingTexts[endingType];
  const Icon = config.icon;

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
        className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}
      >
        <Icon className={`w-10 h-10 ${config.color}`} />
      </motion.div>

      <motion.h1
        className={`text-4xl md:text-5xl font-serif-cn font-bold ${config.color} mb-4 text-center`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {text.title}
      </motion.h1>

      <motion.div
        className="max-w-xl w-full mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="card-archive border-l-4 border-l-archive-stamp">
          {text.text.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-gobi-200 leading-relaxed mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="flex gap-8 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gobi-100">{rounds}</div>
          <div className="text-gobi-400 text-sm">历经轮数</div>
        </div>
        <div className="w-px bg-gobi-700" />
        <div className="text-center">
          <div className="text-3xl font-bold text-gobi-100">{totalActions}</div>
          <div className="text-gobi-400 text-sm">决策次数</div>
        </div>
      </motion.div>

      {endingType !== 'victory' && (
        <motion.p
          className="text-gobi-500 text-sm mb-8 text-center italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          1964年10月16日，先辈们在罗布泊完成了中国第一颗原子弹的爆炸试验。
        </motion.p>
      )}

      <motion.button
        onClick={onRestart}
        className="btn-primary text-lg px-8 py-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        重新开始
      </motion.button>
    </motion.div>
  );
}
