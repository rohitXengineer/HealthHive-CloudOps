import { useAuth } from "../AuthContext";

function PatientList({ records, onDelete, onEdit }) {
  const { user, hasAnyRole } = useAuth();

  // helpers: who can edit / delete
  const canEdit = hasAnyRole(["ADMIN", "DOCTOR", "NURSE"]);
  const canDelete = hasAnyRole(["ADMIN"]);

  return (
    <section>
      <h2>Patient Records</h2>

      {records.length === 0 ? (
        <p>No patient records yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px"
          }}
        >
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                #
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Name
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Age
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Condition
              </th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>
                Phone
              </th>
              <th style={{ borderBottom: "1px solid #ccc" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, index) => (
              <tr key={index}>
                <td style={{ padding: "6px 4px" }}>{index + 1}</td>
                <td style={{ padding: "6px 4px" }}>{rec.name}</td>
                <td style={{ padding: "6px 4px" }}>{rec.age}</td>
                <td style={{ padding: "6px 4px" }}>{rec.condition}</td>
                <td style={{ padding: "6px 4px" }}>{rec.phone}</td>
                <td style={{ padding: "6px 4px" }}>
                  <button
                    onClick={() => canEdit && onEdit(index)}
                    disabled={!canEdit}
                    title={
                      canEdit
                        ? "Edit record"
                        : "You don't have permission to edit records"
                    }
                    style={{
                      marginRight: "6px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: canEdit ? "pointer" : "not-allowed",
                      background: canEdit ? "#0277bd" : "#9e9e9e",
                      color: "white"
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => canDelete && onDelete(index)}
                    disabled={!canDelete}
                    title={
                      canDelete
                        ? "Delete record"
                        : "Only admins can delete records"
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: canDelete ? "pointer" : "not-allowed",
                      background: canDelete ? "#e53935" : "#9e9e9e",
                      color: "white"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export default PatientList;
