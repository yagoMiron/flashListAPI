import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import Modal from "react-native-modal";
import { useEffect, useState } from "react";
import deleteProduct from "./services/deleteProduct";
import Produto from "./model/Produto";
import postProduct from "./services/postProduct";
import getProduct from "./services/getProduct";
import putProduct from "./services/putProduct";

export default function App() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [nomeProduto, setNomeProduto] = useState("");
  const [precoProduto, setPrecoProduto] = useState("");

  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");

  useEffect(() => {
    getProdutos();
  }, []);

  const getProdutos = async () => {
    try {
      const response = await getProduct();
      const listaDeProdutos: Produto[] = [];
      for (let i = 0; i < response.length; i++) {
        listaDeProdutos.push({
          _id: response[i]._id,
          nome: response[i].nome,
          preco: response[i].preco,
        });
      }
      setProdutos(listaDeProdutos);
    } catch (err) {
      console.error("Erro no GET do /produtos");
    }
  };

  const addProduto = async () => {
    await postProduct(nomeProduto, precoProduto);
    await getProdutos();
    setNomeProduto("");
    setPrecoProduto("");
  };
  const editProduto = async () => {
    await putProduct(editNome, editPreco);
    await getProdutos();
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Digite algo..."
          value={nomeProduto}
          onChangeText={setNomeProduto}
        />
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          value={precoProduto}
          placeholder="Digite um valor"
          onChangeText={(text) => {
            setPrecoProduto(text.replace(/[^0-9]/g, ""));
          }}
        />
        <TouchableOpacity style={styles.button} onPress={addProduto}>
          <MaterialCommunityIcons name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          style={styles.list}
          data={produtos}
          estimatedItemSize={20}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.textBtn}>
                {item.nome} - R${item.preco}
              </Text>
              <View style={styles.btns}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                    setEditNome(item.nome);
                    setEditPreco(`${item.preco}`);
                  }}
                >
                  <MaterialIcons
                    name="edit-square"
                    size={28}
                    color={"orange"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const index = produtos.indexOf(item);
                    setProdutos([
                      ...produtos.slice(0, index),
                      ...produtos.slice(index + 1),
                    ]);
                    deleteProduct(item.nome);
                  }}
                >
                  <MaterialIcons
                    name="highlight-remove"
                    size={28}
                    color={"red"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="left"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.headerTitle}>Editar Produto</Text>
            <TouchableOpacity
              style={styles.closeTab}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="close" size={28} color={"white"} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalMain}>
            <View style={styles.modalInput}>
              <Text style={styles.modalInput_text}>Nome: {editNome}</Text>
            </View>
            <View style={styles.modalInput}>
              <Text style={styles.modalInput_text}>Preço: </Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={editPreco}
                placeholder="Digite um valor"
                onChangeText={(text) => {
                  setEditPreco(text.replace(/[^0-9]/g, ""));
                }}
              />
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={editProduto}>
              <Text style={styles.editBtn_text}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e7ec",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 20,
    padding: 30,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: "100%",
    backgroundColor: "white",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    gap: 10,
  },
  button: {
    backgroundColor: "#4f4fff",
    padding: 10,
    borderRadius: "50%",
  },
  list: {
    width: "auto",
    gap: 10,
  },
  listContainer: {
    width: "100%",
    paddingVertical: 10,
    gap: 10,
  },
  item: {
    backgroundColor: "#fcffdc",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
  },
  btns: {
    flexDirection: "row",
    gap: 10,
  },
  textBtn: {
    fontSize: 16,
    fontWeight: 500,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 35,
    marginVertical: "auto",
  },
  closeTab: {
    backgroundColor: "red",
    borderRadius: "50%",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    flex: 1,
    height: 200,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalMain: {
    paddingHorizontal: 28,
    paddingBottom: 20,
    gap: 8,
  },
  editBtn: {
    backgroundColor: "#4b4bff",
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 32,
    marginHorizontal: "auto",
    marginTop: 8,
  },
  editBtn_text: {
    color: "white",
    fontSize: 18,
    fontWeight: 600,
  },
  modalInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  modalInput_text: {
    fontSize: 18,
    fontWeight: 500,
  },
});
