import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react'; // asegúrate de tener instalado lucide-react

const Login = ({ onLogin }) => {
  // Estados
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [role, setRole] = useState('student'); // por defecto estudiante
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  // Alternar entre login y registro
  const toggleRegister = () => {
    setIsRegister(!isRegister);
  };

  // Manejo del submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !level || !gradeLevel) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    onLogin(role, { name, level, gradeLevel });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4">
          {isRegister ? 'Registro de Usuario' : 'Iniciar Sesión'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
              required
            />

            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">Nivel</label>
              <select
                value={level}
                onChange={(e) => { setLevel(e.target.value); setGradeLevel(''); }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                required
              >
                <option value="">Selecciona nivel</option>
                <option value="prescolar">Preescolar</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
              </select>
            </div>

            <div className="mt-3">
              <label className="block text-sm text-gray-600 mb-1">Grado</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                required
              >
                <option value="">Selecciona grado</option>
                {level === 'prescolar' && (
                  <>
                    <option value="Primer nivel">Primer nivel</option>
                    <option value="Segundo nivel">Segundo nivel</option>
                    <option value="Tercer nivel">Tercer nivel</option>
                  </>
                )}
                {level === 'primaria' && (
                  <>
                    <option value="1er grado">1er grado</option>
                    <option value="2do grado">2do grado</option>
                    <option value="3er grado">3er grado</option>
                    <option value="4to grado">4to grado</option>
                    <option value="5to grado">5to grado</option>
                    <option value="6to grado">6to grado</option>
                  </>
                )}
                {level === 'secundaria' && (
                  <>
                    <option value="7mo año">7mo año</option>
                    <option value="8vo año">8vo año</option>
                    <option value="9no año">9no año</option>
                    <option value="10mo año">10mo año</option>
                    <option value="11mo año">11mo año</option>
                  </>
                )}
              </select>
            </div>
          </motion.div>

          {error && (
            <motion.p 
              className="text-red-500 text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isRegister ? 'Registrarse' : 'Entrar'}
          </motion.button>

          {role === 'student' && !isRegister && (
            <motion.button
              type="button"
              onClick={toggleRegister}
              className="w-full p-3 bg-green-100 text-green-700 rounded-xl font-medium hover:bg-green-200 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Plus className="w-5 h-5" />
              ¿Nuevo? Regístrate aquí
            </motion.button>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;
