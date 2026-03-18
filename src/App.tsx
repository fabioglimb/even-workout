import { BrowserRouter, Routes, Route } from "react-router";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import WorkoutList from "./screens/WorkoutList";
import WorkoutDetail from "./screens/WorkoutDetail";
import ActiveWorkout from "./screens/ActiveWorkout";
import WorkoutComplete from "./screens/WorkoutComplete";
import WorkoutEditor from "./screens/WorkoutEditor";
import SessionHistory from "./screens/SessionHistory";
import { WorkoutGlasses } from "./glass/WorkoutGlasses";

export default function App() {
  return (
    <BrowserRouter>
      <WorkoutProvider>
        <WorkoutGlasses />
        <div className="min-h-screen bg-bg">
          <Routes>
            <Route path="/" element={<WorkoutList />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/workout/:id/active" element={<ActiveWorkout />} />
            <Route path="/workout/:id/complete" element={<WorkoutComplete />} />
            <Route path="/editor" element={<WorkoutEditor />} />
            <Route path="/editor/:id" element={<WorkoutEditor />} />
            <Route path="/history" element={<SessionHistory />} />
          </Routes>
        </div>
      </WorkoutProvider>
    </BrowserRouter>
  );
}
