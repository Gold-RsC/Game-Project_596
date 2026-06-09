import { motion } from 'framer-motion';
import { Heart, Zap, User, Check } from 'lucide-react';
import type { Expert } from '../types';
import { calculateExpertEfficiency } from '../utils/gameLogic';
import { expertiseLabels } from '../data/experts';

interface Props {
  experts: Expert[];
  selectedExpertId?: string;
  onSelectExpert?: (id: string) => void;
  mode?: 'display' | 'select';
}

export default function ExpertPanel({
  experts,
  selectedExpertId,
  onSelectExpert,
  mode = 'display',
}: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {experts.map((expert, index) => {
        const efficiency = calculateExpertEfficiency(expert);
        const isSelected = selectedExpertId === expert.id;

        return (
          <motion.div
            key={expert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`card-archive p-3 ${
              mode === 'select' && onSelectExpert
                ? 'cursor-pointer hover:ring-1 hover:ring-gobi-500'
                : ''
            } ${
              isSelected ? 'ring-2 ring-archive-stamp' : ''
            } ${
              expert.status !== 'active' ? 'opacity-60' : ''
            }`}
            onClick={() => {
              if (mode === 'select' && onSelectExpert && expert.status === 'active') {
                onSelectExpert(expert.id);
              }
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gobi-800 flex items-center justify-center">
                <User className="w-4 h-4 text-gobi-400" />
              </div>
              <div>
                <div className="text-gobi-100 text-sm font-bold">{expert.codeName}</div>
                <div className="text-gobi-500 text-xs">{expertiseLabels[expert.expertise]}</div>
              </div>
              {isSelected && (
                <Check className="w-4 h-4 text-archive-stamp ml-auto" />
              )}
            </div>

            {/* 状态标签 */}
            {expert.status !== 'active' && (
              <div className={`text-xs font-medium mb-2 ${
                expert.status === 'sick' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {expert.status === 'sick' ? `病倒中（${expert.sickRounds}轮）` : '休息中'}
              </div>
            )}

            {/* 体力条 */}
            <div className="mb-1.5">
              <div className="flex items-center gap-1 text-xs mb-0.5">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-gobi-400">体力</span>
                <span className="text-gobi-200 ml-auto">{expert.stamina}</span>
              </div>
              <div className="h-1.5 bg-gobi-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    expert.stamina > 50
                      ? 'bg-green-500'
                      : expert.stamina > 30
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${expert.stamina}%` }}
                />
              </div>
            </div>

            {/* 牵挂度 */}
            <div className="mb-1.5">
              <div className="flex items-center gap-1 text-xs mb-0.5">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className="text-gobi-400">牵挂</span>
                <span className="text-gobi-200 ml-auto">{expert.familyConcern}</span>
              </div>
              <div className="h-1.5 bg-gobi-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${expert.familyConcern}%` }}
                />
              </div>
            </div>

            {/* 效率 */}
            {expert.status === 'active' && (
              <div className="text-xs text-gobi-400">
                效率: <span className="text-gobi-200">{(efficiency * 100).toFixed(0)}%</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
