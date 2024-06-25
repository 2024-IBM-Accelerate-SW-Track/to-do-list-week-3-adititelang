import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component doesn\'t render duplicate Task', () => {
  render(<App />, container);
  const inputTask = screen.getByTestId('new-item-input').querySelector('input');
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByTestId('new-item-button');
  const dueDate = "06/30/2024";

  // Add a task
  fireEvent.change(inputTask, { target: { value: "Unique Task" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Try to add the same task again
  fireEvent.change(inputTask, { target: { value: "Unique Task" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(/Unique Task/i);
  expect(tasks.length).toBe(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />, container);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByTestId('new-item-button');
  const dueDate = "06/30/2024";

  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const tasks = screen.queryByText(/06\/30\/2024/i);
  expect(tasks).toBeNull();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />, container);
  const inputTask = screen.getByTestId('new-item-input').querySelector('input');
  const addButton = screen.getByTestId('new-item-button');

  fireEvent.change(inputTask, { target: { value: "Task without date" } });
  fireEvent.click(addButton);

  const tasks = screen.queryByText(/Task without date/i);
  expect(tasks).toBeNull();
});

test('test that App component can delete task through checkbox', () => {
  render(<App />, container);
  const inputTask = screen.getByTestId('new-item-input').querySelector('input');
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByTestId('new-item-button');
  const dueDate = "06/30/2024";

  fireEvent.change(inputTask, { target: { value: "Task to delete" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const checkbox = screen.getByRole('checkbox', { name: /Task to delete/i });
  fireEvent.click(checkbox);

  const task = screen.queryByText(/Task to delete/i);
  expect(task).toBeNull();
});

test('test that App component renders different colors for past due events', () => {
  render(<App />, container);
  const inputTask = screen.getByTestId('new-item-input').querySelector('input');
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByTestId('new-item-button');
  const pastDueDate = "05/30/2023";  
  fireEvent.change(inputTask, { target: { value: "Past Due Task" } });
  fireEvent.change(inputDate, { target: { value: pastDueDate } });
  fireEvent.click(addButton);

  const pastDueTask = screen.getByText(/Past Due Task/i);
  expect(pastDueTask).toBeInTheDocument();
  expect(pastDueTask).toHaveStyle('background-color: red');  
});
