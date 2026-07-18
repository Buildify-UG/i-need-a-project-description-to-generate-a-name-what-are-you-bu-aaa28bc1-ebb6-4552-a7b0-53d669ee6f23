import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Ride {
  id: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  estimated_fare: number;
  actual_fare: number | null;
  created_at: string;
}

const MyRides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('Please sign in first');
          navigate('/');
          return;
        }

        let query = supabase
          .from('rides')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setRides(data || []);
      } catch (err) {
        toast.error('Failed to load rides');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [filter, navigate]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">My Rides</h1>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <Button
              key={status}
              onClick={() => setFilter(status)}
              variant={filter === status ? 'default' : 'outline'}
              className={filter === status ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''}
            >
              {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
            </Button>
          ))}
        </div>

        {/* Rides List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading rides...</p>
          </div>
        ) : rides.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-gray-600 mb-4">No rides found</p>
              <Button onClick={() => navigate('/book')} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                Book a Ride
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <Card key={ride.id} className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Locations */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 mt-1">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <div className="w-0.5 h-12 bg-gray-300"></div>
                          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">From</p>
                          <p className="font-semibold text-gray-900 line-clamp-1">{ride.pickup_location}</p>
                          <p className="text-sm text-gray-600 mt-4">To</p>
                          <p className="font-semibold text-gray-900 line-clamp-1">{ride.dropoff_location}</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full font-semibold text-xs ${getStatusBadge(ride.status)}`}>
                        {ride.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Fare</p>
                        <p className="font-bold text-lg text-green-600">
                          ${(ride.actual_fare || ride.estimated_fare).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(ride.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => navigate(`/tracking/${ride.id}`)}
                    variant="ghost"
                    className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
