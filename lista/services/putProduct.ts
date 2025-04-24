import axios from "axios";

const API_URL = "http://localhost:3000";

const putProduct = async (nome: string, preco: string) => {
  const produto = {
    nome,
    preco,
  };
  try {
    await axios.put(`${API_URL}/produto`, produto);
  } catch (err) {
    console.error("Erro no PUT do /produto");
  }
};

export default putProduct;
