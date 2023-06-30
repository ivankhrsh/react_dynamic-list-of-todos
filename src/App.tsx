/* eslint-disable max-len */
import React, { useEffect, useMemo, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos, getUser } from './api';
import './App.css';
import { filterTodos } from './components/Helpers';
import { User } from './types/User';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<null | Todo>(null);
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | User>(null);
  const [filter, setFilter] = useState<string >('all');
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleTodos = useMemo(() => filterTodos(todos, filter, query), [todos, filter, query]);
  const isTodoSelected = selectedTodo;

  const loadTodos = async () => {
    setIsLoadingTodos(true);
    const todosFromServer = await getTodos();

    setTodos(todosFromServer);
    setIsLoadingTodos(false);
  };

  const loadUser = async () => {
    setIsLoadingUser(true);

    if (isTodoSelected) {
      const userFromServer = await getUser(selectedTodo.userId);

      setSelectedUser(userFromServer);
    }

    setIsLoadingUser(false);
  };

  useEffect(() => {
    if (todos.length === 0) {
      loadTodos();
    }

    loadUser();
  }, [selectedTodo]);

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsModalOpen(true);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filterType = event.target.value;

    setFilter(filterType);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const normalizedQuery = event.target.value;

    setQuery(normalizedQuery);
  };

  const clearQuery = () => (setQuery(''));

  const closeModal = () => {
    setSelectedUser(null);
    setSelectedTodo(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                onChangeFilter={handleFilterChange}
                query={query}
                onChangeQuery={handleQueryChange}
                onClearQuery={clearQuery}
              />
            </div>

            <div className="block">
              {isLoadingTodos
                ? <Loader />
                : (
                  <TodoList
                    todos={visibleTodos}
                    selectedTodo={selectedTodo}
                    onChangeTodo={handleSelectTodo}
                  />
                )}

            </div>
          </div>
        </div>
      </div>

      {(isModalOpen) && (
        <TodoModal
          isLoadingUser={isLoadingUser}
          selectedUser={selectedUser}
          selectedTodo={selectedTodo}
          closeModal={closeModal}
        />
      )}
    </>
  );
};
