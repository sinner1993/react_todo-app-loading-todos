import React from 'react';
import { Todo } from '../../types/Todo';
import { Select } from '../../types/select';
type Props = {
  todosCopy: Todo[];
  select: Select;
  handleFiltering: (param: string) => void;
};

export const Footer: React.FC<Props> = ({
  todosCopy,
  select,
  handleFiltering,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCopy.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${select[0] && 'selected'}`}
          data-cy="FilterLinkAll"
          onClick={() => handleFiltering('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${select[1] && 'selected'}`}
          data-cy="FilterLinkActive"
          onClick={() => handleFiltering('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${select[2] && 'selected'}`}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFiltering('completed')}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
