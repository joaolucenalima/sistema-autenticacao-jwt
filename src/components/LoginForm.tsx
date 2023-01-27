import { SubmitHandler, useForm } from 'react-hook-form'
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { Eye, EyeSlash } from 'phosphor-react';

type Inputs = {
  email: string,
  password: string
}

type LoginFormProps = {
  setActiveForm: Dispatch<SetStateAction<string>>
}

export default function LoginForm({ setActiveForm }: LoginFormProps) {

  const [inputType, setInputType] = useState('password')
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const { signIn } = useContext(AuthContext)

  const handleSignIn: SubmitHandler<Inputs> = async data => {
    try {
      await signIn(data)
    } catch (err) {
      console.log(err)
      alert("Não foi possível verificar usuário. Tente novamente mais tarde.")
    }
  }
  return (
    <form
      className="flex flex-col align-center justify-center gap-4 mx-auto mt-10 max-w-lg p-8"
      onSubmit={handleSubmit(handleSignIn)}
      autoComplete='off'
    >
      <h1 className='text-3xl text-center font-bold'>Faça login</h1>

      <div className='flex flex-col gap-8 mt-8'>

        <div>
          <input
            {...register('email', {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Digite um endereço de email válido',
              },
            })}
            type="text"
            name='email'
            placeholder='Email'
            className={`block w-full bg-zinc-600 text-white p-2 placeholder:text-gray-400 rounded focus:outline-none focus:outline-offset-2 focus:outline-zinc-400
                ${errors?.email && 'border-2 border-red-800 focus:outline-0'}`}
          />

          {errors?.email?.type === "required" && (
            <span className='text-red-500 text-sm'>O campo email é obrigatório</span>
          )}

          {
            errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>
          }
        </div>

        <div className='relative'>
          <input
            {...register('password', { required: true, minLength: 7 })}
            type={inputType}
            name='password'
            placeholder='Senha'
            className={`block w-full bg-zinc-600 text-white p-2 placeholder:text-gray-400 rounded focus:outline-none focus:outline-offset-2 focus:outline-zinc-400
          ${errors?.password && 'border-2 border-red-800 focus:outline-0'}`}
          />

          {inputType === 'password' ? (
            <EyeSlash className='absolute top-3 right-3 cursor-pointer'
              onClick={() => { setInputType('text') }}
            />
          ) : (
            <Eye className='absolute top-3 right-3 cursor-pointer'
              onClick={() => { setInputType('password') }}
            />
          )}

          {errors?.password?.type === "minLength" && (
            <span className='text-red-500 text-sm'>A senha deve ter pelo menos 7 caracteres</span>
          )}

          {errors?.password?.type === "required" && (
            <span className='text-red-500 text-sm'>O campo senha é obrigatório</span>
          )}
        </div>

      </div>

      <p className='mt-2'>Ainda não tem uma conta?
        <span
          className='text-blue-500 underline cursor-pointer hover:text-blue-600'
          onClick={() => { setActiveForm('register') }}
        > Registre-se
        </span> 🚀
      </p>

      <button
        type="submit"
        className='mt-2 p-4 rounded-md text-2xl font-bold bg-cyan-800 hover:bg-cyan-900 transition-colors'
      >Criar Usuário</button>
    </form>
  )
}