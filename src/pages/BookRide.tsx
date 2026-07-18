import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const BookRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    rideType: 'economy',
    passengers: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookRide = async () => {
    if (!formData.pickup || !formData.dropoff) {
      toast.error('Please fill in all locations');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in first');
        return;
      }

      const { data, error } = await supabase
        .from('rides')
        .insert([
          {
            user_id: user.id,
            pickup_location: formData.pickup,
            dropoff_location: formData.dropoff,
            status: 'pending',
            estimated_fare: Math.floor(Math.random() * 50) + 10,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Ride booked successfully!');
      navigate(`/tracking/${data.id}`);
    } catch (err) {
      toast.error('Failed to book ride');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl">Book a Ride</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Pickup Location */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Location
              </Label>
              <Input
                name="pickup"
                placeholder="Enter pickup address"
                value={formData.pickup}
                onChange={handleChange}
                className="border-2"
              />
            </div>

            {/* Dropoff Location */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dropoff Location
              </Label>
              <Input
                name="dropoff"
                placeholder="Enter dropoff address"
                value={formData.dropoff}
                onChange={handleChange}
                className="border-2"
              />
            </div>

            {/* Ride Type */}
            <div className="space-y-2">
              <Label>Ride Type</Label>
              <select
                name="rideType"
                value={formData.rideType}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md"
              >
                <option value="economy">Economy</option>
                <option value="comfort">Comfort</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Passengers */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Number of Passengers
              </Label>
              <Input
                name="passengers"
                type="number"
                min="1"
                max="6"
                value={formData.passengers}
                onChange={handleChange}
                className="border-2"
              />
            </div>

            {/* Estimated Fare */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Estimated Fare</p>
              <p className="text-2xl font-bold text-blue-600">$15.50</p>
            </div>

            {/* Book Button */}
            <Button
              onClick={handleBookRide}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold"
            >
              {loading ? 'Booking...' : 'Book Ride Now'}
            </Button>

            {/* View Rides Button */}
            <Button
              onClick={() => navigate('/rides')}
              variant="outline"
              className="w-full"
            >
              View My Rides
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookRide;
