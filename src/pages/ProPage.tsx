
import React from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Check, Star, ArrowRight, Shield, Clock, VideoIcon, BookOpen, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProPage = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-4">AlgoViz Pro</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Unlock advanced features, exclusive content, and premium visualizations to enhance your 
            algorithm and data structure learning experience.
          </p>
        </div>
        
        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {/* Free plan */}
          <div className="glass-card p-8 border border-border">
            <h3 className="text-xl font-semibold mb-2">Basic</h3>
            <p className="text-muted-foreground mb-6">Essential visualization tools</p>
            <div className="mb-6">
              <span className="text-3xl font-bold">Free</span>
              <span className="text-muted-foreground ml-2">forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Basic algorithm visualizations',
                'Standard data structure operations',
                'Interactive controls',
                'Basic code walkthroughs',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Current Plan
            </Button>
          </div>
          
          {/* Pro plan */}
          <div className="glass-card p-8 border-2 border-primary relative z-10 shadow-lg transform md:-translate-y-4">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-6">Advanced learning experience</p>
            <div className="mb-6">
              <span className="text-3xl font-bold">$9.99</span>
              <span className="text-muted-foreground ml-2">per month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Basic',
                'Advanced algorithm visualizations',
                'Complex data structure operations',
                'Detailed step-by-step explanations',
                'Interactive practice exercises',
                'Downloadable cheatsheets',
                'No advertisements',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
              Upgrade Now
            </Button>
          </div>
          
          {/* Team plan */}
          <div className="glass-card p-8 border border-border">
            <h3 className="text-xl font-semibold mb-2">Team</h3>
            <p className="text-muted-foreground mb-6">For educators and teams</p>
            <div className="mb-6">
              <span className="text-3xl font-bold">$49.99</span>
              <span className="text-muted-foreground ml-2">per month</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Pro',
                'Up to 30 team members',
                'Team progress tracking',
                'Custom algorithm upload',
                'Collaborative learning tools',
                'Priority support',
                'Classroom management features',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </div>
        </div>
        
        {/* Features section */}
        <div className="mb-20">
          <h2 className="heading-lg text-center mb-12">Pro Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Feature 1 */}
            <div className="flex gap-6">
              <div className="p-3 h-fit bg-primary/10 rounded-md">
                <Zap size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Visualizations</h3>
                <p className="text-muted-foreground mb-4">
                  Experience richer, more detailed visualizations of complex algorithms and data structures,
                  with additional animation options and insights.
                </p>
                <ul className="space-y-2">
                  {[
                    'Advanced graph algorithms',
                    'Tree balancing visualizations',
                    'Dynamic programming table views',
                    'Custom speed and stepping controls'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="p-3 h-fit bg-primary/10 rounded-md">
                <VideoIcon size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Video Walkthroughs</h3>
                <p className="text-muted-foreground mb-4">
                  Access expert-narrated video explanations of algorithms and data structures that
                  break down complex concepts into easy-to-understand components.
                </p>
                <ul className="space-y-2">
                  {[
                    'In-depth analysis of each algorithm',
                    'Time and space complexity explanations',
                    'Real-world applications',
                    'Common optimization techniques'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="p-3 h-fit bg-primary/10 rounded-md">
                <BookOpen size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Exclusive Learning Paths</h3>
                <p className="text-muted-foreground mb-4">
                  Follow structured learning paths designed by algorithm experts to progressively
                  build your knowledge from basics to advanced topics.
                </p>
                <ul className="space-y-2">
                  {[
                    'Personalized learning recommendations',
                    'Progress tracking and achievements',
                    'Curated problem sets for practice',
                    'Interview preparation materials'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="flex gap-6">
              <div className="p-3 h-fit bg-primary/10 rounded-md">
                <Clock size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Early Access</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to try new visualizations, features, and content before they're
                  released to the public.
                </p>
                <ul className="space-y-2">
                  {[
                    'Beta access to new algorithms',
                    'Preview upcoming data structures',
                    'Provide feedback that shapes development',
                    'Exclusive developer insights'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="heading-lg text-center mb-12">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "AlgoViz Pro completely transformed how I understand algorithms. The visualizations made complex concepts click for me in a way textbooks never could.",
                name: "Sarah J.",
                title: "Computer Science Student"
              },
              {
                quote: "As a professor, the team plan has been invaluable for my classes. Students engage more deeply with the material when they can visualize how algorithms work.",
                name: "Dr. Michael T.",
                title: "University Professor"
              },
              {
                quote: "I used AlgoViz Pro to prepare for technical interviews and it gave me the confidence to explain algorithms clearly. I received offers from multiple companies!",
                name: "Carlos M.",
                title: "Software Engineer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="glass-card p-6 flex flex-col">
                <div className="mb-4 text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 flex-grow">"{testimonial.quote}"</p>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* FAQ */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h2 className="heading-lg text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "How does billing work?",
                answer: "AlgoViz Pro is billed monthly or annually (with a 20% discount for annual plans). You can cancel at any time and your subscription will remain active until the end of your billing period."
              },
              {
                question: "Can I switch between plans?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the change takes effect immediately. If you downgrade, the change will take effect at the end of your current billing cycle."
              },
              {
                question: "Is there a student discount?",
                answer: "Yes, we offer a 50% discount for students with a valid school email address. Contact our support team with your student ID for verification."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and certain regional payment methods. All transactions are processed securely through our payment processor."
              },
              {
                question: "Can I try AlgoViz Pro before subscribing?",
                answer: "Yes, we offer a 7-day free trial of AlgoViz Pro with full access to all features. No credit card required to start your trial."
              }
            ].map((faq, index) => (
              <div key={index} className="glass-card p-6">
                <h3 className="text-lg font-medium mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mb-20 glass-card p-10 bg-gradient-to-r from-primary/10 to-purple-600/10">
          <h2 className="text-2xl font-bold mb-4">Ready to transform your algorithm learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students, professionals, and educators who have enhanced their 
            understanding of algorithms and data structures with AlgoViz Pro.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600">
              Start 7-Day Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Compare Plans
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            No credit card required to start your trial. Cancel anytime.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProPage;
