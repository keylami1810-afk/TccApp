import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { obterTemaSalvo, salvarTema, temasDoProjeto } from "./temas";

export default function Configuracoes() {
  const router = useRouter();
  const [temaAtual, setTemaAtual] = useState("principal");
  const [salvandoTema, setSalvandoTema] = useState(false);

  const Cores = temasDoProjeto[temaAtual] || temasDoProjeto.principal;
  const listaTemas = Object.entries(temasDoProjeto);
  const temaClaro = ["principal", "gelo", "pastel", "retro"].includes(temaAtual);

  useEffect(() => {
    let ativo = true;
    obterTemaSalvo().then((temaSalvo) => {
      if (ativo) setTemaAtual(temaSalvo);
    });
    return () => { ativo = false; };
  }, []);

  const selecionarTema = async (nomeTema) => {
    if (salvandoTema || nomeTema === temaAtual) return;
    setSalvandoTema(true);
    try {
      await salvarTema(nomeTema);
      setTemaAtual(nomeTema);
      Alert.alert("Tema atualizado", `O tema ${temasDoProjeto[nomeTema].nome} será usado nas telas do Malomi.`);
    } catch (error) {
      Alert.alert("Não foi possível salvar", "Tente selecionar o tema novamente.");
    } finally {
      setSalvandoTema(false);
    }
  };

  const sairDaConta = () => {
    Alert.alert("Sair da conta", "Deseja realmente encerrar a sessão?", [
      { text: "Continuar no Malomi", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => router.replace("/") },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: Cores.fundo }]}>
      <StatusBar barStyle={temaClaro ? "dark-content" : "light-content"} backgroundColor={Cores.fundo} />
      <ImageBackground
        source={Cores.imagem}
        resizeMode="cover"
        style={StyleSheet.absoluteFillObject}
        imageStyle={{ opacity: temaAtual === "principal" ? 0.12 : 0.08 }}
        pointerEvents="none"
      />

      <View style={styles.topo}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.voltar, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda }]}
          hitSlop={10}
          accessibilityLabel="Voltar"
        >
          <Ionicons name="arrow-back" size={21} color={Cores.textoGeral} />
        </TouchableOpacity>
        <View style={styles.topoTexto}>
          <Text style={[styles.marca, { color: Cores.botao }]}>malomi</Text>
          <Text style={[styles.tituloTopo, { color: Cores.textoGeral }]}>Configurações</Text>
        </View>
        <View style={[styles.topoIcone, { backgroundColor: Cores.badgeBg }]}>
          <Ionicons name="options-outline" size={22} color={Cores.botao} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={[styles.introCard, { backgroundColor: Cores.cardBg || Cores.caixaInput, borderColor: Cores.borda }]}>
          <View style={[styles.introIcone, { backgroundColor: Cores.badgeBg }]}>
            <Ionicons name="color-palette-outline" size={24} color={Cores.botao} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.introTitulo, { color: Cores.textoGeral }]}>Seu Malomi, do seu jeito</Text>
            <Text style={[styles.introDescricao, { color: Cores.textoGeral }]}>Personalize a aparência do aplicativo. Sua escolha fica salva neste dispositivo.</Text>
          </View>
        </View>

        <View style={styles.secaoCabecalho}>
          <View>
            <Text style={[styles.secaoTitulo, { color: Cores.textoGeral }]}>Aparência</Text>
            <Text style={[styles.descricao, { color: Cores.textoGeral }]}>Escolha um dos 7 temas disponíveis.</Text>
          </View>
          <View style={[styles.contador, { backgroundColor: Cores.badgeBg }]}>
            <Text style={[styles.contadorTexto, { color: Cores.botao }]}>{listaTemas.length} temas</Text>
          </View>
        </View>

        <View style={styles.listaTemas}>
          {listaTemas.map(([chave, tema]) => {
            const selecionado = temaAtual === chave;
            return (
              <TouchableOpacity
                key={chave}
                style={[
                  styles.btnTema,
                  { backgroundColor: Cores.caixaInput, borderColor: selecionado ? Cores.botao : Cores.borda },
                  selecionado && styles.btnTemaSelecionado,
                ]}
                onPress={() => selecionarTema(chave)}
                activeOpacity={0.82}
                accessibilityRole="radio"
                accessibilityState={{ checked: selecionado }}
              >
                <View style={styles.previewWrap}>
                  <Image source={tema.imagem} style={styles.preview} resizeMode="cover" />
                  <View style={[styles.previewFaixa, { backgroundColor: tema.botao }]} />
                </View>
                <View style={styles.infoTema}>
                  <Text style={[styles.nomeTema, { color: Cores.textoGeral }]}>{tema.nome}</Text>
                  <Text style={[styles.chaveTema, { color: Cores.textoGeral }]}>
                    {chave === "principal" ? "Identidade Malomi" : "Tema personalizado"}
                  </Text>
                </View>
                <View style={[styles.seletor, { borderColor: selecionado ? Cores.botao : Cores.borda, backgroundColor: selecionado ? Cores.botao : "transparent" }]}>
                  {selecionado && <Ionicons name="checkmark" size={15} color={Cores.textoBotao} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={[styles.dica, { backgroundColor: Cores.badgeBg }]}>
          <Ionicons name="information-circle-outline" size={19} color={Cores.botao} />
          <Text style={[styles.dicaTexto, { color: Cores.textoGeral }]}>O tema selecionado é aplicado às telas compatíveis quando você volta para elas.</Text>
        </View>

        <TouchableOpacity
          style={[styles.btnSair, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda }]}
          onPress={sairDaConta}
          activeOpacity={0.82}
        >
          <View style={styles.sairIcone}><MaterialIcons name="logout" size={21} color="#C2415D" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.textoSair}>Sair da conta</Text>
            <Text style={styles.subtextoSair}>Voltar para a tela de acesso</Text>
          </View>
          <Ionicons name="chevron-forward" size={19} color="#C2415D" />
        </TouchableOpacity>
        <Text style={[styles.rodape, { color: Cores.textoGeral }]}>MALOMI · ORGANIZE, APRENDA, EVOLUA</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topo: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 12 },
  voltar: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  topoTexto: { flex: 1 },
  marca: { fontSize: 12, fontWeight: "800", letterSpacing: 1.7, textTransform: "uppercase" },
  tituloTopo: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5, marginTop: 2 },
  topoIcone: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  conteudo: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 34 },
  introCard: { flexDirection: "row", alignItems: "center", padding: 17, borderRadius: 22, borderWidth: 1, marginBottom: 25, shadowColor: "#5A244D", shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  introIcone: { width: 48, height: 48, borderRadius: 17, alignItems: "center", justifyContent: "center", marginRight: 13 },
  introTitulo: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  introDescricao: { fontSize: 12, lineHeight: 18, opacity: 0.72 },
  secaoCabecalho: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 },
  secaoTitulo: { fontSize: 19, fontWeight: "800", letterSpacing: -0.3 },
  descricao: { fontSize: 12, opacity: 0.7, marginTop: 4 },
  contador: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  contadorTexto: { fontSize: 10, fontWeight: "800" },
  listaTemas: { gap: 10 },
  btnTema: { minHeight: 82, borderWidth: 1, borderRadius: 19, padding: 10, flexDirection: "row", alignItems: "center", shadowColor: "#39203A", shadowOpacity: 0.035, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  btnTemaSelecionado: { borderWidth: 2, shadowOpacity: 0.09, elevation: 3 },
  previewWrap: { width: 58, height: 58, borderRadius: 15, overflow: "hidden", position: "relative" },
  preview: { width: "100%", height: "100%" },
  previewFaixa: { position: "absolute", left: 0, right: 0, bottom: 0, height: 5 },
  infoTema: { flex: 1, marginLeft: 13 },
  nomeTema: { fontSize: 15, fontWeight: "800" },
  chaveTema: { fontSize: 11, opacity: 0.62, marginTop: 4 },
  seletor: { width: 25, height: 25, borderRadius: 13, borderWidth: 1.5, alignItems: "center", justifyContent: "center", marginHorizontal: 3 },
  dica: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 13, borderRadius: 15, marginTop: 17, marginBottom: 22 },
  dicaTexto: { flex: 1, fontSize: 11, lineHeight: 16, opacity: 0.82 },
  btnSair: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 11 },
  sairIcone: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#FDECEF", alignItems: "center", justifyContent: "center" },
  textoSair: { color: "#B83250", fontWeight: "800", fontSize: 13 },
  subtextoSair: { color: "#9B7180", fontSize: 10, marginTop: 3 },
  rodape: { textAlign: "center", fontSize: 9, letterSpacing: 1.5, opacity: 0.48, marginTop: 25 },
});
