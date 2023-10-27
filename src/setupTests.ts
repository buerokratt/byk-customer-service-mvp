import '@testing-library/jest-dom';
import './i18n';
import { testEnv } from './mocks/handlers';
import server from './mocks/server';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window._env_ = testEnv;
window.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
