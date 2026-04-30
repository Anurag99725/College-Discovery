import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { data: college, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', `${id}`)
        .maybeSingle()


    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('college_id', id)

    const {data: placement} = await supabase
        .from('placements')
        .select('*')
        .eq('college_id', id)
        .maybeSingle()


    return NextResponse.json({ college, courses, placement })
}