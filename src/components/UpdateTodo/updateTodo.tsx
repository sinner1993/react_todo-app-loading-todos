import { Todo } from '../../types/Todo';

type Props = {
  handleUpdateForm: (
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => void;
  todo: Todo;
  updateValue: string;
  setUpdateSwitcher: React.Dispatch<React.SetStateAction<number>>;
  handleUpdatingOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UpdateToDo: React.FC<Props> = ({
  handleUpdateForm,
  todo,
  updateValue,
  setUpdateSwitcher,
  handleUpdatingOnChange,
}) => {
  return (
    <form onSubmit={event => handleUpdateForm(event, todo)}>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={updateValue}
        onBlur={() => setUpdateSwitcher(0)}
        autoFocus
        onChange={handleUpdatingOnChange}
      />
    </form>
  );
};
