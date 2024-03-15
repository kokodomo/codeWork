import React, { useState } from 'react';
import axios from 'axios';

function PersonalInfoForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    birthdate: '',
    age: '',
    gender: ''
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData)
      await axios.post('http://localhost:3000/api/personalinfo', formData);
      alert('Personal info added successfully');
    } catch (error) {
      console.error('Error adding personal info:', error);
      alert('Failed to add personal info');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Full Name:
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      </label>
      <label>
        Nickname:
        <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
      </label>
      <label>
        Birthdate:
        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
      </label>
      <label>
        Age:
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
      </label>
      <label>
        Gender:
        <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
      </label>
      <button type="submit">Add Personal Info</button>
    </form>
  );
}

export default PersonalInfoForm;