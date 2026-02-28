import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1d3a] to-[#0a0a1a] text-white">
      
      {/* ===== SIMPLE BACKGROUND ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Matrix-like code rain effect */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-cyan-500/20 text-xs font-mono whitespace-nowrap"
                 style={{ left: `${i * 5}%`, top: '0', animation: `matrixRain ${15 + i}s linear infinite` }}>
              01001110 01000101 01010100 01010111 01001111 01010010 01001011
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes matrixRain {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .pattern-bg {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
      
      {/* ===== NAVIGATION BAR ===== */}
      <nav className="container mx-auto px-4 py-4 lg:py-6 relative z-10">
        <div className="flex justify-between items-center backdrop-blur-sm bg-[#1a1d3a]/30 rounded-2xl px-6 py-3 border border-cyan-500/20">
          
          {/* Logo with icon */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
              <span className="text-2xl filter drop-shadow-lg">🕵️</span>
            </div>
            <div>
              <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                CRIME SOLVER
              </span>
              <span className="block text-xs text-gray-400 tracking-widest">CYBER INVESTIGATION PLATFORM</span>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-white hover:text-cyan-400 transition font-medium relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#about" className="text-gray-300 hover:text-cyan-400 transition">About</a>
            <a href="#features" className="text-gray-300 hover:text-cyan-400 transition">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition">How It Works</a>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowLogin(true)}
              className="hidden md:block bg-transparent border-2 border-cyan-500 text-cyan-400 px-6 py-2 rounded-full 
                       hover:bg-cyan-500 hover:text-white transition-all duration-300 font-medium hover:shadow-lg hover:shadow-cyan-500/30"
            >
              Sign In
            </button>
            
            <button 
              onClick={() => setShowSignUp(true)}
              className="hidden md:block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full 
                       hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg shadow-cyan-500/30
                       hover:shadow-cyan-500/50 transform hover:scale-105"
            >
              Start Free Trial
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-white hover:text-cyan-400 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 bg-[#1a1d3a]/95 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/30">
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-white hover:text-cyan-400 transition py-2 px-4 rounded-lg hover:bg-white/5">Home</a>
              <a href="#about" className="text-gray-300 hover:text-cyan-400 transition py-2 px-4 rounded-lg hover:bg-white/5">About</a>
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition py-2 px-4 rounded-lg hover:bg-white/5">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-cyan-400 transition py-2 px-4 rounded-lg hover:bg-white/5">How It Works</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-cyan-500/30">
                <button 
                  onClick={() => { setShowLogin(true); setShowMobileMenu(false); }}
                  className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-4 py-3 rounded-xl 
                           hover:bg-cyan-500 hover:text-white transition w-full"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => { setShowSignUp(true); setShowMobileMenu(false); }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-3 rounded-xl 
                           hover:from-cyan-600 hover:to-blue-700 transition w-full font-medium"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <div className="container mx-auto px-4 mt-12 lg:mt-20 text-center relative z-10">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            CRIME SOLVER
          </span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <p className="text-lg md:text-xl lg:text-2xl text-cyan-400 tracking-widest font-light uppercase">
            Interactive Cyber Investigation Platform
          </p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>
        
        <p className="text-gray-300 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed px-4 mb-12">
          Step into the role of a digital investigator and solve realistic cyber incidents inside a 
          <span className="text-cyan-400 font-semibold"> simulated investigation environment</span>. 
          Analyze system logs, trace suspicious activity, connect digital evidence, and submit professional 
          investigation reports.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mt-8">
          <button 
            onClick={() => setShowSignUp(true)}
            className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-full font-semibold 
                     hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-cyan-500/30 
                     hover:shadow-cyan-500/50 transform hover:scale-105 flex items-center gap-3 text-lg"
          >
            <span>Start Investigating</span>
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </button>
          <button 
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-10 py-4 rounded-full font-semibold 
                     hover:bg-cyan-500 hover:text-white transition-all duration-300 text-lg backdrop-blur-sm"
          >
            Explore Platform
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>No Experience Needed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Realistic Scenarios</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Professional Tools</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">✓</span>
            <span>Track Your Progress</span>
          </div>
        </div>
      </div>

      {/* ===== ABOUT SECTION - PROFESSIONAL LAYOUT ===== */}
      <div id="about" className="container mx-auto px-4 mt-24 lg:mt-32 relative z-10">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold tracking-widest text-sm uppercase">About The Platform</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            What is Crime Solver?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Description */}
          <div className="space-y-6">
            <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20">
              <p className="text-gray-300 text-lg leading-relaxed">
                Crime Solver is an <span className="text-cyan-400 font-semibold">interactive web-based mystery and cybersecurity investigation game</span> that simulates real-world cyber incidents in a controlled digital environment.
              </p>
            </div>
            
            <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20">
              <p className="text-gray-300 text-lg leading-relaxed">
                Players must <span className="text-cyan-400">examine digital evidence, analyze activity logs, identify suspicious patterns,</span> and use professional investigation tools to solve each case.
              </p>
            </div>
            
            <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/20">
              <p className="text-gray-300 text-lg leading-relaxed">
                The goal is not guessing — it's <span className="text-cyan-400 font-semibold">logical reasoning and evidence-based decision making</span> that mirrors real cybersecurity workflows.
              </p>
            </div>
          </div>

          {/* Right Column - Core Principles */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-2">Evidence-Based</h3>
              <p className="text-gray-400 text-sm">Every decision backed by data, no guessing allowed</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-2">Logical Thinking</h3>
              <p className="text-gray-400 text-sm">Train your investigation mindset with real scenarios</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="text-xl font-semibold text-white mb-2">File Analysis</h3>
              <p className="text-gray-400 text-sm">Examine digital evidence and uncover hidden clues</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 p-6 rounded-xl border border-cyan-500/30 backdrop-blur-sm">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="text-xl font-semibold text-white mb-2">Terminal Commands</h3>
              <p className="text-gray-400 text-sm">Investigate like a pro with command-line tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES SECTION - PROFESSIONAL LAYOUT ===== */}
      <div id="features" className="container mx-auto px-4 mt-24 lg:mt-32 relative z-10">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold tracking-widest text-sm uppercase">Investigation Tools</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Professional Investigation Environment
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg">
            Inside the game, players work within a simulated investigation OS with professional-grade tools
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* File Explorer */}
          <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all group hover:transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">File Explorer</h3>
            <p className="text-gray-400">Navigate through evidence folders, discover hidden files, and access case data with a realistic file system interface.</p>
          </div>

          {/* Log Viewer */}
          <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all group hover:transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Log Viewer</h3>
            <p className="text-gray-400">Examine system logs with advanced filtering, spot anomalies, and trace suspicious activities across timelines.</p>
          </div>

          {/* Investigation Terminal */}
          <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all group hover:transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">💻</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Investigation Terminal</h3>
            <p className="text-gray-400">Use real command-line tools like cd, ls, cat, grep to dig deeper into evidence and uncover hidden clues.</p>
          </div>

          {/* Network Scanner */}
          <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all group hover:transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🌐</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Network Scanner</h3>
            <p className="text-gray-400">Trace IP addresses, perform DNS lookups, and map out attacker infrastructure.</p>
          </div>

          {/* Hash Verifier */}
          <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all group hover:transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Hash Verifier</h3>
            <p className="text-gray-400">Verify file integrity and authenticate evidence using cryptographic hash matching.</p>
          </div>

          {/* Case Notes */}
          <div className="bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all group hover:transform hover:-translate-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">Case Notes</h3>
            <p className="text-gray-400">Document findings, build timelines, and submit professional investigation reports.</p>
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <div id="how-it-works" className="container mx-auto px-4 mt-24 lg:mt-32 relative z-10">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold tracking-widest text-sm uppercase">The Process</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            How Investigation Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-5 gap-4 relative">
          {/* Progress Line */}
          <div className="absolute top-16 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 hidden md:block"></div>
          
          {/* Steps */}
          {[
            { number: '01', title: 'Select Case', desc: 'Choose from multiple investigation scenarios' },
            { number: '02', title: 'Enter Environment', desc: 'Access the simulated investigation OS' },
            { number: '03', title: 'Analyze Evidence', desc: 'Use tools to examine digital clues' },
            { number: '04', title: 'Discover Findings', desc: 'Uncover key evidence and earn XP' },
            { number: '05', title: 'Submit Report', desc: 'Document conclusions and solve the case' }
          ].map((step, index) => (
            <div key={index} className="text-center relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg shadow-cyan-500/30">
                {step.number}
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-16 p-8 bg-[#1a1d3a]/50 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">5+</div>
            <div className="text-gray-400 mt-1">Investigation Tools</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">6</div>
            <div className="text-gray-400 mt-1">Discoveries Per Case</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">15</div>
            <div className="text-gray-400 mt-1">XP Per Discovery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-400">100%</div>
            <div className="text-gray-400 mt-1">Evidence-Based</div>
          </div>
        </div>
      </div>

      {/* ===== SKILLS SECTION ===== */}
      <div className="container mx-auto px-4 mt-24 lg:mt-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-cyan-400 font-semibold tracking-widest text-sm uppercase">Skills You Develop</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Think Like an Investigator
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              While playing, you naturally develop critical thinking skills used by real cybersecurity professionals
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { skill: 'Analytical Thinking', desc: 'Break down complex incidents' },
                { skill: 'Pattern Recognition', desc: 'Spot anomalies in logs' },
                { skill: 'Logical Reasoning', desc: 'Connect evidence to conclusions' },
                { skill: 'Incident Investigation', desc: 'Follow forensic procedures' },
                { skill: 'Documentation', desc: 'Write professional reports' },
                { skill: 'Decision Making', desc: 'Choose based on evidence' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                    <span className="text-cyan-400 text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.skill}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-[#1a1d3a]/50 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30">
              <div className="text-6xl mb-6 text-center">🎯</div>
              <h3 className="text-2xl font-semibold text-center mb-4 text-white">Evidence-Based Progression</h3>
              <p className="text-gray-400 text-center">
                Unlike traditional mystery games, Crime Solver focuses on realistic scenarios where every conclusion must be backed by evidence you discover yourself.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-black/30 rounded-xl">
                  <div className="text-2xl mb-2">❌</div>
                  <div className="text-sm text-gray-400">No Guessing</div>
                </div>
                <div className="text-center p-4 bg-black/30 rounded-xl">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="text-sm text-gray-400">Evidence Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="container mx-auto px-4 mt-24 lg:mt-32 mb-20 relative z-10">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-sm"></div>
          <div className="absolute inset-0 pattern-bg opacity-20"></div>
          
          <div className="relative py-20 px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Ready to Start Investigating?
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg">
              Join thousands of investigators solving cyber mysteries. No experience required — just curiosity and logical thinking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowSignUp(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-4 rounded-full font-semibold 
                         hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-cyan-500/30 
                         hover:shadow-cyan-500/50 transform hover:scale-105 text-lg"
              >
                Start Free Trial
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="bg-transparent border-2 border-cyan-500 text-cyan-400 px-10 py-4 rounded-full font-semibold 
                         hover:bg-cyan-500 hover:text-white transition-all duration-300 text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="container mx-auto px-4 py-8 border-t border-cyan-500/20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-sm">🕵️</span>
            </div>
            <span className="font-bold text-white">CRIME SOLVER</span>
            <span className="text-gray-600 text-sm ml-2">© 2026</span>
          </div>
          <div className="flex gap-6 text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition">Privacy</a>
            <a href="#" className="hover:text-cyan-400 transition">Terms</a>
            <a href="#" className="hover:text-cyan-400 transition">Contact</a>
          </div>
          <div className="text-gray-600 text-sm">
            Interactive Cyber Investigation Platform
          </div>
        </div>
      </footer>

      {/* ===== SIGN IN MODAL ===== */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowLogin(false)}
          ></div>
          
          <div className="relative bg-[#1a1d3a] rounded-2xl w-full max-w-md p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-gray-400 mt-2">Sign in to continue your investigation</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              
              const formData = new FormData(e.target);
              const loginData = {
                email: formData.get('email'),
                password: formData.get('password')
              };

              try {
                const response = await fetch('http://localhost:5000/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(loginData)
                });

                const data = await response.json();

                if (response.ok) {
                  alert(`✅ Welcome back ${data.user.fullName}!`);
                  
                  localStorage.setItem('user', JSON.stringify({
                    _id: data.user._id,
                    fullName: data.user.fullName,
                    email: data.user.email,
                    rank: data.user.rank || 'Lead Investigator',
                    bio: data.user.bio || '',
                    avatar: data.user.avatar || '',
                    createdAt: data.user.createdAt,
                    role: data.user.role || 'user'
                  }));
                  
                  setShowLogin(false);
                  
                  if (data.user.role === 'admin') {
                    navigate('/admin');
                  } else {
                    navigate('/game-level');
                  }
                } else {
                  alert(`❌ ${data.message}`);
                }
              } catch (error) {
                console.error('❌ Connection error:', error);
                alert('❌ Could not connect to server. Make sure the backend is running!');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input 
                    type="email"
                    name="email"
                    required
                    placeholder="detective@crimesolver.com"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                             focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input 
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 
                             focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold 
                           hover:from-cyan-600 hover:to-blue-700 transition transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
                >
                  Sign In
                </button>
              </div>
            </form>

            <p className="text-center text-gray-400 mt-6">
              Don't have an account?{' '}
              <button 
                onClick={() => {
                  setShowLogin(false);
                  setShowSignUp(true);
                }}
                className="text-cyan-400 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ===== SIGN UP MODAL ===== */}
      {showSignUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSignUp(false)}
          ></div>
          
          <div className="relative bg-[#1a1d3a] rounded-2xl w-full max-w-md p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <button 
              onClick={() => setShowSignUp(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🕵️</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Join Crime Solver</h2>
              <p className="text-gray-400 mt-2">Start your detective journey today</p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              
              const formData = new FormData(e.target);
              const userData = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                password: formData.get('password')
              };

              const confirmPassword = formData.get('confirmPassword');
              if (userData.password !== confirmPassword) {
                alert('❌ Passwords do not match!');
                return;
              }

              if (userData.email === 'admin@crimesolver.com') {
                alert('❌ This email is reserved for admin use only!');
                return;
              }

              try {
                const response = await fetch('http://localhost:5000/api/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.ok) {
                  alert(`✅ Welcome ${userData.fullName}! Registration successful! You can now sign in.`);
                  setShowSignUp(false);
                  setShowLogin(true);
                } else {
                  alert(`❌ ${data.message}`);
                }
              } catch (error) {
                alert('❌ Could not connect to server!');
              }
            }}>
              <div className="space-y-4">
                <div>
                  <input 
                    type="text"
                    name="fullName"
                    required
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <input 
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <input 
                    type="password"
                    name="password"
                    required
                    minLength="6"
                    placeholder="Password (min. 6 characters)"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <input 
                    type="password"
                    name="confirmPassword"
                    required
                    placeholder="Confirm Password"
                    className="w-full px-4 py-3 bg-[#0a0a1a] border border-cyan-500/30 rounded-lg 
                             text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold 
                           hover:from-cyan-600 hover:to-blue-700 transition shadow-lg shadow-cyan-500/30"
                >
                  Create Account
                </button>
              </div>
            </form>

            <p className="text-center text-gray-400 mt-6">
              Already have an account?{' '}
              <button 
                onClick={() => {
                  setShowSignUp(false);
                  setShowLogin(true);
                }}
                className="text-cyan-400 hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;