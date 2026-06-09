import { motion } from 'framer-motion';
import { Radio, Shield, Heart } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* 顶部红色印章效果 */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-full border-4 border-archive-stamp/80 flex items-center justify-center">
          <span className="text-archive-stamp font-bold text-lg font-serif-cn">机密</span>
        </div>
      </motion.div>

      {/* 标题 */}
      <motion.h1
        className="text-5xl md:text-6xl font-serif-cn font-bold text-gobi-100 mb-4 text-center tracking-wider"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        代号：596
      </motion.h1>

      <motion.p
        className="text-gobi-400 text-lg mb-10 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        中国第一颗原子弹研制工程代号
      </motion.p>

      {/* 三个精神 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mb-12"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        <div className="card-archive text-center">
          <Shield className="w-8 h-8 text-archive-stamp mx-auto mb-3" />
          <h3 className="text-gobi-200 font-serif-cn font-bold text-lg mb-2">自力更生</h3>
          <p className="text-gobi-400 text-sm">外援撤走后，靠自己啃下硬骨头</p>
        </div>
        <div className="card-archive text-center">
          <Radio className="w-8 h-8 text-archive-stamp mx-auto mb-3" />
          <h3 className="text-gobi-200 font-serif-cn font-bold text-lg mb-2">大力协同</h3>
          <p className="text-gobi-400 text-sm">三部门联动，找到最弱的环节帮一把</p>
        </div>
        <div className="card-archive text-center">
          <Heart className="w-8 h-8 text-archive-stamp mx-auto mb-3" />
          <h3 className="text-gobi-200 font-serif-cn font-bold text-lg mb-2">无私奉献</h3>
          <p className="text-gobi-400 text-sm">把牵挂压在心底，隐姓埋名干惊天动地事</p>
        </div>
      </motion.div>

      {/* 背景故事 */}
      <motion.div
        className="max-w-2xl w-full mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <div className="card-archive border-l-4 border-l-archive-stamp">
          <p className="text-gobi-300 leading-relaxed">
            1960年，苏联撤走全部专家。罗布泊的戈壁滩上，一群科学家隐姓埋名，
            用算盘和手摇计算机，开始了中国原子弹的研制。
          </p>
          <p className="text-gobi-300 leading-relaxed mt-3">
            你，是罗布泊原子弹研制基地的<span className="text-archive-stamp font-bold">总调度</span>。
            在20轮内，你需要协调四个部门，完成三项核心攻关——理论设计、核燃料提纯、引爆装置。
          </p>
          <p className="text-gobi-400 text-sm mt-3 italic">
            每一轮你只能选择两个行动。时间紧迫，压力巨大。
          </p>
        </div>
      </motion.div>

      {/* 开始按钮 */}
      <motion.button
        onClick={onStart}
        className="btn-primary text-xl px-10 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        接受任务
      </motion.button>
    </motion.div>
  );
}
