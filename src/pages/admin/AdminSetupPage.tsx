import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminSetupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('email', 'admin@deeskinstore.com')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsComplete(true);
      }
    } catch (err) {
      console.error('Error checking admin:', err);
    } finally {
      setChecking(false);
    }
  };

  const setupAdmin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, sign up the admin user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: 'admin@deeskinstore.com',
        password: 'admin123',
        options: {
          data: {
            full_name: 'Super Administrator'
          }
        }
      });

      if (signUpError) {
        // If user already exists, that's okay - we'll try to get their ID
        if (signUpError.message.includes('already registered')) {
          const { data: existingUsers } = await supabase
            .from('admins')
            .select('user_id')
            .eq('email', 'admin@deeskinstore.com')
            .maybeSingle();

          if (!existingUsers?.user_id) {
            throw new Error('Admin user exists but is not properly configured. Please contact support.');
          }
        } else {
          throw signUpError;
        }
      }

      const userId = authData?.user?.id;

      if (!userId) {
        throw new Error('Failed to create auth user');
      }

      // Check if admin record already exists
      const { data: existingAdmin } = await supabase
        .from('admins')
        .select('id')
        .eq('email', 'admin@deeskinstore.com')
        .maybeSingle();

      if (existingAdmin) {
        // Update existing admin record with user_id
        const { error: updateError } = await supabase
          .from('admins')
          .update({ user_id: userId })
          .eq('email', 'admin@deeskinstore.com');

        if (updateError) throw updateError;
      } else {
        // Create admin record
        const { error: insertError } = await supabase
          .from('admins')
          .insert({
            email: 'admin@deeskinstore.com',
            user_id: userId,
            full_name: 'Super Administrator',
            role: 'super_admin',
            is_active: true
          });

        if (insertError) throw insertError;
      }

      setIsComplete(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/admin');
      }, 2000);
    } catch (err: any) {
      console.error('Setup error:', err);
      setError(err.message || 'Failed to setup admin account');
    } finally {
      setIsLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Checking admin status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-[#0d0499] p-3 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Admin Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Initialize the administrator account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {isComplete ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Admin Account Ready!
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You can now log in with:
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-left">
                <p className="text-sm font-mono mb-1">
                  <span className="font-semibold">Email:</span> admin@deeskinstore.com
                </p>
                <p className="text-sm font-mono">
                  <span className="font-semibold">Password:</span> admin123
                </p>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-6 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  This will create a super administrator account with the following credentials:
                </p>
                <div className="mt-2 text-sm font-mono bg-white p-2 rounded">
                  <p><span className="font-semibold">Email:</span> admin@deeskinstore.com</p>
                  <p><span className="font-semibold">Password:</span> admin123</p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={setupAdmin}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0d0499] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d0499] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Create Admin Account'
                )}
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Run this setup only once. After completion, you can log in to the admin panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSetupPage;
