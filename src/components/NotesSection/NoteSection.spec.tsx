import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

import { useStore } from '@store/store';
import NoteSection from './NoteSection';

type NoteItem = { id: string; content: string };
type MinimalStore = {
  addNote: (city: string, content: string) => void;
  notes: Record<string, NoteItem[]>;
};

describe('NoteSection', () => {
  let addNoteSpy: ReturnType<typeof vi.fn>;

  const setStore = (partial: Partial<MinimalStore>) =>
    useStore.setState(partial as Partial<unknown>);

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    addNoteSpy = vi.fn();
    setStore({
      addNote: addNoteSpy,
      notes: {},
    });
  });

  afterEach(() => {
    setStore({ addNote: () => {}, notes: {} });
  });

  it('renders NoteBox (textarea present)', async () => {
    render(<NoteSection city="Paris" />);
    const textarea = await screen.findByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('saves a comment and clears the input', async () => {
    render(<NoteSection city="Paris" />);
    const textarea = (await screen.findByRole(
      'textbox'
    )) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'A new comment' } });

    const buttons = await screen.findAllByRole('button');
    const enabledButtons = buttons.filter((b) => !b.hasAttribute('disabled'));
    const saveButton = enabledButtons[enabledButtons.length - 1];
    fireEvent.click(saveButton);

    expect(addNoteSpy).toHaveBeenCalledWith('Paris', 'A new comment');
    expect(textarea).toHaveValue('');
  });

  it('cancels a comment and clears the input without calling addNote', async () => {
    render(<NoteSection city="Paris" />);
    const textarea = (await screen.findByRole(
      'textbox'
    )) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: 'Draft comment' } });

    const buttons = await screen.findAllByRole('button');
    const cancelButton = buttons.find((b) => !b.hasAttribute('disabled'))!;
    fireEvent.click(cancelButton);

    expect(addNoteSpy).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('');
  });

  it('renders notes for the current city and shows count', async () => {
    setStore({
      notes: {
        London: [
          { id: 'n1', content: 'Note 1' },
          { id: 'n2', content: 'Note 2' },
        ],
      },
    });

    const { container } = render(<NoteSection city="London" />);

    expect(await screen.findByText(/Notes \(2\)/)).toBeInTheDocument();
    expect(await screen.findByText('Note 1')).toBeInTheDocument();
    expect(await screen.findByText('Note 2')).toBeInTheDocument();

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot when no notes exist', async () => {
    setStore({ notes: {} });
    const { container } = render(<NoteSection city="Nowhere" />);
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    expect(container.firstChild).toMatchSnapshot();
  });
});
