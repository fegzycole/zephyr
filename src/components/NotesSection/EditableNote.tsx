import { useState } from 'react';
import NoteBox from './NoteBox';
import { useStore } from '@store';
import NoteBubble from './NoteBubble';
import NoteActions from './NoteActions';

interface IEditableNote {
  value: string;
  id: string;
  city: string;
}

export default function EditableNote({ value, id, city }: IEditableNote) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const updateNote = useStore((s) => s.updateNote);
  const removeNote = useStore((s) => s.removeNote);

  const handleSave = () => {
    updateNote(city, id, text);
    setIsEditing(false);
  };

  return (
    <div className="relative max-w-full flex justify-end group my-5">
      <NoteBubble>
        {!isEditing ? (
          <p className="font-lighter text-base text-subtle">{text}</p>
        ) : (
          <NoteBox
            value={text}
            onChange={(e) => setText(e.target.value)}
            onCancel={() => {
              setText(value);
              setIsEditing(false);
            }}
            onSave={handleSave}
          />
        )}
      </NoteBubble>

      {!isEditing && (
        <NoteActions
          onEdit={() => setIsEditing(true)}
          onRemove={() => removeNote(city, id)}
        />
      )}
    </div>
  );
}
