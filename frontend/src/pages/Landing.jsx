import Hero, { FeaturesSection, ShowcaseSection } from '../components/Hero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineChartBar, HiOutlineMicrophone, HiOutlineShieldCheck, HiOutlineDeviceMobile, HiOutlineMoon } from 'react-icons/hi';

const highlights = [
  { icon: HiOutlineLightningBolt, title: 'Real-Time Tracking', desc: 'Log meals and workouts instantly with our lightning-fast interface.' },
  { icon: HiOutlineChartBar, title: 'Smart Analytics', desc: 'Weekly & monthly charts that reveal your real progress trends.' },
  { icon: HiOutlineMicrophone, title: 'Voice Logging', desc: 'Say "log 200g chicken" and we auto-parse and save it for you.' },
  { icon: HiOutlineShieldCheck, title: 'Bank-Grade Security', desc: 'JWT auth, encrypted passwords, and rate-limited APIs.' },
  { icon: HiOutlineDeviceMobile, title: 'Mobile First', desc: 'Perfectly responsive design that looks stunning on every device.' },
  { icon: HiOutlineMoon, title: 'Dark & Light Mode', desc: 'Premium themes with automatic system preference detection.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturesSection />
      <ShowcaseSection />

      {/* Highlights Section */}
      <section id="about" className="section-padding bg-gray-50 dark:bg-surface-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
              Why{' '}
              <span className="gradient-text">FitLife</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Built with cutting-edge technology and designed with obsessive attention to detail.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card group"
                >
                  <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-500/10 w-fit mb-4 group-hover:shadow-neon transition-shadow duration-500">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-900 dark:to-surface-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=40')] bg-cover bg-center opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to Transform Your Life?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg">
              Join thousands of users achieving their fitness goals with FitLife.
            </p>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-950 border-t border-gray-100 dark:border-white/5 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12 L10 16 L18 8" /></svg>
              </div>
              <span className="font-display font-bold text-lg">
                <span className="text-primary-600 dark:text-primary-400">Fit</span>
                <span className="text-accent-600 dark:text-accent-400">Life</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © 2024 FitLife. Built with ❤️ for fitness enthusiasts.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
