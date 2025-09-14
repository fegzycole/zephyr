import clsx from 'clsx';

interface ISearchBar {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  className,
  placeholder = 'Search Cities',
  onChange,
}: ISearchBar) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={clsx('bg-gray w-full lg:w-[45%] rounded-xl p-3', className)}
    />
  );
}
