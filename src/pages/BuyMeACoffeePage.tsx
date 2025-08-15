import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Coffee, Heart, CreditCard, Globe, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Layout } from '../components/Layout';

const BuyMeACoffeePage: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'international'>('upi');
  const [upiId, setUpiId] = useState('sammohammed2003@okicici');
  const [amount, setAmount] = useState('50');
  const [customAmount, setCustomAmount] = useState('');

  const handleUpiPayment = () => {
    // Simulate UPI payment redirect
    const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=AlgoViz%20Support`;
    window.open(upiUrl, '_blank');
  };

  const handleInternationalPayment = () => {
    // Simulate international payment redirect
    alert('Redirecting to international payment gateway...');
  };

  const presetAmounts = ['25', '50', '100', '200', '500'];

  return (
    <Layout>
      <div className="min-h-screen bg-background p-2 sm:p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Buy Me a Coffee</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl"
              >
                ☕
              </motion.div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text">
              Buy Me a Coffee
            </h1>
            
            <div className="space-y-2">
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                "Algorithms run on logic, I run on coffee — fuel my code!"
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Your support helps keep AlgoViz free, open-source, and continuously improving. 
                Every coffee fuels new features, better visualizations, and educational content.
              </p>
            </div>
          </motion.div>

          {/* Coffee Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-8xl"
              >
                ☕
              </motion.div>
              <motion.div
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [0, -20, -40]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 text-2xl"
              >
                💨
              </motion.div>
            </div>
          </motion.div>

          {/* Payment Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* UPI Payment (India) */}
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  UPI Payment (India)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">UPI ID</label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID"
                    className="font-mono"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant={amount === amt ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAmount(amt)}
                        className="text-sm"
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && customAmount) {
                        setAmount(customAmount);
                        setCustomAmount('');
                      }
                    }}
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={handleUpiPayment}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                  size="lg"
                >
                  <Coffee className="h-5 w-5 mr-2" />
                  Pay with UPI
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Works with Google Pay, PhonePe, Paytm, and all UPI apps
                </p>
              </CardContent>
            </Card>

            {/* International Payment */}
            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  International Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Credit/Debit Card</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (USD)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['5', '10', '25'].map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        className="text-sm"
                      >
                        ${amt}
                      </Button>
                    ))}
                  </div>
                  <Input
                    placeholder="Custom amount in USD"
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={handleInternationalPayment}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  size="lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay Internationally
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Secure payments via PayPal, Stripe, and crypto
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Why Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-center">Why Support AlgoViz?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-semibold mb-2">Free Forever</h3>
                <p className="text-sm text-muted-foreground">
                  Keep AlgoViz completely free for students and developers worldwide
                </p>
              </Card>
              
              <Card className="text-center p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">New Features</h3>
                <p className="text-sm text-muted-foreground">
                  Fund development of new algorithms, data structures, and visualizations
                </p>
              </Card>
              
              <Card className="text-center p-4">
                <div className="text-3xl mb-2">🎓</div>
                <h3 className="font-semibold mb-2">Education</h3>
                <p className="text-sm text-muted-foreground">
                  Support creation of comprehensive guides and tutorials
                </p>
              </Card>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-center">What People Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  "AlgoViz helped me understand complex algorithms in minutes. The visualizations are incredible!"
                </p>
                <p className="text-xs font-medium">- Computer Science Student</p>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  "As a teacher, this tool has revolutionized how I explain data structures to my students."
                </p>
                <p className="text-xs font-medium">- University Professor</p>
              </Card>
            </div>
          </motion.div>

          {/* Footer CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center space-y-4"
          >
            <div className="flex justify-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl"
              >
                ☕
              </motion.div>
            </div>
            
            <p className="text-lg text-muted-foreground">
              Every coffee counts! Thank you for supporting open-source education.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-sm">Made with love for the developer community</span>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default BuyMeACoffeePage;
