
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Building2, Save, Clock } from 'lucide-react';
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

interface BusinessHours {
  [key: string]: {
    open?: string;
    close?: string;
    closed?: boolean;
  };
}

const BusinessSettings = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    timezone: 'UTC'
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: { open: '09:00', close: '18:00', closed: false },
    tuesday: { open: '09:00', close: '18:00', closed: false },
    wednesday: { open: '09:00', close: '18:00', closed: false },
    thursday: { open: '09:00', close: '18:00', closed: false },
    friday: { open: '09:00', close: '18:00', closed: false },
    saturday: { open: '09:00', close: '14:00', closed: false },
    sunday: { open: '09:00', close: '14:00', closed: true }
  });

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
        setFormData({
          name: data.name,
          description: data.description || '',
          email: data.email,
          phone: data.phone,
          address: data.address,
          timezone: data.timezone || 'UTC'
        });
        
        // Type guard to ensure business_hours is properly typed
        if (data.business_hours && typeof data.business_hours === 'object' && !Array.isArray(data.business_hours)) {
          const hours = data.business_hours as BusinessHours;
          setBusinessHours(hours);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          description: formData.description,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          timezone: formData.timezone,
          business_hours: businessHours
        })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error updating business:', error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el negocio",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Éxito",
          description: "Negocio actualizado correctamente",
        });
        navigate(`/business/${id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateBusinessHours = (day: string, field: string, value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const dayNames = {
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
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
              onClick={() => navigate(`/business/${business.id}`)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Configuración - {business.name}</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información general */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Información General
              </CardTitle>
              <CardDescription>
                Configuración básica del negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del negocio</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre del negocio"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción del negocio"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@ejemplo.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+34 123 456 789"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Dirección completa"
                />
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
                Configura los horarios de funcionamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dayNames).map(([dayKey, dayLabel]) => (
                  <div key={dayKey} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">{dayLabel}</div>
                    <Switch
                      checked={!businessHours[dayKey]?.closed}
                      onCheckedChange={(checked) => updateBusinessHours(dayKey, 'closed', !checked)}
                    />
                    {!businessHours[dayKey]?.closed && (
                      <>
                        <Input
                          type="time"
                          value={businessHours[dayKey]?.open || '09:00'}
                          onChange={(e) => updateBusinessHours(dayKey, 'open', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-gray-500">a</span>
                        <Input
                          type="time"
                          value={businessHours[dayKey]?.close || '18:00'}
                          onChange={(e) => updateBusinessHours(dayKey, 'close', e.target.value)}
                          className="w-32"
                        />
                      </>
                    )}
                    {businessHours[dayKey]?.closed && (
                      <span className="text-gray-500 italic">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex gap-4">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          
          <Button variant="outline" onClick={() => navigate(`/business/${business.id}`)}>
            Cancelar
          </Button>
        </div>
      </main>
    </div>
  );
};

export default BusinessSettings;
