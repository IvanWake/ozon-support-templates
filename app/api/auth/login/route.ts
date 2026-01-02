import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/types"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    if (!login || !password) {
      return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 })
    }

    const db = await getDatabase()
    const user = await db.collection<User>("users").findOne({ login })

    if (!user) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 })
    }

    // Return user data without password
    return NextResponse.json({
      id: user.id,
      login: user.login,
      name: user.name,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
