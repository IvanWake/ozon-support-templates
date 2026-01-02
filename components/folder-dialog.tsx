"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FolderDialogProps {
  mode: "create" | "rename"
  initialName?: string
  onSave: (name: string) => void
  onClose: () => void
}

export function FolderDialog({ mode, initialName = "", onSave, onClose }: FolderDialogProps) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSave(name.trim())
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{mode === "create" ? "Новая папка" : "Переименовать папку"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Название папки</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              {mode === "create" ? "Создать" : "Сохранить"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
