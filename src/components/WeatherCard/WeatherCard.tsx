import { StarIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import IconButton from '../IconButton';

interface IWeatherCardProps {
  city: string;
  time: string;
  temp: string;
  icon: string;
  isFavorite: boolean;
  canDelete: boolean;
  onFavoriteToggle: () => void;
  onRemoveCity: () => void;
}

export function WeatherCard({
  city,
  time,
  temp,
  icon,
  isFavorite,
  canDelete,
  onFavoriteToggle,
  onRemoveCity,
}: IWeatherCardProps) {
  return (
    <div className="p-5 bg-gray rounded-3xl relative">
      <div className="absolute top-[-20px] right-[-10px] flex gap-2">
        {canDelete && (
          <IconButton
            icon={TrashIcon}
            onAction={onRemoveCity}
            className="hover:bg-red-50 bg-white"
            iconClassName="text-red-500 white"
            dataTestId='delete-icon'
          />
        )}
        <IconButton
          icon={StarIcon}
          onAction={onFavoriteToggle}
          className="hover:bg-yellow-50 bg-white"
          iconClassName={
            isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-subtle'
          }
          dataTestId='favorite-icon'
        />
      </div>
      <Link
        to={`/weather?city=${city}`}
        className="flex justify-between items-center"
      >
        <div className="flex gap-3 items-center">
          <div>
            <img src={icon} alt={`${city} icon`} className="w-16 h-16" />
          </div>
          <div>
            <h3 className="text-active text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
              {city}
            </h3>
            <p className="text-subtle text-base md:text-lg lg:text-xl">
              {time}
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-subtle">
            {temp}°C
          </h2>
        </div>
      </Link>
    </div>
  );
}
