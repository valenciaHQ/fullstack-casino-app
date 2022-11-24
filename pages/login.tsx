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
    email: string;
    password: string;
};

const validationSchema = yup.object().shape({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required").min(8).max(32)
});

export default function App() {
    const dispatch = useAppDispatch();
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [notification, setNotification] = useState<ToastType | null>(null)
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        // If notification has any value, will trigger toast
        if (notification) {
            getToast(notification.type, notification.message)
        }
    }, [notification])

    //Submit form values and set state
    const onSubmit = handleSubmit(async (data: FormValues) => {
        setLoading(true)
        try {
            const response = await api.post('/api/auth/login', data);
            localStorage.setItem("access_token", response.data.token);
            setNotification({ type: "success", message: "Logged in!" })
            dispatch(setAuth({ user: response.data.user }))
            setTimeout(() => {
                router.push('/home')
            }, 500)
        } catch (error) {
            setNotification({ type: 'error', message: (error as ResponseError).response.data.error || "An error occurred" })
        } finally {
            setLoading(false)
        }
    })

    return (
        <CenteredContainer>
            <form onSubmit={onSubmit} className="flex flex-col w-3/4 md:w-1/4 p-8 border-2 border-solid border-black rounded-md bg-gray-200" >
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
                    {loading ? <div className='mt-4'><Loading /></div> : <button type="submit"> Login </button>}
                </InputContainer>
            </form>
        </CenteredContainer>
    );
}
