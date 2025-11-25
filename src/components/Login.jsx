import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { findUserByCredentials } from '../utils/supabaseClient';
import { registerUser } from '../lib/services/registerUser';
import { supabase } from '../utils/supabaseClient';



const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && role === 'student') {
      if (!email || !password || !name || !level || !gradeLevel) {
        setError('¡Ey! Completa todos los campos para registrarte.');
        return;
      }
      if (!email.includes('@')) {
        setError('El email debe ser válido, como algo@gmail.com.');
        return;
      }
      try {
        const result = await registerUser({
          email: email.toLowerCase(),
          password,
          name,
          role: 'student',
          level,
          grade: gradeLevel,
        });
        if (result) {
          onLogin('student', { email: email.toLowerCase(), name, role: 'student', level, grade: gradeLevel });
          navigate('/student');
          setEmail(''); setPassword(''); setName(''); setLevel(''); setGradeLevel(''); setError('');
        }
      } catch (err) {
        setError('¡Ups! Ese email ya está registrado o hubo un error.');
      }
      return;
    }

    if (role === 'teacher') {
      // Login seguro usando Supabase Auth
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });
        if (error || !data.user) {
          setError('¡Ups! Email o contraseña incorrectos.');
          return;
        }
        // Buscar perfil en tabla users
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        if (userError || !userProfile) {
          setError('No se encontró el perfil de maestro.');
          return;
        }
        onLogin('teacher', userProfile);
        navigate('/teacher');
      } catch (err) {
        setError('¡Ups! Error al intentar iniciar sesión.');
      }
      return;
    }

    // Login de estudiante por tabla users
    try {
      const user = await findUserByCredentials(role, email.toLowerCase(), password);
      if (user) {
        onLogin(role, user);
        navigate('/student');
      } else {
        setError('¡Ups! Email o contraseña incorrectos.');
      }
    } catch (err) {
      setError('¡Ups! Error al intentar iniciar sesión.');
    }
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setEmail(''); setPassword(''); setName(''); setError('');
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 w-full max-w-md shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.img 
            src="https://utfs.io/f/5BN0V4mlt4NUkZjqJyKcYeEWHJagI08DSuKnXwL9ZRzGv7xy"
            alt="Logo Centro Educativo Sor Maria Romero"
            className="mx-auto w-32 h-32 object-contain mb-4"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Notas</h1>
          <p className="text-gray-600">Centro Educativo Sor Maria Romero - Barrio San Judas</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isRegister ? (
            <div className="flex gap-2 mb-6">
              <motion.button
                type="button"
                onClick={() => { setRole('student'); setError(''); }}
                className={`flex-1 p-3 rounded-xl font-medium transition-all duration-300 ${role === 'student' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="w-5 h-5 inline mr-2" />
                Estudiante
              </motion.button>
              <motion.button
                type="button"
                onClick={() => { setRole('teacher'); setError(''); }}
                className={`flex-1 p-3 rounded-xl font-medium transition-all duration-300 ${role === 'teacher' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GraduationCap className="w-5 h-5 inline mr-2" />
                Maestro
              </motion.button>
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={toggleRegister}
              className="w-full p-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Plus className="w-5 h-5" />
              Cambiar a Login
            </motion.button>
          )}

          {role && (
            <>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                  required
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                  required
                />
              </motion.div>
              {isRegister && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
              )}
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
            </>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;