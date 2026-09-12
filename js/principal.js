import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { temasDoProjeto } from "./temas";

const larguraTela = Dimensions.get("window").width;

export default function Principal() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Despesa");
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toLocaleDateString("pt-BR")
  );

  const [movimentacoes, setMovimentacoes] = useState([]);
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");

  const [temaAtual, setTemaAtual] = useState("claro");
  const Cores = temasDoProjeto[temaAtual] || temasDoProjeto.claro;

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        try {
          if (params.nomeUsuario) {
            setNomeUsuario(params.nomeUsuario);
            await AsyncStorage.setItem("@nome_usuario", params.nomeUsuario);
          } else {
            const nomeSalvo = await AsyncStorage.getItem("@nome_usuario");
            if (nomeSalvo) setNomeUsuario(nomeSalvo);
          }

          const dadosSalvos = await AsyncStorage.getItem("@movimentacoes_user");
          if (dadosSalvos) {
            setMovimentacoes(JSON.parse(dadosSalvos));
          }

          const temaSalvo = await AsyncStorage.getItem("@tema_app");
          if (temaSalvo && temasDoProjeto[temaSalvo]) {
            setTemaAtual(temaSalvo);
          }
        } catch (error) {
          console.log("Erro ao carregar dados:", error);
        }
      }
      carregarDados();
    }, [params.nomeUsuario])
  );

  const salvarMovimentacoesNoStorage = async (novasMovimentacoes) => {
    try {
      setMovimentacoes(novasMovimentacoes);
      await AsyncStorage.setItem(
        "@movimentacoes_user",
        JSON.stringify(novasMovimentacoes)
      );
    } catch (error) {
      console.log("Erro ao salvar movimentação:", error);
    }
  };

  const receitas = movimentacoes
    .filter((item) => item.tipo === "Receita")
    .reduce((total, item) => total + Number(item.valor), 0);

  const despesas = movimentacoes
    .filter((item) => item.tipo === "Despesa")
    .reduce((total, item) => total + Number(item.valor), 0);

  const saldo = receitas - despesas;

  const CORES_GRAFICO = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
  const dadosGrafico =
    movimentacoes.length > 0
      ? movimentacoes.map((item, index) => ({
          name: item.descricao,
          population: Number(item.valor),
          color:
            item.tipo === "Receita"
              ? "#2ecc71"
              : CORES_GRAFICO[index % CORES_GRAFICO.length],
          legendFontColor: Cores.textoGeral,
          legendFontSize: 12,
        }))
      : [
          {
            name: "Sem registros",
            population: 1,
            color: "#ccc",
            legendFontColor: "#888",
            legendFontSize: 12,
          },
        ];

  function adicionarMovimentacao() {
    if (!descricao || !valor) return;

    const nova = {
      id: Date.now().toString(),
      descricao,
      valor: Number(valor),
      tipo,
      data: dataSelecionada,
    };

    const listaAtualizada = [nova, ...movimentacoes];
    salvarMovimentacoesNoStorage(listaAtualizada);

    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setModalVisible(false);
  }

  function excluirMovimentacao(id) {
    const listaFiltrada = movimentacoes.filter((item) => item.id !== id);
    salvarMovimentacoesNoStorage(listaFiltrada);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Cores.fundo }]}>
      <View style={[styles.topo, { backgroundColor: Cores.botao }]}>
        <Text style={[styles.nomeUsuario, { color: Cores.textoBotao }]}>
          Olá, {nomeUsuario} 
        </Text>
        <Text style={[styles.subtitulo, { color: Cores.textoBotao }]}>
          Painel Financeiro
        </Text>
      </View>

      <View style={styles.resumoCards}>
        <View style={[styles.card, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda, borderWidth: 1 }]}>
          <Text style={[styles.cardLabel, { color: Cores.textoGeral }]}>Receitas</Text>
          <Text style={[styles.cardValue, { color: "#2ecc71" }]}>R$ {receitas}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda, borderWidth: 1 }]}>
          <Text style={[styles.cardLabel, { color: Cores.textoGeral }]}>Despesas</Text>
          <Text style={[styles.cardValue, { color: "#e74c3c" }]}>R$ {despesas}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda, borderWidth: 1 }]}>
          <Text style={[styles.cardLabel, { color: Cores.textoGeral }]}>Saldo</Text>
          <Text style={[styles.cardValue, { color: Cores.textoGeral }]}>R$ {saldo}</Text>
        </View>
      </View>

      <Text style={[styles.tituloSecao, { color: Cores.textoGeral }]}>
        Histórico
      </Text>

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", color: "#888", marginVertical: 15 }}>
            Nenhuma movimentação lançada ainda.
          </Text>
        )}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda, borderWidth: 1 }]}>
            <View>
              <Text style={[styles.itemDesc, { color: Cores.textoGeral }]}>
                {item.descricao}
              </Text>
              <Text style={{ color: "#888", fontSize: 11 }}>{item.data}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text
                style={[
                  styles.itemValor,
                  { color: item.tipo === "Receita" ? "#2ecc71" : "#e74c3c" },
                ]}
              >
                {item.tipo === "Receita" ? "+" : "-"} R$ {item.valor}
              </Text>
              <TouchableOpacity onPress={() => excluirMovimentacao(item.id)}>
                <MaterialIcons name="delete" size={20} color={Cores.botao} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ maxHeight: 180 }}
      />

      <View style={{ alignItems: "center", marginTop: 10 }}>
        <PieChart
          data={dadosGrafico}
          width={larguraTela - 20}
          height={160}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 0]}
          chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
        />
      </View>

      <View style={[styles.menuInferior, { backgroundColor: Cores.botao }]}>
        <TouchableOpacity onPress={() => router.push("/principal")}>
          <Ionicons name="home" size={24} color={Cores.textoBotao} style={{ alignSelf: "center" }} />
          <Text style={[styles.menuTexto, { color: Cores.textoBotao }]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.botaoAdd, { backgroundColor: Cores.caixaInput }]} onPress={() => setModalVisible(true)}>
          <FontAwesome5 name="plus" size={24} color={Cores.botao} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/configuracoes")}>
          <MaterialIcons name="settings" size={26} color={Cores.textoBotao} style={{ alignSelf: "center" }} />
          <Text style={[styles.menuTexto, { color: Cores.textoBotao }]}>Config</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={[styles.caixaModal, { backgroundColor: Cores.caixaInput }]}>
            <Text style={[styles.modalTitulo, { color: Cores.textoGeral }]}>
              Nova Movimentação
            </Text>

            <TextInput
              placeholder="Descrição"
              placeholderTextColor="#888"
              style={[styles.input, { color: Cores.textoGeral, borderColor: Cores.borda }]}
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              placeholder="Valor (R$)"
              placeholderTextColor="#888"
              style={[styles.input, { color: Cores.textoGeral, borderColor: Cores.borda }]}
              keyboardType="numeric"
              value={valor}
              onChangeText={setValor}
            />
            <TextInput
              placeholder="Data (DD/MM/AAAA)"
              placeholderTextColor="#888"
              style={[styles.input, { color: Cores.textoGeral, borderColor: Cores.borda }]}
              value={dataSelecionada}
              onChangeText={setDataSelecionada}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 5,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: tipo === "Receita" ? "#2ecc71" : "#e0e0e0",
                }}
                onPress={() => setTipo("Receita")}
              >
                <Text style={{ fontWeight: "bold", color: tipo === "Receita" ? "#ffffff" : "#333333" }}>
                  Receita
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 5,
                  padding: 12,
                  borderRadius: 8,
                  alignItems: "center",
                  backgroundColor: tipo === "Despesa" ? "#e74c3c" : "#e0e0e0",
                }}
                onPress={() => setTipo("Despesa")}
              >
                <Text style={{ fontWeight: "bold", color: tipo === "Despesa" ? "#ffffff" : "#333333" }}>
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.salvar, { backgroundColor: Cores.botao }]} onPress={adicionarMovimentacao}>
              <Text style={{ color: Cores.textoBotao, fontWeight: "bold" }}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ marginTop: 12, alignItems: "center" }} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#888" }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topo: { padding: 20 },
  nomeUsuario: { fontSize: 20, fontWeight: "bold" },
  subtitulo: { fontSize: 12, opacity: 0.9 },
  resumoCards: { flexDirection: "row", justifyContent: "space-around", margin: 15 },
  card: { padding: 12, borderRadius: 10, alignItems: "center", minWidth: 95 },
  cardLabel: { fontSize: 12 },
  cardValue: { fontSize: 16, fontWeight: "bold", marginTop: 2 },
  tituloSecao: { marginLeft: 15, marginBottom: 8, fontWeight: "bold", fontSize: 16 },
  item: { marginHorizontal: 15, marginVertical: 4, padding: 12, borderRadius: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemDesc: { fontWeight: "bold", fontSize: 15 },
  itemValor: { fontWeight: "bold", fontSize: 14 },
  menuInferior: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 10, position: "absolute", bottom: 0, width: "100%" },
  menuTexto: { textAlign: "center", fontSize: 11, marginTop: 2 },
  botaoAdd: { width: 52, height: 52, borderRadius: 26, justifyContent: "center", alignItems: "center", marginTop: -20 },
  modal: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  caixaModal: { margin: 20, padding: 20, borderRadius: 20 },
  modalTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 },
  salvar: { padding: 12, borderRadius: 8, alignItems: "center" },
});