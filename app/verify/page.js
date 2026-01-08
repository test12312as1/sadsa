'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Gift, Shield, Upload, CheckCircle, Clock, AlertCircle, MessageSquare, Wallet, Camera, Link as LinkIcon, ChevronRight, Star, Lock, Eye, Users, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';

// Demo available bonuses based on verification
const DEMO_BONUSES = [
  {
    id: 'bonus-001',
    casino: 'Stake',
    type: 'No Deposit',
    amount: '$500',
    requirement: '$50,000+ volume',
    wager: 'None',
    expires: '7 days',
    claimed: 12,
    color: '#22c55e'
  },
  {
    id: 'bonus-002',
    casino: 'Rollbit',
    type: 'Free Spins',
    amount: '200 Spins',
    requirement: '$25,000+ volume',
    wager: 'None',
    expires: '14 days',
    claimed: 34,
    color: '#ef4444'
  },
  {
    id: 'bonus-003',
    casino: 'Shuffle',
    type: 'Cash Bonus',
    amount: '$250',
    requirement: '$10,000+ volume',
    wager: 'None',
    expires: '30 days',
    claimed: 89,
    color: '#ec4899'
  },
  {
    id: 'bonus-004',
    casino: 'Gamdom',
    type: 'VIP Trial',
    amount: '1 Week',
    requirement: 'Platinum+ at any casino',
    wager: 'None',
    expires: '7 days',
    claimed: 23,
    color: '#eab308'
  }
];

const VERIFICATION_STEPS = [
  {
    id: 'wallet',
    title: 'Wallet Ownership',
    description: 'Prove you own the scanned wallet',
    icon: Wallet
  },
  {
    id: 'casino',
    title: 'Casino Activity',
    description: 'Screenshot of your casino account',
    icon: Camera
  },
  {
    id: 'chat',
    title: 'Username Match',
    description: 'Post in casino chat to verify username',
    icon: MessageSquare
  }
];

