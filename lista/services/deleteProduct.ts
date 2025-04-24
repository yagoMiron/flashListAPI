import axios from "axios";

const API_URL = "http://localhost:3000";

const deleteProduct = async (nome: string) => {
  try {
    await axios.delete(`${API_URL}/produto`, { data: { nome } });
  } catch (err) {
    console.error("Erro no DELETE do /produto");
  }
};

export default deleteProduct;
