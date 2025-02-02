/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Select } from './types/select';
import { Error } from './components/Error/Error';
import { Footer } from './components/Footer/Footer';
import { Todos } from './components/Todos/Todos';
import { AddTodos } from './components/AddToDo/AddToDo';
import {
  handleSubmit,
  handleComplete,
  handleRemove,
  handleUpdateForm,
} from './utils/handlers';

export const App: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loader, setLoader] = useState<Record<number, boolean>>({});
  const [errorMesage, setErrorMesage] = useState<string>('');
  const [updateSwitcher, setUpdateSwitcher] = useState<number>(0);
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

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.trim());
  };

  const switchOnUpdatingForm = (todo: Todo) => {
    setUpdateSwitcher(todo.id);
    setUpdateValue(todo.title);
  };

  const handleUpdatingOnChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUpdateValue(event.target.value.trim());
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
          <AddTodos
            handleSubmit={event =>
              handleSubmit(
                event,
                value,
                setValue,
                setTodos,
                setErrorMesage,
                setLoader,
              )
            }
            handleOnChange={handleOnChange}
            value={value}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos.map(todo => {
            return (
              <Todos
                key={todo.id}
                todo={todo}
                handleComplete={() =>
                  handleComplete(
                    todo,
                    setTodos,
                    setTodosCopy,
                    setErrorMesage,
                    setLoader,
                  )
                }
                handleSwitcher={switchOnUpdatingForm}
                handleRemove={() =>
                  handleRemove(todo, setTodos, setErrorMesage, setLoader)
                }
                handleUpdateForm={event =>
                  handleUpdateForm(
                    event,
                    todo,
                    updateValue,
                    setUpdateSwitcher,
                    setTodos,
                    setErrorMesage,
                    setLoader,
                  )
                }
                updateValue={updateValue}
                setUpdateSwitcher={setUpdateSwitcher}
                handleUpdatingOnChange={handleUpdatingOnChange}
                updateSwitcher={updateSwitcher}
                loader={loader}
              />
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todosCopy.length > 0 && (
          <Footer
            todosCopy={todosCopy}
            select={select}
            handleFiltering={handleFiltering}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <Error setErrorMesage={setErrorMesage} errorMesage={errorMesage} />
    </div>
  );
};
