export default function RenderStep({
  step,
  title,
}: {
  step: number;
  title: string;
}): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 font-bold text-white">
        {step}
      </div>
      <span className="text-lg font-semibold">{title}</span>
    </div>
  );
}
