import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays, Clock, Users, CheckCircle, ArrowRight, Building2 } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/logo_claro.png" className="h-16 w-16 text-blue-600 mr-3" />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Iniciar Sesión
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Comenzar Gratis
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            La plataforma de reservas
            <span className="text-blue-600 block">más fácil de usar</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Gestiona las reservas de tu negocio de forma automática. Calendario inteligente, 
            confirmaciones automáticas y panel de control completo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate('/auth')}>
              <ArrowRight className="h-5 w-5 mr-2" />
              Comenzar Gratis
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate('/demo')}>
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-16 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Acceso Rápido
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="h-auto p-6 flex flex-col items-center gap-3"
              onClick={() => navigate('/businesses')}
            >
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold">Explorar Negocios</div>
                <div className="text-sm text-gray-600">Encuentra servicios cerca de ti</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-auto p-6 flex flex-col items-center gap-3"
              onClick={() => navigate('/demo')}
            >
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold">Ver Demo</div>
                <div className="text-sm text-gray-600">Conoce todas las funcionalidades</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="h-auto p-6 flex flex-col items-center gap-3"
              onClick={() => navigate('/auth')}
            >
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-center">
                <div className="font-semibold">Para Negocios</div>
                <div className="text-sm text-gray-600">Gestiona tu negocio online</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <CalendarDays className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calendario Inteligente</h3>
              <p className="text-gray-600">
                Visualiza todas tus reservas en un calendario fácil de usar. 
                Gestiona horarios y disponibilidad automáticamente.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Automatización Total</h3>
              <p className="text-gray-600">
                Confirmaciones automáticas por WhatsApp y SMS. 
                Recordatorios y gestión de cancelaciones sin intervención manual.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Panel de Control</h3>
              <p className="text-gray-600">
                Estadísticas en tiempo real, gestión de clientes y 
                reportes detallados para hacer crecer tu negocio.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                ¿Por qué elegir Reservas Online?
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Setup en minutos</h4>
                    <p className="text-gray-600">Configura tu negocio y comienza a recibir reservas en menos de 5 minutos</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Sin límites</h4>
                    <p className="text-gray-600">Gestiona múltiples negocios, servicios ilimitados y todas las reservas que necesites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Soporte 24/7</h4>
                    <p className="text-gray-600">Nuestro equipo está disponible para ayudarte cuando lo necesites</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Integraciones</h4>
                    <p className="text-gray-600">Conecta con WhatsApp, SMS, Google Calendar y más</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-8 text-center">
              <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Listo para comenzar?
              </h3>
              <p className="text-gray-600 mb-6">
                Únete a cientos de negocios que ya confían en nuestra plataforma
              </p>
              <Button size="lg" className="w-full" onClick={() => navigate('/auth')}>
                Crear Mi Cuenta Gratis
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Transforma tu negocio hoy mismo
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Comienza gratis y descubre por qué somos la plataforma preferida
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => navigate('/auth')}>
            Comenzar Ahora - Es Gratis
          </Button>
        </section>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-blue-400 mr-3" />
            <span className="text-2xl font-bold">Reservas Online</span>
          </div>
          <p className="text-gray-400">
            La forma más fácil de gestionar las reservas de tu negocio
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
