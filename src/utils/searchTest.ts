import { supabase } from "@/integrations/supabase/client";

export async function testFerrolSearch(): Promise<boolean> {
  try {
    console.log("Testing Ferrol search...");
    
    // Test exact match search
    const { data, error } = await supabase
      .from('bus_routes')
      .select('*')
      .filter('stops', 'cs', `{"Ferrol E.F."}`);
    
    if (error) {
      console.error("Search error:", error);
      return false;
    }
    
    console.log("Search results:", data);
    console.log(`Found ${data?.length || 0} routes containing "Ferrol"`);
    
    // Test should pass if we find at least 1 route
    const testPassed = (data?.length || 0) >= 1;
    console.log(`Test ${testPassed ? 'PASSED' : 'FAILED'}: Expected >= 1 result, got ${data?.length || 0}`);
    
    return testPassed;
  } catch (error) {
    console.error("Test failed with exception:", error);
    return false;
  }
}

export async function testRoute34Search(): Promise<boolean> {
  try {
    console.log("Testing Route 34 search (XG64201001: Gándara → A Malata)...");
    console.log("Searching for second stop: 'A Malata'");
    
    // Test using the new search function for partial matching
    const { data, error } = await (supabase as any).rpc('search_bus_routes', {
      search_term: 'A Malata'
    });
    
    if (error) {
      console.error("Search error:", error);
      return false;
    }
    
    console.log("Search results:", data);
    console.log(`Found ${data?.length || 0} routes containing "A Malata"`);
    
    // Check if we found the specific route XG64201001
    const route34Found = data?.some((route: any) => route.service_id === 'XG64201001');
    const testPassed = route34Found;
    
    console.log(`Test ${testPassed ? 'PASSED' : 'FAILED'}: Expected to find route XG64201001, found: ${route34Found}`);
    
    if (route34Found) {
      const route34 = data?.find((route: any) => route.service_id === 'XG64201001');
      console.log("Route 34 details:", route34);
    }
    
    return testPassed;
  } catch (error) {
    console.error("Test failed with exception:", error);
    return false;
  }
}

// Auto-run tests when this module is imported
async function runTests() {
  console.log("=== Running Bus Route Search Tests ===");
  await testFerrolSearch();
  await testRoute34Search();
  console.log("=== Tests Completed ===");
}

runTests();