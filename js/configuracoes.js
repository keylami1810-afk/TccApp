import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { obterTemaSalvo, salvarTema, temasDoProjeto } from "./temas";

export default function Configuracoes() {
  const router = useRouter();
  const [temaAtual, setTemaAtual] = useState("principal");

  const Cores = temasDoProjeto[temaAtual] || temasDoProjeto.principal;

  useEffect(() => {
    carregarTemaSalvo();
  }, []);

  async function carregarTemaSalvo() {
    const temaSalvo = await obterTemaSalvo();
    setTemaAtual(temaSalvo);
  }

  const selecionarTema = async (nomeTema) => {
    setTemaAtual(nomeTema);
    await salvarTema(nomeTema);
    Alert.alert("Sucesso", `Tema alterado para: ${temasDoProjeto[nomeTema].nome}.`);
  };

  const sairDaConta = () => {
    Alert.alert("Sair", "Deseja realmente encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => router.replace("/") },
    ]);
  };

  const listaTemas = Object.entries(temasDoProjeto);

  return (
    <View style={[styles.container, { backgroundColor: Cores.fundo }]}>
      <View style={[styles.topo, { backgroundColor: Cores.botao }]}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={24} color={Cores.textoBotao} />
        </TouchableOpacity>
        <Text style={[styles.tituloTopo, { color: Cores.textoBotao }]}>
          Configurações
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.secaoTitulo, { color: Cores.textoGeral }]}>
          Aparência e Tema
        </Text>
        <Text style={[styles.descricao, { color: Cores.textoGeral }]}>
          Escolha um tema. Cada opção possui sua própria imagem de fundo.
        </Text>

        <View style={[styles.caixaOpcao, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda }]}>
          {listaTemas.map(([chave, tema]) => (
            <TouchableOpacity
              key={chave}
              style={[
                styles.btnTema,
                { borderColor: Cores.borda },
                temaAtual === chave && { borderWidth: 2 },
              ]}
              onPress={() => selecionarTema(chave)}
              activeOpacity={0.85}
            >
              <Image source={tema.imagem} style={styles.preview} resizeMode="cover" />
              <View style={styles.infoTema}>
                <Text style={[styles.nomeTema, { color: Cores.textoGeral }]}>
                  {tema.nome}
                </Text>
                <Text style={[styles.chaveTema, { color: Cores.textoGeral }]}>
                  {chave === "principal" ? "Tema principal" : "Tema personalizado"}
                </Text>
              </View>
              {temaAtual === chave && (
                <Ionicons name="checkmark-circle" size={24} color={Cores.botao} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btnSair, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda }]}
          onPress={sairDaConta}
        >
          <MaterialIcons name="exit-to-app" size={24} color="#e74c3c" />
          <Text style={styles.textoSair}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topo: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  tituloTopo: { fontSize: 20, fontWeight: "bold" },
  conteudo: { padding: 20, paddingBottom: 40 },
  secaoTitulo: { fontSize: 18, fontWeight: "bold", marginBottom: 6 },
  descricao: { fontSize: 13, opacity: 0.75, marginBottom: 14 },
  caixaOpcao: { borderWidth: 1, borderRadius: 14, padding: 10, marginBottom: 20 },
  btnTema: {
    minHeight: 70,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  preview: { width: 54, height: 54, borderRadius: 8 },
  infoTema: { flex: 1, marginLeft: 12 },
  nomeTema: { fontSize: 15, fontWeight: "bold" },
  chaveTema: { fontSize: 11, opacity: 0.65, marginTop: 2 },
  btnSair: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
  },
  textoSair: { color: "#e74c3c", fontWeight: "bold", fontSize: 16 },
});
