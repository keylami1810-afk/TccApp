import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { temasDoProjeto } from "./temas";

const MODULOS = [
  {
    id: 1,
    titulo: "Começando com dinheiro",
    descricao: "Aprenda os conceitos básicos de educação financeira.",
    icone: "cash-outline",
    cor: "#9B59B6",
    atividades: [
      {
        id: "dinheiro-1",
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
    ],
  },

  {
    id: 2,
    titulo: "Organizando o orçamento",
    descricao:
      "Aprenda a controlar seus gastos e planejar seu dinheiro.",
    icone: "bar-chart-outline",
    cor: "#3498DB",
    atividades: [
      {
        id: "orcamento-1",
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
    ],
  },

  {
    id: 3,
    titulo: "Consumo consciente",
    descricao:
      "Aprenda a tomar decisões melhores antes de comprar.",
    icone: "cart-outline",
    cor: "#E67E22",
    atividades: [
      {
        id: "consumo-1",
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
    ],
  },
];

const GRADIENTES = {
  principal: ["#F472B6", "#EC4899", "#DB2777"],
  roxo: ["#C084FC", "#A855F7", "#7E22CE"],
  azul: ["#60A5FA", "#3498DB", "#2563EB"],
  laranja: ["#FDBA74", "#F97316", "#EA580C"],
  verde: ["#86EFAC", "#22C55E", "#16A34A"],
};

export default function AtividadesAluno() {
  const router = useRouter();

  const [temaAtual, setTemaAtual] = useState("principal");
  const [pontos, setPontos] = useState(0);
  const [atividadesConcluidas, setAtividadesConcluidas] = useState([]);

  const entrada = useRef(new Animated.Value(0)).current;
  const pontosFlutuacao = useRef(new Animated.Value(0)).current;
  const pontosScale = useRef(new Animated.Value(1)).current;

  const Cores =
    temasDoProjeto[temaAtual] ||
    temasDoProjeto.principal;

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        try {
          const temaSalvo =
            await AsyncStorage.getItem("@tema_app");

          if (
            temaSalvo &&
            temasDoProjeto[temaSalvo]
          ) {
            setTemaAtual(temaSalvo);
          }

          const pontosSalvos =
            await AsyncStorage.getItem(
              "@pontos_atividades"
            );

          if (pontosSalvos) {
            const novoPontos = Number(pontosSalvos);

            if (novoPontos !== pontos) {
              Animated.sequence([
                Animated.spring(pontosScale, {
                  toValue: 1.12,
                  friction: 4,
                  tension: 90,
                  useNativeDriver: true,
                }),
                Animated.spring(pontosScale, {
                  toValue: 1,
                  friction: 5,
                  tension: 80,
                  useNativeDriver: true,
                }),
              ]).start();
            }

            setPontos(novoPontos);
          }

          const atividadesSalvas =
            await AsyncStorage.getItem(
              "@atividades_concluidas"
            );

          if (atividadesSalvas) {
            setAtividadesConcluidas(
              JSON.parse(atividadesSalvas)
            );
          }
        } catch (error) {
          console.log(
            "Erro ao carregar dados das atividades:",
            error
          );
        }
      }

      carregarDados();

      entrada.setValue(0);

      Animated.timing(entrada, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, [])
  );

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pontosFlutuacao, {
          toValue: -3,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pontosFlutuacao, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  function abrirAtividade(atividade, modulo) {
    router.push({
      pathname: "/atividade",
      params: {
        atividadeId: atividade.id,
        moduloId: String(modulo.id),
      },
    });
  }

  function porcentagemModulo(modulo) {
    const total = modulo.atividades.length;

    const concluidas =
      modulo.atividades.filter((atividade) =>
        atividadesConcluidas.includes(
          atividade.id
        )
      ).length;

    if (total === 0) return 0;

    return Math.round(
      (concluidas / total) * 100
    );
  }

  function moduloDesbloqueado(index) {
    if (index === 0) return true;

    const moduloAnterior =
      MODULOS[index - 1];

    return (
      porcentagemModulo(moduloAnterior) ===
      100
    );
  }

  const totalAtividades =
    MODULOS.reduce(
      (total, modulo) =>
        total + modulo.atividades.length,
      0
    );

  const totalConcluidas =
    atividadesConcluidas.length;

  const progressoGeral =
    totalAtividades === 0
      ? 0
      : Math.round(
          (totalConcluidas /
            totalAtividades) *
            100
        );

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
        contentContainerStyle={styles.scroll}
      >
        {/* ================= TOPO ================= */}

        <Animated.View
          style={{
            opacity: entrada,
            transform: [
              {
                translateY: entrada.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-25, 0],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={[
              Cores.botao,
              "#F472B6",
              "#C026D3",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.topo}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.botaoVoltar}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={23}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View style={styles.topoTexto}>
              <Text
                style={styles.tituloTopo}
              >
                Aprenda Finanças
              </Text>

              <Text
                style={styles.subtituloTopo}
              >
                Sua jornada financeira
              </Text>
            </View>

            <Animated.View
              style={{
                transform: [
                  {
                    translateY:
                      pontosFlutuacao,
                  },
                  {
                    scale: pontosScale,
                  },
                ],
              }}
            >
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.30)",
                  "rgba(255,255,255,0.12)",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.pontosTopo}
              >
                <Ionicons
                  name="trophy-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text
                  style={styles.pontosTexto}
                >
                  {pontos}
                </Text>

                <Text
                  style={styles.xpTexto}
                >
                  XP
                </Text>
              </LinearGradient>
            </Animated.View>
          </LinearGradient>
        </Animated.View>

        {/* ================= PROGRESSO ================= */}

        <Animated.View
          style={[
            styles.cardProgresso,
            {
              backgroundColor:
                Cores.caixaInput,
              borderColor: Cores.borda,
              opacity: entrada,
              transform: [
                {
                  translateY:
                    entrada.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                },
              ],
            },
          ]}
        >
          <View
            style={styles.linhaProgresso}
          >
            <View>
              <Text
                style={[
                  styles.tituloCard,
                  {
                    color:
                      Cores.textoGeral,
                  },
                ]}
              >
                Minha jornada
              </Text>

              <Text
                style={[
                  styles.textoPequeno,
                  {
                    color: "#888",
                  },
                ]}
              >
                {totalConcluidas} de{" "}
                {totalAtividades}{" "}
                atividades concluídas
              </Text>
            </View>

            <LinearGradient
              colors={GRADIENTES.principal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.porcentagemBadge}
            >
              <Text
                style={styles.porcentagem}
              >
                {progressoGeral}%
              </Text>
            </LinearGradient>
          </View>

          <View style={styles.barraFundo}>
            <LinearGradient
              colors={GRADIENTES.principal}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.barraProgresso,
                {
                  width: `${progressoGeral}%`,
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* ================= STATUS ================= */}

        <View style={styles.linhaStatus}>
          <Animated.View
            style={{
              flex: 1,
              opacity: entrada,
              transform: [
                {
                  translateY:
                    entrada.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                },
              ],
            }}
          >
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor:
                    Cores.caixaInput,
                  borderColor:
                    Cores.borda,
                },
              ]}
            >
              <LinearGradient
                colors={[
                  "#FFB7D9",
                  "#F472B6",
                  "#DB2777",
                ]}
                style={styles.statusIconBox}
              >
                <Ionicons
                  name="flame-outline"
                  size={22}
                  color="#FFFFFF"
                />
              </LinearGradient>

              <View>
                <Text
                  style={[
                    styles.statusTitulo,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  1 dia
                </Text>

                <Text
                  style={styles.statusTexto}
                >
                  sequência
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              flex: 1,
              opacity: entrada,
              transform: [
                {
                  translateY:
                    entrada.interpolate({
                      inputRange: [0, 1],
                      outputRange: [25, 0],
                    }),
                },
              ],
            }}
          >
            <View
              style={[
                styles.statusCard,
                {
                  backgroundColor:
                    Cores.caixaInput,
                  borderColor:
                    Cores.borda,
                },
              ]}
            >
              <LinearGradient
                colors={[
                  "#F9A8D4",
                  "#EC4899",
                  "#BE185D",
                ]}
                style={styles.statusIconBox}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={22}
                  color="#FFFFFF"
                />
              </LinearGradient>

              <View>
                <Text
                  style={[
                    styles.statusTitulo,
                    {
                      color:
                        Cores.textoGeral,
                    },
                  ]}
                >
                  {pontos} XP
                </Text>

                <Text
                  style={styles.statusTexto}
                >
                  pontos
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* ================= JORNADA ================= */}

        <Animated.Text
          style={[
            styles.tituloSecao,
            {
              color: Cores.textoGeral,
              opacity: entrada,
            },
          ]}
        >
          Sua jornada
        </Animated.Text>

        {MODULOS.map((modulo, index) => {
          const desbloqueado =
            moduloDesbloqueado(index);

          const progresso =
            porcentagemModulo(modulo);

          const gradienteModulo =
            index === 0
              ? GRADIENTES.roxo
              : index === 1
              ? GRADIENTES.azul
              : GRADIENTES.laranja;

          return (
            <Animated.View
              key={modulo.id}
              style={{
                opacity: entrada,
                transform: [
                  {
                    translateY:
                      entrada.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          35 + index * 10,
                          0,
                        ],
                      }),
                  },
                ],
              }}
            >
              <View
                style={[
                  styles.modulo,
                  {
                    backgroundColor:
                      Cores.caixaInput,
                    borderColor:
                      Cores.borda,
                    opacity:
                      desbloqueado
                        ? 1
                        : 0.65,
                  },
                ]}
              >
                {/* CABEÇALHO */}

                <View
                  style={
                    styles.moduloTopo
                  }
                >
                  <LinearGradient
                    colors={
                      gradienteModulo
                    }
                    start={{
                      x: 0,
                      y: 0,
                    }}
                    end={{
                      x: 1,
                      y: 1,
                    }}
                    style={
                      styles.iconeModulo
                    }
                  >
                    <Ionicons
                      name={
                        modulo.icone
                      }
                      size={24}
                      color="#FFFFFF"
                    />
                  </LinearGradient>

                  <View
                    style={
                      styles.moduloInfo
                    }
                  >
                    <Text
                      style={[
                        styles.moduloTitulo,
                        {
                          color:
                            Cores.textoGeral,
                        },
                      ]}
                    >
                      {modulo.titulo}
                    </Text>

                    <Text
                      style={
                        styles.moduloDescricao
                      }
                    >
                      {modulo.descricao}
                    </Text>
                  </View>

                  {!desbloqueado && (
                    <View
                      style={
                        styles.lockBox
                      }
                    >
                      <Ionicons
                        name="lock-closed"
                        size={16}
                        color="#888"
                      />
                    </View>
                  )}
                </View>

                {/* PROGRESSO */}

                <View
                  style={
                    styles.linhaModulo
                  }
                >
                  <Text
                    style={
                      styles.progressoTexto
                    }
                  >
                    {
                      modulo.atividades.filter(
                        (
                          atividade
                        ) =>
                          atividadesConcluidas.includes(
                            atividade.id
                          )
                      ).length
                    }{" "}
                    /{" "}
                    {
                      modulo
                        .atividades
                        .length
                    }{" "}
                    atividades
                  </Text>

                  <Text
                    style={[
                      styles.progressoNumero,
                      {
                        color:
                          modulo.cor,
                      },
                    ]}
                  >
                    {progresso}%
                  </Text>
                </View>

                <View
                  style={
                    styles.barraFundoModulo
                  }
                >
                  <LinearGradient
                    colors={
                      gradienteModulo
                    }
                    start={{
                      x: 0,
                      y: 0,
                    }}
                    end={{
                      x: 1,
                      y: 0,
                    }}
                    style={[
                      styles.barraModulo,
                      {
                        width: `${progresso}%`,
                      },
                    ]}
                  />
                </View>

                {/* ATIVIDADES */}

                {desbloqueado ? (
                  <View
                    style={
                      styles.listaAtividades
                    }
                  >
                    {modulo.atividades.map(
                      (
                        atividade,
                        atividadeIndex
                      ) => {
                        const concluida =
                          atividadesConcluidas.includes(
                            atividade.id
                          );

                        return (
                          <TouchableOpacity
                            key={
                              atividade.id
                            }
                            activeOpacity={
                              0.82
                            }
                            style={[
                              styles.atividade,
                              {
                                borderColor:
                                  Cores.borda,
                                backgroundColor:
                                  concluida
                                    ? "rgba(34,197,94,0.07)"
                                    : "transparent",
                              },
                            ]}
                            onPress={() =>
                              abrirAtividade(
                                atividade,
                                modulo
                              )
                            }
                          >
                            <LinearGradient
                              colors={
                                concluida
                                  ? GRADIENTES.verde
                                  : gradienteModulo
                              }
                              start={{
                                x: 0,
                                y: 0,
                              }}
                              end={{
                                x: 1,
                                y: 1,
                              }}
                              style={
                                styles.numeroAtividade
                              }
                            >
                              {concluida ? (
                                <Ionicons
                                  name="checkmark"
                                  size={
                                    17
                                  }
                                  color="#fff"
                                />
                              ) : (
                                <Text
                                  style={
                                    styles.numeroTexto
                                  }
                                >
                                  {atividadeIndex +
                                    1}
                                </Text>
                              )}
                            </LinearGradient>

                            <View
                              style={
                                styles.atividadeInfo
                              }
                            >
                              <Text
                                style={[
                                  styles.atividadeTitulo,
                                  {
                                    color:
                                      Cores.textoGeral,
                                  },
                                ]}
                              >
                                {
                                  atividade.titulo
                                }
                              </Text>

                              <Text
                                style={
                                  styles.atividadeSubtitulo
                                }
                              >
                                {concluida
                                  ? "Concluída • +10 XP"
                                  : "Toque para começar"}
                              </Text>
                            </View>

                            <View
                              style={[
                                styles.setaAtividade,
                                {
                                  backgroundColor:
                                    concluida
                                      ? "rgba(34,197,94,0.12)"
                                      : `${modulo.cor}18`,
                                },
                              ]}
                            >
                              <Ionicons
                                name={
                                  concluida
                                    ? "checkmark"
                                    : "arrow-forward"
                                }
                                size={18}
                                color={
                                  concluida
                                    ? "#22C55E"
                                    : modulo.cor
                                }
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    )}
                  </View>
                ) : (
                  <View
                    style={
                      styles.bloqueio
                    }
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="#888"
                    />

                    <Text
                      style={
                        styles.textoBloqueado
                      }
                    >
                      Complete o módulo
                      anterior para
                      desbloquear
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          );
        })}

        {/* ================= DESAFIO ================= */}

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.desafio}
        >
          <LinearGradient
            colors={[
              "#F472B6",
              "#DB2777",
              "#9333EA",
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={styles.desafioGradiente}
          >
            <View
              style={styles.desafioIcone}
            >
              <Ionicons
                name="flash-outline"
                size={25}
                color="#FFFFFF"
              />
            </View>

            <View
              style={styles.desafioInfo}
            >
              <Text
                style={
                  styles.desafioTitulo
                }
              >
                Desafio do dia
              </Text>

              <Text
                style={
                  styles.desafioTexto
                }
              >
                Teste seus conhecimentos
                financeiros.
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#FFFFFF"
            />
          </LinearGradient>
        </TouchableOpacity>
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

  /* ================= TOPO ================= */

  topo: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 7,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  botaoVoltar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor:
      "rgba(255,255,255,0.16)",
    marginRight: 12,
  },

  topoTexto: {
    flex: 1,
  },

  tituloTopo: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  subtituloTopo: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 2,
    opacity: 0.82,
  },

  pontosTopo: {
    minWidth: 66,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.25)",
  },

  pontosTexto: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 15,
  },

  xpTexto: {
    color:
      "rgba(255,255,255,0.75)",
    fontSize: 9,
    fontWeight: "700",
  },

  /* ================= PROGRESSO ================= */

  cardProgresso: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 17,
    borderRadius: 18,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  linhaProgresso: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tituloCard: {
    fontSize: 18,
    fontWeight: "800",
  },

  textoPequeno: {
    fontSize: 12,
    marginTop: 3,
  },

  porcentagemBadge: {
    minWidth: 51,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  porcentagem: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  barraFundo: {
    height: 9,
    backgroundColor: "rgba(0,0,0,0.08)",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 14,
  },

  barraProgresso: {
    height: "100%",
    borderRadius: 10,
  },

  /* ================= STATUS ================= */

  linhaStatus: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 11,
  },

  statusCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  statusIconBox: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  statusTitulo: {
    fontSize: 15,
    fontWeight: "800",
  },

  statusTexto: {
    color: "#888",
    fontSize: 11,
    marginTop: 1,
  },

  /* ================= TÍTULO ================= */

  tituloSecao: {
    fontSize: 21,
    fontWeight: "800",
    marginHorizontal: 16,
    marginTop: 27,
    marginBottom: 12,
  },

  /* ================= MÓDULO ================= */

  modulo: {
    marginHorizontal: 16,
    marginBottom: 15,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 2,
  },

  moduloTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconeModulo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  moduloInfo: {
    flex: 1,
  },

  moduloTitulo: {
    fontSize: 17,
    fontWeight: "800",
  },

  moduloDescricao: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
    lineHeight: 16,
  },

  lockBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor:
      "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  linhaModulo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 7,
  },

  progressoTexto: {
    fontSize: 11,
    color: "#888",
  },

  progressoNumero: {
    fontSize: 12,
    fontWeight: "800",
  },

  barraFundoModulo: {
    height: 7,
    backgroundColor:
      "rgba(0,0,0,0.08)",
    borderRadius: 10,
    overflow: "hidden",
  },

  barraModulo: {
    height: "100%",
    borderRadius: 10,
  },

  /* ================= ATIVIDADES ================= */

  listaAtividades: {
    marginTop: 10,
  },

  atividade: {
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  numeroAtividade: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  numeroTexto: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  atividadeInfo: {
    flex: 1,
    marginHorizontal: 10,
  },

  atividadeTitulo: {
    fontSize: 14,
    fontWeight: "700",
  },

  atividadeSubtitulo: {
    color: "#888",
    fontSize: 10,
    marginTop: 3,
  },

  setaAtividade: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ================= BLOQUEIO ================= */

  bloqueio: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  textoBloqueado: {
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },

  /* ================= DESAFIO ================= */

  desafio: {
    marginHorizontal: 16,
    marginTop: 5,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#DB2777",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  desafioGradiente: {
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  desafioIcone: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor:
      "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  desafioInfo: {
    marginLeft: 12,
    flex: 1,
  },

  desafioTitulo: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  desafioTexto: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 3,
    opacity: 0.88,
  },
});