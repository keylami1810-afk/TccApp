
import React, { useState, useCallback, useEffect, useRef } from "react";

import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Modal,
  Dimensions,
  Animated,
  Easing,
} from "react-native";

import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

import { PieChart } from "react-native-chart-kit";

import {
  useLocalSearchParams,
  useRouter,
  useFocusEffect,
} from "expo-router";

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

  const [temaAtual, setTemaAtual] = useState("principal");

  const [pontos, setPontos] = useState(0);
  const [pontosAnteriores, setPontosAnteriores] = useState(0);
  const [mostrarParabens, setMostrarParabens] = useState(false);

  const Cores =
    temasDoProjeto[temaAtual] ||
    temasDoProjeto.principal;

  // =========================================================
  // ANIMAÇÕES
  // =========================================================

  const entradaAnim = useRef(new Animated.Value(0)).current;

  const topoAnim = useRef(new Animated.Value(0)).current;

  const pontosAnim = useRef(new Animated.Value(1)).current;

  const brilhoPontos = useRef(new Animated.Value(0)).current;

  const parabensAnim = useRef(new Animated.Value(0)).current;

  const parabensScale = useRef(
    new Animated.Value(0.7)
  ).current;

  const toqueAnim = useRef(new Animated.Value(0)).current;

  const toqueX = useRef(new Animated.Value(0)).current;
  const toqueY = useRef(new Animated.Value(0)).current;

  // =========================================================
  // ANIMAÇÃO INICIAL
  // =========================================================

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entradaAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(topoAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // =========================================================
  // ANIMAÇÃO DOS PONTOS
  // =========================================================

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(brilhoPontos, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.timing(brilhoPontos, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => loop.stop();
  }, []);

  // =========================================================
  // EFEITO DE TOQUE
  // =========================================================

  const mostrarToque = (event) => {
    const { locationX, locationY } = event.nativeEvent;

    toqueX.setValue(locationX - 28);
    toqueY.setValue(locationY - 28);

    toqueAnim.setValue(0);

    Animated.sequence([
      Animated.timing(toqueAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),

      Animated.timing(toqueAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // =========================================================
  // CARREGAR DADOS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        try {
          // Nome
          if (params.nomeUsuario) {
            setNomeUsuario(params.nomeUsuario);

            await AsyncStorage.setItem(
              "@nome_usuario",
              params.nomeUsuario
            );
          } else {
            const nomeSalvo =
              await AsyncStorage.getItem("@nome_usuario");

            if (nomeSalvo) {
              setNomeUsuario(nomeSalvo);
            }
          }

          // Movimentações
          const dadosSalvos =
            await AsyncStorage.getItem(
              "@movimentacoes_user"
            );

          if (dadosSalvos) {
            setMovimentacoes(JSON.parse(dadosSalvos));
          } else {
            setMovimentacoes([]);
          }

          // Tema
          const temaSalvo =
            await AsyncStorage.getItem("@tema_app");

          if (
            temaSalvo &&
            temasDoProjeto[temaSalvo]
          ) {
            setTemaAtual(temaSalvo);
          }

          // Pontos
          const pontosSalvos =
            await AsyncStorage.getItem(
              "@pontos_atividades"
            );

          const novosPontos = Number(
            pontosSalvos || 0
          );

          const pontosAntigos =
            Number(
              await AsyncStorage.getItem(
                "@pontos_vistos_principal"
              )
            ) || 0;

          setPontosAnteriores(pontosAntigos);
          setPontos(novosPontos);

          // Detecta se ganhou novos pontos
          if (novosPontos > pontosAntigos) {
            setMostrarParabens(true);

            parabensAnim.setValue(0);
            parabensScale.setValue(0.7);

            Animated.parallel([
              Animated.timing(parabensAnim, {
                toValue: 1,
                duration: 450,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
              }),

              Animated.spring(parabensScale, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
              }),

              Animated.sequence([
                Animated.delay(500),

                Animated.spring(pontosAnim, {
                  toValue: 1.18,
                  friction: 4,
                  tension: 80,
                  useNativeDriver: true,
                }),

                Animated.spring(pontosAnim, {
                  toValue: 1,
                  friction: 5,
                  tension: 60,
                  useNativeDriver: true,
                }),
              ]),
            ]).start();

            setTimeout(() => {
              setMostrarParabens(false);
            }, 2800);

            await AsyncStorage.setItem(
              "@pontos_vistos_principal",
              String(novosPontos)
            );
          }
        } catch (error) {
          console.log(
            "Erro ao carregar dados:",
            error
          );
        }
      }

      carregarDados();
    }, [params.nomeUsuario])
  );

  // =========================================================
  // SALVAR MOVIMENTAÇÕES
  // =========================================================

  const salvarMovimentacoesNoStorage = async (
    novasMovimentacoes
  ) => {
    try {
      setMovimentacoes(novasMovimentacoes);

      await AsyncStorage.setItem(
        "@movimentacoes_user",
        JSON.stringify(novasMovimentacoes)
      );
    } catch (error) {
      console.log(
        "Erro ao salvar movimentação:",
        error
      );
    }
  };

  // =========================================================
  // VALORES FINANCEIROS
  // =========================================================

  const receitas = movimentacoes
    .filter((item) => item.tipo === "Receita")
    .reduce(
      (total, item) =>
        total + Number(item.valor),
      0
    );

  const despesas = movimentacoes
    .filter((item) => item.tipo === "Despesa")
    .reduce(
      (total, item) =>
        total + Number(item.valor),
      0
    );

  const saldo = receitas - despesas;

  // =========================================================
  // GRÁFICO
  // =========================================================

  const CORES_GRAFICO = [
    "#C66F98",
    "#9A78B5",
    "#DCA7C2",
    "#8D6B83",
    "#E7B7CF",
  ];

  const dadosGrafico =
    movimentacoes.length > 0
      ? movimentacoes.map((item, index) => ({
          name: item.descricao,
          population: Number(item.valor),

          color:
            item.tipo === "Receita"
              ? "#2ecc71"
              : CORES_GRAFICO[
                  index %
                    CORES_GRAFICO.length
                ],

          legendFontColor:
            Cores.textoGeral,

          legendFontSize: 12,
        }))
      : [];

  // =========================================================
  // ADICIONAR MOVIMENTAÇÃO
  // =========================================================

  function adicionarMovimentacao() {
    if (!descricao || !valor) return;

    const nova = {
      id: Date.now().toString(),
      descricao,
      valor: Number(valor),
      tipo,
      data: dataSelecionada,
    };

    const listaAtualizada = [
      nova,
      ...movimentacoes,
    ];

    salvarMovimentacoesNoStorage(
      listaAtualizada
    );

    setDescricao("");
    setValor("");
    setTipo("Despesa");
    setModalVisible(false);
  }

  // =========================================================
  // EXCLUIR MOVIMENTAÇÃO
  // =========================================================

  function excluirMovimentacao(id) {
    const listaFiltrada =
      movimentacoes.filter(
        (item) => item.id !== id
      );

    salvarMovimentacoesNoStorage(
      listaFiltrada
    );
  }

  // =========================================================
  // OPACIDADE / ANIMAÇÕES
  // =========================================================

  const brilhoOpacity =
    brilhoPontos.interpolate({
      inputRange: [0, 1],
      outputRange: [0.15, 0.5],
    });

  const toqueScale =
    toqueAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1.5],
    });

  const toqueOpacity =
    toqueAnim.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 0.65, 0],
    });

  // =========================================================
  // TELA
  // =========================================================

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Cores.fundo },
      ]}
    >
      <ImageBackground source={Cores.imagem} style={StyleSheet.absoluteFillObject} imageStyle={{ opacity: 0.12 }} resizeMode="cover" pointerEvents="none" />
      {/* =====================================================
          ÁREA DE TOQUE
      ====================================================== */}

      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="box-none"
        onTouchStart={mostrarToque}
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.efeitoToque,
          {
            left: toqueX,
            top: toqueY,
            opacity: toqueOpacity,
            transform: [
              {
                scale: toqueScale,
              },
            ],
            backgroundColor:
              Cores.botao,
          },
        ]}
      />

      {/* =====================================================
          TOPO
      ====================================================== */}

      <Animated.View
        style={[
          styles.topo,
          {
            backgroundColor: Cores.botao,
            opacity: entradaAnim,
            transform: [
              {
                translateY:
                  topoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-25, 0],
                  }),
              },
            ],
          },
        ]}
      >
        <View>
          <Text
            style={[
              styles.nomeUsuario,
              {
                color:
                  Cores.textoBotao,
              },
            ]}
          >
            Olá, {nomeUsuario} 👋
          </Text>

          <Text
            style={[
              styles.subtitulo,
              {
                color:
                  Cores.textoBotao,
              },
            ]}
          >
            Organize sua vida financeira
          </Text>
        </View>

        {/* PONTOS */}

        <Animated.View
          style={[
            styles.caixaPontos,
            {
              backgroundColor:
                "rgba(0,0,0,0.16)",
              transform: [
                {
                  scale: pontosAnim,
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.brilhoPontos,
              {
                opacity:
                  brilhoOpacity,
                backgroundColor:
                  "#ffffff",
              },
            ]}
          />

          <Ionicons
            name="trophy"
            size={19}
            color="#FFD84D"
          />

          <Text
            style={[
              styles.textoPontos,
              {
                color:
                  Cores.textoBotao,
              },
            ]}
          >
            {pontos} pts
          </Text>
        </Animated.View>
      </Animated.View>

      {/* =====================================================
          AVISO DE NOVOS PONTOS
      ====================================================== */}

      {mostrarParabens && (
        <Animated.View
          style={[
            styles.avisoPontos,
            {
              backgroundColor:
                Cores.caixaInput,
              borderColor:
                Cores.borda,

              opacity:
                parabensAnim,

              transform: [
                {
                  scale:
                    parabensScale,
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.iconeParabens,
              {
                backgroundColor:
                  Cores.botao,
              },
            ]}
          >
            <Ionicons
              name="sparkles"
              size={21}
              color={
                Cores.textoBotao
              }
            />
          </View>

          <View>
            <Text
              style={[
                styles.parabensTitulo,
                {
                  color:
                    Cores.textoGeral,
                },
              ]}
            >
              Parabéns! 🎉
            </Text>

            <Text
              style={[
                styles.parabensTexto,
                {
                  color:
                    Cores.textoGeral,
                },
              ]}
            >
              Você está com{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  color: Cores.botao,
                }}
              >
                {pontos} pontos
              </Text>
              !
            </Text>
          </View>
        </Animated.View>
      )}

      {/* =====================================================
          CONTEÚDO
      ====================================================== */}

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View>
            {/* CARDS */}

            <Animated.View
              style={[
                styles.resumoCards,
                {
                  opacity: entradaAnim,
                  transform: [
                    {
                      translateY:
                        entradaAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                    },
                  ],
                },
              ]}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      Cores.caixaInput,
                    borderColor:
                      Cores.borda,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconeCard,
                    {
                      backgroundColor:
                        "rgba(46,204,113,0.12)",
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-down"
                    size={18}
                    color="#2ecc71"
                  />
                </View>

                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Receitas
                </Text>

                <Text
                  style={[
                    styles.cardValue,
                    {
                      color:
                        "#2ecc71",
                    },
                  ]}
                >
                  R$ {receitas.toFixed(2)}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      Cores.caixaInput,
                    borderColor:
                      Cores.borda,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconeCard,
                    {
                      backgroundColor:
                        "rgba(231,76,60,0.12)",
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-up"
                    size={18}
                    color="#e74c3c"
                  />
                </View>

                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Despesas
                </Text>

                <Text
                  style={[
                    styles.cardValue,
                    {
                      color:
                        "#e74c3c",
                    },
                  ]}
                >
                  R$ {despesas.toFixed(2)}
                </Text>
              </View>

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      Cores.caixaInput,
                    borderColor:
                      Cores.borda,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconeCard,
                    {
                      backgroundColor:
                        "rgba(155,89,182,0.12)",
                    },
                  ]}
                >
                  <Ionicons
                    name="wallet"
                    size={18}
                    color="#9b59b6"
                  />
                </View>

                <Text
                  style={[
                    styles.cardLabel,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Saldo
                </Text>

                <Text
                  style={[
                    styles.cardValue,
                    {
                      color:
                        saldo >= 0
                          ? Cores.textoGeral
                          : "#e74c3c",
                    },
                  ]}
                >
                  R$ {saldo.toFixed(2)}
                </Text>
              </View>
            </Animated.View>

            {/* =================================================
                ÁREA VAZIA / PRIMEIROS PASSOS
            ================================================== */}

            {movimentacoes.length === 0 && (
              <Animated.View
                style={[
                  styles.boasVindasFinanceiras,
                  {
                    backgroundColor:
                      Cores.caixaInput,
                    borderColor:
                      Cores.borda,

                    opacity:
                      entradaAnim,

                    transform: [
                      {
                        translateY:
                          entradaAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [
                              25,
                              0,
                            ],
                          }),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconeBoasVindas,
                    {
                      backgroundColor:
                        Cores.botao,
                    },
                  ]}
                >
                  <Ionicons
                    name="sparkles"
                    size={30}
                    color={
                      Cores.textoBotao
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.boasVindasTitulo,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Vamos começar? ✨
                </Text>

                <Text
                  style={[
                    styles.boasVindasTexto,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Seu painel financeiro
                  está pronto. Adicione
                  sua primeira receita
                  ou despesa para começar
                  a acompanhar seu
                  dinheiro.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    setModalVisible(true)
                  }
                  style={[
                    styles.botaoPrimeiroLancamento,
                    {
                      backgroundColor:
                        Cores.botao,
                    },
                  ]}
                >
                  <FontAwesome5
                    name="plus"
                    size={15}
                    color={
                      Cores.textoBotao
                    }
                  />

                  <Text
                    style={[
                      styles.textoPrimeiroLancamento,
                      {
                        color:
                          Cores.textoBotao,
                      },
                    ]}
                  >
                    Adicionar primeiro lançamento
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* =================================================
                HISTÓRICO
            ================================================== */}

            <Text
              style={[
                styles.tituloSecao,
                {
                  color:
                    Cores.textoGeral,
                },
              ]}
            >
              {movimentacoes.length === 0
                ? "Seu histórico"
                : "Histórico"}
            </Text>

            {movimentacoes.length === 0 && (
              <View
                style={[
                  styles.estadoVazio,
                  {
                    borderColor:
                      Cores.borda,
                  },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={32}
                  color={
                    Cores.botao
                  }
                />

                <Text
                  style={[
                    styles.estadoVazioTitulo,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Ainda não há registros
                </Text>

                <Text
                  style={[
                    styles.estadoVazioTexto,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Suas movimentações
                  aparecerão aqui.
                </Text>
              </View>
            )}

            {/* =================================================
                GRÁFICO
            ================================================== */}

            <View
              style={[
                styles.graficoContainer,
                {
                  backgroundColor:
                    Cores.caixaInput,
                  borderColor:
                    Cores.borda,
                },
              ]}
            >
              <View
                style={
                  styles.tituloGraficoLinha
                }
              >
                <View>
                  <Text
                    style={[
                      styles.tituloGrafico,
                      {
                        color:
                          Cores.textoGeral,
                      },
                    ]}
                  >
                    Visão financeira
                  </Text>

                  <Text
                    style={[
                      styles.subtituloGrafico,
                      {
                        color:
                          Cores.textoGeral,
                      },
                    ]}
                  >
                    {movimentacoes.length === 0
                      ? "Seu gráfico aparecerá aqui"
                      : "Resumo das movimentações"}
                  </Text>
                </View>

                <Ionicons
                  name="stats-chart"
                  size={22}
                  color={
                    Cores.botao
                  }
                />
              </View>

              {movimentacoes.length > 0 ? (
                <View
                  style={{
                    alignItems:
                      "center",
                  }}
                >
                  <PieChart
                    data={dadosGrafico}
                    width={
                      larguraTela -
                      50
                    }
                    height={170}
                    accessor={
                      "population"
                    }
                    backgroundColor={
                      "transparent"
                    }
                    paddingLeft={
                      "15"
                    }
                    center={[
                      10,
                      0,
                    ]}
                    chartConfig={{
                      color: (
                        opacity = 1
                      ) =>
                        `rgba(0, 0, 0, ${opacity})`,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={
                    styles.graficoVazio
                  }
                >
                  <View
                    style={[
                      styles.graficoCirculo,
                      {
                        borderColor:
                          Cores.borda,
                      },
                    ]}
                  >
                    <Ionicons
                      name="pie-chart-outline"
                      size={42}
                      color={
                        Cores.botao
                      }
                    />
                  </View>

                  <Text
                    style={[
                      styles.graficoVazioTitulo,
                      {
                        color:
                          Cores.textoGeral,
                      },
                    ]}
                  >
                    Nenhum dado ainda
                  </Text>
                </View>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.item,
              {
                backgroundColor:
                  Cores.caixaInput,
                borderColor:
                  Cores.borda,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.itemDesc,
                  {
                    color:
                      Cores.textoGeral,
                  },
                ]}
              >
                {item.descricao}
              </Text>

              <Text
                style={{
                  color: "#888",
                  fontSize: 11,
                  marginTop: 3,
                }}
              >
                {item.data}
              </Text>
            </View>

            <View
              style={{
                flexDirection:
                  "row",
                alignItems:
                  "center",
                gap: 10,
              }}
            >
              <Text
                style={[
                  styles.itemValor,
                  {
                    color:
                      item.tipo ===
                      "Receita"
                        ? "#2ecc71"
                        : "#e74c3c",
                  },
                ]}
              >
                {item.tipo ===
                "Receita"
                  ? "+"
                  : "-"}{" "}
                R$ {Number(item.valor).toFixed(2)}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  excluirMovimentacao(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete"
                  size={20}
                  color={
                    Cores.botao
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* =====================================================
          MENU INFERIOR
      ====================================================== */}

      <View
        style={[
          styles.menuInferior,
          {
            backgroundColor:
              Cores.botao,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            router.push("/principal")
          }
        >
          <Ionicons
            name="home"
            size={24}
            color={
              Cores.textoBotao
            }
            style={{
              alignSelf:
                "center",
            }}
          />

          <Text
            style={[
              styles.menuTexto,
              {
                color:
                  Cores.textoBotao,
              },
            ]}
          >
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoAdd,
            {
              backgroundColor:
                Cores.caixaInput,
            },
          ]}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <FontAwesome5
            name="plus"
            size={24}
            color={
              Cores.botao
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push(
              "/configuracoes"
            )
          }
        >
          <MaterialIcons
            name="settings"
            size={26}
            color={
              Cores.textoBotao
            }
            style={{
              alignSelf:
                "center",
            }}
          />

          <Text
            style={[
              styles.menuTexto,
              {
                color:
                  Cores.textoBotao,
              },
            ]}
          >
            Config
          </Text>
        </TouchableOpacity>
      </View>

      {/* =====================================================
          MODAL
      ====================================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View
          style={styles.modal}
        >
          <View
            style={[
              styles.caixaModal,
              {
                backgroundColor:
                  Cores.caixaInput,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitulo,
                {
                  color:
                    Cores.textoGeral,
                },
              ]}
            >
              Nova Movimentação
            </Text>

            <TextInput
              placeholder="Descrição"
              placeholderTextColor="#888"
              style={[
                styles.input,
                {
                  color:
                    Cores.textoGeral,
                  borderColor:
                    Cores.borda,
                },
              ]}
              value={descricao}
              onChangeText={
                setDescricao
              }
            />

            <TextInput
              placeholder="Valor (R$)"
              placeholderTextColor="#888"
              style={[
                styles.input,
                {
                  color:
                    Cores.textoGeral,
                  borderColor:
                    Cores.borda,
                },
              ]}
              keyboardType="numeric"
              value={valor}
              onChangeText={
                setValor
              }
            />

            <TextInput
              placeholder="Data (DD/MM/AAAA)"
              placeholderTextColor="#888"
              style={[
                styles.input,
                {
                  color:
                    Cores.textoGeral,
                  borderColor:
                    Cores.borda,
                },
              ]}
              value={
                dataSelecionada
              }
              onChangeText={
                setDataSelecionada
              }
            />

            <View
              style={{
                flexDirection:
                  "row",
                justifyContent:
                  "space-between",
                marginBottom: 15,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 5,
                  padding: 12,
                  borderRadius: 8,
                  alignItems:
                    "center",
                  backgroundColor:
                    tipo ===
                    "Receita"
                      ? "#2ecc71"
                      : "#e0e0e0",
                }}
                onPress={() =>
                  setTipo(
                    "Receita"
                  )
                }
              >
                <Text
                  style={{
                    fontWeight:
                      "bold",
                    color:
                      tipo ===
                      "Receita"
                        ? "#ffffff"
                        : "#333333",
                  }}
                >
                  Receita
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 5,
                  padding: 12,
                  borderRadius: 8,
                  alignItems:
                    "center",
                  backgroundColor:
                    tipo ===
                    "Despesa"
                      ? "#e74c3c"
                      : "#e0e0e0",
                }}
                onPress={() =>
                  setTipo(
                    "Despesa"
                  )
                }
              >
                <Text
                  style={{
                    fontWeight:
                      "bold",
                    color:
                      tipo ===
                      "Despesa"
                        ? "#ffffff"
                        : "#333333",
                  }}
                >
                  Despesa
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.salvar,
                {
                  backgroundColor:
                    Cores.botao,
                },
              ]}
              onPress={
                adicionarMovimentacao
              }
            >
              <Text
                style={{
                  color:
                    Cores.textoBotao,
                  fontWeight:
                    "bold",
                }}
              >
                Salvar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginTop: 12,
                alignItems:
                  "center",
              }}
              onPress={() =>
                setModalVisible(
                  false
                )
              }
            >
              <Text
                style={{
                  color: "#888",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ===========================================================
// ESTILOS
// ===========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 23,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 7,
    shadowColor: "#35172F",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
  },

  nomeUsuario: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.45,
  },

  subtitulo: {
    fontSize: 12,
    opacity: 0.9,
    marginTop: 3,
  },

  caixaPontos: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 22,
    flexDirection:
      "row",
    alignItems:
      "center",
    gap: 6,
    overflow: "hidden",
  },

  brilhoPontos: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    top: -25,
    left: -15,
  },

  textoPontos: {
    fontWeight: "bold",
    fontSize: 13,
  },

  resumoCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 14,
    marginTop: 20,
    marginBottom: 13,
    gap: 8,
  },

  card: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    elevation: 3,
    shadowColor: "#4A233F",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },

  iconeCard: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent:
      "center",
    alignItems:
      "center",
    marginBottom: 7,
  },

  cardLabel: {
    fontSize: 11,
    opacity: 0.75,
  },

  cardValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 3,
  },

  boasVindasFinanceiras: {
    marginHorizontal: 15,
    marginTop: 8,
    padding: 24,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#4A233F",
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  iconeBoasVindas: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent:
      "center",
    alignItems:
      "center",
    marginBottom: 12,
  },

  boasVindasTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign:
      "center",
    marginBottom: 8,
  },

  boasVindasTexto: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.7,
    textAlign:
      "center",
    maxWidth: 310,
  },

  botaoPrimeiroLancamento: {
    marginTop: 17,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 15,
    flexDirection:
      "row",
    alignItems:
      "center",
    gap: 8,
  },

  textoPrimeiroLancamento: {
    fontSize: 13,
    fontWeight: "bold",
  },

  tituloSecao: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "bold",
    fontSize: 17,
  },

  estadoVazio: {
    marginHorizontal: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 18,
    alignItems:
      "center",
    opacity: 0.8,
  },

  estadoVazioTitulo: {
    fontWeight:
      "bold",
    fontSize: 14,
    marginTop: 7,
  },

  estadoVazioTexto: {
    fontSize: 12,
    opacity: 0.65,
    marginTop: 3,
  },

  item: {
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 15,
    borderRadius: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#4A233F",
    shadowOpacity: 0.035,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  itemDesc: {
    fontWeight:
      "bold",
    fontSize: 15,
  },

  itemValor: {
    fontWeight:
      "bold",
    fontSize: 14,
  },

  graficoContainer: {
    marginHorizontal: 15,
    marginTop: 16,
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 18,
    paddingHorizontal: 9,
    shadowColor: "#4A233F",
    shadowOpacity: 0.055,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  tituloGraficoLinha: {
    flexDirection:
      "row",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    paddingHorizontal: 12,
  },

  tituloGrafico: {
    fontSize: 16,
    fontWeight:
      "bold",
  },

  subtituloGrafico: {
    fontSize: 11,
    opacity: 0.55,
    marginTop: 2,
  },

  graficoVazio: {
    height: 150,
    justifyContent:
      "center",
    alignItems:
      "center",
  },

  graficoCirculo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderStyle:
      "dashed",
    justifyContent:
      "center",
    alignItems:
      "center",
  },

  graficoVazioTitulo: {
    fontSize: 13,
    fontWeight:
      "bold",
    marginTop: 9,
  },

  menuInferior: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 13,
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    elevation: 12,
    shadowColor: "#25101F",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
  },

  menuTexto: {
    textAlign:
      "center",
    fontSize: 11,
    marginTop: 2,
  },

  botaoAdd: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent:
      "center",
    alignItems:
      "center",
    marginTop: -25,
    elevation: 7,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  efeitoToque: {
    position:
      "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    zIndex: 999,
    borderWidth: 2,
    borderColor:
      "rgba(255,255,255,0.8)",
  },

  avisoPontos: {
    position:
      "absolute",
    top: 105,
    left: 20,
    right: 20,
    zIndex: 50,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection:
      "row",
    alignItems:
      "center",
    elevation: 8,
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },

  iconeParabens: {
    width: 43,
    height: 43,
    borderRadius: 22,
    justifyContent:
      "center",
    alignItems:
      "center",
    marginRight: 11,
  },

  parabensTitulo: {
    fontSize: 15,
    fontWeight:
      "bold",
  },

  parabensTexto: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },

  modal: {
    flex: 1,
    justifyContent:
      "center",
    backgroundColor:
      "rgba(0,0,0,0.5)",
  },

  caixaModal: {
    margin: 20,
    padding: 22,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.72)",
    elevation: 10,
    shadowColor: "#25101F",
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },

  modalTitulo: {
    fontSize: 18,
    fontWeight:
      "bold",
    marginBottom: 15,
    textAlign:
      "center",
  },

  input: {
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 13,
    marginBottom: 11,
    fontSize: 14,
    backgroundColor: "rgba(255,255,255,0.55)",
  },

  salvar: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
    shadowOpacity: 0.12,
    shadowRadius: 7,
  },
});


