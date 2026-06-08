import express from 'express';
// Using named imports (the curly brackets) to perfectly match your controller exports!
import { register, login } from '../controllers/authController.js'; 

const router = express.Router();

// Route for new user registration
router.post('/register', register); 
// (Note: If you named your function 'signup' instead of 'register', just change the word 'register' above to 'signup')

// Route for user login
router.post('/login', login);

export default router;