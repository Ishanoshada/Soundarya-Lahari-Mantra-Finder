import React, { useState, useMemo } from 'react';
import { SLOKA_DATA } from '../constants/slokaData';

interface SearchBarProps {
  onSearch: (query: string, combine: boolean) => void;
  onLocalSearch: (slokaNumbers: number[]) => void;
  isLoading: boolean;
}

const formatTitleForDisplay = (title: string): string => {
  return title.replace(/\s*-\s*\d+$/, '').trim();
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocalSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // These will be sloka numbers as strings
  const [combineMantras, setCombineMantras] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const textQuery = query.trim();
    const selectedSlokaNumbers = selectedItems.map(Number);

    if (textQuery) {
        // User typed something, use AI search.
        // We'll add the titles of selected slokas to the query for better context for the AI.
        const selectedTitles = SLOKA_DATA
            .filter(sloka => selectedSlokaNumbers.includes(sloka.slokaNumber))
            .map(sloka => formatTitleForDisplay(sloka.title));

        const finalQuery = [textQuery, ...selectedTitles].filter(Boolean).join(', ');
        
        if (finalQuery) {
            onSearch(finalQuery, combineMantras);
        }
    } else if (selectedSlokaNumbers.length > 0) {
        // User only selected from the dropdown, perform a local lookup.
        onLocalSearch(selectedSlokaNumbers);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedItems(selectedOptions);
  };

  const selectedSlokaTitles = useMemo(() => {
    const selectedNumbers = selectedItems.map(Number);
    return SLOKA_DATA
        .filter(sloka => selectedNumbers.includes(sloka.slokaNumber))
        .map(sloka => formatTitleForDisplay(sloka.title));
  }, [selectedItems]);

  return (
    <div className="w-full max-w-xl mx-auto my-6 animate-landing animate-fade-in" style={{ animationDelay: '1.3s' }}>
      <form onSubmit={handleSubmit} className="p-2 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/30">
        <div className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your problem (e.g., 'for success in exams')"
              className="w-full px-5 py-3 text-lg text-amber-900 placeholder-amber-700/70 bg-transparent focus:outline-none flex-grow"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || (!query.trim() && selectedItems.length === 0)}
              className="w-full sm:w-auto px-8 py-3 bg-amber-800 text-white font-bold rounded-full hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Searching...' : 'Find Mantra'}
            </button>
        </div>
      </form>

      {selectedSlokaTitles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center px-4">
              {selectedSlokaTitles.map((title, index) => (
                  <span key={index} className="bg-amber-200/80 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full animate-fade-in shadow-sm">
                      {title}
                  </span>
              ))}
          </div>
      )}

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
                <label htmlFor="combine-checkbox" className="ml-2 font-medium">
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
                    value={selectedItems}
                    onChange={handleSelectChange}
                    className="w-full p-2 border border-amber-300/50 rounded-xl shadow-lg bg-white/60 backdrop-blur-sm focus:ring-amber-500 focus:border-amber-500 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100"
                    size={8}
                    disabled={isLoading}
                 >
                    {SLOKA_DATA.map((sloka) => {
                        const displayTitle = formatTitleForDisplay(sloka.title);
                        return (
                            <option key={sloka.slokaNumber} value={String(sloka.slokaNumber)}>
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