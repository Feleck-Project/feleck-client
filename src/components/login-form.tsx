import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/ui';

const schema = z.object({
  email: z
    .string({
      required_error: '이메일을 입력해주세요',
    })
    .email('잘못된 이메일 형식입니다'),
  phoneNumber: z.string().min(11, '휴대폰 번호를 확인해 주세요'),
  password: z
    .string({
      required_error: '비밀번호를 입력해주세요',
    })
    .refine((value) => value.length >= 8, '비밀번호는 8자리 이상이어야 합니다')
    .refine(
      (value) => /[A-Za-z]/.test(value),
      '비밀번호는 영문자를 포함해야 합니다'
    )
    .refine((value) => /\d/.test(value), '비밀번호는 숫자를 포함해야 합니다')
    .refine(
      (value) => /\W|_/.test(value),
      '비밀번호는 최소 1개의 특수문자를 포함해야 합니다'
    ),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  return (
    <View className="flex-1 justify-center p-4">
      <Text testID="form-title" className="pb-6 text-center text-2xl">
        👽
      </Text>

      <ControlledInput
        testID="email-input"
        control={control}
        name="email"
        label="이메일"
      />
      <ControlledInput
        testID="phone-number-input"
        control={control}
        name="phoneNumber"
        label="휴대폰 번호"
      />
      <ControlledInput
        testID="password-input"
        control={control}
        name="password"
        label="비밀번호"
        secureTextEntry={true}
      />
      <Button
        testID="login-button"
        label="로그인"
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};
