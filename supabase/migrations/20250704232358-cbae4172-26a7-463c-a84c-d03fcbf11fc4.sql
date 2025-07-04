
-- Create game_rounds table to store betting round data
CREATE TABLE public.game_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_number INTEGER NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('live', 'next', 'completed')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  start_price NUMERIC,
  end_price NUMERIC,
  total_pool NUMERIC NOT NULL DEFAULT 0,
  result TEXT CHECK (result IN ('bull', 'bear')),
  percentage_change NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) 
ALTER TABLE public.game_rounds ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to game rounds
CREATE POLICY "Anyone can view game rounds" 
  ON public.game_rounds 
  FOR SELECT 
  USING (true);

-- Create policy to allow system to insert/update rounds (no user restriction for game system)
CREATE POLICY "System can manage game rounds" 
  ON public.game_rounds 
  FOR ALL 
  USING (true);

-- Create index for performance
CREATE INDEX idx_game_rounds_round_number ON public.game_rounds(round_number);
CREATE INDEX idx_game_rounds_status ON public.game_rounds(status);
