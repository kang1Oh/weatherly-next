import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import fs from "fs";
import path from "path";

async function requireAdmin(request) {
    const token = request.headers.get("x-admin-token");
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return null;
}

// GET /api/outfit_images  → list images
export async function GET() {
    const result = await pool.query(
        "SELECT * FROM images ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
}

// POST /api/outfit_images  → upload image
export async function POST(request) {
    const adminError = await requireAdmin(request);
    if (adminError) return adminError;

    try {
        const form = await request.formData();

        const category = form.get("category");
        const item_name = form.get("item_name");
        const type = form.get("type");
        const file = form.get("file");

        if (!file || !file.name) {
            return NextResponse.json(
                { error: "No image file uploaded" },
                { status: 400 }
            );
        }

        const ext = path.extname(file.name).toLowerCase();
        if (![".png", ".jpg", ".jpeg"].includes(ext)) {
            return NextResponse.json(
                { error: "Only PNG, JPG, and JPEG allowed" },
                { status: 400 }
            );
        }

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public/outfits");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save file into /public/outfits
        const filePath = path.join(uploadDir, file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const url = `/outfits/${file.name}`;

        const result = await pool.query(
            `INSERT INTO images (filename, url, category, item_name, type)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
            [file.name, url, category, item_name, type]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        console.error("❌ Upload error:", err);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}
