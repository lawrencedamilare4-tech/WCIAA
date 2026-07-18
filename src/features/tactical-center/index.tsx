import { useState } from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { motion } from 'framer-motion';
import { slideUp } from '@/shared/utils/animations';
import { useTacticalReports, useTacticalReportById } from './hooks/useTacticalReports';
import { MatchSelector } from './components/MatchSelector';
import { TacticalReportCard } from './components/TacticalReportCard';

export default function TacticalCenterPage() {
  const { data: reports, isLoading, error } = useTacticalReports();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: selectedReport, isLoading: loadingReport } = useTacticalReportById(selectedId);

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-6 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Tactical Center</h1>
        {reports && reports.length > 0 && (
          <MatchSelector
            reports={reports}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>

      {error && <div className="text-danger">Failed to load tactical reports.</div>}

      {isLoading && <Skeleton className="h-64" />}

      {!isLoading && reports?.length === 0 && (
        <div className="text-gray-500">No tactical reports available yet.</div>
      )}

      {selectedId && loadingReport && <Skeleton className="h-64" />}

      {selectedId && selectedReport && (
        <TacticalReportCard report={selectedReport} />
      )}

      {!selectedId && !isLoading && reports && reports.length > 0 && (
        <div className="text-gray-500 text-center py-12">
          Select a match to view its tactical breakdown.
        </div>
      )}
    </motion.div>
  );
}