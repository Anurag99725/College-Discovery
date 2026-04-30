import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)

    const search = searchParams.get('search') || ''

    const state = searchParams.get('state') || ''

    const minFees = searchParams.get('minFees') || '0'

    const maxFees = searchParams.get('maxFees') || '9999999'

    const page = parseInt(searchParams.get('page') || '1')

    const limit = 9

    const offset = (page - 1) * limit

    let query = supabase
    .from('colleges')
    .select('*', { count: 'exact' })
    .order('rating', { ascending: false })
    .range(offset, offset + limit - 1)

    // Only apply search if not empty
    if (search) query = query.ilike('name', `%${search}%`)

    // Only apply fees filter if values are valid numbers
    if (minFees && !isNaN(parseInt(minFees))) query = query.gte('fees_per_year', parseInt(minFees))
    if (maxFees && !isNaN(parseInt(maxFees))) query = query.lte('fees_per_year', parseInt(maxFees))

    // Only apply state filter if not empty
    if (state) query = query.eq('state', state)

    const { data, error, count } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data, count, page, limit })
}

