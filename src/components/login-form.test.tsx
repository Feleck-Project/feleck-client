import React from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@/core/test-utils';

import type { LoginFormProps } from './login-form';
import { LoginForm } from './login-form';

afterEach(cleanup);

const onSubmitMock: jest.Mock<LoginFormProps['onSubmit']> = jest.fn();

// eslint-disable-next-line max-lines-per-function
describe('LoginForm Form ', () => {
  it('renders correctly', async () => {
    render(<LoginForm />);
    expect(await screen.findByText(/👽 로그인/i)).toBeOnTheScreen();
  });

  it('should display required error when values are empty', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    expect(screen.queryByText(/이메일을 입력해주세요/i)).not.toBeOnTheScreen();
    fireEvent.press(button);
    expect(await screen.findByText(/이메일을 입력해주세요/i)).toBeOnTheScreen();
    expect(screen.getByText(/비밀번호를 입력해주세요/i)).toBeOnTheScreen();
  });

  it('should display matching error when email is invalid', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(emailInput, 'yyyyy');
    fireEvent.changeText(passwordInput, 'test');
    fireEvent.press(button);

    expect(screen.queryByText(/이메일을 입력해주세요/i)).not.toBeOnTheScreen();
    expect(
      await screen.findByText(/잘못된 이메일 형식입니다/i)
    ).toBeOnTheScreen();
  });

  it('password should be at least 8 characters long', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(passwordInput, 'test');
    fireEvent.press(button);

    expect(
      await screen.findByText(/비밀번호는 8자리 이상이어야 합니다/i)
    ).toBeOnTheScreen();
  });

  it('password should contain at least one english letter', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(passwordInput, '12345678');
    fireEvent.press(button);

    expect(
      await screen.findByText(/비밀번호는 영문자를 포함해야 합니다/i)
    ).toBeOnTheScreen();
  });

  it('password should contain at least one special character', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(passwordInput, 'password1');
    fireEvent.press(button);

    expect(
      await screen.findByText(
        /비밀번호는 최소 1개의 특수문자를 포함해야 합니다/i
      )
    ).toBeOnTheScreen();
  });

  it('Should call LoginForm with correct values when values are valid', async () => {
    render(<LoginForm onSubmit={onSubmitMock} />);

    const button = screen.getByTestId('login-button');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(emailInput, 'youssef@gmail.com');
    fireEvent.changeText(passwordInput, 'password1!');
    fireEvent.press(button);
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
    // undefined because we don't use second argument of the  SubmitHandler
    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        email: 'youssef@gmail.com',
        password: 'password1!',
      },
      undefined
    );
  });
});
