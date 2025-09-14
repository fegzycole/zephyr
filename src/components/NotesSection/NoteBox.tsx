import { SaveIcon, XIcon } from 'lucide-react';
import TextArea from '../TextArea';
import IconButton from '../IconButton/IconButton';

interface INoteBox {
  value: string;
  onSave: () => void;
  onCancel: () => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export default function NoteBox({
  value,
  onChange,
  onCancel,
  onSave,
  rows = 3,
}: INoteBox) {
  return (
    <div className="relative">
      <TextArea
        value={value}
        onChange={onChange}
        className="pr-12 pb-12"
        rows={rows}
      />
      <div className="absolute bottom-2 right-2 flex gap-3">
        {value?.trim() && (
          <IconButton
            icon={XIcon}
            onAction={onCancel}
            className="hover:bg-gray bg-white"
            iconClassName="text-subtle"
          />
        )}
        <IconButton
          icon={SaveIcon}
          onAction={onSave}
          className="bg-primary"
          iconClassName="text-white"
          disabled={!value?.trim()}
        />
      </div>
    </div>
  );
}
