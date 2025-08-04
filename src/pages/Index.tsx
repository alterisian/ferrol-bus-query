import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Bus, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { testFerrolSearch } from "@/utils/searchTest";
import RouteSchedule from "@/components/RouteSchedule";
import LanguageSwitcher from "@/components/LanguageSwitcher";

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
  const { t } = useTranslation();

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
        title: t("pleaseEnterSearchTerm"),
        description: t("pleaseEnterSearchTermDesc"),
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
        title: t("searchCompleted"),
        description: `${t("foundRoutes", { count: (data || []).length })} containing "${query}"`,
      });
    } catch (error) {
      console.error('Search error:', error);
      setShowNoResults(true);
      toast({
        title: t("searchFailed"),
        description: t("searchFailedDesc"),
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
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Bus className="text-primary" />
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {allStops.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">{t("availableStops")}</CardTitle>
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
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? t("searching") : t("searchButton")}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {results.length === 1 ? t("foundRoutes", { count: results.length }) : t("foundRoutesPlural", { count: results.length })}
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
                        {t("stops")}:
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
                {t("noResultsFound", { query })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
