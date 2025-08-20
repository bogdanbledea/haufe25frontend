import "./App.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold text-gray-800">Student App</h1>
        <nav>
          <Button variant="outline" size="sm">
            Login
          </Button>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="mt-12 text-center">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Welcome to the Summer Practice App!
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Track your todos, participate in polls, and practice coding in a fun
          interactive way.
        </p>
      </section>

      {/* Todos Card */}
      <section className="mt-10 w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Todos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Learn React</span>
                <Button variant="ghost" size="sm">
                  Done
                </Button>
              </li>
              <li className="flex justify-between items-center">
                <span>Build practice app</span>
                <Button variant="ghost" size="sm">
                  Done
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default App;
