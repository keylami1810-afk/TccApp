import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { temas } from "./temas";

const ATIVIDADES = {
  renda: {
    modulo: "Começando com dinheiro",
    numero: "01",
    titulo: "O que é renda?",
    pergunta:
      "Imagine que você recebe R$ 500 por mês fazendo pequenos trabalhos. Esse dinheiro é considerado:",
    opcoes: [
      "Uma renda",
      "Uma despesa",
      "Uma dívida",
      "Um investimento",
    ],
    resposta: "Uma renda",
    explicacao:
      "Renda é todo dinheiro que entra. Pode vir de salário, trabalhos, mesada, benefícios ou outras fontes.",
    icone: "cash-outline",
  },

  necessidade: {
    modulo: "Começando com dinheiro",
    numero: "02",
    titulo: "Necessidade ou desejo?",
    pergunta:
      "Você tem R$ 100 e precisa comprar um material escolar que custa R$ 40. Também encontrou um jogo que custa R$ 90. Qual seria a decisão mais consciente?",
    opcoes: [
      "Comprar o material escolar",
      "Comprar o jogo",
      "Comprar os dois",
      "Não comprar nada",
    ],
    resposta: "Comprar o material escolar",
    explicacao:
      "Uma necessidade é algo importante para sua rotina. Antes de gastar com desejos, é importante garantir aquilo que realmente precisamos.",
    icone: "cart-outline",
  },

  gastos: {
    modulo: "Começando com dinheiro",
    numero: "03",
    titulo: "O que são gastos?",
    pergunta:
      "Você recebeu R$ 200 e utilizou R$ 50 para comprar comida. Os R$ 50 representam:",
    opcoes: [
      "Uma renda",
      "Um gasto",
      "Uma meta",
      "Uma economia",
    ],
    resposta: "Um gasto",
    explicacao:
      "Gasto é o dinheiro que sai do seu orçamento para pagar produtos, serviços ou outras necessidades.",
    icone: "wallet-outline",
  },
};