function VerifyContent() {
  const searchParams = useSearchParams();
  const walletParam = searchParams.get('wallet');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, in_progress, verified
  const [uploadedFiles, setUploadedFiles] = useState({
    wallet: null,
    casino: null,
    chat: null
  });
  const [formData, setFormData] = useState({
    casinoUsername: '',
    preferredCasino: 'Stake',
    chatMessage: ''
  });
  const [showBonuses, setShowBonuses] = useState(false);
  const [claimingBonus, setClaimingBonus] = useState(null);

  const handleFileUpload = (stepId, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles({
        ...uploadedFiles,
        [stepId]: {
          name: file.name,
          size: file.size,
          preview: URL.createObjectURL(file)
        }
      });
    }
  };

  const handleNextStep = () => {
    if (currentStep < VERIFICATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setVerificationStatus('in_progress');
    } else {
      setVerificationStatus('verified');
      setShowBonuses(true);
    }
  };

  const handleClaimBonus = (bonusId) => {
    setClaimingBonus(bonusId);
    // Simulate claim process
    setTimeout(() => {
      setClaimingBonus(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Header */}
      <header className="border-b border-gray-800/50 bg-[#0a0a14]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft size={18} />
                <span className="text-sm">Back</span>
              </Link>
              <div className="w-px h-6 bg-gray-700" />
              <div className="flex items-center gap-2">
                <Gift className="text-red-400" size={20} />
                <span className="text-white font-semibold">VIP Verification</span>
              </div>
            </div>
            {verificationStatus === 'verified' && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle size={16} />
                Verified
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Gift className="text-red-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-300 font-medium mb-1">Unlock Exclusive Bonuses</h3>
              <p className="text-sm text-gray-400">
                Verify your VIP status to access no-deposit, no-wager bonuses from top casinos. 
                Your deposit history is valuable - casinos want players like you!
              </p>
            </div>
          </div>
        </div>

        {!showBonuses ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Progress Steps */}
            <div className="lg:col-span-1">
              <div className="bg-[#12121c] rounded-xl p-5 border border-gray-800/50 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Verification Steps</h3>
                <div className="space-y-3">
                  {VERIFICATION_STEPS.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index < currentStep || (index === currentStep && uploadedFiles[step.id]);
                    const isCurrent = index === currentStep;
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          isCurrent ? 'bg-red-500/10 border border-red-500/30' :
                          isCompleted ? 'bg-green-500/10 border border-green-500/30' :
                          'bg-[#1a1a2e] border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isCompleted ? 'bg-green-500/20' :
                          isCurrent ? 'bg-red-500/20' :
                          'bg-[#252540]'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="text-green-400" size={16} />
                          ) : (
                            <StepIcon className={isCurrent ? 'text-red-400' : 'text-gray-500'} size={16} />
                          )}
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${
                            isCompleted ? 'text-green-300' :
                            isCurrent ? 'text-white' :
                            'text-gray-500'
                          }`}>
                            {step.title}
                          </div>
                          <div className="text-xs text-gray-500">{step.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connected Wallet */}
                <div className="mt-6 pt-6 border-t border-gray-800/50">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Connected Wallet</div>
                  <div className="font-mono text-xs text-gray-400 bg-[#1a1a2e] rounded p-2 break-all">
                    {walletParam || '0x742d35Cc6634...f0bEb'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Current Step Form */}
            <div className="lg:col-span-2">
              <div className="bg-[#12121c] rounded-xl p-6 border border-gray-800/50">
                {/* Step 0: Wallet Ownership */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Prove Wallet Ownership</h2>
                      <p className="text-sm text-gray-400">
                        Sign a message with your wallet or send a small test transaction to verify ownership.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-700 hover:border-red-500/50 cursor-pointer transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-3 group-hover:bg-red-500/30">
                          <Wallet className="text-red-400" size={20} />
                        </div>
                        <div className="text-sm font-medium text-white mb-1">Sign Message</div>
                        <div className="text-xs text-gray-500">Free - Sign with MetaMask/WalletConnect</div>
                      </div>

                      <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-700 hover:border-red-500/50 cursor-pointer transition-all group">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center mb-3 group-hover:bg-red-500/30">
                          <LinkIcon className="text-red-400" size={20} />
                        </div>
                        <div className="text-sm font-medium text-white mb-1">Test Transaction</div>
                        <div className="text-xs text-gray-500">Send 0.0001 ETH to verify address</div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                        <div className="text-sm text-gray-300">
                          <strong className="text-yellow-300">Demo Mode:</strong> In production, this would connect to your wallet. For now, click continue to proceed.
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleNextStep}
                      className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Continue
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}

                {/* Step 1: Casino Activity */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Casino Account Verification</h2>
                      <p className="text-sm text-gray-400">
                        Upload a screenshot of your casino account showing your username and VIP level.
                      </p>
                    </div>

                    {/* Casino Selection */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Which casino are you verifying?</label>
                      <select
                        value={formData.preferredCasino}
                        onChange={(e) => setFormData({ ...formData, preferredCasino: e.target.value })}
                        className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Stake">Stake</option>
                        <option value="Rollbit">Rollbit</option>
                        <option value="Shuffle">Shuffle</option>
                        <option value="Roobet">Roobet</option>
                        <option value="Gamdom">Gamdom</option>
                        <option value="Duel">Duel</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Your casino username</label>
                      <input
                        type="text"
                        placeholder="e.g., CryptoWhale2024"
                        value={formData.casinoUsername}
                        onChange={(e) => setFormData({ ...formData, casinoUsername: e.target.value })}
                        className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Screenshot of account (showing VIP level)</label>
                      <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-red-500/50 transition-colors">
                        {uploadedFiles.casino ? (
                          <div className="space-y-2">
                            <CheckCircle className="text-green-400 mx-auto" size={32} />
                            <div className="text-sm text-white">{uploadedFiles.casino.name}</div>
                            <button
                              onClick={() => setUploadedFiles({ ...uploadedFiles, casino: null })}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="text-gray-500 mx-auto mb-2" size={32} />
                            <div className="text-sm text-gray-400 mb-2">Drag & drop or click to upload</div>
                            <div className="text-xs text-gray-500">PNG, JPG up to 10MB</div>
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
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        Continue
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Chat Verification */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white mb-2">Username Verification</h2>
                      <p className="text-sm text-gray-400">
                        Post a specific message in the casino's general chat to verify you control the account.
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className="bg-[#1a1a2e] rounded-xl p-5 border border-gray-700 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">1</div>
                        <div className="text-sm text-gray-300">Go to {formData.preferredCasino}'s general chat</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">2</div>
                        <div className="text-sm text-gray-300">Post this exact message:</div>
                      </div>
                      <div className="bg-[#0f0f1a] rounded-lg p-4 font-mono text-sm text-red-300 break-all">
                        GamStart Verify: GS-{Date.now().toString(36).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold">3</div>
                        <div className="text-sm text-gray-300">Screenshot the chat showing your username and message</div>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Screenshot of chat message</label>
                      <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-red-500/50 transition-colors relative">
                        {uploadedFiles.chat ? (
                          <div className="space-y-2">
                            <CheckCircle className="text-green-400 mx-auto" size={32} />
                            <div className="text-sm text-white">{uploadedFiles.chat.name}</div>
                            <button
                              onClick={() => setUploadedFiles({ ...uploadedFiles, chat: null })}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="text-gray-500 mx-auto mb-2" size={32} />
                            <div className="text-sm text-gray-400 mb-2">Drag & drop or click to upload</div>
                            <div className="text-xs text-gray-500">PNG, JPG up to 10MB</div>
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
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1 py-3 bg-[#1a1a2e] hover:bg-[#252540] text-gray-300 rounded-lg font-medium transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        Complete Verification
                        <CheckCircle size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Verified - Show Bonuses */
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-400" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verification Complete!</h2>
              <p className="text-gray-400 mb-4">
                You're now a verified VIP. Casinos can see your deposit history and offer you exclusive bonuses.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
                <Star className="text-yellow-400" size={16} />
                <span className="text-green-300 font-medium">VIP Status: Verified</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 text-center">
                <div className="text-2xl font-bold text-red-400">{DEMO_BONUSES.length}</div>
                <div className="text-xs text-gray-500">Available Bonuses</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 text-center">
                <div className="text-2xl font-bold text-white">$1,250+</div>
                <div className="text-xs text-gray-500">Total Value</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 text-center">
                <div className="text-2xl font-bold text-green-400">0x</div>
                <div className="text-xs text-gray-500">Wager Required</div>
              </div>
              <div className="bg-[#12121c] rounded-xl p-4 border border-gray-800/50 text-center">
                <div className="text-2xl font-bold text-purple-400">Instant</div>
                <div className="text-xs text-gray-500">Credit Time</div>
              </div>
            </div>

            {/* Available Bonuses */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Available Bonuses For You</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEMO_BONUSES.map((bonus) => (
                  <div
                    key={bonus.id}
                    className="bg-[#12121c] rounded-xl border border-gray-800/50 overflow-hidden hover:border-gray-700 transition-all"
                  >
                    {/* Header */}
                    <div 
                      className="px-4 py-3 border-b border-gray-800/50"
                      style={{ backgroundColor: `${bonus.color}15` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: bonus.color }}
                          />
                          <span className="font-semibold text-white">{bonus.casino}</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300">
                          {bonus.type}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                      <div className="text-center py-4">
                        <div className="text-3xl font-bold text-white">{bonus.amount}</div>
                        <div className="text-xs text-gray-500 mt-1">{bonus.requirement}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-[#1a1a2e] rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Wager</div>
                          <div className="text-green-400 font-medium">{bonus.wager}</div>
                        </div>
                        <div className="bg-[#1a1a2e] rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">Expires</div>
                          <div className="text-gray-300 font-medium">{bonus.expires}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {bonus.claimed} claimed
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Limited time
                        </span>
                      </div>

                      <button
                        onClick={() => handleClaimBonus(bonus.id)}
                        disabled={claimingBonus === bonus.id}
                        className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {claimingBonus === bonus.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Claiming...
                          </>
                        ) : (
                          <>
                            <Gift size={16} />
                            Claim Bonus
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VIP Dashboard Link */}
            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Want More Bonuses?</h3>
                  <p className="text-sm text-gray-400">
                    Visit the VIP Dashboard to see all available offers from casinos looking for verified players.
                  </p>
                </div>
                <Link
                  href="/vip-dashboard"
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  VIP Dashboard
                  <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Loading fallback component
function VerifyLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading verification...</p>
      </div>
    </div>
  );
}

// Wrap in Suspense boundary for useSearchParams
export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}

