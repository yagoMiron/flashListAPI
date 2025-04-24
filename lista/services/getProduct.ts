import axios from "axios";

const API_URL = "http://localhost:3000";

const getProduct = async () => {
  try {
    const response = await axios.get(`${API_URL}/produtos`);
    return response.data;
  } catch (err) {
    console.error("Erro no GET do /produto");
  }
};

export default getProduct;
