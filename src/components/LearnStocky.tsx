import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { BookOpen, PlayCircle, CheckCircle, BrainCircuit, ArrowRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Button } from './ui/Button';

const LESSONS = [
  { id: 'basics', title: 'Stock Market Basics', description: 'What is a stock? How does the market work?' },
  { id: 'analysis', title: 'Fundamental vs Technical', description: 'Understanding different ways to evaluate stocks.' },
  { id: 'risk', title: 'Risk Management', description: 'How to protect your capital and avoid common pitfalls.' },
  { id: 'crypto', title: 'Intro to Crypto', description: 'Understanding blockchain and digital assets.' },
];

export const LearnStocky: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const generateLesson = async (lessonId: string, title: string) => {
    setLoading(true);
    setActiveLesson(lessonId);
    setLessonContent(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are an expert financial educator. Create a comprehensive, engaging, and easy-to-understand lesson on: "${title}".
        The target audience is a beginner investor.
        Use Markdown formatting. Include:
        - A catchy introduction
        - 3 key concepts explained simply
        - A real-world analogy
        - A quick summary or "takeaway" at the end.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      setLessonContent(response.text || "Failed to generate lesson.");
    } catch (error) {
      console.error("Error generating lesson:", error);
      setLessonContent("An error occurred while loading the lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = (id: string) => {
    if (!completedLessons.includes(id)) {
      setCompletedLessons([...completedLessons, id]);
    }
    setActiveLesson(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-indigo-500/20 rounded-2xl">
          <BookOpen className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Learn Stocky</h1>
          <p className="text-zinc-400 mt-1">Master the markets with AI-generated interactive lessons.</p>
        </div>
      </div>

      {!activeLesson ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LESSONS.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <Card 
                key={lesson.id} 
                className={`border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-all cursor-pointer group ${isCompleted ? 'border-emerald-500/30' : ''}`}
                onClick={() => generateLesson(lesson.id, lesson.title)}
              >
                <CardContent className="p-6 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <PlayCircle className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                      )}
                      <h3 className="text-lg font-semibold text-zinc-100">{lesson.title}</h3>
                    </div>
                    <p className="text-sm text-zinc-400">{lesson.description}</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                    <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-indigo-500/20 bg-zinc-950 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainCircuit className="w-6 h-6 text-indigo-400" />
              <CardTitle className="text-xl text-indigo-100">
                {LESSONS.find(l => l.id === activeLesson)?.title}
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setActiveLesson(null)}>
              Back to Courses
            </Button>
          </CardHeader>
          <CardContent className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-indigo-400 animate-pulse">AI is generating your personalized lesson...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="prose prose-invert prose-indigo max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: formatMarkdown(lessonContent || '') }} />
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <Button 
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    onClick={() => markCompleted(activeLesson)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Lesson
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function formatMarkdown(text: string) {
  return text
    .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-indigo-300 mt-8 mb-4">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="text-2xl font-bold text-indigo-200 mt-10 mb-6 border-b border-white/10 pb-2">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-100">$1</strong>')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>')
    .replace(/- (.*)/g, '<li class="ml-4 mb-2 text-zinc-300">$1</li>');
}
