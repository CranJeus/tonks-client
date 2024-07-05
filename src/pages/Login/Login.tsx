import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (name: string) => void; // Modify the onLogin function to accept a name parameter
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState(''); // Change username to name

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Pass the name to the onLogin function
    console.log("name", name);
    onLogin(name);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <input type="submit" value="Log in" />
      </form>
    </div>
  );
};

export default LoginPage;