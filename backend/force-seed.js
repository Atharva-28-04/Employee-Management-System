async function registerUser() {
  console.log('🔄 Attemping to trigger registration via API route...');
  
  const payload = {
    email: 'admin@company.com',
    password: 'admin123',
    role: 'ADMIN',
    // Including default fields for the profile creation logic to process safely
    firstName: 'System',
    lastName: 'Admin',
    department: 'IT',
    designation: 'Manager'
  };

  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Registration rejected.');
    }

    console.log('✅ Success! Server account created perfectly:', data);
  } catch (err) {
    console.error('❌ Request failed:', err.message);
    console.log('\n💡 Quick Fix: Make sure your server is running via "node server.js" in your other terminal tab before running this!');
  }
}

registerUser();