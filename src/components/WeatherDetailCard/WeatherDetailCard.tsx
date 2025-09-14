export interface IWeatherDetailCard {
  label: string;
  value: string;
  icon: string;
}

export default function WeatherDetailCard({
  label,
  value,
  icon,
}: IWeatherDetailCard) {
  return (
    <div className="bg-gray p-5 rounded-3xl flex gap-4 items-start">
      <img
        src={`/weather_details/${icon}`}
        alt={`${label} icon`}
        className="w-6"
      />
      <div>
        <h5 className="mb-2 text-xl text-detail">{label}</h5>
        <h3 className="text-3xl text-foreground font-semibold">{value}</h3>
      </div>
    </div>
  );
}
