import { SearchIcon } from 'lucide-react';

export default function NoWeatherData() {
  return (
    <div className="h-[70%] w-full flex flex-col justify-center items-center">
      <SearchIcon
        data-testid="lucide-icon"
        className="size-24 xl:size-48 text-subtle"
      />
      <p className="text-subtle text-lg xl:text-3xl">
        No Weather Information Available
      </p>
    </div>
  );
}
