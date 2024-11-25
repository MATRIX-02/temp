import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { StockStatus } from './stock-status';
import { PieGraph } from './pie-graph';
// import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TopCategoriesCard from './TopCategoriesCard';
import SupplierPerformanceCard from './SupplierPerformanceCard';
import ComplianceScores from './complaince-scores';
import { CycleTime } from './cycle-time';
import { DeliveryStats } from './delivery-stats';
import { ActionButtons } from './actions/action-buttons';

export default function OverViewPage2() {
  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Key Performance Metrics
          </h2>
          {/* <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div> */}
        </div>
        <div className="space-y-4 pt-3">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="col-span-full md:col-span-2 xl:col-span-1">
              <PieGraph name="Approved Requisition" />
            </div>
            <div className="col-span-full md:col-span-2 xl:col-span-1">
              <PieGraph name="Purchase Order" />
            </div>
            <div className="col-span-full xl:col-span-2">
              <TopCategoriesCard />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
            <div className="col-span-full space-y-4 xl:col-span-9">
              <div>
                <SupplierPerformanceCard />
              </div>
              <div className="col-span-4">
                <StockStatus />
              </div>
              <div className="col-span-4 grid grid-cols-5 gap-4 md:col-span-3">
                <div className="col-span-full xl:col-span-2">
                  <CycleTime />
                </div>
                <div className="col-span-full xl:col-span-3">
                  <DeliveryStats />
                </div>
              </div>
              <div className="col-span-4 md:col-span-3"></div>
            </div>
            {/* Compliance Scores */}
            <Card className="col-span-full mb-4 xl:col-span-3">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Compliance Scores</CardTitle>
                    <CardDescription>
                      By Percentage / Out of 100
                    </CardDescription>
                  </div>
                  <ActionButtons />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ComplianceScores />
              </CardContent>
              <CardFooter className="mt-4 justify-center text-center text-sm text-gray-600">
                Showing 5 suppliers • Last 30 days
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
