const axios = require('axios');

const ninjasClient = axios.create({
  baseURL: 'https://api.api-ninjas.com/v1',
  headers: { 'X-Api-Key': '' } // Set dynamically
});

/**
 * Search exercises by muscle group / difficulty
 * @param {Object} params - { muscle, difficulty, type, offset }
 * @returns {Array} Exercise objects
 */
const searchExercises = async (params = {}) => {
  try {
    const queryParams = {};
    if (params.muscle) queryParams.muscle = params.muscle;
    if (params.difficulty) queryParams.difficulty = params.difficulty;
    if (params.type) queryParams.type = params.type;
    if (params.offset) queryParams.offset = params.offset;

    // API Ninjas requires at least one parameter. If none provided, default to a sensible search or return demo data.
    if (Object.keys(queryParams).length === 0) {
      return getDemoExercises();
    }

    const response = await ninjasClient.get('/exercises', { 
      params: queryParams,
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY }
    });

    return response.data.map(ex => ({
      name: ex.name,
      type: ex.type,
      muscle: ex.muscle,
      equipment: ex.equipment,
      difficulty: ex.difficulty,
      instructions: ex.instructions
    }));
  } catch (error) {
    console.error('API Ninjas error:', error.message);
    return getDemoExercises(params);
  }
};

const getDemoExercises = (params = {}) => {
  const exercises = [
    { name: 'Push-Ups', type: 'strength', muscle: 'chest', equipment: 'body_only', difficulty: 'beginner', instructions: 'Start in plank position. Lower your body until your chest nearly touches the floor. Push yourself back up.' },
    { name: 'Squats', type: 'strength', muscle: 'quadriceps', equipment: 'body_only', difficulty: 'beginner', instructions: 'Stand with feet shoulder-width apart. Lower your hips back and down as if sitting in a chair. Return to standing.' },
    { name: 'Deadlift', type: 'strength', muscle: 'lower_back', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Stand with feet hip-width apart behind the bar. Bend at hips, grip bar, lift by extending hips and knees.' },
    { name: 'Pull-Ups', type: 'strength', muscle: 'lats', equipment: 'pull-up_bar', difficulty: 'intermediate', instructions: 'Hang from a pull-up bar with palms facing away. Pull yourself up until your chin is above the bar.' },
    { name: 'Bench Press', type: 'strength', muscle: 'chest', equipment: 'barbell', difficulty: 'intermediate', instructions: 'Lie on a flat bench. Lower the bar to your chest and press it back up.' },
    { name: 'Plank', type: 'strength', muscle: 'abdominals', equipment: 'body_only', difficulty: 'beginner', instructions: 'Hold a push-up position with arms straight. Keep your body in a straight line from head to heels.' },
    { name: 'Lunges', type: 'strength', muscle: 'quadriceps', equipment: 'body_only', difficulty: 'beginner', instructions: 'Step forward with one leg and lower your hips until both knees are bent at 90 degrees.' },
    { name: 'Shoulder Press', type: 'strength', muscle: 'shoulders', equipment: 'dumbbell', difficulty: 'intermediate', instructions: 'Press dumbbells overhead from shoulder height until arms are fully extended.' },
    { name: 'Bicep Curls', type: 'strength', muscle: 'biceps', equipment: 'dumbbell', difficulty: 'beginner', instructions: 'Hold dumbbells at your sides. Curl them up toward your shoulders, then lower.' },
    { name: 'Burpees', type: 'cardio', muscle: 'chest', equipment: 'body_only', difficulty: 'intermediate', instructions: 'From standing, squat down, kick feet back to plank, do a push-up, jump feet forward, jump up.' }
  ];

  let filtered = exercises;
  if (params.muscle) filtered = filtered.filter(e => e.muscle === params.muscle);
  if (params.difficulty) filtered = filtered.filter(e => e.difficulty === params.difficulty);
  return filtered.length > 0 ? filtered : exercises;
};

module.exports = { searchExercises };
