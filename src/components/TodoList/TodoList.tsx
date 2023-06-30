import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  selectedTodo: Todo | null;
  onChangeTodo: (todo: Todo) => void
}

export const TodoList: React.FC<Props> = (
  {
    todos,
    selectedTodo,
    onChangeTodo,
  },
) => (
  <table className="table is-narrow is-fullwidth">
    <thead>
      <tr>
        <th>#</th>
        <th>
          <span className="icon">
            <i className="fas fa-check" />
          </span>
        </th>
        <th>Title</th>
        <th> </th>
      </tr>
    </thead>

    <tbody>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selectedTodo={selectedTodo}
          handleSelectTodo={onChangeTodo}
        />
      ))}
    </tbody>
  </table>
);
