
import React, { useCallback, useEffect, useRef, useState } from "react";

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
  StatusBar,
} from "react-native";

import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";

import { PieChart } from "react-native-chart-kit";

import {
  useRouter,
  useFocusEffect,
} from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { temasDoProjeto } from "./temas";

const { width: larguraTela } = Dimensions.get("window");

export default function PrincipalMFS() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Despesa");

  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toLocaleDateString("pt-BR")
  );

  const [movimentacoes, setMovimentacoes] = useState([]);

  const [temaAtual, setTemaAtual] = useState("principal");

  const entrada = useRef(new Animated.Value(0)).current;

  const touchOpacity = useRef(new Animated.Value(0)).current;
  const touchScale = useRef(new Animated.Value(0.15)).current;

  const [touchPosition, setTouchPosition] = useState({
    x: 0,
    y: 0,
  });

  const Cores =
    temasDoProjeto[temaAtual] ||
    temasDoProjeto.principal;

  /* =====================================================
     ENTRADA
  ===================================================== */

  useEffect(() => {
    Animated.timing(entrada, {
      toValue: 1,
      duration: 650,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  /* =====================================================
     CARREGAR DADOS
  ===================================================== */

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        try {
          const dadosSalvos =
            await AsyncStorage.getItem(
              "@movimentacoes_aluno"
            );

          if (dadosSalvos) {
            setMovimentacoes(
              JSON.parse(dadosSalvos)
            );
          } else {
            setMovimentacoes([]);
          }

          const temaSalvo =
            await AsyncStorage.getItem(
              "@tema_app"
            );

          if (
            temaSalvo &&
            temasDoProjeto[temaSalvo]
          ) {
            setTemaAtual(temaSalvo);
          }
        } catch (error) {
          console.log(
            "Erro ao carregar dados financeiros:",
            error
          );
        }
      }

      carregarDados();
    }, [])
  );

  /* =====================================================
     TOQUE ROSA
  ===================================================== */

  function mostrarToque(event) {
    const {
      locationX,
      locationY,
    } = event.nativeEvent;

    setTouchPosition({
      x: locationX,
      y: locationY,
    });

    touchOpacity.setValue(0.65);
    touchScale.setValue(0.15);

    Animated.parallel([
      Animated.spring(touchScale, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),

      Animated.timing(touchOpacity, {
        toValue: 0,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }

  /* =====================================================
     SALVAR
  ===================================================== */

  async function salvarMovimentacoesNoStorage(
    novasMovimentacoes
  ) {
    try {
      setMovimentacoes(novasMovimentacoes);

      await AsyncStorage.setItem(
        "@movimentacoes_aluno",
        JSON.stringify(novasMovimentacoes)
      );
    } catch (error) {
      console.log(
        "Erro ao salvar movimentação:",
        error
      );
    }
  }

  /* =====================================================
     VALORES
  ===================================================== */

  const receitas = movimentacoes
    .filter(
      (item) =>
        item.tipo === "Receita"
    )
    .reduce(
      (total, item) =>
        total + Number(item.valor),
      0
    );

  const despesas = movimentacoes
    .filter(
      (item) =>
        item.tipo === "Despesa"
    )
    .reduce(
      (total, item) =>
        total + Number(item.valor),
      0
    );

  const saldo = receitas - despesas;

  /* =====================================================
     GRÁFICO
  ===================================================== */

  const CORES_GRAFICO = [
    "#C66F98",
    "#9A78B5",
    "#DCA7C2",
    "#8D6B83",
    "#E7B7CF",
  ];

  const dadosGrafico =
    movimentacoes.length > 0
      ? movimentacoes.map(
          (item, index) => ({
            name: item.descricao,

            population:
              Number(item.valor),

            color:
              item.tipo === "Receita"
                ? "#34D399"
                : CORES_GRAFICO[
                    index %
                      CORES_GRAFICO.length
                  ],

            legendFontColor:
              Cores.textoGeral,

            legendFontSize: 11,
          })
        )
      : [];

  /* =====================================================
     ADICIONAR
  ===================================================== */

  function adicionarMovimentacao() {
    if (!descricao || !valor) {
      return;
    }

    const valorNumerico =
      Number(
        valor.replace(",", ".")
      );

    if (
      Number.isNaN(valorNumerico) ||
      valorNumerico <= 0
    ) {
      return;
    }

    const nova = {
      id: Date.now().toString(),

      descricao,

      valor: valorNumerico,

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

    setDataSelecionada(
      new Date().toLocaleDateString("pt-BR")
    );

    setModalVisible(false);
  }

  /* =====================================================
     EXCLUIR
  ===================================================== */

  function excluirMovimentacao(id) {
    const listaFiltrada =
      movimentacoes.filter(
        (item) =>
          item.id !== id
      );

    salvarMovimentacoesNoStorage(
      listaFiltrada
    );
  }

  /* =====================================================
     FUNDO
  ===================================================== */

  const fundoPrincipal = Cores.fundo;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            fundoPrincipal,
        },
      ]}
      onTouchStart={mostrarToque}
    >
      <ImageBackground source={Cores.imagem} style={StyleSheet.absoluteFillObject} imageStyle={{ opacity: 0.12 }} resizeMode="cover" pointerEvents="none" />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={
          temaAtual === "principal" ||
          temaAtual === "gelo" ||
          temaAtual === "pastel"
            ? "dark-content"
            : "light-content"
        }
      />

      {/* =====================================================
          BRILHO DE TOQUE
      ===================================================== */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.touchGlow,
          {
            left:
              touchPosition.x - 42,

            top:
              touchPosition.y - 42,

            opacity:
              touchOpacity,

            transform: [
              {
                scale:
                  touchScale,
              },
            ],
          },
        ]}
      />

      <FlatList
        data={movimentacoes}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
        ListHeaderComponent={
          <>
            {/* =================================================
                TOPO
            ================================================= */}

            <Animated.View
              style={[
                styles.topo,
                {
                  opacity: entrada,

                  transform: [
                    {
                      translateY:
                        entrada.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            -25,
                            0,
                          ],
                        }),
                    },
                  ],
                },
              ]}
            >
              <View
                pointerEvents="none"
                style={[
                  styles.topoGlow,
                  {
                    backgroundColor:
                      Cores.sombraCor,
                  },
                ]}
              />

              <View style={styles.topoConteudo}>
                <View>
                  <Text
                    style={[
                      styles.tituloTopo,
                      {
                        color:
                          Cores.textoBotao,
                      },
                    ]}
                  >
                    Olá, Aluno(a)
                  </Text>

                  <Text
                    style={[
                      styles.subtituloTopo,
                      {
                        color:
                          Cores.textoBotao,
                      },
                    ]}
                  >
                    Seu controle financeiro
                  </Text>
                </View>

                {/* ESCOLA */}

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.botaoEscola
                  }
                  onPress={() =>
                    router.push(
                      "/principalaluno"
                    )
                  }
                >
                  <Ionicons
                    name="school-outline"
                    size={18}
                    color={
                      Cores.textoBotao
                    }
                  />

                  <Text
                    style={[
                      styles.botaoEscolaTexto,
                      {
                        color:
                          Cores.textoBotao,
                      },
                    ]}
                  >
                    Escola
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* =================================================
                RESUMO
            ================================================= */}

            <Animated.View
              style={[
                styles.resumo,
                {
                  opacity: entrada,

                  transform: [
                    {
                      translateY:
                        entrada.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            30,
                            0,
                          ],
                        }),
                    },
                  ],
                },
              ]}
            >
              <CardFinanceiro
                titulo="Receitas"
                valor={receitas}
                cor="#34D399"
                Cores={Cores}
              />

              <CardFinanceiro
                titulo="Despesas"
                valor={despesas}
                cor="#FB7185"
                Cores={Cores}
              />

              <CardFinanceiro
                titulo="Saldo"
                valor={saldo}
                cor={
                  saldo >= 0
                    ? "#C084FC"
                    : "#FB7185"
                }
                Cores={Cores}
              />
            </Animated.View>

            {/* =================================================
                ESTADO VAZIO
            ================================================= */}

            {movimentacoes.length === 0 && (
              <View
                style={[
                  styles.estadoVazio,
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
                    styles.vazioIcone,
                    {
                      borderColor:
                        Cores.borda,
                    },
                  ]}
                >
                  <Ionicons
                    name="wallet-outline"
                    size={32}
                    color={
                      Cores.botao
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.vazioTitulo,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Seu dinheiro começa aqui
                </Text>

                <Text
                  style={[
                    styles.vazioTexto,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  Registre sua primeira
                  receita ou despesa e
                  comece a acompanhar
                  sua vida financeira.
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.vazioBotao,
                    {
                      backgroundColor:
                        Cores.botao,
                    },
                  ]}
                  onPress={() =>
                    setModalVisible(true)
                  }
                >
                  <Ionicons
                    name="add"
                    size={19}
                    color={
                      Cores.textoBotao
                    }
                  />

                  <Text
                    style={[
                      styles.vazioBotaoTexto,
                      {
                        color:
                          Cores.textoBotao,
                      },
                    ]}
                  >
                    Adicionar movimentação
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* =================================================
                HISTÓRICO
            ================================================= */}

            {movimentacoes.length > 0 && (
              <Text
                style={[
                  styles.tituloSecao,
                  {
                    color:
                      Cores.textoGeral,
                  },
                ]}
              >
                Histórico
              </Text>
            )}
          </>
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
            <View
              style={
                styles.itemEsquerda
              }
            >
              <View
                style={[
                  styles.indicador,
                  {
                    backgroundColor:
                      item.tipo ===
                      "Receita"
                        ? "#34D399"
                        : "#FB7185",
                  },
                ]}
              />

              <View>
                <Text
                  style={[
                    styles.itemTitulo,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  {item.descricao}
                </Text>

                <Text
                  style={
                    styles.itemData
                  }
                >
                  {item.data}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.itemDireita
              }
            >
              <Text
                style={[
                  styles.itemValor,
                  {
                    color:
                      item.tipo ===
                      "Receita"
                        ? "#16A34A"
                        : "#E11D48",
                  },
                ]}
              >
                {item.tipo ===
                "Receita"
                  ? "+"
                  : "-"}{" "}
                R${" "}
                {Number(
                  item.valor
                ).toFixed(2)}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  excluirMovimentacao(
                    item.id
                  )
                }
              >
                <MaterialIcons
                  name="delete-outline"
                  size={21}
                  color={
                    Cores.botao
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          movimentacoes.length > 0 ? (
            <View
              style={
                styles.graficoContainer
              }
            >
              <Text
                style={[
                  styles.tituloSecao,
                  {
                    color:
                      Cores.textoGeral,
                  },
                ]}
              >
                Visão financeira
              </Text>

              <PieChart
                data={dadosGrafico}
                width={
                  larguraTela - 20
                }
                height={190}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                chartConfig={{
                  color: (
                    opacity = 1
                  ) =>
                    `rgba(0,0,0,${opacity})`,
                }}
              />
            </View>
          ) : null
        }
      />

      {/* =====================================================
          MENU
      ===================================================== */}

      <View
        style={[
          styles.menu,
          {
            backgroundColor:
              Cores.botao,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.75}
          onPress={() =>
            router.push(
              "/principalaluno"
            )
          }
        >
          <Ionicons
            name="school-outline"
            size={25}
            color={
              Cores.textoBotao
            }
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
            Escola
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.botaoAdd,
            {
              backgroundColor:
                Cores.caixaInput,

              borderColor:
                Cores.borda,
            },
          ]}
          onPress={() =>
            setModalVisible(true)
          }
        >
          <FontAwesome5
            name="plus"
            size={21}
            color={
              Cores.botao
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={0.75}
          onPress={() =>
            router.push(
              "/configuracoes"
            )
          }
        >
          <MaterialIcons
            name="settings"
            size={25}
            color={
              Cores.textoBotao
            }
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
      ===================================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <View style={styles.modal}>
          <View
            style={[
              styles.caixaModal,
              {
                backgroundColor:
                  Cores.caixaInput,

                borderColor:
                  Cores.borda,
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
              Nova movimentação
            </Text>

            <Text
              style={
                styles.modalDescricao
              }
            >
              Registre uma entrada ou
              saída para acompanhar
              seu dinheiro.
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
              keyboardType="decimal-pad"
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
              value={dataSelecionada}
              onChangeText={
                setDataSelecionada
              }
            />

            <View
              style={
                styles.tipoContainer
              }
            >
              <TouchableOpacity
                style={[
                  styles.tipoBotao,
                  {
                    backgroundColor:
                      tipo ===
                      "Receita"
                        ? "#34D399"
                        : "#F1F1F1",
                  },
                ]}
                onPress={() =>
                  setTipo(
                    "Receita"
                  )
                }
              >
                <Text
                  style={{
                    fontWeight:
                      "700",

                    color:
                      tipo ===
                      "Receita"
                        ? "#fff"
                        : "#555",
                  }}
                >
                  Receita
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tipoBotao,
                  {
                    backgroundColor:
                      tipo ===
                      "Despesa"
                        ? "#FB7185"
                        : "#F1F1F1",
                  },
                ]}
                onPress={() =>
                  setTipo(
                    "Despesa"
                  )
                }
              >
                <Text
                  style={{
                    fontWeight:
                      "700",

                    color:
                      tipo ===
                      "Despesa"
                        ? "#fff"
                        : "#555",
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
                style={[
                  styles.salvarTexto,
                  {
                    color:
                      Cores.textoBotao,
                  },
                ]}
              >
                Salvar movimentação
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.cancelar
              }
              onPress={() =>
                setModalVisible(
                  false
                )
              }
            >
              <Text
                style={
                  styles.cancelarTexto
                }
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

/* =========================================================
   CARD FINANCEIRO
========================================================= */

function CardFinanceiro({
  titulo,
  valor,
  cor,
  Cores,
}) {
  const brilho = useRef(
    new Animated.Value(0.3)
  ).current;

  useEffect(() => {
    const animacao =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            brilho,
            {
              toValue: 0.65,
              duration: 1800,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            brilho,
            {
              toValue: 0.3,
              duration: 1800,
              easing:
                Easing.inOut(
                  Easing.sin
                ),
              useNativeDriver: true,
            }
          ),
        ])
      );

    animacao.start();

    return () =>
      animacao.stop();
  }, []);

  return (
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
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cardBrilho,
          {
            backgroundColor:
              cor,

            opacity:
              brilho,
          },
        ]}
      />

      <Text
        style={[
          styles.cardLabel,
          {
            color:
              Cores.textoGeral,
          },
        ]}
      >
        {titulo}
      </Text>

      <Text
        style={[
          styles.cardValor,
          {
            color: cor,
          },
        ]}
      >
        R${" "}
        {Number(valor).toFixed(2)}
      </Text>
    </View>
  );
}