export default function AtividadeQuestao() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const atividade = ATIVIDADES[params.id];

  const [tema, setTema] = useState(temas.claro);
  const [selecionada, setSelecionada] = useState(null);
  const [respondeu, setRespondeu] = useState(false);
  const [acertou, setAcertou] = useState(false);

  useEffect(() => {
    carregarTema();
  }, []);

  async function carregarTema() {
    try {
      const temaSalvo = await AsyncStorage.getItem("@tema_app");

      if (temaSalvo && temas[temaSalvo]) {
        setTema(temas[temaSalvo]);
      }
    } catch (error) {
      console.log("Erro ao carregar tema:", error);
    }
  }

  if (!atividade) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: tema.fundo },
        ]}
      >
        <Text style={{ color: tema.textoGeral }}>
          Atividade não encontrada.
        </Text>
      </View>
    );
  }

  async function responder(opcao) {
    if (respondeu) return;

    const correta = opcao === atividade.resposta;

    setSelecionada(opcao);
    setAcertou(correta);
    setRespondeu(true);

    if (correta) {
      try {
        const concluidasSalvas =
          await AsyncStorage.getItem("@atividades_concluidas");

        const concluidas = concluidasSalvas
          ? JSON.parse(concluidasSalvas)
          : [];

        if (!concluidas.includes(params.id)) {
          concluidas.push(params.id);

          await AsyncStorage.setItem(
            "@atividades_concluidas",
            JSON.stringify(concluidas)
          );

          const pontosSalvos =
            await AsyncStorage.getItem("@pontos_atividades");

          const pontos = Number(pontosSalvos || 0);

          await AsyncStorage.setItem(
            "@pontos_atividades",
            String(pontos + 10)
          );
        }
      } catch (error) {
        console.log("Erro ao salvar atividade:", error);
      }
    }
  }

  function voltar() {
    router.back();
  }

  function continuar() {
    router.back();
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: tema.fundo },
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { borderBottomColor: tema.borda },
        ]}
      >
        <TouchableOpacity
          style={styles.voltar}
          onPress={voltar}
        >
          <Ionicons
            name="arrow-back"
            size={25}
            color={tema.textoGeral}
          />
        </TouchableOpacity>

        <View style={styles.progressoHeader}>
          <View
            style={[
              styles.progressoFundo,
              { backgroundColor: tema.caixaInput },
            ]}
          >
            <View
              style={[
                styles.progressoAtual,
                { backgroundColor: tema.botao },
              ]}
            />
          </View>
        </View>

        <View style={styles.xpHeader}>
          <Ionicons
            name="star"
            size={19}
            color={tema.botao}
          />
          <Text
            style={[
              styles.xpTexto,
              { color: tema.textoGeral },
            ]}
          >
            +10 XP
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        {/* IDENTIFICAÇÃO */}
        <View style={styles.identificacao}>
          <View
            style={[
              styles.iconeModulo,
              { backgroundColor: tema.botao },
            ]}
          >
            <Ionicons
              name={atividade.icone}
              size={28}
              color={tema.textoBotao}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.modulo,
                { color: tema.botao },
              ]}
            >
              {atividade.modulo}
            </Text>

            <Text
              style={[
                styles.numero,
                { color: tema.textoGeral },
              ]}
            >
              ATIVIDADE {atividade.numero}
            </Text>
          </View>
        </View>

        {/* TÍTULO */}
        <Text
          style={[
            styles.titulo,
            { color: tema.textoGeral },
          ]}
        >
          {atividade.titulo}
        </Text>

        {/* PERGUNTA */}
        <View
          style={[
            styles.perguntaCard,
            {
              backgroundColor: tema.caixaInput,
              borderColor: tema.borda,
            },
          ]}
        >
          <View
            style={[
              styles.perguntaTag,
              { backgroundColor: tema.botao },
            ]}
          >
            <Text
              style={[
                styles.perguntaTagTexto,
                { color: tema.textoBotao },
              ]}
            >
              DESAFIO
            </Text>
          </View>

          <Text
            style={[
              styles.pergunta,
              { color: tema.textoGeral },
            ]}
          >
            {atividade.pergunta}
          </Text>
        </View>

        {/* OPÇÕES */}
        <Text
          style={[
            styles.escolhaTexto,
            { color: tema.textoGeral },
          ]}
        >
          Escolha uma resposta:
        </Text>

        {atividade.opcoes.map((opcao, index) => {
          const selecionadaAtual =
            selecionada === opcao;

          const correta =
            respondeu &&
            opcao === atividade.resposta;

          const errada =
            respondeu &&
            selecionadaAtual &&
            !acertou;

          return (
            <TouchableOpacity
              key={opcao}
              activeOpacity={0.8}
              disabled={respondeu}
              onPress={() => responder(opcao)}
              style={[
                styles.opcao,
                {
                  backgroundColor: tema.caixaInput,
                  borderColor: tema.borda,
                },
                selecionadaAtual && {
                  borderColor: tema.botao,
                  borderWidth: 2,
                },
                correta && {
                  borderColor: "#38C172",
                  backgroundColor: "#E8F8EF",
                },
                errada && {
                  borderColor: "#E85D75",
                  backgroundColor: "#FDECEF",
                },
              ]}
            >
              <View
                style={[
                  styles.letra,
                  { borderColor: tema.botao },
                  correta && {
                    backgroundColor: "#38C172",
                    borderColor: "#38C172",
                  },
                  errada && {
                    backgroundColor: "#E85D75",
                    borderColor: "#E85D75",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.letraTexto,
                    { color: tema.botao },
                    (correta || errada) && {
                      color: "#FFFFFF",
                    },
                  ]}
                >
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>

              <Text
                style={[
                  styles.opcaoTexto,
                  { color: tema.textoGeral },
                ]}
              >
                {opcao}
              </Text>

              {correta && (
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  color="#38C172"
                />
              )}

              {errada && (
                <Ionicons
                  name="close-circle"
                  size={25}
                  color="#E85D75"
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* FEEDBACK */}
        {respondeu && (
          <View
            style={[
              styles.feedback,
              acertou
                ? styles.feedbackCorreto
                : styles.feedbackErrado,
            ]}
          >
            <View style={styles.feedbackTopo}>
              <Ionicons
                name={
                  acertou
                    ? "checkmark-circle"
                    : "alert-circle"
                }
                size={30}
                color={acertou ? "#269B5A" : "#D94A64"}
              />

              <Text
                style={[
                  styles.feedbackTitulo,
                  {
                    color: acertou
                      ? "#269B5A"
                      : "#D94A64",
                  },
                ]}
              >
                {acertou
                  ? "Muito bem! 🎉"
                  : "Quase lá!"}
              </Text>
            </View>

            <Text style={styles.feedbackTexto}>
              {acertou
                ? "+10 XP adicionados à sua jornada!"
                : `A resposta correta é: ${atividade.resposta}`}
            </Text>

            <Text style={styles.explicacao}>
              {atividade.explicacao}
            </Text>
          </View>
        )}

        {/* BOTÃO */}
        {respondeu && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={continuar}
            style={[
              styles.continuar,
              { backgroundColor: tema.botao },
            ]}
          >
            <Text
              style={[
                styles.continuarTexto,
                { color: tema.textoBotao },
              ]}
            >
              Continuar
            </Text>

            <Ionicons
              name="arrow-forward"
              size={21}
              color={tema.textoBotao}
            />
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: 75,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },

  voltar: {
    width: 40,
  },

  progressoHeader: {
    flex: 1,
    marginHorizontal: 10,
  },

  progressoFundo: {
    height: 9,
    borderRadius: 10,
    overflow: "hidden",
  },

  progressoAtual: {
    height: "100%",
    width: "35%",
    borderRadius: 10,
  },

  xpHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  xpTexto: {
    fontWeight: "800",
    fontSize: 13,
  },

  conteudo: {
    padding: 22,
  },

  identificacao: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconeModulo: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  modulo: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 3,
  },

  numero: {
    fontSize: 11,
    opacity: 0.55,
    fontWeight: "700",
    letterSpacing: 1,
  },

  titulo: {
    fontSize: 31,
    fontWeight: "900",
    marginBottom: 22,
  },

  perguntaCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    marginBottom: 25,
  },

  perguntaTag: {
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 15,
  },

  perguntaTagTexto: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },

  pergunta: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 29,
  },

  escolhaTexto: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },

  opcao: {
    minHeight: 67,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },

  letra: {
    width: 39,
    height: 39,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  letraTexto: {
    fontSize: 15,
    fontWeight: "900",
  },

  opcaoTexto: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },

  feedback: {
    marginTop: 10,
    padding: 20,
    borderRadius: 22,
  },

  feedbackCorreto: {
    backgroundColor: "#E8F8EF",
  },

  feedbackErrado: {
    backgroundColor: "#FDECEF",
  },

  feedbackTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 8,
  },

  feedbackTitulo: {
    fontSize: 20,
    fontWeight: "900",
  },

  feedbackTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 10,
  },

  explicacao: {
    fontSize: 14,
    lineHeight: 21,
    color: "#555555",
  },

  continuar: {
    marginTop: 18,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  continuarTexto: {
    fontSize: 17,
    fontWeight: "900",
  },
});