import { useAuth } from "../store/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
const DashboardPage = () => {
    const { user } = useAuth();
    return (<div className="max-w-7xl mx-auto px-4 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, {user?.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>My Roadmaps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                No roadmaps yet. Create one to get started!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Track your academic journey here</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">Access helpful planning tools</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
};
export default DashboardPage;
