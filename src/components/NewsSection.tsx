import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/Card';
import { ExternalLink, Clock } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news');
        const data = await response.json();
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          console.error("Failed to fetch news:", data);
          setNews([]);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
    }
  };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
        <span className="w-1.5 h-6 bg-emerald-500 rounded-full mr-3"></span>
        Market Insights & News
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {news.slice(0, 12).map((item, index) => (
          <a 
            key={index} 
            href={item.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="h-full border-white/5 bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden flex flex-col">
              {item.thumbnail && item.thumbnail.resolutions && item.thumbnail.resolutions.length > 0 && (
                <div className="w-full h-40 overflow-hidden relative">
                  <img 
                    src={item.thumbnail.resolutions[0].url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60" />
                </div>
              )}
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-emerald-400 mb-3 font-medium">
                  <span>{item.publisher}</span>
                  <span className="mx-2 text-zinc-600">•</span>
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{new Date(item.providerPublishTime * 1000).toLocaleDateString()}</span>
                </div>
                <h4 className="text-lg font-semibold text-zinc-100 mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h4>
                {item.relatedTickers && item.relatedTickers.length > 0 && (
                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    {item.relatedTickers.slice(0, 3).map((ticker: string) => (
                      <span key={ticker} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-zinc-400">
                        {ticker}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};
