import { useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { WorkoutCard } from "../components/shared/WorkoutCard";
import { Button, ScreenHeader, AppShell } from "even-toolkit/web";

export default function WorkoutList() {
  const navigate = useNavigate();
  const { allWorkouts, removeWorkout } = useWorkoutContext();

  return (
    <AppShell
      header={
        <div className="px-3">
          <ScreenHeader
            title="EvenWorkout"
            actions={
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => navigate("/editor")}>+ New</Button>
                <Button variant="default" size="sm" onClick={() => navigate("/history")}>History</Button>
              </div>
            }
          />
        </div>
      }
    >
      <div className="px-3 pt-2 pb-8 flex flex-col gap-3">
        {allWorkouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onDelete={() => removeWorkout(workout.id)}
          />
        ))}
      </div>
    </AppShell>
  );
}
