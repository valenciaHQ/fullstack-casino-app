import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CenteredContainer from '../components/CenteredContainer';
import InputContainer from '../components/ InputContainer';
import { getToast } from '../utils';
import Loading from '../components/Loading';
import { useRouter } from 'next/router';
import api from '../utils/api';
import { setAuth } from '../reducer/userSlice';
import { useAppDispatch } from '../store';

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const DEFAULT_START_COINS = process.env.START_COINS;

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(2).max(120),
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required").min(8).max(32)
});

export default function App() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [notification, setNotification] = useState<ToastType | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: yupResolver(validationSchema)
  });

  useEffect(() => {
    if (notification) {
      getToast(notification.type, notification.message)
    }
  }, [notification])

  const onSubmit = handleSubmit(async (data: FormValues) => {
    setLoading(true)
    try {
      const user = { ...data, coins: Number(DEFAULT_START_COINS) || 20 }
      const response = await api.post('/api/user/register', user)
      if (response.status === 209) {
        setNotification({ type: 'success', message: "Account successfully created" })
        dispatch(setAuth({ user }))
        setTimeout(() => {
          router.push('/login')
        }, 500)
      }
    } catch (error) {
      setNotification({ type: 'error', message: "Account already exists" })
    } finally {
      setLoading(false)
    }
  })

  return (
    <CenteredContainer>
      <form onSubmit={onSubmit} className="flex flex-col w-1/4 p-8  border-2 border-solid border-black rounded-md bg-white" >
        <InputContainer>
          <label htmlFor="name">Name</label>
          <input {...register("name")} placeholder="Your name?" type="text" />
          {errors?.name && <p>{errors.name.message}</p>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="email" className="">Email</label>
          <input {...register("email")} placeholder="Your email?" type='email' />
          {errors?.email && <p>{errors.email.message}</p>}
        </InputContainer>
        <InputContainer>
          <label htmlFor="password" className="">Password</label>
          <input {...register("password")} placeholder="Choose password" type='password' />
          {errors?.password && <p>{errors.password.message}</p>}
        </InputContainer>
        <InputContainer>
          {loading ? <div className='mt-4'><Loading /></div> : <button type="submit"> Register </button>}
        </InputContainer>
      </form>
      <p className='m-4'>Already registered?<a className='text-gray-600 hover:underline' href='#' onClick={() => router.push('/login')}> Go to login</a></p>
    </CenteredContainer>
  );
}
