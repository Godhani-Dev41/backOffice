export interface INote {
  content: string;
  datetime: string;
}

export interface INotesProps {
  notes: INote[];
  handleAdd: (INote) => void;
  toggle: () => void;
}
