import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// 1. Create a slice
const formSlice = createSlice({
  name: "form",
  initialState: { name: "", email: "", age: "", emailError: "" },
  reducers: {
    updateField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;

      // Email validation logic
      if (field === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        state.emailError = emailRegex.test(value) ? "" : "Invalid email format";
      }
    },
    resetForm: (state) => {
      state.name = "";
      state.email = "";
      state.age = "";
      state.emailError = "";
    },
  },
});

const { updateField, resetForm } = formSlice.actions;

// 2. Configure the store
const store = configureStore({
  reducer: {
    form: formSlice.reducer,
  },
});

// 3. Form component
function UserForm() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form);

  const handleChange = (e) => {
    dispatch(updateField({ field: e.target.name, value: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.emailError) {
      alert("Please fix errors before submitting.");
      return;
    }
    alert(`Submitted:\n${JSON.stringify(formData, null, 2)}`);
    dispatch(resetForm());
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "1rem" }}>
      <h2>Interactive Redux Form with Email Validation</h2>

      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      {formData.emailError && (
        <p style={{ color: "red" }}>{formData.emailError}</p>
      )}
      <br />

      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
}

// 4. App wrapper with Provider
export default function App() {
  return (
    <Provider store={store}>
      <UserForm />
    </Provider>
  );
}