/* =========================================================
   ESTILOS
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  touchGlow: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor:
      "rgba(244,114,182,0.20)",
    borderWidth: 1,
    borderColor:
      "rgba(236,72,153,0.45)",
    zIndex: 100,
  },

  topo: {
    minHeight: 145,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 23,
    backgroundColor: "#EC4899",
    overflow: "hidden",
    elevation: 7,
  },

  topoGlow: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    right: -100,
    top: -135,
    opacity: 0.35,
  },

  topoConteudo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  tituloTopo: {
    fontSize: 23,
    fontWeight: "800",
  },

  subtituloTopo: {
    fontSize: 12,
    marginTop: 4,
    opacity: 0.85,
  },

  botaoEscola: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.17)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.3)",
  },

  botaoEscolaTexto: {
    fontSize: 11,
    fontWeight: "800",
  },

  resumo: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    marginTop: 15,
  },

  card: {
    flex: 1,
    minHeight: 88,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 13,
    justifyContent: "center",
    overflow: "hidden",
    elevation: 2,
  },

  cardBrilho: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    right: -42,
    top: -42,
  },

  cardLabel: {
    fontSize: 11,
    opacity: 0.7,
    fontWeight: "600",
  },

  cardValor: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 5,
  },

  estadoVazio: {
    marginHorizontal: 16,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 27,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    elevation: 2,
  },

  vazioIcone: {
    width: 70,
    height: 70,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.55)",
    marginBottom: 13,
  },

  vazioTitulo: {
    fontSize: 19,
    fontWeight: "800",
    textAlign: "center",
  },

  vazioTexto: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    opacity: 0.65,
    marginTop: 7,
    maxWidth: 290,
  },

  vazioBotao: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  vazioBotaoTexto: {
    fontSize: 12,
    fontWeight: "800",
  },

  tituloSecao: {
    marginHorizontal: 16,
    marginTop: 23,
    marginBottom: 9,
    fontWeight: "800",
    fontSize: 18,
  },

  item: {
    marginHorizontal: 15,
    marginVertical: 4,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  itemEsquerda: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  indicador: {
    width: 4,
    height: 36,
    borderRadius: 4,
    marginRight: 10,
  },

  itemTitulo: {
    fontWeight: "700",
    fontSize: 14,
  },

  itemData: {
    color: "#888",
    fontSize: 10,
    marginTop: 3,
  },

  itemDireita: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  itemValor: {
    fontWeight: "800",
    fontSize: 13,
  },

  graficoContainer: {
    alignItems: "center",
    marginTop: 2,
  },

  menu: {
    flexDirection: "row",
    justifyContent:
      "space-around",
    alignItems: "center",
    paddingTop: 9,
    paddingBottom: 11,
    position: "absolute",
    bottom: 0,
    width: "100%",
    elevation: 15,
  },

  menuItem: {
    width: 80,
    alignItems: "center",
  },

  menuTexto: {
    textAlign: "center",
    fontSize: 10,
    marginTop: 3,
    fontWeight: "600",
  },

  botaoAdd: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -26,
    borderWidth: 2,
    elevation: 8,
  },

  modal: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:
      "rgba(20,10,20,0.48)",
    padding: 10,
  },

  caixaModal: {
    margin: 10,
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    elevation: 8,
  },

  modalTitulo: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },

  modalDescricao: {
    textAlign: "center",
    color: "#888",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
    marginBottom: 18,
  },

  input: {
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    fontSize: 13,
  },

  tipoContainer: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    marginBottom: 15,
    gap: 10,
  },

  tipoBotao: {
    flex: 1,
    padding: 12,
    borderRadius: 11,
    alignItems: "center",
  },

  salvar: {
    padding: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  salvarTexto: {
    fontWeight: "800",
    fontSize: 13,
  },

  cancelar: {
    marginTop: 13,
    alignItems: "center",
  },

  cancelarTexto: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
  },
});