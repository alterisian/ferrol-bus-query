-- Create bus_routes table
CREATE TABLE public.bus_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL UNIQUE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  stops TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bus_routes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is public transit data)
CREATE POLICY "Bus routes are publicly viewable" 
ON public.bus_routes 
FOR SELECT 
USING (true);

-- Restrict write access (only authenticated users can modify)
CREATE POLICY "Only authenticated users can insert bus routes" 
ON public.bus_routes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update bus routes" 
ON public.bus_routes 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete bus routes" 
ON public.bus_routes 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bus_routes_updated_at
BEFORE UPDATE ON public.bus_routes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better search performance
CREATE INDEX idx_bus_routes_service_id ON public.bus_routes (service_id);
CREATE INDEX idx_bus_routes_origin ON public.bus_routes (origin);
CREATE INDEX idx_bus_routes_destination ON public.bus_routes (destination);
CREATE INDEX idx_bus_routes_stops ON public.bus_routes USING GIN(stops);