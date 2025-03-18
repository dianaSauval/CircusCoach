const FormationForm = ({ formData, setFormData, activeTab }) => {
    return (
      
      <>
      
        <input
          type="text"
          name="title"
          value={formData?.title?.[activeTab] || ""}
          onChange={(e) => setFormData({ ...formData, title: { ...formData.title, [activeTab]: e.target.value } })}
          placeholder="Título"
        />
        <textarea
          name="description"
          value={formData?.description?.[activeTab] || ""}
          onChange={(e) => setFormData({ ...formData, description: { ...formData.description, [activeTab]: e.target.value } })}
          placeholder="Descripción"
        />
        <input
          type="number"
          name="price"
          value={formData?.price || ""}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          placeholder="Precio"
        />
  

      </>
    );
  };
  
  export default FormationForm;
  
  