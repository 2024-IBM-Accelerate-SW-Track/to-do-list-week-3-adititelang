import { render, screen } from '@testing-library/react';
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

test('test that App component renders', () => {
  render(<App />, container);
});

test('test that new-item-button is a button', () => {
  render(<App />, container);
  const element = screen.getByTestId('new-item-button');
  expect(element.tagName).toBe('BUTTON');  
});

test('test that new-item-input contains an input element', () => {
  render(<App />, container);
  const inputContainer = screen.getByTestId('new-item-input');
  const inputElement = inputContainer.querySelector('input');
  expect(inputElement).not.toBeNull();
  expect(inputElement.tagName).toBe('INPUT');
});
