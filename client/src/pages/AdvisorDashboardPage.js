import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
const AdvisorDashboardPage = () => {
    return (<div className="max-w-7xl mx-auto px-4 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Advisor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage student roadmaps</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">Advisor tools coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>);
};
export default AdvisorDashboardPage;
