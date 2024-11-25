import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionButtons } from './actions/action-buttons';

export function CycleTime() {
  const cycleInfo = [
    { title: 'PR to PO', time: '1 day', bgColor: '#D5E4FA' },
    { title: 'Receipt Processing', time: '1 day', bgColor: '#FFFDC7' },
    { title: 'Invoice Processing', time: '1 day', bgColor: '#FBD4F5' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <div>
              Cycle Time{' '}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {'('}avg{'.)'}
              </span>
            </div>
            <ActionButtons />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {cycleInfo.map((info, idx) => (
            <div
              key={`Cycle-info-${idx}`}
              className="flex items-center justify-between rounded-xl px-4 py-2"
              style={{ backgroundColor: info.bgColor }}
            >
              <div className="flex items-center justify-center gap-x-3">
                <div className="size-1.5 rounded-full border border-black"></div>
                <span className="font-medium">{info.title}</span>
              </div>
              <Badge className="rounded-full bg-secondary/50 font-medium text-black hover:bg-secondary/50">
                {info.time}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
