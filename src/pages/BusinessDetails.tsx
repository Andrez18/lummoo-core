import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Clock, Settings, Share2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Business {
  id: string;
  name: string;
  description: string | null;
  email: string;
  phone: string;
  address: string;
  timezone: string;
  business_hours: any;
  created_at: string;
}

const BusinessDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !id) {
      navigate('/dashboard');
      return;
    }

    fetchBusinessDetails();
  }, [user, id, navigate]);

  const fetchBusinessDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching business details:', error);
        navigate('/dashboard');
      } else {
        setBusiness(data);
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatBusinessHours = (hours: any) => {
    if (!hours) return 'No configurado';
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    return days.map((day, index) => {
      const dayHours = hours[day];
      if (!dayHours) return null;
      
      return (
        <div key={day} className="flex justify-between">
          <span>{dayNames[index]}:</span>
          <span>
            {dayHours.closed ? 'Cerrado' : `${dayHours.open} - ${dayHours.close}`}
          </span>
        </div>
      );
    }).filter(Boolean);
  };

  const copyBookingLink = () => {
    const bookingUrl = `${window.location.origin}/booking/${business?.id}`;
    navigator.clipboard.writeText(bookingUrl);
    toast({
      title: "¡Enlace copiado!",
      description: "El enlace de reservas ha sido copiado al portapapeles",
    });
  };

  const shareBookingLink = () => {
    const bookingUrl = `${window.location.origin}/booking/${business?.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Reservar en ${business?.name}`,
        text: `Haz tu reserva en ${business?.name}`,
        url: bookingUrl,
      });
    } else {
      copyBookingLink();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles del negocio...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Negocio no encontrado</h2>
          <p className="text-gray-600 mb-4">El negocio que buscas no existe o no tienes permisos para verlo</p>
          <Button onClick={() => navigate('/dashboard')}>
            Volver al Dashboard
          </Button>
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
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Public booking link card */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Share2 className="h-5 w-5 mr-2" />
              Enlace Público de Reservas
            </CardTitle>
            <CardDescription className="text-blue-700">
              Comparte este enlace con tus clientes para que puedan hacer reservas online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white p-3 rounded border text-sm">
                {window.location.origin}/booking/{business.id}
              </div>
              <Button onClick={copyBookingLink} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
              <Button onClick={shareBookingLink} size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información general */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Información General
              </CardTitle>
              <CardDescription>
                Detalles básicos del negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nombre</label>
                <p className="text-gray-900">{business.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="text-gray-900">{business.description || 'Sin descripción'}</p>
              </div>
              
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{business.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{business.phone}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-900">{business.address}</span>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Zona horaria</label>
                <p className="text-gray-900">{business.timezone}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de creación</label>
                <p className="text-gray-900">
                  {new Date(business.created_at).toLocaleDateString('es-ES')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Horarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Horarios de Atención
              </CardTitle>
              <CardDescription>
                Horarios de funcionamiento del negocio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formatBusinessHours(business.business_hours)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex gap-4">
          <Button onClick={() => navigate(`/business/${business.id}/settings`)}>
            <Settings className="h-4 w-4 mr-2" />
            Configurar Negocio
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/services')}>
            Ver Servicios
          </Button>
          
          <Button variant="outline" onClick={() => navigate('/bookings')}>
            Ver Reservas
          </Button>

          <Button variant="outline" onClick={() => window.open(`/booking/${business.id}`, '_blank')}>
            <Share2 className="h-4 w-4 mr-2" />
            Ver Página de Reservas
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BusinessDetails;
