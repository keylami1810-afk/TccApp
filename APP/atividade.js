
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
import { ATIVIDADES as ATIVIDADES_DADOS } from "./atividadesDados";

const ATIVIDADES = ATIVIDADES_DADOS;

export default function Atividade() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const atividadeId = params.atividadeId;

  const atividade = ATIVIDADES.find(
    (item) => item.id === atividadeId
  );

  const [temaAtual, setTemaAtual] = useState("principal");
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
    (temasDoProjeto && temasDoProjeto.principal) || {
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

  const proximaAtividade = async () => {
    const indiceAtual = ATIVIDADES.findIndex(
      (item) => item.id === atividade.id
    );

    const proxima = ATIVIDADES[indiceAtual + 1];

    // Ao terminar um módulo, só avança para o próximo se todas as questões
    // daquele módulo estiverem concluídas. Assim, o botão não burla os bloqueios.
    if (proxima && proxima.modulo !== atividade.modulo) {
      try {
        const salvas = await AsyncStorage.getItem("@atividades_concluidas");
        const concluidas = salvas ? JSON.parse(salvas) : [];
        const atividadesDoModulo = ATIVIDADES.filter(
          (item) => item.modulo === atividade.modulo
        );
        const moduloCompleto = atividadesDoModulo.every(
          (item) => concluidas.includes(item.id)
        );

        if (!moduloCompleto) {
          router.replace("/atividadesaluno");
          return;
        }
      } catch (error) {
        console.log("Erro ao conferir o progresso do módulo:", error);
        router.replace("/atividadesaluno");
        return;
      }
    }

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
