import { motion } from 'framer-motion';
import { Phone, AlertTriangle } from 'lucide-react';
import type { GameEvent } from '../types';

interface Props {
  event: GameEvent;
  onChoice: (index: number) => void;
}

export default function EventModal({ event, onChoice }: Props) {
  const isBeijingCall = event.type === 'beijingCall';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 遮罩 */}
      <motion.div
        className="absolute inset-0 bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* 弹窗 */}
      <motion.div
        className="relative card-archive max-w-lg w-full border-2"
        style={{
          borderColor: isBeijingCall ? '#c41e3a' : undefined,
        }}
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* 标题 */}
        <div className="flex items-center gap-3 mb-4">
          {isBeijingCall ? (
            <div className="w-10 h-10 rounded-full bg-archive-stamp/20 flex items-center justify-center">
              <Phone className="w-5 h-5 text-archive-stamp" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold font-serif-cn text-gobi-100">
              {event.title}
            </h3>
            {isBeijingCall && (
              <span className="text-archive-stamp text-xs font-bold">紧急来电</span>
            )}
          </div>
        </div>

        {/* 描述 */}
        <div className="bg-gobi-950/50 rounded-lg p-4 mb-5 border border-gobi-800">
          <p className="text-gobi-200 leading-relaxed">{event.description}</p>
        </div>

        {/* 选择 */}
        <div className="space-y-3">
          {event.choices.map((choice, index) => (
            <motion.button
              key={index}
              onClick={() => onChoice(index)}
              className="w-full text-left btn-secondary py-4 group"
              whileHover={{ scale: 1.02, borderColor: 'rgba(196, 30, 58, 0.5)' }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-gobi-100 group-hover:text-archive-stamp transition-colors">
                    {choice.text}
                  </div>
                  <div className="text-sm text-gobi-500 mt-1">{choice.effect}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
