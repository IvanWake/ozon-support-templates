"use client"

import { useState } from "react"
import { Copy, Check, Trash2, Plus, GripVertical, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Template, Folder } from "@/lib/types"

interface MessageBuilderProps {
  templates: Template[]
  folders: Folder[]
}

export function MessageBuilder({ templates, folders }: MessageBuilderProps) {
  const [selectedParts, setSelectedParts] = useState<{ id: string; content: string }[]>([])
  const [customText, setCustomText] = useState("")
  const [copied, setCopied] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)

  const getFolderName = (folderId: string) => {
    return folders.find((f) => f.id === folderId)?.name || "Без папки"
  }

  const filteredTemplates = selectedFolderId ? templates.filter((t) => t.folderId === selectedFolderId) : templates

  const rootFolders = folders.filter((f) => !f.parentId)

  const addPart = (template: Template) => {
    setSelectedParts((prev) => [...prev, { id: `${template.id}-${Date.now()}`, content: template.content }])
  }

  const addCustomPart = () => {
    if (!customText.trim()) return
    setSelectedParts((prev) => [...prev, { id: `custom-${Date.now()}`, content: customText }])
    setCustomText("")
  }

  const removePart = (id: string) => {
    setSelectedParts((prev) => prev.filter((p) => p.id !== id))
  }

  const clearAll = () => {
    setSelectedParts([])
  }

  const getFullMessage = () => {
    return selectedParts.map((p) => p.content).join("\n\n")
  }

  const copyFullMessage = async () => {
    const message = getFullMessage()
    if (!message) return

    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const movePart = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= selectedParts.length) return

    setSelectedParts((prev) => {
      const newParts = [...prev]
      ;[newParts[index], newParts[newIndex]] = [newParts[newIndex], newParts[index]]
      return newParts
    })
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Templates panel */}
      <div className="flex-1 flex flex-col min-h-0 border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground mb-3">Выберите шаблоны</h2>
          {/* Folder filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedFolderId === null ? "default" : "outline"}
              onClick={() => setSelectedFolderId(null)}
              className={selectedFolderId === null ? "bg-[#005bff] hover:bg-[#004ed6]" : ""}
            >
              Все
            </Button>
            {rootFolders.map((folder) => (
              <Button
                key={folder.id}
                size="sm"
                variant={selectedFolderId === folder.id ? "default" : "outline"}
                onClick={() => setSelectedFolderId(folder.id)}
                className={selectedFolderId === folder.id ? "bg-[#005bff] hover:bg-[#004ed6]" : ""}
              >
                {folder.name}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>Нет шаблонов в этой папке</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="p-3 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => addPart(template)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground truncate">{template.name}</span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {getFolderName(template.folderId)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Custom text input */}
        <div className="p-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-2">Добавить свой текст</p>
          <div className="flex gap-2">
            <Textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Введите произвольный текст..."
              className="min-h-[60px] resize-none text-sm"
            />
            <Button
              onClick={addCustomPart}
              disabled={!customText.trim()}
              className="shrink-0 bg-[#005bff] hover:bg-[#004ed6]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Message builder panel */}
      <div className="flex-1 flex flex-col min-h-0 border border-border rounded-xl bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Собранное сообщение</h2>
          <div className="flex items-center gap-2">
            {selectedParts.length > 0 && (
              <Button size="sm" variant="ghost" onClick={clearAll} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-1" />
                Очистить
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {selectedParts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-1">Сообщение пусто</p>
                <p className="text-sm">Кликните на шаблоны слева, чтобы добавить их</p>
              </div>
            ) : (
              selectedParts.map((part, index) => (
                <div key={part.id} className="p-3 border border-border rounded-lg bg-background group">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => movePart(index, "up")}
                        disabled={index === 0}
                      >
                        <GripVertical className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="flex-1 text-sm text-foreground whitespace-pre-wrap">{part.content}</p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                      onClick={() => removePart(part.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Copy button */}
        <div className="p-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-3 mb-3 max-h-32 overflow-auto">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {getFullMessage() || "Предпросмотр сообщения появится здесь..."}
            </p>
          </div>
          <Button
            className="w-full bg-[#005bff] hover:bg-[#004ed6]"
            size="lg"
            onClick={copyFullMessage}
            disabled={selectedParts.length === 0}
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Скопировано!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 mr-2" />
                Скопировать сообщение
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
