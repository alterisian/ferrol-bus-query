-- Create function to get schedule information for a bus route
CREATE OR REPLACE FUNCTION public.get_route_schedules(route_id uuid, target_day_type text DEFAULT NULL)
RETURNS TABLE(
  stop_name text,
  stop_order integer,
  day_type text,
  arrival_time time,
  departure_time time
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
SELECT 
  s.name as stop_name,
  rs.stop_order,
  sch.day_type,
  sst.arrival_time,
  sch.departure_time
FROM schedules sch
JOIN schedule_stop_times sst ON sch.id = sst.schedule_id
JOIN stops s ON sst.stop_id = s.id
JOIN route_stops rs ON rs.stop_id = s.id AND rs.bus_route_id = sch.bus_route_id
WHERE sch.bus_route_id = route_id
  AND (target_day_type IS NULL OR sch.day_type = target_day_type)
ORDER BY rs.stop_order, sch.departure_time;
$function$