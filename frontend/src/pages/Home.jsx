import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="w-full border-b border-white/10 backdrop-blur-lg bg-black/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-[#D4AF37]">
              ENFIANCE
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#vision" className="hover:text-white transition">
              Vision
            </a>
            <a href="#wallet" className="hover:text-white transition">
              Wallet
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </div>

          <button className="bg-[#D4AF37] hover:bg-[#e8c85a] transition text-black font-semibold px-5 py-2 rounded-xl shadow-lg">
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#050816] to-black opacity-90"></div>

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full text-sm mb-6">
              Modern Financial Infrastructure
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Modern Payments
              <span className="block text-[#D4AF37]">
                Without Borders
              </span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed max-w-xl mb-10">
              Enfiance is building a next-generation financial platform that makes sending,
              receiving, and managing money faster, simpler, and more accessible for people
              and businesses around the world.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="bg-[#D4AF37] hover:bg-[#e8c85a] text-black px-8 py-4 rounded-2xl font-semibold shadow-xl transition">
                Create Wallet
              </button>

              <button className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-2xl font-semibold transition backdrop-blur-sm bg-white/5">
                Learn More
              </button>
            </div>
          </div>

          {/* HERO CARD */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#D4AF37]/20 blur-3xl rounded-full"></div>

            <div className="relative bg-[#0B1120] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-gray-400 text-sm">Available Balance</p>
                  <h2 className="text-4xl font-bold mt-2">25,450 GRD</h2>
                </div>

                <div className="bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-xl text-sm">
                  ENFI Wallet
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Transfer</p>
                      <p className="font-semibold mt-1">Global Payment</p>
                    </div>
                    <p className="text-green-400">Completed</p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">QR Payment</p>
                      <p className="font-semibold mt-1">Merchant Checkout</p>
                    </div>
                    <p className="text-[#D4AF37]">Processing</p>
                  </div>
                </div>

                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Security</p>
                      <p className="font-semibold mt-1">Encrypted Infrastructure</p>
                    </div>
                    <p className="text-blue-400">Protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-4">
              Platform Features
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built For The Future Of Finance
            </h2>

            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Enfiance combines modern payment technology, secure wallet infrastructure,
              and global accessibility into one connected financial ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/40 transition">
              <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                ⚡
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Instant Transfers
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Send and receive money globally with modern payment rails designed for speed and reliability.
              </p>
            </div>

            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/40 transition">
              <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                🔒
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Secure Wallets
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Enterprise-grade infrastructure designed to protect users and businesses at scale.
              </p>
            </div>

            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-8 hover:border-[#D4AF37]/40 transition">
              <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-6 text-2xl">
                🌎
              </div>

              <h3 className="text-2xl font-bold mb-4">
                Global Access
              </h3>

              <p className="text-gray-400 leading-relaxed">
                Financial tools designed to empower underserved communities and modern global commerce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section id="vision" className="py-24 px-6 bg-black/30 border-y border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-6">
            Our Vision
          </p>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-10">
            Building Financial Access
            <span className="block text-[#D4AF37] mt-3">
              For The Modern World
            </span>
          </h2>

          <p className="text-gray-300 text-xl leading-relaxed max-w-4xl mx-auto">
            Enfiance was created with a vision to simplify global payments and create more accessible financial opportunities for individuals, families, and businesses worldwide.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section id="wallet" className="py-28 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-[#0B1120] to-black border border-white/10 rounded-[40px] p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl"></div>

          <div className="relative z-10">
            <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-sm mb-6">
              Join Enfiance
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              Experience The Next Generation
              <span className="block text-[#D4AF37] mt-2">
                Of Financial Technology
              </span>
            </h2>

            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10">
              Start exploring the Enfiance ecosystem and discover a faster, more connected approach to digital finance.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <button className="bg-[#D4AF37] hover:bg-[#e8c85a] text-black font-bold px-8 py-4 rounded-2xl transition shadow-xl">
                Launch Wallet
              </button>

              <button className="border border-white/20 hover:border-white/40 px-8 py-4 rounded-2xl font-semibold transition backdrop-blur-sm bg-white/5">
                Explore Platform
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-2xl font-bold text-[#D4AF37]">
              ENFIANCE
            </h3>

            <p className="text-gray-500 mt-2">
              Modern payments without borders.
            </p>
          </div>

          <div className="flex items-center gap-6 text-gray-400 text-sm">
            <a href="#features" className="hover:text-white transition">
              Features
            </a>

            <a href="#vision" className="hover:text-white transition">
              Vision
            </a>

            <a href="#wallet" className="hover:text-white transition">
              Wallet
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
