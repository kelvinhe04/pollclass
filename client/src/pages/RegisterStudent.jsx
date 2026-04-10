import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/design';

export default function RegisterStudent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden');
      return;
    }

    if (password.length < 4) {
      setError('La contrasena debe tener al menos 4 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name, 'student');
      navigate('/student');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card title="CREAR CUENTA DE ESTUDIANTE">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-600 text-white border-2 border-black p-4 mb-4 font-bold">
              {error}
            </div>
          )}

          <Input
            label="NOMBRE COMPLETO"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
          />

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
            placeholder="Minimo 4 caracteres"
            required
          />

          <Input
            label="CONFIRMAR CONTRASENA"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contrasena"
            required
          />

          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading ? 'REGISTRANDO...' : 'CREAR CUENTA'}
          </Button>
        </form>

        <div className="mt-4 text-center border-t-2 border-black pt-4">
          <p className="text-sm font-bold">Ya tienes cuenta?</p>
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-2"
            onClick={() => navigate('/student/login')}
          >
            INICIAR SESION
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