import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineArrowRight, HiOutlineChevronDown } from 'react-icons/hi';

// Curated high-quality fitness images from Unsplash
const heroImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1920&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1920&q=80',
];

const featureImages = [
  {
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    alt: 'Healthy meal prep with fresh vegetables',
    label: 'Nutrition Tracking'
  },
  {
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
    alt: 'Person doing strength training workout',
    label: 'Workout Logging'
  },
  {
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80',
    alt: 'Runner tracking progress outdoors',
    label: 'Progress Analytics'
  }
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '500K+', label: 'Meals Tracked' },
  { value: '1M+', label: 'Workouts Logged' },
  { value: '98%', label: 'Satisfaction' },
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background */}
      {heroImages.map((img, index) => (
        <motion.div
          key={img}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentImage ? 1 : 0 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src={img}
            alt="Fitness background"
            className="w-full h-full object-cover"
            loading={index === 0 ? 'eager' : 'lazy'}
            onError={(e) => e.target.style.display = 'none'}
          />
        </motion.div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-primary-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-400/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container-custom w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/10 text-white/80 text-sm mb-8"
          >
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
            Your Fitness Journey Starts Here
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6"
          >
            Track Your Fitness.
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Transform Your Life.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Nutrition tracking, workout logging, and progress analytics — all in one beautiful, 
            AI-powered platform designed to help you reach your goals.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/auth/register"
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              Get Started Free
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              Login
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <HiOutlineChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>

      {/* Image indicator dots */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {heroImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentImage ? 'bg-white w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// Features section with fitness images
export const FeaturesSection = () => (
  <section id="features" className="section-padding bg-gray-50 dark:bg-surface-900">
    <div className="container-custom">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
          Everything You Need to{' '}
          <span className="gradient-text">Stay Fit</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Track your nutrition, log workouts, and monitor progress — all in one place.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {featureImages.map((feature, i) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-card group cursor-pointer overflow-hidden !p-0"
          >
            <div className="relative h-56 overflow-hidden">
              <img
                src={feature.url}
                alt={feature.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="badge-primary text-xs">{feature.label}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-display font-bold mb-2 text-gray-900 dark:text-white">
                {feature.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.label === 'Nutrition Tracking' && 'Search foods, track macros, and log meals with voice commands. Powered by the Edamam nutrition database.'}
                {feature.label === 'Workout Logging' && 'Browse exercises by muscle group, log sets and reps, and track your training volume over time.'}
                {feature.label === 'Progress Analytics' && 'Visualize your weight, BMI, and fitness trends with beautiful interactive charts.'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Showcase gallery section with more fitness images
export const ShowcaseSection = () => {
  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80', alt: 'Weight training session' },
    { url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80', alt: 'Yoga and flexibility' },
    { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', alt: 'Healthy food preparation' },
    { url: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80', alt: 'Running and cardio' },
    { url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&q=80', alt: 'Group fitness class' },
    { url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80', alt: 'Stretching exercise' },
    { url: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&q=80', alt: 'Outdoor running' },
    { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80', alt: 'Gym workout' },
  ];

  return (
    <section className="section-padding bg-white dark:bg-surface-950">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Your Fitness,{' '}
            <span className="gradient-text">Elevated</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Join thousands transforming their health with FitLife's premium tracking experience.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((img, i) => (
            <motion.div
              key={img.alt}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group ${
                i === 0 || i === 5 ? 'row-span-2 h-80 md:h-full' : 'h-40 md:h-56'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                onError={(e) => e.target.style.display = 'none'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">{img.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
