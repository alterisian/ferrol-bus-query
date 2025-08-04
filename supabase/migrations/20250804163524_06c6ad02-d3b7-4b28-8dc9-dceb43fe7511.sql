-- Enable RLS and create policies for the new tables

-- Enable RLS on stops table
ALTER TABLE public.stops ENABLE ROW LEVEL SECURITY;

-- Stops are publicly viewable (since bus stops are public information)
CREATE POLICY "Stops are publicly viewable" 
ON public.stops 
FOR SELECT 
USING (true);

-- Only authenticated users can manage stops
CREATE POLICY "Only authenticated users can manage stops" 
ON public.stops 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS on schedules table
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Schedules are publicly viewable
CREATE POLICY "Schedules are publicly viewable" 
ON public.schedules 
FOR SELECT 
USING (true);

-- Only authenticated users can manage schedules
CREATE POLICY "Only authenticated users can manage schedules" 
ON public.schedules 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS on schedule_stop_times table
ALTER TABLE public.schedule_stop_times ENABLE ROW LEVEL SECURITY;

-- Schedule stop times are publicly viewable
CREATE POLICY "Schedule stop times are publicly viewable" 
ON public.schedule_stop_times 
FOR SELECT 
USING (true);

-- Only authenticated users can manage schedule stop times
CREATE POLICY "Only authenticated users can manage schedule stop times" 
ON public.schedule_stop_times 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable RLS on route_stops table
ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;

-- Route stops are publicly viewable
CREATE POLICY "Route stops are publicly viewable" 
ON public.route_stops 
FOR SELECT 
USING (true);

-- Only authenticated users can manage route stops
CREATE POLICY "Only authenticated users can manage route stops" 
ON public.route_stops 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);