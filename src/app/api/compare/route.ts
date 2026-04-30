import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const {searchParams} = new URL(req.url)

    const ids = searchParams.get('ids') || ''

    const idArray = ids.split(',').filter(Boolean)

    if (idArray.length < 2) {
        return NextResponse.json({ error: 'Minimum 2 colleges required' }, { status: 400 })
    }

    const {data, error} = await supabase
    .from('colleges')
    .select("*")
    .in('id', idArray)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ colleges: data })
}