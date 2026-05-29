import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
const ExplorePage = () => {
    return (<div className="max-w-7xl mx-auto px-4 py-20">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Explore CUNY</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Discover all 25 CUNY campuses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (<Card key={i}>
              <CardHeader>
                <CardTitle>Campus {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Campus information coming soon</p>
              </CardContent>
            </Card>))}
        </div>
      </div>
    </div>);
};
export default ExplorePage;
