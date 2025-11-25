export const mockStudents = [
  { id: 1, name: 'Ana López', email: 'ana@estudiante.com', password: '123', level: 'primaria', grade: '3er grado' },
  { id: 2, name: 'Carlos Ruiz', email: 'carlos@estudiante.com', password: '123', level: 'primaria', grade: '5to grado' },
  { id: 3, name: 'María García', email: 'maria@estudiante.com', password: '123', level: 'secundaria', grade: '7mo año' }
];

export const mockTeachers = [
  { id: 1, name: 'Prof. Elena', email: 'elena@maestro.com', password: '123' }
];

// Notas en escala 0-100 para consistencia con el dashboard
export const mockGrades = {
  1: {
    'Matemáticas': 85,
    'Historia': 70,
    'Ciencias': 92
  },
  2: {
    'Matemáticas': 68,
    'Historia': 55,
    'Ciencias': 71
  },
  3: {
    'Matemáticas': 90,
    'Historia': 88,
    'Ciencias': 65
  }
};

// Umbral de aprobación: 60 (escala 0-100)
export const getApprovalStatus = (grade) => (grade >= 60 ? 'Aprobado' : 'Reprobado');