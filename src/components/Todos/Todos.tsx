/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import { UpdateToDo } from '../UpdateTodo/updateTodo';
import { RemoveButton } from '../RemoveTodos/RemoveTodo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  handleComplete: (todo: Todo) => void;
  handleSwitcher: (todo: Todo) => void;
  handleRemove: (todo: Todo) => void;
  handleUpdateForm: (
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => void;
  updateValue: string;
  setUpdateSwitcher: React.Dispatch<React.SetStateAction<number>>;
  handleUpdatingOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updateSwitcher: number; // Fixed the typo here
  loader: Record<number, boolean>;
};

export const Todos: React.FC<Props> = ({
  todo,
  handleComplete,
  handleSwitcher,
  handleRemove,
  handleUpdateForm,
  updateValue,
  setUpdateSwitcher,
  handleUpdatingOnChange,
  updateSwitcher,
  loader,
}) => {
  return (
    // eslint-disable-next-line react/jsx-no-comment-textnodes
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleComplete(todo)}
          checked={todo.completed}
        />
      </label>
      {updateSwitcher !== todo.id && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => handleSwitcher(todo)}
        >
          {todo.title}
        </span>
      )}
      {updateSwitcher !== todo.id && (
        <RemoveButton handleRemove={handleRemove} todo={todo} />
      )}
      {updateSwitcher === todo.id && (
        <UpdateToDo
          handleUpdateForm={handleUpdateForm}
          todo={todo}
          updateValue={updateValue}
          setUpdateSwitcher={setUpdateSwitcher}
          handleUpdatingOnChange={handleUpdatingOnChange}
        />
      )}
      {/* Overlay will cover the todo while it is being deleted or updated */}
      <Loader loader={loader} todoId={todo.id} />
    </div>
  );
};
