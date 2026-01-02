import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Folder, Template } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const folders = await db.collection<Folder>("folders").find({ userId }).toArray()

    return NextResponse.json(folders)
  } catch (error) {
    console.error("Error fetching folders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDatabase()

    const folder: Folder = {
      id: `folder-${Date.now()}`,
      name: body.name,
      parentId: body.parentId || null,
      userId,
      createdAt: new Date(),
    }

    await db.collection<Folder>("folders").insertOne(folder)

    return NextResponse.json(folder, { status: 201 })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const db = await getDatabase()

    const result = await db
      .collection<Folder>("folders")
      .findOneAndUpdate({ id: body.id, userId }, { $set: { name: body.name } }, { returnDocument: "after" })

    if (!result) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating folder:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Folder ID required" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get all child folder IDs recursively
    const getAllChildIds = async (parentId: string): Promise<string[]> => {
      const children = await db.collection<Folder>("folders").find({ parentId, userId }).toArray()
      const childIds = children.map((c) => c.id)
      const grandChildIds = await Promise.all(childIds.map(getAllChildIds))
      return [...childIds, ...grandChildIds.flat()]
    }

    const childIds = await getAllChildIds(id)
    const allIds = [id, ...childIds]

    // Delete all folders and their templates
    await db.collection<Folder>("folders").deleteMany({ id: { $in: allIds }, userId })
    await db.collection<Template>("templates").deleteMany({ folderId: { $in: allIds }, userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
