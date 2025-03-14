import React, { useState } from 'react';
import './app.css';
import axios from 'axios';

function App() {
  // Initialize the form state as an object instead of an array
  const [form, setForm] = useState({ file: null, price: '', desc: '', category: '' });
  const [response, setResponse] = useState('');
  const [dataFromServer, setDataFromServer] = useState([]);
  const [view, setView] = useState(true);

  const formHandler = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: files[0],  // Update only the file field with the selected file
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,  // Update the other form fields
      }));
    }
  };

  const getHandler = async () => {
    try {
      const res = await axios.get('http://localhost:3000/images');
      setView(true);
      setDataFromServer(res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('price', form.price);
    formData.append('desc', form.desc);
    formData.append('category', form.category);

    try {
      const res = await axios.post('http://localhost:3000/admin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res && res.data) {
        // Clear the form state after successful upload
        setForm({ file: null, price: '', desc: '', category: '' });
        setResponse(res.data.msg);
      } else {
        setResponse('Unexpected response format');
      }
    } catch (error) {
      console.error("Error in submitHandler:", error);
      if (error.response && error.response.data) {
        setResponse(error.response.data.msg);
      } else {
        setResponse('An error occurred, please try again.');
      }
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="file"
          accept=".png,.jpg"
          required
          name="file"
          onChange={formHandler}
        />
        <input
          type="number"
          required
          min={1}
          placeholder="Enter the price"
          name="price"
          value={form.price}
          onChange={formHandler}
        />
        <input
          type="text"
          required
          placeholder="Enter the description"
          name="desc"
          value={form.desc}
          onChange={formHandler}
        />
        <select
          name="category"
          value={form.category}
          onChange={formHandler}
        >
          <option value="">Select a category</option>
          <optgroup label="Food">
            <option value="fasting">Fasting</option>
            <option value="non_fasting">Non Fasting</option>
          </optgroup>
          <optgroup label="Electronics">
            <option value="phone">Phone</option>
            <option value="laptop">Laptop</option>
          </optgroup>
          <optgroup label="Cloth">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </optgroup>
        </select>
        <br />
        <p>{response}</p>
        <button type="submit">Submit</button>
      </form>

      <button onClick={getHandler}>See images</button>

      {
        view && (
          <div className="image-gallery">
            {dataFromServer.map((data, index) => (
              <div key={index} className="image-item">
                <img src={data.image_url} alt="image" className="image" />
                <div className="info">
                  <p className="price">${data.price}</p>
                  <p className="desc">{data.desc}</p>
                  <p className="category">{data.category}</p>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}

export default App;