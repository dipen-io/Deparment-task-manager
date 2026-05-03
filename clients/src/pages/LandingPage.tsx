import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, Users, Zap, Shield } from "lucide-react";

export function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/" replace />;
  const features = [
    {
      icon: CheckCircle,
      title: "Task Management",
      description:
        "Organize and track tasks efficiently across your entire team",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamless collaboration between admins and staff members",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "Stay informed with instant notifications and activity feeds",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for your sensitive data",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#14b8a6] rounded-lg" />
            <span className="text-xl text-gray-900">TaskManager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-[#14b8a6] text-white rounded-lg hover:bg-[#14b8a6]/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl text-gray-900 mb-6 max-w-4xl mx-auto">
          Streamline Your Team's Workflow
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The all-in-one task management platform designed for admin and staff
          collaboration. Track, assign, and complete tasks effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-4 bg-[#14b8a6] text-white rounded-xl hover:bg-[#14b8a6]/90 transition-colors text-lg"
          >
            Start Free Trial
          </Link>
          <button className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-lg">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-center text-gray-900 mb-16">
          Everything you need to manage tasks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-[#14b8a6]/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="text-[#14b8a6]" size={24} />
              </div>
              <h3 className="text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-[#14b8a6] to-[#0d9488] rounded-2xl p-12 text-center text-white">
          <h2 className="mb-4">Ready to get started?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of teams already using TaskManager
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-[#14b8a6] rounded-xl hover:bg-gray-100 transition-colors text-lg"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2026 TaskManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
