import { BrowserRouter, Routes, Route } from "react-router";
import { WorkoutProvider } from "./contexts/WorkoutContext";
import WorkoutList from "./screens/WorkoutList";
import WorkoutDetail from "./screens/WorkoutDetail";
import ActiveWorkout from "./screens/ActiveWorkout";
import WorkoutComplete from "./screens/WorkoutComplete";
import WorkoutEditor from "./screens/WorkoutEditor";
import SessionHistory from "./screens/SessionHistory";
import Settings from "./screens/Settings";
import WorkoutCalendar from "./screens/WorkoutCalendar";
import { WorkoutGlasses } from "./glass/WorkoutGlasses";
import { Shell } from "./layouts/shell";

export default function App() {
  return (
    <BrowserRouter>
      <WorkoutProvider>
        <WorkoutGlasses />
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<WorkoutList />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/workout/:id/active" element={<ActiveWorkout />} />
            <Route path="/workout/:id/complete" element={<WorkoutComplete />} />
            <Route path="/editor" element={<WorkoutEditor />} />
            <Route path="/editor/:id" element={<WorkoutEditor />} />
            <Route path="/calendar" element={<WorkoutCalendar />} />
            <Route path="/history" element={<SessionHistory />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </WorkoutProvider>
    </BrowserRouter>
  );
}
