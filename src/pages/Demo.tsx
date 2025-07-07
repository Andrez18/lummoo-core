
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock, Users, Building2, ArrowLeft, CheckCircle, Star } from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CalendarDays,
      title: "Calendario Inteligente",
      description: "Gestiona todas tus reservas en un calendario fácil de usar con disponibilidad automática."
    },
    {
      icon: Clock,
      title: "Automatización Total",
      description: "Confirmaciones automáticas por WhatsApp, recordatorios y gestión sin intervención manual."
    },
    {
      icon: Users,
      title: "Gestión de Clientes",
      description: "Base de datos completa de clientes con historial de reservas y comunicación directa."
    },
    {
      icon: Building2,
      title: "Multi-negocio",
      description: "Gestiona múltiples ubicaciones o negocios desde una sola plataforma."
    }
  ];

  const testimonials = [
    {
      name: "María González",
      business: "Salón de Belleza Elegance",
      rating: 5,
      comment: "Desde que uso esta plataforma, mis reservas se organizan solas. Mis clientes pueden reservar 24/7 y yo me enfoco en lo importante."
    },
    {
      name: "Carlos Mendez",
      business: "Clínica Dental Sonrisas",
      rating: 5,
      comment: "La automatización de recordatorios ha reducido las ausencias en un 80%. Excelente herramienta."
    },
    {
      name: "Ana Ruiz",
      business: "Centro de Fisioterapia",
      rating: 5,
      comment: "Fácil de usar y muy completa. Mis pacientes están encantados con poder reservar online."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center">
              <img src="/logo_claro.png" className="h-12 w-12 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Demo - Reservas Online</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ve cómo funciona
            <span className="text-blue-600 block">nuestra plataforma</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre todas las funcionalidades que harán crecer tu negocio y simplificarán tu día a día.
          </p>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Demo Interactiva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Para Negocios:</h3>
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate('/auth')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Panel de Control del Negocio
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/businesses')}
              >
                <Users className="h-4 w-4 mr-2" />
                Ver Directorio de Negocios
              </Button>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Para Clientes:</h3>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/businesses')}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Buscar y Reservar Servicios
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('/booking/demo', '_blank')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Ver Página de Reserva
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <section className="bg-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Lo que dicen nuestros clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <p className="text-sm text-gray-600">{testimonial.business}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Beneficios comprobados
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">80% menos ausencias</h4>
                  <p className="text-gray-600">Los recordatorios automáticos reducen significativamente las no-presentaciones</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Disponible 24/7</h4>
                  <p className="text-gray-600">Tus clientes pueden reservar en cualquier momento, incluso fuera del horario comercial</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Ahorra 5+ horas semanales</h4>
                  <p className="text-gray-600">Automatiza la gestión de reservas y enfócate en tu negocio</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Aumento del 40% en reservas</h4>
                  <p className="text-gray-600">La facilidad de reserva online atrae más clientes</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-8 text-center">
            <CalendarDays className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Listo para probarlo?
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza gratis y descubre por qué cientos de negocios confían en nosotros
            </p>
            <Button size="lg" className="w-full mb-4" onClick={() => navigate('/auth')}>
              Comenzar Gratis Ahora
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/businesses')}
            >
              Explorar Negocios
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes preguntas?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nuestro equipo está aquí para ayudarte a hacer crecer tu negocio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" onClick={() => navigate('/auth')}>
              Empezar Ahora
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 text-white border-white hover:bg-white hover:text-blue-600">
              Contactar Soporte
            </Button>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Demo;
