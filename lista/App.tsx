import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import '@expo/metro-runtime';

type Produto = {
  _id?: string;
  nome: string;
  preco: number;
};

const API_URL = "http://localhost:3000";

export default function App() {
  // Inicializando a state 'tarefas' com o valor [ "Tarefa 1", "Tarefa 2" ]
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");

  useEffect(() => {
    getProdutos();
  }, []);

  const getProdutos = async () => {
    try {
      const response = await axios.get(`${API_URL}/produtos`);
      const listaDeProdutos: Produto[] = [];
      for (let i = 0; i < response.data.length; i++) {
        listaDeProdutos.push({
          _id: response.data[i]._id,
          nome: response.data[i].nome,
          preco: response.data[i].preco,
        });
      }
      setProdutos(listaDeProdutos);
    } catch (err) {
      console.error("Erro no GET do /produtos");
    }
  };

  // Função que altera a state 'tarefas' quando o botão é clicado
  const addProduto = async () => {
    // setTarefas(tarefas.concat([texto]))
    try {
      const novoProduto = {
        nome: nomeProduto,
        preco: precoProduto,
      };
      const response = await axios.post(`${API_URL}/produto`, novoProduto);
      await getProdutos();
      setNomeProduto("");
      setPrecoProduto("");
    } catch (err) {
      console.log("Erro no POST do /produto");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.linha}>
        <TextInput
          style={styles.input}
          value={nomeProduto}
          placeholder="Digite algo..."
          onChangeText={setNomeProduto}
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={precoProduto}
          placeholder="Digite um valor"
          onChangeText={(text) => {
            setPrecoProduto(text.replace(/[^0-9]/g, ''))
        }}
        />
        <TouchableOpacity style={styles.button} onPress={addProduto}>
          <Text style={{ color: "white" }}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlashList
        data={produtos}
        estimatedItemSize={20}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.textBtn}>
              {item.nome} - R${item.preco}
            </Text>
            <View style={styles.btns}>
              <TouchableOpacity>
                <MaterialIcons name="edit-square" size={22} color={"orange"} />
              </TouchableOpacity>
              <TouchableOpacity>
                <MaterialIcons
                  name="highlight-remove"
                  size={22}
                  color={"red"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: "#8aff86",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    width: "60%",
    padding: 5,
  },
  button: {
    backgroundColor: "blue",
    width: 50,
    padding: 10,
    borderRadius: 5,
    alignContent: "center",
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btns: {
    flexDirection: "row",
    gap: 10,
  },
  textBtn: {
    fontSize: 16,
    fontWeight: 500,
  },
});
