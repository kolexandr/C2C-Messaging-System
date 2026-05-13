"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/"
    })
  }

  return (
    <div>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  )
}