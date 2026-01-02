import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/types"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { login, password, name } = await request.json()

    if (!login || !password || !name) {
      return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection<User>("users").findOne({ login })

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким логином уже существует" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user: User = {
      id: `user-${Date.now()}`,
      login,
      password: hashedPassword,
      name,
      createdAt: new Date(),
    }

    await db.collection<User>("users").insertOne(user)

    // Return user data without password
    return NextResponse.json(
      {
        id: user.id,
        login: user.login,
        name: user.name,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
