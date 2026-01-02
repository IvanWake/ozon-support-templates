"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Folder as FolderType } from "@/lib/types"

interface FolderTreeProps {
  folders: FolderType[]
  selectedFolderId: string | null
  expandedFolders: Set<string>
  onSelectFolder: (id: string | null) => void
  onToggleFolder: (id: string) => void
  onCreateFolder: (parentId: string | null) => void
  onRenameFolder: (id: string) => void
  onDeleteFolder: (id: string) => void
  onCloseSidebar?: () => void
}

export function FolderTree({
  folders,
  selectedFolderId,
  expandedFolders,
  onSelectFolder,
  onToggleFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  onCloseSidebar,
}: FolderTreeProps) {
  const rootFolders = folders.filter((f) => f.parentId === null)

  const handleSelectFolder = (id: string | null) => {
    onSelectFolder(id)
    onCloseSidebar?.()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h2 className="font-semibold text-sm text-foreground">Папки</h2>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onCreateFolder(null)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <button
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors text-left",
            selectedFolderId === null ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground",
          )}
          onClick={() => handleSelectFolder(null)}
        >
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span>Все шаблоны</span>
        </button>
        {rootFolders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            folders={folders}
            selectedFolderId={selectedFolderId}
            expandedFolders={expandedFolders}
            onSelectFolder={handleSelectFolder}
            onToggleFolder={onToggleFolder}
            onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            level={0}
          />
        ))}
      </div>
    </div>
  )
}

interface FolderItemProps {
  folder: FolderType
  folders: FolderType[]
  selectedFolderId: string | null
  expandedFolders: Set<string>
  onSelectFolder: (id: string) => void
  onToggleFolder: (id: string) => void
  onCreateFolder: (parentId: string) => void
  onRenameFolder: (id: string) => void
  onDeleteFolder: (id: string) => void
  level: number
}

function FolderItem({
  folder,
  folders,
  selectedFolderId,
  expandedFolders,
  onSelectFolder,
  onToggleFolder,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  level,
}: FolderItemProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const children = folders.filter((f) => f.parentId === folder.id)
  const isExpanded = expandedFolders.has(folder.id)
  const isSelected = selectedFolderId === folder.id
  const hasChildren = children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded-md text-sm transition-colors group",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground",
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        <button
          className="p-0.5 hover:bg-muted-foreground/10 rounded"
          onClick={(e) => {
            e.stopPropagation()
            onToggleFolder(folder.id)
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )
          ) : (
            <span className="w-3.5" />
          )}
        </button>
        <button className="flex-1 flex items-center gap-2 text-left min-w-0" onClick={() => onSelectFolder(folder.id)}>
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-primary shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-primary shrink-0" />
          )}
          <span className="truncate">{folder.name}</span>
        </button>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 shrink-0 transition-opacity",
                menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuItem
              onClick={() => {
                onCreateFolder(folder.id)
                setMenuOpen(false)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Создать подпапку
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onRenameFolder(folder.id)
                setMenuOpen(false)
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Переименовать
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                onDeleteFolder(folder.id)
                setMenuOpen(false)
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isExpanded &&
        children.map((child) => (
          <FolderItem
            key={child.id}
            folder={child}
            folders={folders}
            selectedFolderId={selectedFolderId}
            expandedFolders={expandedFolders}
            onSelectFolder={onSelectFolder}
            onToggleFolder={onToggleFolder}
            onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            level={level + 1}
          />
        ))}
    </div>
  )
}
