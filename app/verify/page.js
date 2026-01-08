'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Gift, Upload, CheckCircle, Clock, AlertCircle, MessageSquare, Wallet, Camera, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Twitter/X Icon
const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Discord Icon
const DiscordIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

const VERIFICATION_STEPS = [
  {
    id: 'wallet',
    title: 'Wallet Ownership',
    description: 'Prove you own the scanned wallet',
    icon: Wallet
  },
  {
    id: 'casino',
    title: 'Casino Screenshot',
    description: 'Upload proof of your VIP status',
    icon: Camera
  },
  {
    id: 'chat',
    title: 'Username Verification',
    description: 'Verify your casino username',
    icon: MessageSquare
  }
];

function VerifyContent() {
  const searchParams = useSearchParams();
  const walletParam = searchParams.get('wallet');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [formData, setFormData] = useState({
    casinoUsername: '',
    preferredCasino: 'Stake',
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    casino: null,
    chat: null
  });

  const handleFileUpload = (stepId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles({
        ...uploadedFiles,
        [stepId]: { name: file.name }
      });
    }
  };

  const handleNext = () => {
    if (currentStep < VERIFICATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setVerificationComplete(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg hover:opacity-80 transition-opacity">
                <span className="text-purple-500">◈</span>
                GamStart
              </Link>
              
              <div className="flex items-center bg-[#1a1a2e] rounded-lg p-0.5">
                <Link href="/" className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-all">
                  Players
                </Link>
                <Link href="/?tab=platforms" className="px-4 py-1.5 rounded-md text-sm font-medium text-gray-400 hover:text-gray-300 transition-all">
                  Casinos
                </Link>
              </div>

              <div className="hidden md:flex items-center gap-1">
                <Link href="/marketplace" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  Account Marketplace
                </Link>
                <Link href="/vip-dashboard" className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">
                  VIP Offers
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                <TwitterIcon size={18} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-white transition-colors">
                <DiscordIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!verificationComplete ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">VIP Verification</h1>
              <p className="text-sm text-gray-500">Complete verification to receive personalized casino offers</p>
            </div>

            {/* Progress */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {VERIFICATION_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep 
                      ? 'bg-purple-500 text-white' 
                      : index === currentStep 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500'
                        : 'bg-[#1a1a2e] text-gray-500'
                  }`}>
                    {index < currentStep ? <CheckCircle size={14} /> : index + 1}
                  </div>
                  {index < VERIFICATION_STEPS.length - 1 && (
                    <div className={`w-12 h-0.5 mx-1 ${
                      index < currentStep ? 'bg-purple-500' : 'bg-[#1a1a2e]'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
              {/* Step 0: Wallet */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-2">Wallet Ownership</h2>
                    <p className="text-sm text-gray-400">
                      Verify you own the wallet that was scanned.
                    </p>
                  </div>

                  {walletParam && (
                    <div className="bg-[#1a1a2e] rounded-lg p-3">
                      <div className="text-xs text-gray-500 mb-1">Connected Wallet</div>
                      <div className="font-mono text-sm text-gray-300 break-all">{walletParam}</div>
                    </div>
                  )}

                  <div className="bg-[#1a1a2e] rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-3">Choose verification method:</div>
                    <div className="space-y-2">
                      <button className="w-full p-3 bg-[#12121c] hover:bg-[#252540] rounded-lg border border-gray-700 hover:border-purple-500/50 text-left transition-all">
                        <div className="text-sm text-white font-medium">Sign Message</div>
                        <div className="text-xs text-gray-500">Free - Sign with your wallet</div>
                      </button>
                      <button className="w-full p-3 bg-[#12121c] hover:bg-[#252540] rounded-lg border border-gray-700 hover:border-purple-500/50 text-left transition-all">
                        <div className="text-sm text-white font-medium">Micro Transaction</div>
                        <div className="text-xs text-gray-500">Send 0.0001 ETH to verify</div>
                      </button>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={14} />
                      <p className="text-xs text-gray-400">
                        <span className="text-yellow-400">Demo:</span> Click continue to proceed without actual verification.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {/* Step 1: Casino Screenshot */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-2">Casino Screenshot</h2>
                    <p className="text-sm text-gray-400">
                      Upload a screenshot showing your VIP status.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Casino</label>
                    <select
                      value={formData.preferredCasino}
                      onChange={(e) => setFormData({ ...formData, preferredCasino: e.target.value })}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
                    >
                      <option>Stake</option>
                      <option>Rollbit</option>
                      <option>Shuffle</option>
                      <option>Roobet</option>
                      <option>Gamdom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Username</label>
                    <input
                      type="text"
                      placeholder="Your casino username"
                      value={formData.casinoUsername}
                      onChange={(e) => setFormData({ ...formData, casinoUsername: e.target.value })}
                      className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Screenshot</label>
                    <div className="border border-dashed border-gray-700 rounded-lg p-6 text-center relative hover:border-purple-500/50 transition-colors">
                      {uploadedFiles.casino ? (
                        <div className="space-y-1">
                          <CheckCircle className="text-purple-400 mx-auto" size={24} />
                          <div className="text-sm text-white">{uploadedFiles.casino.name}</div>
                          <button
                            onClick={() => setUploadedFiles({ ...uploadedFiles, casino: null })}
                            className="text-xs text-gray-500 hover:text-purple-400"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-gray-500 mx-auto mb-2" size={24} />
                          <div className="text-sm text-gray-400">Click to upload</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('casino', e)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="flex-1 py-2.5 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Continue
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Chat Verification */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white mb-2">Username Verification</h2>
                    <p className="text-sm text-gray-400">
                      Post a message in casino chat to verify your username.
                    </p>
                  </div>

                  <div className="bg-[#1a1a2e] rounded-lg p-4 space-y-3">
                    <div className="text-sm text-gray-400">Post this in {formData.preferredCasino}'s chat:</div>
                    <div className="bg-[#0f0f1a] rounded p-3 font-mono text-sm text-purple-300 break-all">
                      GamStart Verify: GS-{Date.now().toString(36).toUpperCase().slice(0, 6)}
                    </div>
                    <div className="text-xs text-gray-500">Then screenshot the chat showing your message</div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Chat Screenshot</label>
                    <div className="border border-dashed border-gray-700 rounded-lg p-6 text-center relative hover:border-purple-500/50 transition-colors">
                      {uploadedFiles.chat ? (
                        <div className="space-y-1">
                          <CheckCircle className="text-purple-400 mx-auto" size={24} />
                          <div className="text-sm text-white">{uploadedFiles.chat.name}</div>
                          <button
                            onClick={() => setUploadedFiles({ ...uploadedFiles, chat: null })}
                            className="text-xs text-gray-500 hover:text-purple-400"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-gray-500 mx-auto mb-2" size={24} />
                          <div className="text-sm text-gray-400">Click to upload</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('chat', e)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-2.5 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Complete
                      <CheckCircle size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Verification Complete */
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-purple-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Submitted</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Your verification is being reviewed. You'll receive offers from casinos once approved.
            </p>
            <Link
              href="/vip-dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors"
            >
              View VIP Dashboard
              <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 bg-[#0a0a14]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="text-gray-500 text-sm">© 2026 GamStart</div>
            <div className="flex items-center gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <TwitterIcon size={16} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                <DiscordIcon size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function VerifyLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}




