import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/design';

export default function LoginStudent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user?.role !== 'student') {
        setError('Esta cuenta no es de estudiante');
        return;
      }
      navigate('/student');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card title="INICIAR SESION COMO ESTUDIANTE">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-600 text-white border-2 border-black p-4 mb-4 font-bold">
              {error}
            </div>
          )}

          <Input
            label="EMAIL"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />

          <Input
            label="CONTRASENA"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contrasena"
            required
          />

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'INICIANDO...' : 'INICIAR SESION'}
          </Button>
        </form>

        <div className="mt-4 text-center border-t-2 border-black pt-4">
          <p className="text-sm font-bold">No tienes cuenta?</p>
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-2"
            onClick={() => navigate('/student/register')}
          >
            CREAR CUENTA DE ESTUDIANTE
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => navigate('/')}
          >
            VOLVER AL INICIO
          </Button>
        </div>
      </Card>
    </div>
  );
}