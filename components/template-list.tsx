"use client"

import { useState } from "react"
import { Copy, Check, FileText, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Template, Folder } from "@/lib/types"

interface TemplateListProps {
  templates: Template[]
  folders: Folder[]
  selectedFolderId: string | null
  onCreateTemplate: () => void
  onEditTemplate: (template: Template) => void
  onDeleteTemplate: (id: string) => void
}

export function TemplateList({
  templates,
  folders,
  selectedFolderId,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
}: TemplateListProps) {
  const getChildFolderIds = (parentId: string): string[] => {
    const children = folders.filter((f) => f.parentId === parentId)
    return children.flatMap((c) => [c.id, ...getChildFolderIds(c.id)])
  }

  const filteredTemplates =
    selectedFolderId === null
      ? templates
      : templates.filter((t) => {
          const folderIds = [selectedFolderId, ...getChildFolderIds(selectedFolderId)]
          return folderIds.includes(t.folderId)
        })

  const currentFolder = selectedFolderId ? folders.find((f) => f.id === selectedFolderId) : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border gap-2">
        <div className="min-w-0">
          <h2 className="font-semibold text-foreground truncate">
            {currentFolder ? currentFolder.name : "Все шаблоны"}
          </h2>
          <p className="text-sm text-muted-foreground">{filteredTemplates.length} шаблонов</p>
        </div>
        <Button onClick={onCreateTemplate} size="sm" className="shrink-0">
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Новый шаблон</span>
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">Нет шаблонов</p>
            <p className="text-sm text-muted-foreground/70">Создайте первый шаблон для этой папки</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                folder={folders.find((f) => f.id === template.folderId)}
                onEdit={() => onEditTemplate(template)}
                onDelete={() => onDeleteTemplate(template.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: Template
  folder?: Folder
  onEdit: () => void
  onDelete: () => void
}

function TemplateCard({ template, folder, onEdit, onDelete }: TemplateCardProps) {
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(template.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="p-3 sm:p-4 hover:shadow-md transition-shadow group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <h3 className="font-medium text-foreground truncate">{template.name}</h3>
            {folder && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{folder.name}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{template.content}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
          <Button variant={copied ? "default" : "outline"} size="sm" onClick={handleCopy} className="gap-1.5">
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Скопировано</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Копировать</span>
              </>
            )}
          </Button>
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 transition-opacity",
                  menuOpen ? "opacity-100" : "sm:opacity-0 sm:group-hover:opacity-100",
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  onEdit()
                  setMenuOpen(false)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Редактировать
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  onDelete()
                  setMenuOpen(false)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
