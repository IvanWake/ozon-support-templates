"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileText, FolderOpen, Copy, Search, Zap, Shield, Layers } from "lucide-react"
import Image from "next/image"

interface LandingPageProps {
  onGetStarted: () => void
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: FolderOpen,
      title: "Организация папок",
      description: "Создавайте папки и подпапки для удобной структуры шаблонов",
    },
    {
      icon: FileText,
      title: "Готовые шаблоны",
      description: "Храните типовые ответы для быстрого использования в чате",
    },
    {
      icon: Copy,
      title: "Быстрое копирование",
      description: "Копируйте шаблон одним кликом прямо в буфер обмена",
    },
    {
      icon: Search,
      title: "Умный поиск",
      description: "Находите нужный шаблон за секунды по названию или содержимому",
    },
    {
      icon: Layers,
      title: "Конструктор сообщений",
      description: "Собирайте сообщение из нескольких шаблонов и своего текста",
    },
    {
      icon: Shield,
      title: "Личный аккаунт",
      description: "Ваши шаблоны доступны только вам и защищены паролем",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Image src="/ozon-logo.png" alt="Ozon" width={120} height={40} className="h-8 w-auto" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button onClick={onGetStarted} className="bg-[#005bff] hover:bg-[#004ed6] text-white">
              Войти
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#005bff]/10 text-[#005bff] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Для сотрудников службы поддержки
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Шаблоны ответов для <span className="text-[#005bff]">быстрой работы</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Организуйте свои шаблоны в папках, собирайте сообщения в конструкторе и копируйте одним кликом. Отвечайте
            клиентам быстрее и качественнее.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="bg-[#005bff] hover:bg-[#004ed6] text-white text-lg px-8 py-6"
            >
              Начать работу
            </Button>
            <Button size="lg" variant="outline" onClick={onGetStarted} className="text-lg px-8 py-6 bg-transparent">
              Уже есть аккаунт
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            Всё для эффективной работы
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Простой и удобный инструмент, который поможет вам работать быстрее
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#005bff]/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-[#005bff]" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#005bff]/10 text-[#005bff] px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                <Layers className="h-4 w-4" />
                Новая функция
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Конструктор сообщений</h2>
              <p className="text-muted-foreground mb-6">
                Собирайте идеальный ответ из нескольких шаблонов. Добавляйте свой текст между блоками, меняйте порядок и
                копируйте готовое сообщение одной кнопкой.
              </p>
              <ul className="space-y-3">
                {[
                  "Комбинируйте несколько шаблонов в одно сообщение",
                  "Добавляйте произвольный текст между блоками",
                  "Меняйте порядок частей сообщения",
                  "Копируйте готовый результат одним кликом",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <div className="h-5 w-5 rounded-full bg-[#005bff]/10 flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-[#005bff]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">Приветствие</p>
                  <p className="text-sm text-foreground mt-1">
                    Здравствуйте! Благодарим за обращение в службу поддержки.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">Ответ по заказу</p>
                  <p className="text-sm text-foreground mt-1">
                    Ваш заказ уже передан в доставку и будет у вас в ближайшее время.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <p className="text-sm text-muted-foreground">Прощание</p>
                  <p className="text-sm text-foreground mt-1">Если у вас возникнут вопросы, мы всегда рады помочь!</p>
                </div>
                <Button className="w-full bg-[#005bff] hover:bg-[#004ed6] mt-2">
                  <Copy className="h-4 w-4 mr-2" />
                  Скопировать сообщение
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Готовы ускорить свою работу?</h2>
          <p className="text-muted-foreground mb-8">
            Зарегистрируйтесь бесплатно и начните использовать шаблоны уже сегодня
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-[#005bff] hover:bg-[#004ed6] text-white text-lg px-8 py-6"
          >
            Создать аккаунт
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/ozon-logo.png" alt="Ozon" width={80} height={30} className="h-6 w-auto opacity-60" />
          <p className="text-sm text-muted-foreground">
            Сделано для Ozon от{" "}
            <a
              href="https://t.me/ivanwakedev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#005bff] hover:underline"
            >
              Ивана Тимофеева
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
