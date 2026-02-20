import { Check, Circle, Droplets, Lightbulb, Recycle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  icon: React.ReactNode;
}

export function TasksList() {
  const tasks: Task[] = [
    {
      id: "1",
      title: "Water Conservation Quiz",
      points: 50,
      completed: true,
      icon: <Droplets className="w-5 h-5 text-blue-600" />
    },
    {
      id: "2", 
      title: "Energy Saving Challenge",
      points: 75,
      completed: false,
      icon: <Lightbulb className="w-5 h-5 text-yellow-600" />
    },
    {
      id: "3",
      title: "Recycling Photo Upload",
      points: 30,
      completed: false,
      icon: <Recycle className="w-5 h-5 text-green-600" />
    },
    {
      id: "4",
      title: "Daily Eco Habit Check",
      points: 25,
      completed: true,
      icon: <span className="text-green-600">🌱</span>
    }
  ];

  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg mb-4">Today's Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between ${
              task.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                {task.icon}
              </div>
              <div>
                <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500">+{task.points} points</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {task.completed ? (
                <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                  <Circle className="w-4 h-4 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}