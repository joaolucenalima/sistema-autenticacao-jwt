import { useContext } from "react"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"
import { AuthContext } from "@/contexts/AuthContext"

export default function Home() {

  const { user } = useContext(AuthContext)

  return (
    <div>
      <h1 className="font-extrabold text-4xl text-center mt-10">Home</h1>
      <div className="w-96 h-96 rounded bg-zinc-700 shadow-xl mx-auto mt-10 p-4 text-lg">

        <div className="mt-14">
          <span>Email:</span>
          <input
            type="text"
            name="text"
            disabled
            placeholder={user?.email}
            className="block mt-2 w-full bg-zinc-600 text-white p-2 placeholder:text-gray-200 rounded focus:outline-none focus:outline-offset-2 focus:outline-zinc-400"
          />
        </div>

        <div className="mt-12">
          <span>Nome:</span>
          <input
            type="text"
            name="text"
            disabled
            placeholder={user?.name}
            className="block mt-2 w-full bg-zinc-600 text-white p-2 placeholder:text-gray-200 rounded focus:outline-none focus:outline-offset-2 focus:outline-zinc-400"
          />
        </div>

      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ['token-teste']: token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}