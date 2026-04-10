import { useState } from 'react';
import { Button, Card, Input } from './design';

export default function PollForm({ onSubmit, loading, onSuccess }) {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);

  const resetForm = () => {
    setTitle('');
    setOptions(['', '']);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, '']);
  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validOptions = options.filter(opt => opt.trim());
    if (title.trim() && validOptions.length >= 2) {
      try {
        await onSubmit(title, validOptions);
        resetForm();
      } catch (err) {
        // no resetear si hay error
      }
    }
  };

  return (
    <Card title="CREAR ENCUESTA">
      <form onSubmit={handleSubmit}>
        <Input
          label="TITULO"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Que tema te interesa mas?"
          required
        />
        
        <div className="mb-4">
          <label className="brutal-label">OPCIONES</label>
          {options.map((opt, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="brutal-input flex-1"
                placeholder={`Opcion ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="border-2 border-black px-3 font-bold hover:bg-red-600 hover:text-white transition-colors"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="text-sm font-bold uppercase tracking-wide hover:underline"
          >
            + Agregar opcion
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading || !title.trim() || options.filter(o => o.trim()).length < 2}
          className="w-full"
        >
          {loading ? 'CREANDO...' : 'CREAR ENCUESTA'}
        </Button>
      </form>
    </Card>
  );
}