import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Template } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const templates = await db.collection<Template>("templates").find({ userId }).toArray()

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Error fetching templates:", error)
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

    const template: Template = {
      id: `template-${Date.now()}`,
      name: body.name,
      content: body.content,
      folderId: body.folderId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection<Template>("templates").insertOne(template)

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error("Error creating template:", error)
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

    const result = await db.collection<Template>("templates").findOneAndUpdate(
      { id: body.id, userId },
      {
        $set: {
          name: body.name,
          content: body.content,
          folderId: body.folderId,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating template:", error)
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
      return NextResponse.json({ error: "Template ID required" }, { status: 400 })
    }

    const db = await getDatabase()
    await db.collection<Template>("templates").deleteOne({ id, userId })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
