import { Todo } from '../types/Todo';
import { client } from './fetchClient';

// Лоадер для керування станом завантаження
export const handleLoading = (
  id: number,
  state: boolean,
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
) => {
  setLoader(prev => ({ ...prev, [id]: state }));
};

// Додавання нового TODO
export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  value: string,
  setValue: React.Dispatch<React.SetStateAction<string>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>,
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
) => {
  event.preventDefault();

  if (!value.trim()) {
    setErrorMesage('Title should not be empty');

    return;
  }

  setErrorMesage('');

  const newTodo: Todo = {
    title: value,
    id: Math.floor(Math.random() * 100000000),
    completed: false,
  };

  try {
    const response = await client.post<Todo>('/todos', newTodo);

    handleLoading(response.id, true, setLoader);

    setTimeout(() => {
      handleLoading(response.id, false, setLoader);
      setTodos(prev => [...prev, response]);
      setValue('');
    }, 100);
  } catch {
    setErrorMesage('Unable to add todo');
  }
};

// Оновлення TODO (зміна статусу)
export const handleComplete = async (
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setTodosCopy: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>,
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
) => {
  const updatedTodo = { ...todo, completed: !todo.completed };

  try {
    handleLoading(todo.id, true, setLoader);
    const updatedResponse: Todo = await client.patch(
      `/todos/${todo.id}`,
      updatedTodo,
    );

    setTimeout(() => {
      setTodos(prev =>
        prev.map(item =>
          item.id === updatedResponse.id ? updatedResponse : item,
        ),
      );
      setTodosCopy(prev =>
        prev.map(item =>
          item.id === updatedResponse.id ? updatedResponse : item,
        ),
      );
      handleLoading(todo.id, false, setLoader);
    }, 100);
  } catch {
    setErrorMesage('Unable to update todo');
  }
};

// Видалення TODO
export const handleRemove = async (
  todo: Todo,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>,
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
) => {
  try {
    handleLoading(todo.id, true, setLoader);
    setErrorMesage('');

    setTimeout(async () => {
      await client.delete(`/todos/${todo.id}`);
      setTodos(prev => prev.filter(item => item.id !== todo.id));
      handleLoading(todo.id, false, setLoader);
    }, 100);
  } catch {
    setErrorMesage('Unable to delete todo');
  }
};

// Оновлення назви TODO
export const handleUpdateForm = async (
  event: React.FormEvent<HTMLFormElement>,
  todo: Todo,
  updateValue: string,
  setUpdateSwitcher: React.Dispatch<React.SetStateAction<number>>,
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setErrorMesage: React.Dispatch<React.SetStateAction<string>>,
  setLoader: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
) => {
  event.preventDefault();

  if (!updateValue.trim()) {
    setErrorMesage('Title should not be empty');

    return;
  }

  try {
    const updatedTodo: Todo = await client.patch(`/todos/${todo.id}`, {
      ...todo,
      title: updateValue,
    });

    handleLoading(todo.id, true, setLoader);
    setUpdateSwitcher(0);

    setTimeout(() => {
      handleLoading(todo.id, false, setLoader);
      setTodos(prev =>
        prev.map(item => (item.id === updatedTodo.id ? updatedTodo : item)),
      );
    }, 100);
  } catch {
    setErrorMesage('Unable to update todo');
  }
};
