import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ScheduleData {
  stop_name: string;
  stop_order: number;
  day_type: string;
  arrival_time: string;
  departure_time: string;
}

interface RouteScheduleProps {
  routeId: string;
}

const RouteSchedule = ({ routeId }: RouteScheduleProps) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current day of week
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const currentDay = getCurrentDay();

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const { data, error } = await (supabase as any).rpc('get_route_schedules', {
          route_id: routeId,
          target_day_type: currentDay
        });

        if (error) throw error;
        setScheduleData(data || []);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [routeId, currentDay]);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" />
          Loading schedule...
        </div>
      </div>
    );
  }

  if (scheduleData.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4" />
          {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}
        </div>
        <p className="text-sm text-muted-foreground">No schedule available for today</p>
      </div>
    );
  }

  // Group schedule data by stop
  const scheduleByStop = scheduleData.reduce((acc, item) => {
    if (!acc[item.stop_name]) {
      acc[item.stop_name] = {
        stop_order: item.stop_order,
        times: []
      };
    }
    acc[item.stop_name].times.push(item.arrival_time);
    return acc;
  }, {} as Record<string, { stop_order: number; times: string[] }>);

  // Sort stops by order
  const sortedStops = Object.entries(scheduleByStop).sort(
    ([, a], [, b]) => a.stop_order - b.stop_order
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4" />
        {currentDay.charAt(0).toUpperCase() + currentDay.slice(1)}
      </div>
      
      <div className="space-y-3">
        {sortedStops.map(([stopName, data]) => (
          <div key={stopName} className="border-l-2 border-muted pl-3">
            <div className="font-medium text-sm mb-1">{stopName}</div>
            <div className="space-y-1">
              {data.times.map((time, index) => (
                <div key={index} className="text-xs text-muted-foreground font-mono">
                  {time.slice(0, 5)} {/* Remove seconds from time */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteSchedule;