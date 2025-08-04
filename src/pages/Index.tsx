import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bus, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { testFerrolSearch } from "@/utils/searchTest";
import RouteSchedule from "@/components/RouteSchedule";

interface BusRoute {
  id: string;
  service_id: string;
  origin: string;
  destination: string;
  stops: string[];
}

const Index = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BusRoute[]>([]);
  const [allStops, setAllStops] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const { toast } = useToast();

  // Fetch all stops and run test on component mount
  useEffect(() => {
    const fetchAllStops = async () => {
      try {
        const { data, error } = await (supabase as any).rpc('get_all_stops');
        if (error) throw error;
        setAllStops(data ? data.map((row: any) => row.stop) : []);
      } catch (error) {
        console.error('Error fetching stops:', error);
      }
    };

    fetchAllStops();
    testFerrolSearch();
  }, []);

  // Auto search when query is 2+ characters
  useEffect(() => {
    const autoSearch = async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        setShowNoResults(false);
        try {
          const { data, error } = await (supabase as any).rpc('search_bus_routes', {
            search_term: query.trim()
          });

          if (error) throw error;
          setResults(data || []);
        } catch (error) {
          console.error('Auto search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowNoResults(false);
      }
    };

    const timeoutId = setTimeout(autoSearch, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a search term",
        description: "Enter a stop name to search for bus routes",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setShowNoResults(false);
    try {
      // Search for routes using partial matching across origin, destination, and stops
      const { data, error } = await (supabase as any).rpc('search_bus_routes', {
        search_term: query.trim()
      });

      if (error) {
        throw error;
      }

      setResults(data || []);
      if ((data || []).length === 0) {
        setShowNoResults(true);
      }
      toast({
        title: "Search completed",
        description: `Found ${(data || []).length} routes containing "${query}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      setShowNoResults(true);
      toast({
        title: "Search failed",
        description: "There was an error searching for bus routes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Bus className="text-primary" />
            Ferrol Bus Search
          </h1>
          <p className="text-xl text-muted-foreground">
            Search for bus routes by stop name in Ferrol, Galicia
          </p>
        </div>

        {allStops.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Available Stops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allStops.map((stop) => (
                  <Badge
                    key={stop}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => setQuery(stop)}
                  >
                    {stop}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter a stop name (e.g., Narón, Ferrol, Cedeira...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Found {results.length} route{results.length !== 1 ? 's' : ''}
            </h2>
            {results.map((route) => (
              <Card key={route.id} className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">{route.service_id}</Badge>
                    <span>{route.origin} → {route.destination}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Stops:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {route.stops.map((stop, index) => (
                          <Badge
                            key={index}
                            variant={stop.toLowerCase().includes(query.toLowerCase()) ? "default" : "secondary"}
                          >
                            {stop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <RouteSchedule routeId={route.id} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {showNoResults && !loading && (
          <Card className="text-center p-8">
            <CardContent>
              <p className="text-muted-foreground">
                No routes found containing "{query}". Try searching for stops like "Narón", "Ferrol", or "Cedeira".
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
