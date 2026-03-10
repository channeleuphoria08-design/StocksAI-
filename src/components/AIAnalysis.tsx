import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { GoogleGenAI } from '@google/genai';
import { Loader2, Sparkles, Target } from 'lucide-react';

interface AIAnalysisProps {
  ticker: string;
}

const INVESTMENT_GOALS = [
  { id: 'long-term', label: 'Long-term Growth' },
  { id: 'dividend', label: 'Dividend Income' },
  { id: 'value', label: 'Value Investing' },
  { id: 'short-term', label: 'Short-term Trading' },
  { id: 'low-risk', label: 'Low Risk / Safe' },
];

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ ticker }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState(INVESTMENT_GOALS[0].id);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("Gemini API key is missing.");
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const goalLabel = INVESTMENT_GOALS.find(g => g.id === selectedGoal)?.label || 'Investment';

        const prompt = `
          Analyze the following asset/company for a user whose primary investment goal is: **${goalLabel}**.
          Asset Name/Ticker: ${ticker}
          
          Provide the analysis in the following format (use Markdown):
          
          ### Asset Summary
          [Brief summary of the asset and its current market position]
          
          ### Goal Alignment (${goalLabel})
          [Analyze how well this asset fits the user's specific goal of ${goalLabel}. Is it a good match?]
          
          ### Peer Comparison & Alternatives
          [Compare this asset to 2-3 similar assets or competitors. Crucially, suggest better alternatives if they exist that align more closely with the user's goal of ${goalLabel}.]
          
          ### Final Recommendation
          [Buy / Hold / Avoid / Switch to Alternative]
          
          Make the explanation simple, actionable, and directly tailored to the user's stated goal. Use recent news and data if possible.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          }
        });

        setAnalysis(response.text || "No analysis generated.");
      } catch (err: any) {
        console.error("Error generating analysis:", err);
        setError(err.message || "Failed to generate AI analysis.");
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchAnalysis();
    }
  }, [ticker, selectedGoal]);

  return (
    <Card className="h-full border-emerald-500/20 bg-emerald-950/10 flex flex-col">
      <CardHeader className="flex flex-col space-y-4 pb-4 border-b border-emerald-500/10">
        <div className="flex flex-row items-center space-x-2">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-emerald-400">AI Analysis & Alternatives</CardTitle>
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-xs text-emerald-500/80 flex items-center uppercase tracking-wider font-semibold">
            <Target className="w-3 h-3 mr-1" />
            Investment Goal
          </label>
          <select 
            value={selectedGoal}
            onChange={(e) => setSelectedGoal(e.target.value)}
            className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-100 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5 outline-none transition-colors"
          >
            {INVESTMENT_GOALS.map(goal => (
              <option key={goal.id} value={goal.id} className="bg-zinc-900">
                {goal.label}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 h-full">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm text-zinc-400 animate-pulse text-center">
              Analyzing {ticker} against peers for<br/>
              <span className="text-emerald-400 font-medium">{INVESTMENT_GOALS.find(g => g.id === selectedGoal)?.label}</span>...
            </p>
          </div>
        ) : error ? (
          <div className="text-red-400 text-sm p-4 bg-red-950/20 rounded-md border border-red-900/50">
            {error}
          </div>
        ) : analysis ? (
          <div className="prose prose-invert prose-emerald max-w-none text-sm">
            <div dangerouslySetInnerHTML={{ __html: formatMarkdown(analysis) }} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

// Simple markdown formatter since we don't have react-markdown installed
function formatMarkdown(text: string) {
  return text
    .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-emerald-300 mt-5 mb-2 border-b border-emerald-500/20 pb-1">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-emerald-100">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
