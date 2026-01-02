import type { Template, Folder } from "./types"

export async function fetchTemplates(userId: string): Promise<Template[]> {
  const response = await fetch("/api/templates", {
    headers: { "x-user-id": userId },
  })
  if (!response.ok) throw new Error("Failed to fetch templates")
  return response.json()
}

export async function createTemplate(
  userId: string,
  data: Omit<Template, "id" | "createdAt" | "updatedAt" | "userId">,
): Promise<Template> {
  const response = await fetch("/api/templates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create template")
  return response.json()
}

export async function updateTemplate(userId: string, data: Partial<Template> & { id: string }): Promise<Template> {
  const response = await fetch("/api/templates", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update template")
  return response.json()
}

export async function deleteTemplate(userId: string, id: string): Promise<void> {
  const response = await fetch(`/api/templates?id=${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  })
  if (!response.ok) throw new Error("Failed to delete template")
}

export async function fetchFolders(userId: string): Promise<Folder[]> {
  const response = await fetch("/api/folders", {
    headers: { "x-user-id": userId },
  })
  if (!response.ok) throw new Error("Failed to fetch folders")
  return response.json()
}

export async function createFolder(userId: string, data: { name: string; parentId: string | null }): Promise<Folder> {
  const response = await fetch("/api/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to create folder")
  return response.json()
}

export async function updateFolder(userId: string, data: { id: string; name: string }): Promise<Folder> {
  const response = await fetch("/api/folders", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error("Failed to update folder")
  return response.json()
}

export async function deleteFolder(userId: string, id: string): Promise<void> {
  const response = await fetch(`/api/folders?id=${id}`, {
    method: "DELETE",
    headers: { "x-user-id": userId },
  })
  if (!response.ok) throw new Error("Failed to delete folder")
}
