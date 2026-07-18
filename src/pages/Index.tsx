
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Package, MapPin, Clock, Shield, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">RideFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/rides')}>
                  My Rides
                </Button>
                <Button
                  onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost">Sign In</Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Your Ride, Anytime, Anywhere
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Fast, reliable, and affordable taxi and delivery services at your fingertips.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            onClick={() => user ? navigate('/book') : null}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold"
          >
            <Car className="w-5 h-5 mr-2" />
            Book a Ride
          </Button>
          <Button
            onClick={() => user ? navigate('/orders') : null}
            variant="outline"
            className="px-8 py-6 text-lg font-semibold"
          >
            <Package className="w-5 h-5 mr-2" />
            Send a Delivery
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose RideFlow?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Quick Pickup</h4>
                <p className="text-gray-600">Average pickup time under 5 minutes</p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Safe & Secure</h4>
                <p className="text-gray-600">Verified drivers and real-time tracking</p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Great Prices</h4>
                <p className="text-gray-600">Competitive rates with transparent pricing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {user && (
        <section className="max-w-6xl mx-auto px-4 py-20 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-xl">
            <CardContent className="pt-12 pb-12">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-8 text-lg">Book your first ride now and enjoy the journey!</p>
              <Button
                onClick={() => navigate('/book')}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-semibold mb-4">About</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Download</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">iOS App</a></li>
                <li><a href="#" className="hover:text-white">Android App</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RideFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
