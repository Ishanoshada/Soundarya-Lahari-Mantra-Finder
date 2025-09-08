import React, { useState } from 'react';
import { SLOKA_DATA } from '../constants/slokaData';

interface SearchBarProps {
  onSearch: (query: string, combine: boolean) => void;
  isLoading: boolean;
}

const formatTitleForDisplay = (title: string): string => {
  return title.replace(/\s*-\s*\d+$/, '').trim();
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [combineMantras, setCombineMantras] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), combineMantras);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    const newQuery = selectedOptions.join(', ');
    setQuery(newQuery);
  };


  return (
    <div className="w-full max-w-xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
      <form onSubmit={handleSubmit} className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-amber-300/60">
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your problem or select from the list below"
              className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-600/70 bg-transparent focus:outline-none flex-grow"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-8 py-3 bg-amber-800 text-white font-bold rounded-full hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Searching...' : 'Find Mantra'}
            </button>
        </div>
      </form>
       <div className="text-center mt-4 text-sm text-amber-800 flex flex-col items-center gap-3">
            <div className="flex items-center">
                <input 
                    id="combine-checkbox"
                    type="checkbox" 
                    checked={combineMantras}
                    onChange={(e) => setCombineMantras(e.target.checked)}
                    className="h-4 w-4 rounded border-amber-400 text-amber-700 focus:ring-amber-600"
                    disabled={isLoading}
                />
                <label htmlFor="combine-checkbox" className="ml-2">
                    Combine mantras for a powerful solution
                </label>
            </div>
            <div className="w-full max-w-xl mx-auto mt-4">
                 <label htmlFor="sloka-select" className="block text-sm font-medium text-amber-800 mb-1">
                    Or select one or more intentions (use Ctrl/Cmd to multi-select):
                 </label>
                 <select
                    id="sloka-select"
                    multiple
                    onChange={handleSelectChange}
                    className="w-full p-2 border border-amber-300 rounded-lg shadow-sm bg-white/80 focus:ring-amber-500 focus:border-amber-500 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100"
                    size={8}
                    disabled={isLoading}
                 >
                    {SLOKA_DATA.map((sloka) => {
                        const displayTitle = formatTitleForDisplay(sloka.title);
                        return (
                            <option key={sloka.slokaNumber} value={displayTitle}>
                                {`#${sloka.slokaNumber}: ${displayTitle}`}
                            </option>
                        );
                    })}
                </select>
            </div>
      </div>
    </div>
  );
};

export default SearchBar;