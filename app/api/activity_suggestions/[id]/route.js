import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

async function requireAdmin(request) {
    const token = request.headers.get("x-admin-token");
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return null;
}

export async function DELETE(request, { params }) {
    const adminError = await requireAdmin(request);
    if (adminError) return adminError;

    const { id } = await params;

    await pool.query("DELETE FROM suggestions WHERE suggestion_id=$1", [id]);

    return NextResponse.json({ deleted: true });
}
