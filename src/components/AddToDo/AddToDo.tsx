import React from 'react';

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

export const AddTodos: React.FC<Props> = ({
  handleSubmit,
  handleOnChange,
  value,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={handleOnChange}
        value={value}
      />
    </form>
  );
};
