import { api } from "../lib/axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import Router from 'next/router'
import { setCookie, parseCookies } from "nookies";

type ChildrenProps = {
  children: ReactNode,
}

type AuthContextData = {
  isAuthenticated: boolean,
  user: User | null,
  signIn: (data: SignInData) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
}

type SignUpData = {
  email: string,
  name: string,
  password: string,
}

type SignInData = {
  email: string,
  password: string,
}

type User = {
  email: string,
  name: string,
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: ChildrenProps) {

  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const { 'token-teste': token } = parseCookies()

    if (token) {
      api.get('/api/users', { params: { token, } }).then(response => {
        setUser(response.data.user)
      })
    }

  }, [])

  async function signUp({ email, name, password }: SignUpData) {

    const { token, user } = await api.post('/api/users', { email, name, password, })
      .then(response => {
        return response.data
      })

    if (token && user) {
      setCookie(undefined, 'token-teste', token, {
        maxAge: 60 * 60 * 12,    // 12 horas
        sameSite: "lax"
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      setUser(user)

      Router.push('/')
    }
  }


  async function signIn({ email, password }: SignInData) {
    const { token, user } = await api.post('/api/login', { email, password, })
      .then(response => {
        return response.data
      })

    if (token && user) {
      setCookie(undefined, 'token-teste', token, {
        maxAge: 60 * 60 * 12,    // 12 horas
        sameSite: "lax"
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      setUser(user)

      Router.push('/')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  )
}