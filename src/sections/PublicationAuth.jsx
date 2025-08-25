import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import serverManager from '../utils/serverManager';

const PublicationAuth = () => {
  const [stage, setStage] = useState('request'); // 'request' or 'verify'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [serverStatus, setServerStatus] = useState('stopped'); // 'stopped', 'starting', 'running', 'stopping'
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

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
    setServerStatus('starting');

    try {
      // Step 1: Check if controller is running
      await serverManager.ensureControllerRunning();
      
      // Step 2: Start the OTP server
      setSuccess('Starting authentication server...');
      await serverManager.startServer();
      
      // Step 3: Wait for server to be ready
      setSuccess('Waiting for server to be ready...');
      await serverManager.waitForServer();
      
      setServerStatus('running');
      setSuccess('Server ready! Sending OTP...');
      
      // Step 4: Send OTP request
      const response = await fetch(`${API_URL}/api/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('OTP sent to harry@harryrose.dev');
        setStage('verify');
      } else {
        setError(data.message || 'Failed to send OTP');
        // If OTP sending failed, stop the server
        setServerStatus('stopping');
        await serverManager.stopServer();
        setServerStatus('stopped');
      }
    } catch (err) {
      console.error('Error in OTP process:', err);
      
      if (err.message.includes('Server controller')) {
        setError(
          'Please start the server controller first:\n' +
          '1. Open a new terminal\n' +
          '2. Run: cd server-controller\n' +
          '3. Run: npm install && npm start'
        );
      } else if (err.message.includes('Server failed to become ready')) {
        setError('Authentication server failed to start. Please try again.');
      } else {
        setError('Network error. Please try again.');
      }
      
      setServerStatus('stopped');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token with 24-hour expiry
        localStorage.setItem('authToken', data.token);
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        localStorage.setItem('authTokenExpiry', expiryTime.toString());
        
        // Stop the server after successful authentication
        setSuccess('Authentication successful! Stopping server...');
        setServerStatus('stopping');
        
        try {
          await serverManager.stopServer();
          setServerStatus('stopped');
          console.log('Server stopped successfully');
        } catch (stopError) {
          console.warn('Failed to stop server:', stopError);
          // Continue anyway as authentication was successful
        }
        
        navigate('/publications/manage');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
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
                onClick={() => navigate('/publications')} 
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>←</span> Back to Publications
              </button>
            </div>
          </div>
        </nav>
        
        <section className="c-space pt-32 pb-20">
          <div className="max-w-md mx-auto">
            <div className="bg-black-300 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Article Management
              </h1>

              {/* Server Status Indicator */}
              {serverStatus !== 'stopped' && (
                <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg">
                  <p className="text-blue-400 text-sm text-center flex items-center justify-center gap-2">
                    {serverStatus === 'starting' && (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        Starting authentication server...
                      </>
                    )}
                    {serverStatus === 'running' && (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Authentication server running
                      </>
                    )}
                    {serverStatus === 'stopping' && (
                      <>
                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                        Stopping server...
                      </>
                    )}
                  </p>
                </div>
              )}

              {stage === 'request' ? (
                <div className="space-y-6">
                  <p className="text-white-600 text-center">
                    Click below to start the authentication server and receive an OTP code.
                  </p>
                  
                  <button
                    onClick={sendOTP}
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-lg font-medium transition-all ${
                      loading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-white-500 hover:bg-white-600 text-black'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        {serverStatus === 'starting' ? 'Starting Server...' : 'Sending OTP...'}
                      </span>
                    ) : (
                      '🚀 Start Server & Send OTP'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
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
