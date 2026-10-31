-- Criar tabela de ingressos
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code TEXT UNIQUE NOT NULL,
  sector TEXT NOT NULL,
  section TEXT NOT NULL,
  gate TEXT NOT NULL,
  price TEXT NOT NULL,
  total TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_name TEXT NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Criar índice para busca rápida por QR code
CREATE INDEX IF NOT EXISTS idx_tickets_qr_code ON tickets(qr_code);

-- Inserir os ingressos iniciais
INSERT INTO tickets (qr_code, sector, section, gate, price, total, event_date, event_name) VALUES
  ('BTS2026-SP-PISTA-1', 'Pista', 'INTEIRA', 'Portões 02, 04 e 18', 'R$ 1.250,00', 'R$ 1.500,00', '31/10/26', 'BTS WORLD TOUR ''ARIRANG'''),
  ('BTS2026-SP-CADEIRA-INFERIOR-2', 'Cadeira Inferior', 'INTEIRA', 'Portões 17A e 17B', 'R$ 1.080,00', 'R$ 1.296,00', '31/10/26', 'BTS WORLD TOUR ''ARIRANG'''),
  ('BTS2026-SP-CADEIRA-SUPERIOR-3', 'Cadeira Superior', 'INTEIRA', 'Portões 05 e 16', 'R$ 980,00', 'R$ 1.176,00', '31/10/26', 'BTS WORLD TOUR ''ARIRANG'''),
  ('BTS2026-SP-ARQUIBANCADA-4', 'Arquibancada', 'INTEIRA', 'Portões 06 e 15', 'R$ 680,00', 'R$ 816,00', '31/10/26', 'BTS WORLD TOUR ''ARIRANG''')
ON CONFLICT (qr_code) DO NOTHING;

-- Habilitar Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (para validação do QR code)
CREATE POLICY "Allow public read access" ON tickets
  FOR SELECT
  TO anon
  USING (true);

-- Política para permitir atualização (marcar como usado)
CREATE POLICY "Allow update on tickets" ON tickets
  FOR UPDATE
  TO anon
  USING (true);
