import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const ids = searchParams.get('ids') || ''

    const idArray = ids.split(',').filter(Boolean)

    const { data, error } = await supabase
        .from('colleges')
        .select("*")
        .in('id', idArray)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ colleges: data })
}