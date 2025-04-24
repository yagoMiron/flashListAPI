import axios from "axios";

const API_URL = "http://localhost:3000";

const postProduct = async (nome: string, preco: string) => {
  const produto = {
    nome,
    preco,
  };
  try {
    await axios.post(`${API_URL}/produto`, produto);
  } catch (err) {
    console.error("Erro no POST do /produto");
  }
};

export default postProduct;
