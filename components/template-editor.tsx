"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Template, Folder } from "@/lib/types"

interface TemplateEditorProps {
  template: Template | null
  folders: Folder[]
  selectedFolderId: string | null
  onSave: (template: Omit<Template, "id" | "createdAt" | "updatedAt">) => void
  onClose: () => void
}

export function TemplateEditor({ template, folders, selectedFolderId, onSave, onClose }: TemplateEditorProps) {
  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [folderId, setFolderId] = useState("")

  useEffect(() => {
    if (template) {
      setName(template.name)
      setContent(template.content)
      setFolderId(template.folderId)
    } else {
      setName("")
      setContent("")
      setFolderId(selectedFolderId || folders[0]?.id || "")
    }
  }, [template, selectedFolderId, folders])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim() || !folderId) return
    onSave({ name: name.trim(), content: content.trim(), folderId })
  }

  const getFolderPath = (folder: Folder): string => {
    const parent = folders.find((f) => f.id === folder.parentId)
    if (parent) {
      return `${getFolderPath(parent)} / ${folder.name}`
    }
    return folder.name
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">{template ? "Редактировать шаблон" : "Новый шаблон"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название шаблона" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="folder">Папка</Label>
            <Select value={folderId} onValueChange={setFolderId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите папку" />
              </SelectTrigger>
              <SelectContent>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {getFolderPath(folder)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Текст шаблона</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Введите текст шаблона..."
              rows={6}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!name.trim() || !content.trim() || !folderId}>
              {template ? "Сохранить" : "Создать"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
