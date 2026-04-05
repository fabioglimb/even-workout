import { useNavigate } from "react-router";
import { useWorkoutContext } from "../contexts/WorkoutContext";
import { WorkoutCard } from "../components/shared/WorkoutCard";
import { Button, useDrawerHeader } from "even-toolkit/web";
import { IcEditAdd } from "even-toolkit/web/icons/svg-icons";
import { useTranslation } from "../hooks/useTranslation";

export default function WorkoutList() {
  const navigate = useNavigate();
  const { allWorkouts, removeWorkout } = useWorkoutContext();
  const { t } = useTranslation();

  useDrawerHeader({
    title: 'ER Workout',
    right: (
      <Button size="sm" onClick={() => navigate("/editor")} aria-label={t('editor.newWorkout')}>
        <IcEditAdd width={16} height={16} />
      </Button>
    ),
  });

  return (
    <div className="px-3 pt-2 pb-8 flex flex-col gap-3">
      {allWorkouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onDelete={() => removeWorkout(workout.id)}
        />
      ))}
    </div>
  );
}
