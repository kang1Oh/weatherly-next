import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

async function requireAdmin(request) {
    const token = request.headers.get("x-admin-token");
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return null;
}

// POST /api/activity_suggestions  (public submit)
export async function POST(request) {
    try {
        const body = await request.json();
        const {
            name,
            activity,
            reason,
            duration,
            energyLevel,
            timeOfDay,
            category,
            indoor,
            condition,
            status,
        } = body;

        if (!activity) {
            return NextResponse.json(
                { error: "Activity name is required." },
                { status: 400 }
            );
        }

        const result = await pool.query(
            `INSERT INTO suggestions 
        (name, activity, reason, duration, "energyLevel", "timeOfDay", category, indoor, condition, status) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
            [
                name || "Anonymous",
                activity,
                reason || null,
                duration || null,
                energyLevel || "Any",
                timeOfDay || "Any",
                category || "Relaxation",
                indoor === true || indoor === "true",
                condition || "any",
                status || "inactive",
            ]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (err) {
        console.error("❌ Error inserting suggestion:", err);
        return NextResponse.json(
            { error: "Failed to submit suggestion." },
            { status: 500 }
        );
    }
}

// GET /api/activity_suggestions  (admin list)
export async function GET(request) {
    const adminError = await requireAdmin(request);
    if (adminError) return adminError;

    const result = await pool.query(
        "SELECT * FROM suggestions ORDER BY created_at DESC"
    );
    return NextResponse.json(result.rows);
}
