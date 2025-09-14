interface ITextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  rows?: number;
}

export default function TextArea({
  value = '',
  onChange,
  placeholder = '',
  className = '',
  id,
  rows = 8,
}: ITextAreaProps) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full block text-foreground p-3 bg-gray border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-y ${className}`}
    />
  );
}
