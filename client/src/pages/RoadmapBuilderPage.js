import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
const RoadmapBuilderPage = () => {
    return (<div className="max-w-7xl mx-auto px-4 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Roadmap Builder</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Create your academic roadmap</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Build Your Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">Roadmap builder coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>);
};
export default RoadmapBuilderPage;
