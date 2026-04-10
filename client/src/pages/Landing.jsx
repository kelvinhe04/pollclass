import { useNavigate } from 'react-router-dom';
import Button from '../components/design/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brutal-bg">
      <div className="border-4 border-black p-8 bg-white shadow-brutal max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="brutal-title-lg mb-2 uppercase tracking-widest">PollClass</h1>
          <div className="h-2 bg-black w-24 mx-auto"></div>
          <p className="text-brutal-textMuted mt-4 font-bold uppercase text-sm">
            Encuestas en vivo para el aula
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => navigate('/professor/login')}
            size="lg"
            className="w-full"
          >
            Soy Profesor
          </Button>
          <Button
            onClick={() => navigate('/student/login')}
            variant="secondary"
            size="lg"
            className="w-full"
          >
            Soy Estudiante
          </Button>
        </div>
      </div>
      
      <p className="mt-8 text-xs font-mono uppercase tracking-widest text-brutal-textMuted">
        Sistema de encuestas en tiempo real
      </p>
    </div>
  );
}