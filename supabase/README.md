# Configuração do Sistema de QR Code Funcional

Este guia explica como configurar o sistema de validação de ingressos usando Supabase.

## Passo 1: Executar a migração no Supabase

Acesse o dashboard do Supabase e execute o SQL do arquivo `migrations/001_create_tickets.sql` no SQL Editor.

Ou use a CLI do Supabase:

```bash
npx supabase db push
```

## Passo 2: Fazer deploy da Edge Function

Use a CLI do Supabase para fazer deploy da função:

```bash
npx supabase functions deploy validate-ticket --no-verify-jwt
```

Esse endpoint não exige login; o segredo `SUPABASE_SERVICE_ROLE_KEY` é usado somente dentro da Edge Function e nunca deve ser colocado no app.

Ou se não tiver a CLI instalada:

1. Acesse o dashboard do Supabase
2. Vá em Edge Functions
3. Crie uma nova função chamada `validate-ticket`
4. Cole o conteúdo de `functions/validate-ticket/index.ts`

## Passo 3: Testar a Edge Function

Teste a função usando curl:

```bash
curl -X POST https://zqcolmspkrucybtavibr.supabase.co/functions/v1/validate-ticket \
  -H "Authorization: Bearer SUA_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"qr_code": "BTS2026-SP-PISTA-1"}'
```

## Passo 4: Validar pelo QR

O QR contém a URL da Edge Function. Ao ser lido pela câmera da máquina, a URL abre diretamente a validação: a primeira leitura marca o ingresso como usado; as seguintes retornam `INGRESSO USADO`.

A URL da função será:
`https://zqcolmspkrucybtavibr.supabase.co/functions/v1/validate-ticket`

Quando uma máquina ler o QR code, o navegador abrirá uma página de resultado:
- Primeira leitura: `INGRESSO VALIDADO`, e o ingresso é marcado como usado.
- Leituras seguintes: `INGRESSO USADO`.
