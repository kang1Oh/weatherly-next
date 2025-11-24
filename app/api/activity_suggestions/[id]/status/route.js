import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

async function requireAdmin(request) {
    const token = request.headers.get("x-admin-token");
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return null;
}

export async function PUT(request, { params }) {
    const adminError = await requireAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;
    const { status } = await request.json();

    const result = await pool.query(
        "UPDATE suggestions SET status=$1 WHERE suggestion_id=$2 RETURNING *",
        [status, id]
    );

    return NextResponse.json(result.rows[0]);
}
