import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
const JourneyDashboardPage = () => {
    return (<div className="max-w-7xl mx-auto px-4 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">My Journey</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your academic progress</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">Journey tracking coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>);
};
export default JourneyDashboardPage;
