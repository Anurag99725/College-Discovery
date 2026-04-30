import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const exam = searchParams.get('exam') || 'JEE Main'
    const rank = parseInt(searchParams.get('rank') || '0')

    const { data: cutoffs, error } = await supabase
    .from('rank_cutoffs')
    .select('*, colleges(*)')
    .eq('exam', exam)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const predictions = (cutoffs || []).map((cutoff: any) => {
    let chance: 'High' | 'Medium' | 'Low'

    if (rank <= cutoff.min_rank) {
        chance = 'High'       // rank better than min = very safe
    } else if (rank <= cutoff.max_rank) {
        chance = 'Medium'     // rank between min and max = possible
    } else {
        chance = 'Low'        // rank worse than max = tough
    }

    return {
        college_id: cutoff.college_id,
        college_name: cutoff.colleges?.name || 'Unknown',
        exam: cutoff.exam,
        min_rank: cutoff.min_rank,
        max_rank: cutoff.max_rank,
        chance,
    }
    }).filter((p: any) => p.chance !== 'Low') // optional: hide Low chance colleges

    predictions.sort((a: any, b: any) => {
    const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 }
    return order[a.chance] - order[b.chance]
    })

    return NextResponse.json({ predictions })
}