"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

interface AuthFormProps {
  onSuccess: (user: { id: string; login: string; name: string }) => void
  onBack?: () => void
}

export function AuthForm({ onSuccess, onBack }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
      const body = mode === "login" ? { login, password } : { login, password, name }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Произошла ошибка")
        return
      }

      localStorage.setItem("user", JSON.stringify(data))
      onSuccess(data)
    } catch (err) {
      setError("Ошибка подключения к серверу")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        {onBack ? (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Назад</span>
          </Button>
        ) : (
          <div />
        )}
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
            <Image src="/ozon-logo.png" alt="Ozon" width={160} height={60} className="h-12 w-auto" />
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h1 className="text-xl font-semibold text-center mb-6 text-foreground">
              {mode === "login" ? "Вход в систему" : "Регистрация"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="login">Логин</Label>
                <Input
                  id="login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите логин"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль"
                  required
                  minLength={6}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full bg-[#005bff] hover:bg-[#004ed6] text-white" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "login" ? "Войти" : "Зарегистрироваться"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login")
                  setError("")
                }}
                className="text-sm text-[#005bff] hover:underline"
              >
                {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Система шаблонов для сотрудников службы поддержки
          </p>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        Сделано для Ozon от{" "}
        <a
          href="https://t.me/ivanwakedev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#005bff] hover:underline"
        >
          Ивана Тимофеева
        </a>
      </footer>
    </div>
  )
}
