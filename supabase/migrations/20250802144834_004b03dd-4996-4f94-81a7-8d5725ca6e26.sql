-- Create RPC function to get all unique stops
CREATE OR REPLACE FUNCTION public.get_all_stops()
RETURNS TABLE(stop text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
WITH all_stops AS (
    SELECT unnest(
        array_cat(
            array_cat(
                array_agg(DISTINCT origin), 
                array_agg(DISTINCT destination)
            ), 
            array_agg(DISTINCT stop_name)
        )
    ) AS stop
    FROM bus_routes, unnest(stops) AS stop_name
)
SELECT DISTINCT all_stops.stop::text
FROM all_stops
WHERE all_stops.stop IS NOT NULL
ORDER BY all_stops.stop;
$$;