import { useState } from 'react';
import { Button } from './design';

export default function VoteForm({ options, onVote, loading }) {
  const [selected, setSelected] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected !== null) {
      onVote(selected);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {options.map((opt, idx) => (
        <label
          key={idx}
          className={`
            block p-4 border-2 border-black cursor-pointer transition-all
            ${selected === idx
              ? 'bg-yellow-400 shadow-brutal translate-x-[2px] translate-y-[2px]'
              : 'bg-white hover:bg-gray-100'
            }
          `}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="option"
              value={idx}
              checked={selected === idx}
              onChange={() => setSelected(idx)}
              className="w-5 h-5 accent-black"
            />
            <span className={`font-bold ${selected === idx ? '' : ''}`}>{opt.text}</span>
          </div>
        </label>
      ))}
      
      <Button
        type="submit"
        disabled={selected === null || loading}
        className="w-full"
      >
        {loading ? 'ENVIANDO...' : 'VOTAR'}
      </Button>
    </form>
  );
}