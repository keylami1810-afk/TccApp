
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  StatusBar,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  useRouter,
  useFocusEffect,
} from "expo-router";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { temasDoProjeto } from "./temas";
import { MODULOS as MODULOS_DADOS } from "./atividadesDados";

const MODULOS = MODULOS_DADOS;

export default function PrincipalAluno() {
  const router = useRouter();

  const [temaAtual, setTemaAtual] =
    useState("principal");

  const [pontos, setPontos] =
    useState(0);

  const [pontosAnimados, setPontosAnimados] =
    useState(0);

  const [pontosGanhos, setPontosGanhos] =
    useState(0);

  const [mostrarParabens, setMostrarParabens] =
    useState(false);

  const [atividadesConcluidas, setAtividadesConcluidas] =
    useState([]);

  /* =====================================================
     ANIMAÇÕES
  ===================================================== */

  const entrada =
    useRef(
      new Animated.Value(0)
    ).current;

  const xpFloat =
    useRef(
      new Animated.Value(0)
    ).current;

  const xpScale =
    useRef(
      new Animated.Value(1)
    ).current;

  const xpGlow =
    useRef(
      new Animated.Value(0.35)
    ).current;

  const parabensOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const parabensScale =
    useRef(
      new Animated.Value(0.75)
    ).current;

  const touchOpacity =
    useRef(
      new Animated.Value(0)
    ).current;

  const touchScale =
    useRef(
      new Animated.Value(0.15)
    ).current;

  const [touchPosition, setTouchPosition] =
    useState({
      x: 0,
      y: 0,
    });

  const Cores =
    temasDoProjeto[temaAtual] ||
    temasDoProjeto.principal;

  /* =====================================================
     ANIMAÇÃO DOS PONTOS
  ===================================================== */

  useEffect(() => {
    const animacao =
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(
              xpFloat,
              {
                toValue: -3,
                duration: 1700,
                easing:
                  Easing.inOut(
                    Easing.sin
                  ),
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              xpGlow,
              {
                toValue: 0.75,
                duration: 1700,
                easing:
                  Easing.inOut(
                    Easing.sin
                  ),
                useNativeDriver: true,
              }
            ),
          ]),

          Animated.parallel([
            Animated.timing(
              xpFloat,
              {
                toValue: 3,
                duration: 1700,
                easing:
                  Easing.inOut(
                    Easing.sin
                  ),
                useNativeDriver: true,
              }
            ),

            Animated.timing(
              xpGlow,
              {
                toValue: 0.35,
                duration: 1700,
                easing:
                  Easing.inOut(
                    Easing.sin
                  ),
                useNativeDriver: true,
              }
            ),
          ]),
        ])
      );

    animacao.start();

    return () =>
      animacao.stop();
  }, []);

  /* =====================================================
     ENTRADA
  ===================================================== */

  useEffect(() => {
    Animated.timing(
      entrada,
      {
        toValue: 1,
        duration: 650,
        easing:
          Easing.out(
            Easing.cubic
          ),
        useNativeDriver: true,
      }
    ).start();
  }, []);

  /* =====================================================
     CARREGAR
  ===================================================== */

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const tema =
            await AsyncStorage.getItem(
              "@tema_app"
            );

          if (
            tema &&
            temasDoProjeto[tema]
          ) {
            setTemaAtual(tema);
          }

          const pontosSalvos =
            await AsyncStorage.getItem(
              "@pontos_atividades"
            );

          const novosPontos =
            Number(
              pontosSalvos || 0
            );

          const ultimo =
            await AsyncStorage.getItem(
              "@pontos_vistos_principal"
            );

          const ultimoValor =
            ultimo === null
              ? novosPontos
              : Number(ultimo);

          setPontos(
            novosPontos
          );

          /* PRIMEIRO ACESSO */

          if (ultimo === null) {
            setPontosAnimados(
              novosPontos
            );

            await AsyncStorage.setItem(
              "@pontos_vistos_principal",
              String(novosPontos)
            );
          }

          /* NOVOS PONTOS */

          else if (
            novosPontos >
            ultimoValor
          ) {
            const ganho =
              novosPontos -
              ultimoValor;

            setPontosGanhos(
              ganho
            );

            setMostrarParabens(
              true
            );

            setPontosAnimados(
              ultimoValor
            );

            xpScale.setValue(1);

            parabensOpacity.setValue(
              0
            );

            parabensScale.setValue(
              0.75
            );

            let inicio = null;

            const animar =
              (timestamp) => {
                if (!inicio) {
                  inicio =
                    timestamp;
                }

                const progresso =
                  Math.min(
                    (timestamp -
                      inicio) /
                      900,
                    1
                  );

                const valorAtual =
                  Math.round(
                    ultimoValor +
                      (novosPontos -
                        ultimoValor) *
                        progresso
                  );

                setPontosAnimados(
                  valorAtual
                );

                if (
                  progresso <
                  1
                ) {
                  requestAnimationFrame(
                    animar
                  );
                }
              };

            requestAnimationFrame(
              animar
            );

            Animated.sequence([
              Animated.parallel([
                Animated.spring(
                  xpScale,
                  {
                    toValue: 1.22,
                    friction: 5,
                    tension: 100,
                    useNativeDriver: true,
                  }
                ),

                Animated.timing(
                  parabensOpacity,
                  {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  }
                ),

                Animated.spring(
                  parabensScale,
                  {
                    toValue: 1,
                    friction: 6,
                    tension: 80,
                    useNativeDriver: true,
                  }
                ),
              ]),

              Animated.delay(
                1800
              ),

              Animated.parallel([
                Animated.spring(
                  xpScale,
                  {
                    toValue: 1,
                    friction: 7,
                    tension: 70,
                    useNativeDriver: true,
                  }
                ),

                Animated.timing(
                  parabensOpacity,
                  {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                  }
                ),
              ]),
            ]).start(() => {
              setMostrarParabens(
                false
              );
            });

            await AsyncStorage.setItem(
              "@pontos_vistos_principal",
              String(novosPontos)
            );
          } else {
            setPontosAnimados(
              novosPontos
            );
          }

          const atividadesSalvas =
            await AsyncStorage.getItem(
              "@atividades_concluidas"
            );

          if (atividadesSalvas) {
            setAtividadesConcluidas(
              JSON.parse(
                atividadesSalvas
              )
            );
          } else {
            setAtividadesConcluidas(
              []
            );
          }
        } catch (error) {
          console.log(
            "Erro ao carregar área escolar:",
            error
          );
        }
      }

      carregar();
    }, [])
  );

  /* =====================================================
     TOQUE
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

    touchOpacity.setValue(
      0.65
    );

    touchScale.setValue(
      0.15
    );

    Animated.parallel([
      Animated.spring(
        touchScale,
        {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        touchOpacity,
        {
          toValue: 0,
          duration: 650,
          easing:
            Easing.out(
              Easing.cubic
            ),
          useNativeDriver: true,
        }
      ),
    ]).start();
  }

  /* =====================================================
     PROGRESSO
  ===================================================== */

  function porcentagemModulo(
    modulo
  ) {
    const concluidas =
      modulo.atividades.filter(
        (atividade) =>
          atividadesConcluidas.includes(
            atividade.id
          )
      ).length;

    return Math.round(
      (concluidas /
        modulo.atividades.length) *
        100
    );
  }

  function moduloDesbloqueado(
    index
  ) {
    if (index === 0) {
      return true;
    }

    return (
      porcentagemModulo(
        MODULOS[index - 1]
      ) === 100
    );
  }

  const totalAtividades =
    MODULOS.reduce(
      (total, modulo) =>
        total +
        modulo.atividades.length,
      0
    );

  const totalConcluidas =
    atividadesConcluidas.length;

  const progressoGeral =
    Math.round(
      (totalConcluidas /
        totalAtividades) *
        100
    );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Cores.fundo },
      ]}
      onTouchStart={
        mostrarToque
      }
    >
      <ImageBackground source={Cores.imagem} style={StyleSheet.absoluteFillObject} imageStyle={{ opacity: 0.12 }} resizeMode="cover" pointerEvents="none" />
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={
          temaAtual ===
            "principal" ||
          temaAtual ===
            "gelo" ||
          temaAtual ===
            "pastel"
            ? "dark-content"
            : "light-content"
        }
      />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.touchGlow,
          {
            left:
              touchPosition.x -
              42,

            top:
              touchPosition.y -
              42,

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

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
      >
        {/* =================================================
            TOPO
        ================================================= */}

        <Animated.View
          style={[
            styles.topo,
            {
              backgroundColor:
                Cores.botao,

              opacity:
                entrada,

              transform: [
                {
                  translateY:
                    entrada.interpolate({
                      inputRange: [
                        0,
                        1,
                      ],
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
            style={[
              styles.topoGlow,
              {
                backgroundColor:
                  Cores.sombraCor,
              },
            ]}
          />

          <View
            style={
              styles.topoConteudo
            }
          >
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
                Aprenda Finanças
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
                Sua jornada financeira
              </Text>
            </View>

            <Animated.View
              style={[
                styles.pontos,
                {
                  transform: [
                    {
                      translateY:
                        xpFloat,
                    },
                    {
                      scale:
                        xpScale,
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.xpBrilho,
                  {
                    backgroundColor:
                      Cores.borda,

                    opacity:
                      xpGlow,
                  },
                ]}
              />

              <Ionicons
                name="trophy"
                size={18}
                color="#FFE4A3"
              />

              <Text
                style={
                  styles.pontosTexto
                }
              >
                {pontosAnimados} XP
              </Text>
            </Animated.View>
          </View>

          {mostrarParabens && (
            <Animated.View
              style={[
                styles.parabens,
                {
                  opacity:
                    parabensOpacity,

                  transform: [
                    {
                      scale:
                        parabensScale,
                    },
                  ],
                },
              ]}
            >
              <Ionicons
                name="sparkles"
                size={18}
                color="#FFE4A3"
              />

              <View>
                <Text
                  style={[
                    styles.parabensTitulo,
                    {
                      color:
                        Cores.textoBotao,
                    },
                  ]}
                >
                  Parabéns!
                </Text>

                <Text
                  style={[
                    styles.parabensTexto,
                    {
                      color:
                        Cores.textoBotao,
                    },
                  ]}
                >
                  Você ganhou +
                  {pontosGanhos} XP
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>

        {/* =================================================
            BOTÃO FINANÇAS
        ================================================= */}

        <TouchableOpacity
          activeOpacity={0.82}
          style={[
            styles.financasBotao,
            {
              backgroundColor:
                Cores.caixaInput,

              borderColor:
                Cores.borda,
            },
          ]}
          onPress={() =>
            router.push(
              "/principalMFS"
            )
          }
        >
          <View
            style={[
              styles.financasIcone,
              {
                backgroundColor:
                  `${Cores.botao}18`,
              },
            ]}
          >
            <Ionicons
              name="wallet-outline"
              size={22}
              color={
                Cores.botao
              }
            />
          </View>

          <View
            style={
              styles.financasInfo
            }
          >
            <Text
              style={[
                styles.financasTitulo,
                {
                  color:
                    Cores.textoGeral,
                },
              ]}
            >
              Meu dinheiro
            </Text>

            <Text
              style={
                styles.financasTexto
              }
            >
              Voltar para o controle financeiro
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={21}
            color={
              Cores.botao
            }
          />
        </TouchableOpacity>

        {/* =================================================
            PROGRESSO
        ================================================= */}

        <View
          style={[
            styles.progressoCard,
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
              styles.progressoTopo
            }
          >
            <View>
              <Text
                style={[
                  styles.progressoTitulo,
                  {
                    color:
                      Cores.textoGeral,
                  },
                ]}
              >
                Minha jornada
              </Text>

              <Text
                style={
                  styles.progressoTexto
                }
              >
                {totalConcluidas} de{" "}
                {totalAtividades}{" "}
                atividades
              </Text>
            </View>

            <Text
              style={[
                styles.progressoNumero,
                {
                  color:
                    Cores.botao,
                },
              ]}
            >
              {progressoGeral}%
            </Text>
          </View>

          <View
            style={
              styles.barraFundo
            }
          >
            <View
              style={[
                styles.barra,
                {
                  width:
                    `${progressoGeral}%`,
                  backgroundColor:
                    Cores.botao,
                },
              ]}
            />
          </View>
        </View>

        {/* =================================================
            STATUS
        ================================================= */}

        <View
          style={
            styles.statusLinha
          }
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
            <Text
              style={
                styles.statusEmoji
              }
            >
              🔥
            </Text>

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
                style={
                  styles.statusTexto
                }
              >
                sequência
              </Text>
            </View>
          </View>

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
            <Text
              style={
                styles.statusEmoji
              }
            >
              ⭐
            </Text>

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
                style={
                  styles.statusTexto
                }
              >
                pontos
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            MÓDULOS
        ================================================= */}

        <Text
          style={[
            styles.secaoTitulo,
            {
              color:
                Cores.textoGeral,
            },
          ]}
        >
          Continue aprendendo
        </Text>

        {MODULOS.map(
          (
            modulo,
            index
          ) => {
            const desbloqueado =
              moduloDesbloqueado(
                index
              );

            const progresso =
              porcentagemModulo(
                modulo
              );

            return (
              <View
                key={
                  modulo.id
                }
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
                        : 0.62,
                  },
                ]}
              >
                <View
                  style={
                    styles.moduloTopo
                  }
                >
                  <View
                    style={[
                      styles.moduloIcone,
                      {
                        backgroundColor:
                          modulo.cor,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        modulo.icone
                      }
                      size={24}
                      color="#fff"
                    />
                  </View>

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
                      {
                        modulo.titulo
                      }
                    </Text>

                    <Text
                      style={
                        styles.moduloDescricao
                      }
                    >
                      {
                        modulo.descricao
                      }
                    </Text>
                  </View>

                  {!desbloqueado && (
                    <Ionicons
                      name="lock-closed"
                      size={19}
                      color="#888"
                    />
                  )}
                </View>

                <View
                  style={
                    styles.moduloProgressoLinha
                  }
                >
                  <Text
                    style={
                      styles.moduloProgressoTexto
                    }
                  >
                    {modulo.atividades.filter(
                      (
                        atividade
                      ) =>
                        atividadesConcluidas.includes(
                          atividade.id
                        )
                    ).length}{" "}
                    /{" "}
                    {
                      modulo
                        .atividades
                        .length
                    }
                  </Text>

                  <Text
                    style={[
                      styles.moduloPorcentagem,
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
                    styles.moduloBarraFundo
                  }
                >
                  <View
                    style={[
                      styles.moduloBarra,
                      {
                        width:
                          `${progresso}%`,
                        backgroundColor:
                          modulo.cor,
                      },
                    ]}
                  />
                </View>

                {desbloqueado && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.abrirModulo,
                      {
                        backgroundColor:
                          `${modulo.cor}18`,
                      },
                    ]}
                    onPress={() =>
                      router.push(
                        "/atividadesaluno"
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.abrirModuloTexto,
                        {
                          color:
                            modulo.cor,
                        },
                      ]}
                    >
                      Continuar módulo
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={17}
                      color={
                        modulo.cor
                      }
                    />
                  </TouchableOpacity>
                )}

                {!desbloqueado && (
                  <View
                    style={
                      styles.bloqueado
                    }
                  >
                    <Ionicons
                      name="lock-closed-outline"
                      size={16}
                      color="#888"
                    />

                    <Text
                      style={
                        styles.bloqueadoTexto
                      }
                    >
                      Complete o módulo
                      anterior para
                      desbloquear
                    </Text>
                  </View>
                )}
              </View>
            );
          }
        )}

        {/* =================================================
            DESAFIO
        ================================================= */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.desafio,
            {
              backgroundColor:
                Cores.botao,
            },
          ]}
          onPress={() =>
            router.push(
              "/atividadesaluno"
            )
          }
        >
          <View
            style={
              styles.desafioIcone
            }
          >
            <Text
              style={
                styles.desafioEmoji
              }
            >
              ⚡
            </Text>
          </View>

          <View
            style={
              styles.desafioInfo
            }
          >
            <Text
              style={[
                styles.desafioTitulo,
                {
                  color:
                    Cores.textoBotao,
                },
              ]}
            >
              Desafio do dia
            </Text>

            <Text
              style={[
                styles.desafioTexto,
                {
                  color:
                    Cores.textoBotao,
                },
              ]}
            >
              Teste seus conhecimentos financeiros!
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={
              Cores.textoBotao
            }
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    minHeight: 155,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 24,
    overflow: "hidden",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 8,
    shadowColor: "#35172F",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
  },

  topoGlow: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -90,
    top: -125,
    opacity: 0.3,
  },

  topoConteudo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  tituloTopo: {
    fontSize: 22,
    fontWeight: "800",
  },

  subtituloTopo: {
    fontSize: 12,
    marginTop: 3,
    opacity: 0.85,
  },

  pontos: {
    minWidth: 84,
    height: 43,
    paddingHorizontal: 12,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor:
      "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.32)",
    overflow: "hidden",
  },

  xpBrilho: {
    position: "absolute",
    width: 120,
    height: 20,
    borderRadius: 20,
  },

  pontosTexto: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  parabens: {
    position: "absolute",
    bottom: 10,
    left: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  parabensTitulo: {
    fontSize: 13,
    fontWeight: "800",
  },

  parabensTexto: {
    fontSize: 11,
    marginTop: 1,
    opacity: 0.9,
  },

  financasBotao: {
    marginHorizontal: 16,
    marginTop: 15,
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  financasIcone: {
    width: 43,
    height: 43,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  financasInfo: {
    flex: 1,
    marginLeft: 11,
  },

  financasTitulo: {
    fontSize: 14,
    fontWeight: "800",
  },

  financasTexto: {
    color: "#888",
    fontSize: 10,
    marginTop: 3,
  },

  progressoCard: {
    marginHorizontal: 16,
    marginTop: 15,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: "#4A233F",
    shadowOpacity: 0.055,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },

  progressoTopo: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  progressoTitulo: {
    fontSize: 17,
    fontWeight: "800",
  },

  progressoTexto: {
    color: "#888",
    fontSize: 11,
    marginTop: 3,
  },

  progressoNumero: {
    fontSize: 22,
    fontWeight: "800",
  },

  barraFundo: {
    height: 9,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 13,
  },

  barra: {
    height: "100%",
    borderRadius: 10,
  },

  statusLinha: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 10,
  },

  statusCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    shadowColor: "#4A233F",
    shadowOpacity: 0.045,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },

  statusEmoji: {
    fontSize: 24,
  },

  statusTitulo: {
    fontSize: 14,
    fontWeight: "800",
  },

  statusTexto: {
    color: "#888",
    fontSize: 10,
    marginTop: 2,
  },

  secaoTitulo: {
    marginHorizontal: 16,
    marginTop: 23,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "800",
  },

  modulo: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 21,
    borderWidth: 1,
    shadowColor: "#4A233F",
    shadowOpacity: 0.05,
    shadowRadius: 11,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  moduloTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  moduloIcone: {
    width: 49,
    height: 49,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  moduloInfo: {
    flex: 1,
  },

  moduloTitulo: {
    fontSize: 16,
    fontWeight: "800",
  },

  moduloDescricao: {
    color: "#888",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },

  moduloProgressoLinha: {
    marginTop: 14,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent:
      "space-between",
  },

  moduloProgressoTexto: {
    color: "#888",
    fontSize: 10,
  },

  moduloPorcentagem: {
    fontSize: 11,
    fontWeight: "800",
  },

  moduloBarraFundo: {
    height: 7,
    backgroundColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },

  moduloBarra: {
    height: "100%",
    borderRadius: 10,
  },

  abrirModulo: {
    marginTop: 11,
    padding: 10,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "center",
    gap: 7,
  },

  abrirModuloTexto: {
    fontSize: 11,
    fontWeight: "800",
  },

  bloqueado: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent:
      "center",
    alignItems: "center",
    gap: 6,
  },

  bloqueadoTexto: {
    color: "#888",
    fontSize: 10,
  },

  desafio: {
    marginHorizontal: 16,
    marginTop: 3,
    padding: 17,
    borderRadius: 21,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#35172F",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },

  desafioIcone: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor:
      "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },

  desafioEmoji: {
    fontSize: 26,
  },

  desafioInfo: {
    flex: 1,
    marginLeft: 11,
  },

  desafioTitulo: {
    fontSize: 16,
    fontWeight: "800",
  },

  desafioTexto: {
    fontSize: 10,
    marginTop: 3,
    opacity: 0.9,
  },
});