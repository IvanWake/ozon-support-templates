"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Menu, LogOut, Loader2, X, FileText, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderTree } from "./folder-tree"
import { TemplateList } from "./template-list"
import { TemplateEditor } from "./template-editor"
import { FolderDialog } from "./folder-dialog"
import { SearchBar } from "./search-bar"
import { ThemeToggle } from "./theme-toggle"
import { AuthForm } from "./auth-form"
import { LandingPage } from "./landing-page"
import { MessageBuilder } from "./message-builder"
import * as api from "@/lib/api"
import type { Folder, Template } from "@/lib/types"

interface User {
  id: string
  login: string
  name: string
}

type TabType = "templates" | "builder"

export function TemplatesApp() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("templates")

  const [folders, setFolders] = useState<Folder[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const [folderDialogOpen, setFolderDialogOpen] = useState(false)
  const [folderDialogMode, setFolderDialogMode] = useState<"create" | "rename">("create")
  const [folderParentId, setFolderParentId] = useState<string | null>(null)
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const loadData = useCallback(async () => {
    if (!user) return

    try {
      const [foldersData, templatesData] = await Promise.all([api.fetchFolders(user.id), api.fetchTemplates(user.id)])
      setFolders(foldersData)
      setTemplates(templatesData)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    setFolders([])
    setTemplates([])
  }

  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates
    const query = searchQuery.toLowerCase()
    return templates.filter((t) => t.name.toLowerCase().includes(query) || t.content.toLowerCase().includes(query))
  }, [templates, searchQuery])

  const handleToggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleCreateFolder = (parentId: string | null) => {
    setFolderParentId(parentId)
    setFolderDialogMode("create")
    setFolderDialogOpen(true)
  }

  const handleRenameFolder = (id: string) => {
    setRenamingFolderId(id)
    setFolderDialogMode("rename")
    setFolderDialogOpen(true)
  }

  const handleDeleteFolder = async (id: string) => {
    if (!user) return

    const getChildFolderIds = (parentId: string): string[] => {
      const children = folders.filter((f) => f.parentId === parentId)
      return children.flatMap((c) => [c.id, ...getChildFolderIds(c.id)])
    }
    const idsToDelete = [id, ...getChildFolderIds(id)]

    try {
      await api.deleteFolder(user.id, id)
      setFolders((prev) => prev.filter((f) => !idsToDelete.includes(f.id)))
      setTemplates((prev) => prev.filter((t) => !idsToDelete.includes(t.folderId)))
      if (selectedFolderId && idsToDelete.includes(selectedFolderId)) {
        setSelectedFolderId(null)
      }
    } catch (error) {
      console.error("Error deleting folder:", error)
    }
  }

  const handleSaveFolder = async (name: string) => {
    if (!user) return

    try {
      if (folderDialogMode === "create") {
        const newFolder = await api.createFolder(user.id, {
          name,
          parentId: folderParentId,
        })
        setFolders((prev) => [...prev, newFolder])
        if (folderParentId) {
          setExpandedFolders((prev) => new Set([...prev, folderParentId]))
        }
      } else if (renamingFolderId) {
        const updated = await api.updateFolder(user.id, {
          id: renamingFolderId,
          name,
        })
        setFolders((prev) => prev.map((f) => (f.id === renamingFolderId ? { ...f, name: updated.name } : f)))
      }
    } catch (error) {
      console.error("Error saving folder:", error)
    }

    setFolderDialogOpen(false)
    setRenamingFolderId(null)
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setEditorOpen(true)
  }

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template)
    setEditorOpen(true)
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!user) return

    try {
      await api.deleteTemplate(user.id, id)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    } catch (error) {
      console.error("Error deleting template:", error)
    }
  }

  const handleSaveTemplate = async (data: Omit<Template, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (!user) return

    try {
      if (editingTemplate) {
        const updated = await api.updateTemplate(user.id, {
          id: editingTemplate.id,
          ...data,
        })
        setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...updated } : t)))
      } else {
        const newTemplate = await api.createTemplate(user.id, data)
        setTemplates((prev) => [...prev, newTemplate])
      }
    } catch (error) {
      console.error("Error saving template:", error)
    }

    setEditorOpen(false)
    setEditingTemplate(null)
  }

  const renamingFolder = renamingFolderId ? folders.find((f) => f.id === renamingFolderId) : null

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    if (showAuth) {
      return <AuthForm onSuccess={setUser} onBack={() => setShowAuth(false)} />
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-3 sm:px-4 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {activeTab === "templates" && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-semibold text-base sm:text-lg text-foreground truncate">Шаблоны поддержки</h1>
          <div className="hidden sm:flex items-center gap-1 ml-4 bg-muted rounded-lg p-1">
            <Button
              size="sm"
              variant={activeTab === "templates" ? "default" : "ghost"}
              onClick={() => setActiveTab("templates")}
              className={activeTab === "templates" ? "bg-[#005bff] hover:bg-[#004ed6]" : ""}
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Шаблоны
            </Button>
            <Button
              size="sm"
              variant={activeTab === "builder" ? "default" : "ghost"}
              onClick={() => setActiveTab("builder")}
              className={activeTab === "builder" ? "bg-[#005bff] hover:bg-[#004ed6]" : ""}
            >
              <Layers className="h-4 w-4 mr-1.5" />
              Конструктор
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "templates" && (
            <div className="w-48 sm:w-64 hidden sm:block">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          )}
          <ThemeToggle />
          <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 pl-1 sm:pl-2 border-l border-border">
            <span className="text-sm text-muted-foreground hidden md:inline truncate max-w-24">{user.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Выйти">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="sm:hidden px-3 py-2 border-b border-border flex gap-2">
        <Button
          size="sm"
          variant={activeTab === "templates" ? "default" : "outline"}
          onClick={() => setActiveTab("templates")}
          className={`flex-1 ${activeTab === "templates" ? "bg-[#005bff] hover:bg-[#004ed6]" : ""}`}
        >
          <FileText className="h-4 w-4 mr-1.5" />
          Шаблоны
        </Button>
        <Button
          size="sm"
          variant={activeTab === "builder" ? "default" : "outline"}
          onClick={() => setActiveTab("builder")}
          className={`flex-1 ${activeTab === "builder" ? "bg-[#005bff] hover:bg-[#004ed6]" : ""}`}
        >
          <Layers className="h-4 w-4 mr-1.5" />
          Конструктор
        </Button>
      </div>

      {activeTab === "templates" && (
        <div className="sm:hidden px-3 py-2 border-b border-border">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === "templates" ? (
          <>
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <aside
              className={`
                fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
                w-72 sm:w-64 border-r border-border bg-sidebar shrink-0 
                transform transition-transform duration-200 ease-in-out
                lg:transform-none lg:transition-none
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              `}
            >
              <div className="lg:hidden flex items-center justify-between p-3 border-b border-border">
                <span className="font-semibold text-sm text-foreground">Меню</span>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <FolderTree
                folders={folders}
                selectedFolderId={selectedFolderId}
                expandedFolders={expandedFolders}
                onSelectFolder={setSelectedFolderId}
                onToggleFolder={handleToggleFolder}
                onCreateFolder={handleCreateFolder}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                onCloseSidebar={() => setSidebarOpen(false)}
              />
            </aside>

            <main className="flex-1 overflow-hidden">
              <TemplateList
                templates={searchQuery ? filteredTemplates : templates}
                folders={folders}
                selectedFolderId={searchQuery ? null : selectedFolderId}
                onCreateTemplate={handleCreateTemplate}
                onEditTemplate={handleEditTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
            </main>
          </>
        ) : (
          <main className="flex-1 overflow-hidden">
            <MessageBuilder templates={templates} folders={folders} />
          </main>
        )}
      </div>

      {editorOpen && (
        <TemplateEditor
          template={editingTemplate}
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSave={handleSaveTemplate}
          onClose={() => {
            setEditorOpen(false)
            setEditingTemplate(null)
          }}
        />
      )}

      {folderDialogOpen && (
        <FolderDialog
          mode={folderDialogMode}
          initialName={renamingFolder?.name || ""}
          onSave={handleSaveFolder}
          onClose={() => {
            setFolderDialogOpen(false)
            setRenamingFolderId(null)
          }}
        />
      )}

      <footer className="h-10 border-t border-border flex items-center justify-center px-4 shrink-0 bg-muted/30">
        <p className="text-xs text-muted-foreground">
          Сделано для Ozon от{" "}
          <a
            href="https://t.me/ivanwakedev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Ивана Тимофеева
          </a>
        </p>
      </footer>
    </div>
  )
}
