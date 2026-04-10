import { useState } from 'react';
import { Button, Card } from './design';

export default function JoinPoll({ onJoin, loading, error }) {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.trim().toUpperCase());
    }
  };

  return (
    <Card title="UNIRSE A ENCUESTA">
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-600 text-white border-2 border-black p-4 mb-4 font-bold">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="brutal-label">CODIGO DE LA ENCUESTA</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="brutal-input text-center text-3xl font-mono tracking-widest uppercase"
            placeholder="ABC123"
            maxLength={6}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !code.trim()}
          className="w-full"
        >
          {loading ? 'BUSCANDO...' : 'UNIRSE A ENCUESTA'}
        </Button>
      </form>
    </Card>
  );
}