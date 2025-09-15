'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { useTranslations, useLanguage } from '@/hooks/useTranslations';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signIn, user, isAdmin } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();
  const translations = t as Record<string, string | Record<string, string>>;

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('🔐 LoginPage: User already logged in, redirecting...', user);
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    }
  }, [user, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError((signInError as any)?.message || 'Login failed');
        return;
      }

      // The useEffect will handle the redirect based on user state
      console.log('🔐 LoginPage: Sign in successful, user state will be updated');
    } catch (error) {
      console.error('Login failed:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToSection = (section: string) => {
    // For login page, we don't need scroll functionality
    console.log('Scroll to section:', section);
  };

  const handleLoginClick = () => {
    // This is already the login page
    console.log('Already on login page');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        scrollToSection={scrollToSection}
        t={translations}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        onLoginClick={handleLoginClick}
        user={user}
        isAdmin={isAdmin}
      />

      {/* Login Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24">
        {/* Background Image with Overlay - Same as home page */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/matmaxstudio.png")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        {/* Login Form */}
        <div className="relative z-10 w-full max-w-md mx-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 
                className="text-3xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Welcome Back
              </h1>
              <p 
                className="text-gray-600"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Sign in to your account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6ea058] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6ea058] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#6ea058] hover:bg-[#5a8a4a] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </motion.button>
            </form>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-[#6ea058] hover:text-[#5a8a4a] transition-colors duration-200 text-sm font-medium"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                ← Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
