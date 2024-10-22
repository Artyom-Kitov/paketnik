import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 

function App() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Paketnik</h1>
      <div className="w-4/5 max-w-7xl flex justify-center bg-gray-100 py-16">
        <Card className="w-96 bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Hello World</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card content</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
