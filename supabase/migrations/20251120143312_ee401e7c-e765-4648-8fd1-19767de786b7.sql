-- Create drones table
CREATE TABLE public.drones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'patrolling', 'charging', 'maintenance')),
  battery_level INTEGER DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  current_latitude NUMERIC,
  current_longitude NUMERIC,
  last_patrol_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.drones ENABLE ROW LEVEL SECURITY;

-- Admins can manage drones
CREATE POLICY "Admins can manage drones"
  ON public.drones
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Everyone can view active drones
CREATE POLICY "Everyone can view drones"
  ON public.drones
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create drone_patrols table to track patrol history
CREATE TABLE public.drone_patrols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drone_id UUID NOT NULL REFERENCES public.drones(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  issues_detected INTEGER DEFAULT 0,
  areas_covered TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drone_patrols ENABLE ROW LEVEL SECURITY;

-- Admins can view patrol history
CREATE POLICY "Admins can view patrol history"
  ON public.drone_patrols
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));