import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does the AI analysis work?",
    answer: "Our platform uses advanced machine learning models to analyze real-time market data, news sentiment, and historical trends to provide actionable insights."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, we use industry-standard encryption and security practices. We never store your sensitive financial credentials directly."
  },
  {
    question: "What markets do you cover?",
    answer: "We cover US equities (NYSE, NASDAQ), major cryptocurrencies, and forex pairs. We are constantly expanding our coverage."
  },
  {
    question: "Can I cancel my premium subscription at any time?",
    answer: "Absolutely. You can manage or cancel your subscription directly from your account settings with no hidden fees."
  }
];

export const FAQPage: React.FC = () => {
  return (
    <div className="pt-12 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
            <HelpCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-zinc-400">Everything you need to know about the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-between">
                {faq.question}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
