import { motion } from 'framer-motion';
import {
  Calculator,
  Factory,
  Flame,
  Truck,
} from 'lucide-react';
import type { Department } from '../types';

const iconMap: Record<string, typeof Calculator> = {
  Calculator,
  Factory,
  Flame,
  Truck,
};

interface Props {
  department: Department;
  techProgress?: number;
  techMax?: number;
  isTarget?: boolean;
  onSelect?: () => void;
}

export default function DepartmentCard({
  department,
  techProgress,
  techMax,
  isTarget = false,
  onSelect,
}: Props) {
  const Icon = iconMap[department.icon] || Calculator;
  const progressPercent = Math.round((department.progress / department.maxProgress) * 100);

  return (
    <motion.div
      className={`card-archive cursor-pointer transition-all ${
        isTarget ? 'ring-2 ring-archive-stamp' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-gobi-800 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gobi-300" />
        </div>
        <div>
          <h3 className="text-gobi-100 font-bold font-serif-cn">{department.name}</h3>
          <p className="text-gobi-500 text-xs">{department.description}</p>
        </div>
        {department.status === 'bottleneck' && (
          <span className="ml-auto text-archive-stamp text-xs font-bold animate-pulse">
            卡壳
          </span>
        )}
      </div>

      {/* 部门进度 */}
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gobi-400">部门进度</span>
          <span className="text-gobi-200">{progressPercent}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-gobi-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* 攻关进度 */}
      {techProgress !== undefined && techMax !== undefined && (
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gobi-400">攻关进度</span>
            <span className="text-archive-stamp font-medium">
              {Math.round((techProgress / techMax) * 100)}%
            </span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill bg-archive-stamp/80"
              initial={{ width: 0 }}
              animate={{ width: `${(techProgress / techMax) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
