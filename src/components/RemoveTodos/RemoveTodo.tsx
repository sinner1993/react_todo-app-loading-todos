import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  handleRemove: (todo: Todo) => void;
  todo: Todo;
};

export const RemoveButton: React.FC<Props> = ({ handleRemove, todo }) => {
  return (
    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => handleRemove(todo)}
    >
      ×
    </button>
  );
};
