import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PublicationAuth = () => {
  const [stage, setStage] = useState('request'); // 'request' or 'verify'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    const tokenExpiry = localStorage.getItem('authTokenExpiry');
    
    if (token && tokenExpiry) {
      const now = new Date().getTime();
      const expiry = parseInt(tokenExpiry);
      
      // Check if token is still valid (within 24 hours)
      if (now < expiry) {
        navigate('/publications/manage');
        return;
      } else {
        // Token expired, clear it
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiry');
      }
    }
  }, [navigate]);

  const sendOTP = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      setSuccess('Sending OTP...');
      
      // Use relative API path to avoid CORS issues
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess('OTP sent to harry@harryrose.dev');
        setStage('verify');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Could not connect to server. Please check that the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Store authentication token for 24 hours
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('authToken', data.token || 'authenticated');
        localStorage.setItem('authTokenExpiry', expiryTime.toString());
        
        setSuccess('Authentication successful! Redirecting...');
        setTimeout(() => {
          navigate('/publications/manage');
        }, 1000);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
        setOtp('');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setOtp(value);
  };

  return (
    <div className="min-h-screen relative bg-black-100">
      <div className="relative">
        <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
              <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                Harry Rose
              </a>
              <button 
                onClick={() => window.location.href = '/publications'} 
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>←</span> Back to Publications
              </button>
            </div>
          </div>
        </nav>

        <section className="c-space pt-32 pb-20">
          <div className="max-w-md mx-auto">
            <div className="bg-black-200 rounded-lg p-8 border border-white-500">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Admin Access
                </h1>
                <p className="text-white-600">
                  {stage === 'request' 
                    ? 'Request a one-time password to access the publications manager.'
                    : 'Enter the verification code sent to your email.'
                  }
                </p>
              </div>

              {stage === 'request' ? (
                <div className="space-y-4">
                  <button
                    onClick={sendOTP}
                    disabled={loading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      loading 
                        ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                        : 'bg-white-500 hover:bg-white-600 text-black'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-white-600 text-center">
                    Enter the 6-digit code sent to your email.
                  </p>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="000000"
                      className="w-full py-4 px-6 bg-black-200 text-white text-center text-2xl tracking-widest rounded-lg border border-white-500 focus:outline-none focus:border-white-600"
                      maxLength="6"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setStage('request');
                        setOtp('');
                        setError('');
                        setSuccess('');
                      }}
                      className="flex-1 py-3 px-6 bg-black-200 text-white rounded-lg hover:bg-black-100 transition-colors border border-white-500"
                    >
                      Request New Code
                    </button>
                    
                    <button
                      onClick={verifyOTP}
                      disabled={loading || otp.length !== 6}
                      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                        loading || otp.length !== 6
                          ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                          : 'bg-white-500 hover:bg-white-600 text-black'
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg">
                  <p className="text-green-400 text-sm text-center">{success}</p>
                </div>
              )}
            </div>

            <div className="mt-8 text-center">
              <p className="text-white-500 text-sm">
                OTP will be sent to harry@harryrose.dev
              </p>
              <p className="text-white-500 text-sm mt-2">
                Code expires in 10 minutes
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PublicationAuth;
