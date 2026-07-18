import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  estimated_fare: number;
  actual_fare: number | null;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
}

const Tracking = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .eq('id', rideId)
          .single();

        if (error) throw error;
        setRide(data);

        // Subscribe to real-time updates
        const subscription = supabase
          .channel(`ride:${rideId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'rides',
              filter: `id=eq.${rideId}`,
            },
            (payload) => {
              setRide(payload.new as Ride);
            }
          )
          .subscribe();

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        toast.error('Failed to load ride');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRide();
  }, [rideId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'accepted', 'in_progress', 'completed'];
    return steps.indexOf(status) + 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Ride not found</p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">Ride Tracking</h1>
        </div>

        {/* Status Card */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle>Ride Status</CardTitle>
              <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(ride.status)}`}>
                {ride.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Requested</span>
                <span>Accepted</span>
                <span>In Progress</span>
                <span>Completed</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-colors ${
                      step <= getStatusStep(ride.status)
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Location Details */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-semibold text-gray-900">{ride.pickup_location}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Dropoff Location</p>
                  <p className="font-semibold text-gray-900">{ride.dropoff_location}</p>
                </div>
              </div>
            </div>

            {/* Fare Details */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Estimated Fare</p>
                  <p className="font-semibold text-lg text-gray-900">${ride.estimated_fare.toFixed(2)}</p>
                </div>
              </div>
              {ride.actual_fare && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Final Fare</p>
                    <p className="font-semibold text-lg text-gray-900">${ride.actual_fare.toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              {ride.scheduled_at && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {new Date(ride.scheduled_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
              {ride.started_at && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Started</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {new Date(ride.started_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Driver Contact */}
            {ride.status !== 'pending' && (
              <div className="border-t pt-4 flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Driver
                </Button>
                <Button variant="outline" className="flex-1">
                  Message Driver
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            {ride.status === 'pending' && (
              <Button variant="destructive" className="w-full">
                Cancel Ride
              </Button>
            )}
            {ride.status === 'completed' && (
              <Button onClick={() => navigate('/')} className="w-full">
                Book Another Ride
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tracking;
