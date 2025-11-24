import { NextResponse } from "next/server";

export async function POST(request) {
    const { username, password } = await request.json();

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {
        return NextResponse.json({
            success: true,
            token: process.env.ADMIN_TOKEN,
        });
    }

    return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
    );
}
