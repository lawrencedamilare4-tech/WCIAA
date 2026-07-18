import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Markdown } from '@/shared/components/Markdown';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title: string;
}

export function ReportContentViewer({ open, onOpenChange, content, title }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          <Markdown content={content} />
        </div>
      </DialogContent>
    </Dialog>
  );
}