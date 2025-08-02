-- Create RPC function for partial search across bus routes
CREATE OR REPLACE FUNCTION public.search_bus_routes(search_term text)
RETURNS TABLE(
    id uuid,
    service_id text,
    origin text,
    destination text,
    stops text[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
SELECT id, service_id, origin, destination, stops 
FROM bus_routes 
WHERE origin ILIKE '%' || search_term || '%' 
   OR destination ILIKE '%' || search_term || '%' 
   OR EXISTS (
       SELECT 1 
       FROM unnest(stops) AS stop 
       WHERE stop ILIKE '%' || search_term || '%'
   );
$$;