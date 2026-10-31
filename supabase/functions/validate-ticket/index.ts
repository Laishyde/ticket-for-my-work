// @ts-ignore - Deno module, ignored in local TypeScript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const responseFor = (req: Request, body: Record<string, any>, status = 200) => {
  const headers = { ...corsHeaders, 'Cache-Control': 'no-store' }

  if (req.method === 'GET') {
    let message = 'INGRESSO NAO ENCONTRADO'
    if (body.message === 'INGRESSO USADO') {
      message = 'INGRESSO USADO'
    } else if (body.valid === true) {
      message = 'INGRESSO VALIDADO - MARCADO COMO USADO'
    }

    return new Response(message, {
      headers: { ...headers, 'Content-Type': 'text/plain; charset=utf-8' },
      status,
    })
  }

  return new Response(JSON.stringify(body), {
    headers: { ...headers, 'Content-Type': 'application/json' },
    status,
  })
}

// @ts-ignore - Deno serve function
serve(async (req: any) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return responseFor(req, { error: 'Method not allowed' }, 405)
    }

    const url = new URL(req.url)
    let qr_code: string | null = url.searchParams.get('code')

    if (!qr_code && req.method === 'POST') {
      try {
        const body = await req.json()
        qr_code = body.qr_code
      } catch {
        qr_code = null
      }
    }

    if (!qr_code) {
      return responseFor(req, { error: 'QR code is required' }, 400)
    }

    // @ts-ignore - Deno env
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    // @ts-ignore - Deno env
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Supabase server configuration is missing')
    }

    const headers = {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    }
    const ticketQuery = new URL(`${supabaseUrl}/rest/v1/tickets`)
    ticketQuery.searchParams.set('qr_code', `eq.${qr_code}`)
    ticketQuery.searchParams.set('select', 'id,sector,section,gate,price,total,event_date,event_name,is_used,used_at')

    const lookupResponse = await fetch(ticketQuery, { headers })
    if (!lookupResponse.ok) {
      throw new Error('Failed to look up ticket')
    }

    const tickets = await lookupResponse.json()
    if (!tickets || tickets.length === 0) {
      return responseFor(req, { valid: false, message: 'INGRESSO NAO ENCONTRADO' }, 404)
    }

    const ticket = tickets[0]
    const ticketDetails = {
      sector: ticket.sector,
      section: ticket.section,
      gate: ticket.gate,
      price: ticket.price,
      total: ticket.total,
      event_date: ticket.event_date,
      event_name: ticket.event_name,
    }

    if (ticket.is_used) {
      return responseFor(req, {
        valid: false,
        message: 'INGRESSO USADO',
        used_at: ticket.used_at,
        ticket: ticketDetails,
      })
    }

    const updateQuery = new URL(`${supabaseUrl}/rest/v1/tickets`)
    updateQuery.searchParams.set('id', `eq.${ticket.id}`)
    updateQuery.searchParams.set('is_used', 'eq.false')

    const updateResponse = await fetch(updateQuery, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=representation' },
      body: JSON.stringify({ is_used: true, used_at: new Date().toISOString() }),
    })

    if (!updateResponse.ok) {
      throw new Error('Failed to mark ticket as used')
    }

    const updatedTickets = await updateResponse.json()
    if (!updatedTickets || updatedTickets.length === 0) {
      return responseFor(req, { valid: false, message: 'INGRESSO USADO', ticket: ticketDetails })
    }

    return responseFor(req, { valid: true, message: 'INGRESSO VALIDADO', ticket: ticketDetails })
  } catch (error: any) {
    return responseFor(req, { error: error.message || 'Unexpected validation error' }, 500)
  }
})
