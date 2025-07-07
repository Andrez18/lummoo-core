
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, MapPin, Phone, Mail, Clock, ArrowLeft, Building2, Star, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  business_hours: any;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  business_id: string;
}

const BusinessDirectory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [services, setServices] = useState<{ [key: string]: Service[] }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .order('name');

      if (businessError) {
        console.error('Error fetching businesses:', businessError);
        toast({
          title: "Error",
          description: "No se pudieron cargar los negocios",
          variant: "destructive",
        });
        return;
      }

      setBusinesses(businessData || []);

      // Fetch services for each business
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
      } else {
        // Group services by business_id
        const servicesByBusiness = (servicesData || []).reduce((acc, service) => {
          if (!acc[service.business_id]) {
            acc[service.business_id] = [];
          }
          acc[service.business_id].push(service);
          return acc;
        }, {} as { [key: string]: Service[] });
        
        setServices(servicesByBusiness);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      fetchBusinesses();
      return;
    }

    try {
      setSearching(true);
      const { data, error } = await supabase.rpc('search_businesses', {
        search_term: term
      });

      if (error) {
        console.error('Search error:', error);
        toast({
          title: "Error en la búsqueda",
          description: "No se pudo realizar la búsqueda",
          variant: "destructive",
        });
        return;
      }

      setBusinesses(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error en la búsqueda",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const formatBusinessHours = (hours: any) => {
    if (!hours) return 'No disponible';
    
    const today = new Date().getDay();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    const todayKey = days[today];
    const todayHours = hours[todayKey];
    
    if (!todayHours) return 'Cerrado hoy';
    
    return todayHours.closed ? 'Cerrado hoy' : `Hoy: ${todayHours.open} - ${todayHours.close}`;
  };

  const getBusinessServices = (businessId: string) => {
    return services[businessId] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando negocios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Inicio
            </Button>
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Directorio de Negocios</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Encuentra el servicio que necesitas
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre del negocio o servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchTerm);
                  }
                }}
              />
            </div>
            <Button 
              onClick={() => handleSearch(searchTerm)}
              disabled={searching}
            >
              {searching ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                fetchBusinesses();
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {businesses.length} {businesses.length === 1 ? 'negocio encontrado' : 'negocios encontrados'}
          </h3>
        </div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {businesses.map((business) => {
            const businessServices = getBusinessServices(business.id);
            
            return (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{business.name}</CardTitle>
                      {business.description && (
                        <p className="text-gray-600 mb-3">{business.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{business.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{business.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{business.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatBusinessHours(business.business_hours)}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Services */}
                  {businessServices.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Servicios disponibles:</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {businessServices.slice(0, 3).map((service) => (
                          <Badge key={service.id} variant="secondary" className="text-xs">
                            {service.name} - ${service.price}
                          </Badge>
                        ))}
                        {businessServices.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{businessServices.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => navigate(`/booking/${business.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Hacer Reserva
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`tel:${business.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {businesses.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron negocios
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 
                'Intenta con otros términos de búsqueda o explora todos los negocios.' :
                'Aún no hay negocios registrados en la plataforma.'
              }
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  fetchBusinesses();
                }}
              >
                Ver todos los negocios
              </Button>
            )}
          </div>
        )}

        {/* CTA Section */}
        <section className="mt-16 bg-blue-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Tienes un negocio?
          </h2>
          <p className="text-blue-100 mb-6">
            Únete a nuestra plataforma y permite que más clientes te encuentren
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/auth')}
          >
            Registrar mi Negocio
          </Button>
        </section>
      </main>
    </div>
  );
};

export default BusinessDirectory;
