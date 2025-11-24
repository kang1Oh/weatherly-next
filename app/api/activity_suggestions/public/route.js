import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
    try {
        const result = await pool.query(
            'SELECT * FROM suggestions WHERE status = $1 ORDER BY created_at DESC',
            ["active"]
        );

        return NextResponse.json(result.rows);
    } catch (err) {
        console.error("❌ Error fetching public suggestions:", err);
        return NextResponse.json(
            { error: "Failed to fetch suggestions" },
            { status: 500 }
        );
    }
}
