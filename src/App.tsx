/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { Select } from './types/select';

export const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loader, setLoader] = useState<Record<number, boolean>>({});
  const randomId = Math.floor(Math.random() * 100000000);
  const [errorMesage, setErrorMesage] = useState<string>('');
  const [uptdateSwitcher, setUpdateSwitcher] = useState<number>(0);
  const [updateValue, setUpdateValue] = useState<string>('');
  const [todosCopy, setTodosCopy] = useState<Todo[]>([]);
  const [select, setSelect] = useState<Select>({
    0: true,
    1: false,
    2: false,
  });

  useEffect(() => {
    getTodos()
      .then(respond => {
        setTodos(respond);
        setTodosCopy(respond);
      })
      .catch(() => {
        setErrorMesage('Unable to load todos');
        setTimeout(() => {
          setErrorMesage('');
        }, 300);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleLoading = (id: number, state: boolean) => {
    setLoader(prev => ({ ...prev, [id]: state }));
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.trim());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value) {
      setErrorMesage('Title should not be empty');

      return;
    }

    setErrorMesage('');

    const postRequest = client.post<Todo>('/todos', {
      title: value,
      id: randomId,
      completed: false,
    });

    postRequest
      .then(response => {
        setErrorMesage('');
        handleLoading(response.id, true);
        setTimeout(() => {
          handleLoading(response.id, false);
          setTodos(prev => [...prev, response]);
        }, 100);
        setErrorMesage('');
        setValue('');
      })
      .catch(() => {
        setErrorMesage('Title should not be empty');
      });
  };

  const handleComplete = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      const updatedPromis: Todo = await client.patch(
        `/todos/${todo.id}`,
        updatedTodo,
      );

      handleLoading(todo.id, true);
      setTimeout(() => {
        setTodos(prev =>
          prev.map(todoObj =>
            todoObj.id === updatedPromis.id ? updatedPromis : todoObj,
          ),
        );
        setTodosCopy(prev =>
          prev.map(todoObj =>
            todoObj.id === updatedPromis.id ? updatedPromis : todoObj,
          ),
        );
        handleLoading(todo.id, false);
      }, 100);
    } catch (error) {
      setErrorMesage('dfsdf');
    }
  };

  const handleRemove = async (todo: Todo) => {
    try {
      handleLoading(todo.id, true);
      setErrorMesage('');
      setTimeout(async () => {
        await client.delete(`/todos/${todo.id}`);
        setTodos(prev => prev.filter(todoPrev => todoPrev.id !== todo.id));
        handleLoading(todo.id, false);
      }, 100);
    } catch (error) {
      setErrorMesage('Unable to delete a todo');
    }
  };

  const handleSwitcher = (todo: Todo) => {
    setUpdateSwitcher(todo.id);
    setUpdateValue(todo.title);
  };

  const handleUpdatingOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdateValue(event.target.value.trim());
  };

  const handleUpdateForm = async (
    event: React.FormEvent<HTMLFormElement>,
    todo: Todo,
  ) => {
    event.preventDefault();
    try {
      const respond: Todo = await client.patch(`/todos/${todo.id}`, {
        ...todo,
        title: updateValue,
      });

      handleLoading(todo.id, true);
      setUpdateSwitcher(0);
      setTimeout(() => {
        handleLoading(todo.id, false);
        setTodos(prev =>
          prev.map(todoPromise =>
            todoPromise.id === respond.id ? respond : todoPromise,
          ),
        );
      }, 100);
    } catch (error) {
      setErrorMesage('');
    }
  };

  const handleFiltering = (param: string) => {
    switch (param) {
      case 'active':
        setSelect({
          0: false,
          1: false,
          2: false,
        });
        setSelect(prev => ({ ...prev, 1: true }));
        setTodos([...todosCopy].filter(todo => !todo.completed));
        break;
      case 'completed':
        setSelect({
          0: false,
          1: false,
          2: false,
        });
        setSelect(prev => ({ ...prev, 2: true }));
        setTodos([...todosCopy].filter(todo => todo.completed));
        break;
      default:
        setTodos([...todosCopy]);
        setSelect({
          0: false,
          1: false,
          2: false,
        });
        setSelect(prev => ({ ...prev, 0: true }));
        break;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
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
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={`todo ${todo.completed && 'completed'}`}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    onChange={() => handleComplete(todo)}
                    checked={todo.completed}
                  />
                </label>
                {uptdateSwitcher !== todo.id && (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => handleSwitcher(todo)}
                  >
                    {todo.title}
                  </span>
                )}

                {uptdateSwitcher !== todo.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleRemove(todo)}
                  >
                    ×
                  </button>
                )}

                {uptdateSwitcher == todo.id && (
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
                )}

                {/* overlay will cover the todo while it is being deleted or updated */}

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loader[todo.id] && 'is-active'}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todosCopy.length > 0 && (
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
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMesage && 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMesage('')}
        />
        {/* show only one message at a time */}
        {errorMesage}
      </div>
    </div>
  );
};
