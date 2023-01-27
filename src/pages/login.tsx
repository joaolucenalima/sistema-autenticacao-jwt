import CreateUserForm from "@/components/CreateUserForm";
import LoginForm from "@/components/LoginForm";
import { useState } from "react";

export default function login() {

  const [activeForm, setActiveForm] = useState('login')

  return (
    <>
      <h1 className="text-center text-4xl font-extrabold mt-6">Sistema de autenticação JWT</h1>
      <div>
        {activeForm === 'login' ? (
          <LoginForm setActiveForm={setActiveForm} />
        ) : (
          <CreateUserForm setActiveForm={setActiveForm} />
        )}
      </div>
    </>
  )
}