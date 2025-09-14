interface NoteBubbleProps {
  children: React.ReactNode;
}

export default function NoteBubble({ children }: NoteBubbleProps) {
  return (
    <div className="relative inline-block rounded-2xl bg-gray p-4 shadow-sm min-w-[150px] min-h-[52px] cursor-auto">
      {children}
      <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2">
        <div className="h-0 w-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray"></div>
      </div>
    </div>
  );
}
