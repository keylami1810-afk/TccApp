
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useRouter,
  useLocalSearchParams,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { temasDoProjeto } from "./temas";

const ATIVIDADES = [
  {
    id: "dinheiro-1",
    modulo: 1,
    titulo: "O que é renda?",
    pergunta:
      "O que podemos considerar como renda de uma pessoa?",
    opcoes: [
      "O dinheiro que entra para a pessoa",
      "Somente o dinheiro guardado",
      "Somente o dinheiro gasto",
      "Apenas dinheiro recebido de amigos",
    ],
    resposta: 0,
    explicacao:
      "Renda é todo dinheiro que entra para uma pessoa, como salário, mesada, bolsa ou outros recebimentos.",
  },

  {
    id: "dinheiro-2",
    modulo: 1,
    titulo: "Necessidade ou desejo?",
    pergunta:
      "Você tem R$ 50 e precisa escolher entre comprar comida ou um jogo. Qual representa uma necessidade básica?",
    opcoes: [
      "Comprar o jogo",
      "Comprar comida",
      "Comprar uma roupa por diversão",
      "Comprar um acessório",
    ],
    resposta: 1,
    explicacao:
      "Alimentação é uma necessidade básica. Desejos podem ser importantes, mas normalmente podem esperar quando o orçamento está apertado.",
  },

  {
    id: "dinheiro-3",
    modulo: 1,
    titulo: "Gastos",
    pergunta:
      "Qual destas opções representa melhor um gasto?",
    opcoes: [
      "Receber salário",
      "Guardar dinheiro",
      "Pagar uma conta",
      "Receber uma mesada",
    ],
    resposta: 2,
    explicacao:
      "Um gasto acontece quando você utiliza dinheiro para comprar algo ou pagar por um serviço.",
  },

  {
    id: "orcamento-1",
    modulo: 2,
    titulo: "Quanto sobrou?",
    pergunta:
      "Você recebeu R$ 800 e gastou R$ 500. Quanto dinheiro sobrou?",
    opcoes: [
      "R$ 200",
      "R$ 250",
      "R$ 300",
      "R$ 400",
    ],
    resposta: 2,
    explicacao:
      "Para descobrir o saldo, subtraímos os gastos da renda: R$ 800 - R$ 500 = R$ 300.",
  },

  {
    id: "orcamento-2",
    modulo: 2,
    titulo: "Planejamento",
    pergunta:
      "Qual é uma boa prática para organizar seu orçamento?",
    opcoes: [
      "Gastar todo o dinheiro assim que receber",
      "Não acompanhar os gastos",
      "Planejar quanto será gasto e quanto será guardado",
      "Comprar primeiro e pensar depois",
    ],
    resposta: 2,
    explicacao:
      "Planejar os gastos ajuda a entender para onde seu dinheiro está indo e evita comprometer todo o orçamento.",
  },

  {
    id: "orcamento-3",
    modulo: 2,
    titulo: "Meta financeira",
    pergunta:
      "Você quer comprar algo que custa R$ 300. Qual atitude ajuda a alcançar essa meta?",
    opcoes: [
      "Guardar uma quantia regularmente",
      "Gastar todo o dinheiro disponível",
      "Ignorar quanto custa o produto",
      "Fazer várias compras por impulso",
    ],
    resposta: 0,
    explicacao:
      "Definir uma meta e guardar uma quantia regularmente torna mais fácil alcançar um objetivo financeiro.",
  },

  {
    id: "consumo-1",
    modulo: 3,
    titulo: "Compra por impulso",
    pergunta:
      "Você viu um produto em promoção, mas não precisava dele. O que é mais consciente?",
    opcoes: [
      "Comprar imediatamente porque está em promoção",
      "Comprar vários para aproveitar",
      "Pensar se realmente precisa antes de comprar",
      "Usar todo o dinheiro disponível",
    ],
    resposta: 2,
    explicacao:
      "Uma promoção não significa que a compra seja necessária. Pensar antes de comprar ajuda a evitar gastos por impulso.",
  },

  {
    id: "consumo-2",
    modulo: 3,
    titulo: "Comparando preços",
    pergunta:
      "Duas lojas vendem o mesmo produto. O que você deve fazer antes de comprar?",
    opcoes: [
      "Comprar na primeira loja",
      "Comparar os preços e condições",
      "Escolher sempre o produto mais caro",
      "Comprar sem verificar o preço",
    ],
    resposta: 1,
    explicacao:
      "Comparar preços e condições pode ajudar a encontrar uma opção mais vantajosa.",
  },

  {
    id: "consumo-3",
    modulo: 3,
    titulo: "Decisão financeira",
    pergunta:
      "Você tem pouco dinheiro disponível este mês. Qual atitude é mais adequada?",
    opcoes: [
      "Gastar tudo com lazer",
      "Ignorar as contas",
      "Priorizar necessidades e controlar os gastos",
      "Fazer compras por impulso",
    ],
    resposta: 2,
    explicacao:
      "Quando o dinheiro está limitado, é importante priorizar necessidades e controlar os gastos.",
  },
];

