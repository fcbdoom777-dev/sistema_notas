
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Home, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGrades as fetchGrades } from '../utils/supabaseClient';

const StudentDashboard = ({ user }) => {
  const [studentGrades, setStudentGrades] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function loadGrades() {
      try {
        const gradesArr = await fetchGrades(user.id);
        // Convierte array [{subject, value}] a objeto {subject: value}
        const gradesObj = {};
        gradesArr.forEach(g => {
          gradesObj[g.subject] = g.value;
        });
        setStudentGrades(gradesObj);
      } catch (err) {
        setStudentGrades({});
      }
    }
    loadGrades();
  }, [user.id]);

  const subjects = Object.entries(studentGrades);
  const approved = subjects.filter(([_, grade]) => grade >= 60).length;
  const total = subjects.length;
  const avgRaw = total > 0 ? (subjects.reduce((sum, [_, grade]) => sum + grade, 0) / total) : 0;
  const average = total > 0 ? avgRaw.toFixed(1) : 0;
  const isApprovedOverall = avgRaw >= 60;

  const handleLogout = () => {
    navigate('/');
  };

  const gradeItems = subjects.map(([subject, grade], index) => (
    <motion.div
      key={subject}
      className={`flex justify-between items-center p-4 rounded-xl shadow-sm ${
        grade >= 60 ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div>
        <h3 className="font-semibold text-gray-900">{subject}</h3>
        <p className="text-sm text-gray-600">Estado: {grade >= 60 ? 'APROBADO!!' : 'REPROBADO'}</p>
      </div>
      <div className="text-right">
        <span className={`text-2xl font-bold ${grade >= 60 ? 'text-green-600' : 'text-red-600'}`}>
          {grade}
        </span>
        {grade >= 60 ? (
          <CheckCircle className="w-6 h-6 text-green-500 ml-2 inline" />
        ) : (
          <XCircle className="w-6 h-6 text-red-500 ml-2 inline" />
        )}
      </div>
    </motion.div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-6 shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Hola, {user.name}</h1>
            </div>
            <motion.button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Salir
            </motion.button>
          </div>
          <p className="text-gray-600">Tus notas del semestre (escala 0-100).</p>
        </motion.div>

        {total > 0 ? (
          <>
            <motion.div 
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-6 shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 justify-center">
                <Home className="w-5 h-5" />
                Resumen General
              </h2>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-700">Aprobadas</p>
                  <p className="text-2xl font-bold text-green-600">{approved}/{total}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl">
                  <p className="text-sm text-purple-700">Promedio</p>
                  <p className="text-2xl font-bold text-purple-600">{average}</p>
                </div>
              </div>
            </motion.div>

            {isApprovedOverall ? (
              <motion.div
                className="bg-green-50 border-l-4 border-green-500 p-6 mb-6 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-extrabold text-green-700 mb-2">APROBADO!!</h3>
                <p className="text-green-700">Felicidades</p>
                <p className="text-green-700">Te Damos las Bienvenida a Nuestra casa salesiana</p>
              </motion.div>
            ) : (
              <motion.div
                className="bg-red-50 border-l-4 border-red-500 p-6 mb-6 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-extrabold text-red-700 mb-2">REPROBADO</h3>
                <p className="text-red-700">Lo sentimos</p>
                <p className="text-red-700">Resultados insuficiente para acceder a matricula.</p>
              </motion.div>
            )}

            <motion.div 
              className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Tus Notas por Materia
              </h2>
              <div className="space-y-3">
                {gradeItems}
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 text-center shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Aún no hay notas!</h2>
            <p className="text-gray-600">Tu maestro las agregará pronto. ¡Estudia duro!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;