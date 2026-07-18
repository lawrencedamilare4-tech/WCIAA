import { usePredictions } from './hooks/usePredictions';
import { PredictionList } from './components/PredictionList';
import { motion } from 'framer-motion';
import { slideUp } from '../../shared/utils/animations';

export default function PredictionsPage() {
  const { matches, aiPredictions, userPredictions, isLoading, error } = usePredictions();

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Predictions</h1>
      <PredictionList
        matches={matches}
        aiPredictions={aiPredictions}
        userPredictions={userPredictions}
        isLoading={isLoading}
        error={error}
      />
    </motion.div>
  );
}