import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface SearchBarProps {
  onSearch: (ticker: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim().toUpperCase());
      setShowSuggestions(false);
    }
  };

  const handleSelect = (symbol: string) => {
    setQuery(symbol);
    onSearch(symbol);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search for a company, crypto, forex (e.g., TSLA, BTCUSD)..."
          className="pl-12 h-14 text-lg bg-zinc-900/80 border-white/10 focus-visible:ring-emerald-500 rounded-2xl shadow-lg backdrop-blur-sm transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setShowSuggestions(true)}
        />
        <Button 
          type="submit" 
          className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md"
        >
          Analyze
        </Button>
      </form>

      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {loading ? (
            <div className="p-4 flex items-center justify-center text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((item, index) => (
                <li 
                  key={index}
                  onClick={() => handleSelect(item.symbol)}
                  className="px-4 py-3 hover:bg-zinc-800 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-sm text-zinc-400 truncate max-w-[300px]">
                      {item.shortname}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-600 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                    {item.exchange}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
