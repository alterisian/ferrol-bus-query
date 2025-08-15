import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ArrowLeft, Bus, Github, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="absolute top-6 right-6">
          <LanguageSwitcher />
        </div>
        
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <Button 
            data-tally-open="n0WeEZ" 
            data-tally-auto-close="2000"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Give Feedback
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Bus className="text-primary" />
            About Ferrol Bus Search
          </h1>
          <p className="text-xl text-muted-foreground">
            Information about this bus route search tool for Ferrol, Galicia
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                About This Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This bus route search tool helps you find public transportation routes in and around Ferrol, Galicia. 
                You can search by stop name to discover available bus routes, schedules, and connections.
              </p>
              <p className="text-muted-foreground">
                The tool includes routes operated by various local transport companies serving the Ferrol area, 
                including connections to nearby towns like Narón, Cedeira, Ortigueira, and other municipalities in the region.
              </p>
              <p className="text-muted-foreground">
                Available in three languages: English, Spanish (Español), and Galician (Galego).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Useful Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="font-medium text-sm text-muted-foreground mb-2">Bus Services</div>
                <a 
                  href="https://www.alsaferrol.es/en/lines" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  ALSA Ferrol - Central Ferrol Area Buses
                </a>
                <a 
                  href="https://www.monbus.es/es/search/results" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Monbus - Ferrol, Pontedeume & Regional Routes
                </a>
                
                <div className="font-medium text-sm text-muted-foreground mb-2 mt-4">Alternative Transport</div>
                <a 
                  href="https://biciferrolterra.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Ferrol Bici - Bicycle Sharing Scheme
                </a>
                
                <div className="font-medium text-sm text-muted-foreground mb-2 mt-4">Official Resources</div>
                <a 
                  href="https://www.ferrol.es" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Official Ferrol City Website
                </a>
                <a 
                  href="https://www.xunta.gal/transporte-publico" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Galicia Public Transport (Xunta de Galicia)
                </a>
                <a 
                  href="https://www.renfe.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  RENFE - Train Services
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact & Technical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This tool was built to help residents and visitors navigate the public transportation system in Ferrol and surrounding areas. 
                The data includes bus routes, stops, and schedule information for the region.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://github.com/alterisian/ferrol-bus-query" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    View Source Code
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://github.com/alterisian/ferrol-bus-query/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Tasks / Roadmap
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
