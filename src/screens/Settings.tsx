import { useDrawerHeader } from "even-toolkit/web";

export default function Settings() {
  useDrawerHeader({ title: 'Settings' });

  return (
    <div className="px-3 pt-4 pb-8">
      <p className="text-[13px] tracking-[-0.13px] text-text-dim">
        ER Workout v1.0 — Workout tracking for Even Realities G2.
      </p>
      <p className="text-[11px] tracking-[-0.11px] text-text-dim mt-2">
        Data is stored locally in your browser.
      </p>
    </div>
  );
}
