import { supabase } from "@/integrations/supabase/client";

export async function testFerrolSearch(): Promise<boolean> {
  try {
    console.log("Testing Ferrol search...");
    
    // Test the corrected search logic
    const { data, error } = await supabase
      .from('bus_routes')
      .select('*')
      .filter('stops', 'cs', `{*Ferrol*}`);
    
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

// Auto-run test when this module is imported
testFerrolSearch();