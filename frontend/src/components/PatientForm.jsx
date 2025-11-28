import { useState, useEffect } from "react";

function PatientForm({ onAdd, editRecord }) {
  const emptyForm = {
    name: "",
    age: "",
    condition: "",
    notes: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  // When a record is selected for edit, load it
  useEffect(() => {
    if (editRecord) {
      setFormData(editRecord);
    } else {
      setFormData(emptyForm);
    }
  }, [editRecord]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Patient Name is required!");
      return;
    }
    if (!formData.age.trim()) {
      alert("Age is required!");
      return;
    }

    onAdd(formData);
    setFormData(emptyForm);
  }

  return (
    <section style={{ marginBottom: "20px" }}>
      <h2>{editRecord ? "✏️ Edit Patient" : "➕ Add Patient"}</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Patient Name"
          required
        />

        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />

        <input
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          placeholder="Condition / Symptoms"
        />

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional Notes / Treatment / Reports"
          rows={2}
        ></textarea>

        <button
          type="submit"
          style={{
            background: "#00695c",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          {editRecord ? "Update Record" : "Add Patient"}
        </button>
      </form>
    </section>
  );
}

export default PatientForm;
