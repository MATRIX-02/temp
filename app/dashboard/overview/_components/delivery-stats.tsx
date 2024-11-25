import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LuClock9, LuMoveVertical } from 'react-icons/lu';

export function DeliveryStats() {
  const deliveryStats = [
    { status: 'Pending Confirmation', totalOrders: 15 },
    { status: 'Pending Confirmation', totalOrders: 15 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <span>Delivery Stats</span>
            <button className="rounded-full p-1 transition-colors hover:bg-purple-100">
              <LuMoveVertical className="size-5 text-gray-600" />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-4">
          {deliveryStats.map((stat, idx) => (
            <div
              key={`Delivery-stat-${idx}`}
              className="flex-1 rounded-lg bg-yellow-200 p-2 shadow-md"
            >
              <div className="flex items-center gap-2">
                <LuClock9 className="size-5 rounded-full bg-red-300 stroke-red-600 p-1" />
                <span>{stat.status}</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4">
                <span className="text-bold text-5xl">{stat.totalOrders}</span>
                <span>{stat.totalOrders === 1 ? 'Order' : 'Orders'}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
