import { Edit2Icon, TrashIcon } from 'lucide-react';
import IconButton from '../IconButton';

interface NoteActionsProps {
  onEdit: () => void;
  onRemove: () => void;
}

export default function NoteActions({ onEdit, onRemove }: NoteActionsProps) {
  return (
    <div
      className="absolute bottom-[-45px] right-0 flex gap-2
                 opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                 transition-opacity duration-200"
    >
      <IconButton
        icon={Edit2Icon}
        onAction={onEdit}
        className="bg-white hover:bg-light shadow"
        iconClassName="text-gray-500"
      />
      <IconButton
        icon={TrashIcon}
        onAction={onRemove}
        className="bg-white hover:bg-red-50 shadow"
        iconClassName="text-red-500"
      />
    </div>
  );
}
