const pollCode = require('./pollCode');

module.exports = {
  profesor: {
    email: 'profesor@pollclass.com',
    password: 'test123',
    name: 'Profesor Test'
  },
  estudiante: {
    email: 'estudiante@pollclass.com',
    password: 'test123',
    name: 'Estudiante Test'
  },
  poll: {
    title: 'Encuesta Automatizada',
    options: ['Opcion A', 'Opcion B'],
    code: pollCode.code
  }
};