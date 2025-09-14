import { useEffect, useState } from 'react';
import { useStore } from '@store/store';
import NoteBox from './NoteBox';
import EditableNote from './EditableNote';
import { Note } from '@store/types';
import LoadMorePagination from '@components/LoadMorePagination';

export interface INoteSection {
  city: string;
}

const NOTES_PER_PAGE = 5;

export default function NoteSection({ city }: INoteSection) {
  const [comment, setNote] = useState('');
  const addNote = useStore((s) => s.addNote);
  const notes = useStore((s) => s.notes);
  const [cityNotes, setCityNotes] = useState<Note[]>([]);

  useEffect(() => {
    const notesOfCity = notes[city] || [];
    setCityNotes(notesOfCity);
  }, [city, notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
  };

  const handleCancel = () => {
    setNote('');
  };

  const handleSave = () => {
    if (comment.trim()) {
      addNote(city, comment);
      handleCancel();
    }
  };

  return (
    <div>
      <NoteBox
        value={comment}
        onCancel={handleCancel}
        onChange={handleChange}
        onSave={handleSave}
        rows={5}
      />

      {cityNotes.length > 0 && (
        <div className="mt-10">
          <h4 className="text-xl font-semibold text-foreground">
            Notes ({cityNotes.length})
          </h4>

          <LoadMorePagination
            totalCount={cityNotes.length}
            initialCount={NOTES_PER_PAGE}
            step={NOTES_PER_PAGE}
          >
            {(visibleCount) =>
              cityNotes
                .slice(0, visibleCount)
                .map((note) => (
                  <EditableNote
                    value={note.content}
                    id={note.id}
                    city={city}
                    key={note.id}
                  />
                ))
            }
          </LoadMorePagination>
        </div>
      )}
    </div>
  );
}