export default function Atividade() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const atividadeId = params.atividadeId;

  const atividade = ATIVIDADES.find(
    (item) => item.id === atividadeId
  );

  const [temaAtual, setTemaAtual] = useState("claro");
  const [respostaSelecionada, setRespostaSelecionada] =
    useState(null);

  const [respondeu, setRespondeu] = useState(false);
  const [pontosGanhos, setPontosGanhos] = useState(0);
  const [jaConcluida, setJaConcluida] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const temaSalvo =
          await AsyncStorage.getItem("@tema_app");

        if (
          temaSalvo &&
          temasDoProjeto &&
          temasDoProjeto[temaSalvo]
        ) {
          setTemaAtual(temaSalvo);
        }

        const atividadesSalvas =
          await AsyncStorage.getItem(
            "@atividades_concluidas"
          );

        if (atividadesSalvas && atividade) {
          const lista = JSON.parse(atividadesSalvas);

          if (lista.includes(atividade.id)) {
            setJaConcluida(true);
          }
        }
      } catch (error) {
        console.log(
          "Erro ao carregar atividade:",
          error
        );
      }
    }

    carregarDados();
  }, [atividadeId]);

  const Cores =
    (temasDoProjeto && temasDoProjeto[temaAtual]) ||
    (temasDoProjeto && temasDoProjeto.claro) || {
      fundo: "#F3E8FF",
      caixaInput: "#FFFFFF",
      borda: "#DDD",
      botao: "#B76EA4",
      textoBotao: "#FFFFFF",
      textoGeral: "#4A154B",
    };

  if (!atividade) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: Cores.fundo,
          },
        ]}
      >
        <View style={styles.erroContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color="#B76EA4"
          />

          <Text
            style={[
              styles.erroTitulo,
              {
                color: Cores.textoGeral,
              },
            ]}
          >
            Atividade não encontrada
          </Text>

          <TouchableOpacity
            style={[
              styles.botaoVoltarErro,
              {
                backgroundColor: Cores.botao,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                styles.textoBotao,
                {
                  color: Cores.textoBotao,
                },
              ]}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const responder = async () => {
    if (respostaSelecionada === null || respondeu) {
      return;
    }

    const acertou =
      respostaSelecionada === atividade.resposta;

    setRespondeu(true);

    if (!acertou) {
      setPontosGanhos(0);
      return;
    }

    if (jaConcluida) {
      setPontosGanhos(0);
      return;
    }

    try {
      const pontosSalvos =
        await AsyncStorage.getItem(
          "@pontos_atividades"
        );

      const pontosAtuais = Number(pontosSalvos || 0);

      const novosPontos = pontosAtuais + 10;

      await AsyncStorage.setItem(
        "@pontos_atividades",
        String(novosPontos)
      );

      const atividadesSalvas =
        await AsyncStorage.getItem(
          "@atividades_concluidas"
        );

      let lista = atividadesSalvas
        ? JSON.parse(atividadesSalvas)
        : [];

      if (!lista.includes(atividade.id)) {
        lista.push(atividade.id);

        await AsyncStorage.setItem(
          "@atividades_concluidas",
          JSON.stringify(lista)
        );
      }

      setPontosGanhos(10);
      setJaConcluida(true);
    } catch (error) {
      console.log(
        "Erro ao salvar progresso:",
        error
      );
    }
  };

  const proximaAtividade = () => {
    const indiceAtual = ATIVIDADES.findIndex(
      (item) => item.id === atividade.id
    );

    const proxima = ATIVIDADES[indiceAtual + 1];

    if (!proxima) {
      router.replace("/atividadesaluno");
      return;
    }

    router.replace({
      pathname: "/atividade",
      params: {
        atividadeId: proxima.id,
        moduloId: String(proxima.modulo),
      },
    });
  };

  const voltar = () => {
    router.back();
  };

  const acertou =
    respostaSelecionada === atividade.resposta;

  const numeroAtividade =
    ATIVIDADES.findIndex(
      (item) => item.id === atividade.id
    ) + 1;

  const totalAtividades = ATIVIDADES.length;

  const progresso =
    (numeroAtividade / totalAtividades) * 100;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: Cores.fundo,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scroll
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={voltar}
            style={styles.voltar}
          >
            <Ionicons
              name="arrow-back"
              size={25}
              color={Cores.textoGeral}
            />
          </TouchableOpacity>

          <View style={styles.headerCentro}>
            <Text
              style={[
                styles.headerTitulo,
                {
                  color: Cores.textoGeral,
                },
              ]}
            >
              Atividade
            </Text>

            <Text style={styles.headerNumero}>
              {numeroAtividade} de{" "}
              {totalAtividades}
            </Text>
          </View>

          <View style={styles.xp}>
            <Ionicons
              name="star"
              size={18}
              color="#f1c40f"
            />

            <Text style={styles.xpTexto}>
              +10 XP
            </Text>
          </View>
        </View>

        <View style={styles.barraContainer}>
          <View
            style={styles.barraFundo}
          >
            <View
              style={[
                styles.barra,
                {
                  width: `${progresso}%`,
                  backgroundColor:
                    Cores.botao,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.conteudo}>
          <View
            style={[
              styles.etiqueta,
              {
                backgroundColor:
                  Cores.botao,
              },
            ]}
          >
            <Text
              style={[
                styles.etiquetaTexto,
                {
                  color:
                    Cores.textoBotao,
                },
              ]}
            >
              Módulo {atividade.modulo}
            </Text>
          </View>

          <Text
            style={[
              styles.titulo,
              {
                color: Cores.textoGeral,
              },
            ]}
          >
            {atividade.titulo}
          </Text>

          <View
            style={[
              styles.perguntaCard,
              {
                backgroundColor:
                  Cores.caixaInput,
                borderColor: Cores.borda,
              },
            ]}
          >
            <View
              style={[
                styles.iconePergunta,
                {
                  backgroundColor:
                    `${Cores.botao}20`,
                },
              ]}
            >
              <Ionicons
                name="help"
                size={25}
                color={Cores.botao}
              />
            </View>

            <Text
              style={[
                styles.pergunta,
                {
                  color:
                    Cores.textoGeral,
                },
              ]}
            >
              {atividade.pergunta}
            </Text>
          </View>

          <Text
            style={[
              styles.instrucao,
              {
                color:
                  Cores.textoGeral,
              },
            ]}
          >
            Escolha uma alternativa:
          </Text>

          <View style={styles.opcoes}>
            {atividade.opcoes.map(
              (opcao, index) => {
                const selecionada =
                  respostaSelecionada ===
                  index;

                const correta =
                  index ===
                  atividade.resposta;

                let fundo =
                  Cores.caixaInput;

                let borda =
                  Cores.borda;

                let corIcone =
                  Cores.botao;

                if (respondeu && correta) {
                  fundo =
                    "rgba(46, 204, 113, 0.12)";
                  borda = "#2ecc71";
                  corIcone = "#2ecc71";
                }

                if (
                  respondeu &&
                  selecionada &&
                  !correta
                ) {
                  fundo =
                    "rgba(231, 76, 60, 0.10)";
                  borda = "#e74c3c";
                  corIcone = "#e74c3c";
                }

                if (
                  !respondeu &&
                  selecionada
                ) {
                  fundo =
                    `${Cores.botao}18`;
                  borda = Cores.botao;
                  corIcone =
                    Cores.botao;
                }

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.8}
                    disabled={respondeu}
                    onPress={() =>
                      setRespostaSelecionada(
                        index
                      )
                    }
                    style={[
                      styles.opcao,
                      {
                        backgroundColor:
                          fundo,
                        borderColor:
                          borda,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.letra,
                        {
                          borderColor:
                            corIcone,
                          backgroundColor:
                            selecionada ||
                            (respondeu &&
                              correta)
                              ? corIcone
                              : "transparent",
                        },
                      ]}
                    >
                      {respondeu &&
                      correta ? (
                        <Ionicons
                          name="checkmark"
                          size={17}
                          color="#fff"
                        />
                      ) : respondeu &&
                        selecionada &&
                        !correta ? (
                        <Ionicons
                          name="close"
                          size={17}
                          color="#fff"
                        />
                      ) : (
                        <Text
                          style={[
                            styles.letraTexto,
                            {
                              color:
                                selecionada
                                  ? "#fff"
                                  : corIcone,
                            },
                          ]}
                        >
                          {String.fromCharCode(
                            65 + index
                          )}
                        </Text>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.opcaoTexto,
                        {
                          color:
                            Cores.textoGeral,
                        },
                      ]}
                    >
                      {opcao}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>

          {respondeu && (
            <View
              style={[
                styles.feedback,
                {
                  backgroundColor: acertou
                    ? "rgba(46, 204, 113, 0.10)"
                    : "rgba(231, 76, 60, 0.10)",
                  borderColor: acertou
                    ? "#2ecc71"
                    : "#e74c3c",
                },
              ]}
            >
              <View
                style={[
                  styles.feedbackIcone,
                  {
                    backgroundColor:
                      acertou
                        ? "#2ecc71"
                        : "#e74c3c",
                  },
                ]}
              >
                <Ionicons
                  name={
                    acertou
                      ? "checkmark"
                      : "close"
                  }
                  size={25}
                  color="#fff"
                />
              </View>

              <View
                style={
                  styles.feedbackTexto
                }
              >
                <Text
                  style={[
                    styles.feedbackTitulo,
                    {
                      color: acertou
                        ? "#27ae60"
                        : "#c0392b",
                    },
                  ]}
                >
                  {acertou
                    ? "Muito bem! 🎉"
                    : "Quase lá! 💜"}
                </Text>

                <Text
                  style={[
                    styles.feedbackDescricao,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  {acertou
                    ? pontosGanhos > 0
                      ? "Você acertou e ganhou +10 XP!"
                      : "Você já havia concluído esta atividade."
                    : `A resposta correta é: ${
                        atividade.opcoes[
                          atividade.resposta
                        ]
                      }`}
                </Text>
              </View>
            </View>
          )}

          {respondeu && (
            <View
              style={[
                styles.explicacao,
                {
                  backgroundColor:
                    Cores.caixaInput,
                  borderColor: Cores.borda,
                },
              ]}
            >
              <View
                style={styles.explicacaoTitulo}
              >
                <Ionicons
                  name="bulb"
                  size={20}
                  color="#f1c40f"
                />

                <Text
                  style={[
                    styles.explicacaoTituloTexto,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Saiba mais
                </Text>
              </View>

              <Text
                style={[
                  styles.explicacaoTexto,
                  {
                    color:
                      Cores.textoGeral,
                  },
                ]}
              >
                {atividade.explicacao}
              </Text>
            </View>
          )}

          {!respondeu ? (
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={
                respostaSelecionada ===
                null
              }
              onPress={responder}
              style={[
                styles.botaoResponder,
                {
                  backgroundColor:
                    respostaSelecionada ===
                    null
                      ? "#ccc"
                      : Cores.botao,
                },
              ]}
            >
              <Text
                style={[
                  styles.botaoResponderTexto,
                  {
                    color:
                      respostaSelecionada ===
                      null
                        ? "#888"
                        : Cores.textoBotao,
                  },
                ]}
              >
                Responder
              </Text>

              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color={
                  respostaSelecionada ===
                  null
                    ? "#888"
                    : Cores.textoBotao
                }
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={proximaAtividade}
              style={[
                styles.botaoResponder,
                {
                  backgroundColor:
                    Cores.botao,
                },
              ]}
            >
              <Text
                style={[
                  styles.botaoResponderTexto,
                  {
                    color:
                      Cores.textoBotao,
                  },
                ]}
              >
                Próxima atividade
              </Text>

              <Ionicons
                name="arrow-forward"
                size={22}
                color={
                  Cores.textoBotao
                }
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    paddingBottom: 35,
  },

  header: {
    minHeight: 65,

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  voltar: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",
  },

  headerCentro: {
    flex: 1,
    alignItems: "center",
  },

  headerTitulo: {
    fontSize: 17,
    fontWeight: "bold",
  },

  headerNumero: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },

  xp: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,

    paddingHorizontal: 9,
    paddingVertical: 7,

    borderRadius: 15,

    backgroundColor:
      "rgba(241,196,15,0.12)",
  },

  xpTexto: {
    color: "#b7950b",
    fontSize: 11,
    fontWeight: "bold",
  },

  barraContainer: {
    paddingHorizontal: 18,
    marginBottom: 8,
  },

  barraFundo: {
    height: 7,

    backgroundColor: "#ddd",

    borderRadius: 10,

    overflow: "hidden",
  },

  barra: {
    height: "100%",

    borderRadius: 10,
  },

  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 15,
  },

  etiqueta: {
    alignSelf: "flex-start",

    paddingHorizontal: 11,
    paddingVertical: 5,

    borderRadius: 12,

    marginBottom: 9,
  },

  etiquetaTexto: {
    fontSize: 11,
    fontWeight: "bold",
  },

  titulo: {
    fontSize: 27,
    fontWeight: "bold",

    marginBottom: 17,
  },

  perguntaCard: {
    borderWidth: 1,

    borderRadius: 18,

    padding: 18,

    marginBottom: 22,
  },

  iconePergunta: {
    width: 45,
    height: 45,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 13,
  },

  pergunta: {
    fontSize: 18,
    fontWeight: "600",

    lineHeight: 27,
  },

  instrucao: {
    fontSize: 14,
    fontWeight: "bold",

    marginBottom: 10,
  },

  opcoes: {
    gap: 10,
  },

  opcao: {
    minHeight: 65,

    borderWidth: 1.5,

    borderRadius: 15,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
  },

  letra: {
    width: 37,
    height: 37,

    borderRadius: 19,

    borderWidth: 1.5,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11,
  },

  letraTexto: {
    fontSize: 14,
    fontWeight: "bold",
  },

  opcaoTexto: {
    flex: 1,

    fontSize: 14,

    lineHeight: 20,
  },

  feedback: {
    marginTop: 18,

    borderWidth: 1,

    borderRadius: 16,

    padding: 14,

    flexDirection: "row",
    alignItems: "center",
  },

  feedbackIcone: {
    width: 43,
    height: 43,

    borderRadius: 22,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 11,
  },

  feedbackTexto: {
    flex: 1,
  },

  feedbackTitulo: {
    fontSize: 16,
    fontWeight: "bold",
  },

  feedbackDescricao: {
    fontSize: 12,

    lineHeight: 18,

    marginTop: 3,
  },

  explicacao: {
    marginTop: 12,

    borderWidth: 1,

    borderRadius: 16,

    padding: 15,
  },

  explicacaoTitulo: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 8,

    gap: 7,
  },

  explicacaoTituloTexto: {
    fontSize: 14,
    fontWeight: "bold",
  },

  explicacaoTexto: {
    fontSize: 12,

    lineHeight: 19,
  },

  botaoResponder: {
    minHeight: 57,

    borderRadius: 15,

    marginTop: 20,

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 9,
  },

  botaoResponderTexto: {
    fontSize: 16,
    fontWeight: "bold",
  },

  erroContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  erroTitulo: {
    fontSize: 21,
    fontWeight: "bold",

    marginTop: 15,

    textAlign: "center",
  },

  botaoVoltarErro: {
    marginTop: 25,

    paddingHorizontal: 30,
    paddingVertical: 13,

    borderRadius: 12,
  },

  textoBotao: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
