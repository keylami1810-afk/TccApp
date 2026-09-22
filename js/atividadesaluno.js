import React, { useCallback, useState } from "react";
//teste
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { temasDoProjeto } from "./temas";

const MODULOS = [
  {
    id: 1,
    titulo: "Começando com dinheiro",
    descricao: "Aprenda os conceitos básicos de educação financeira.",
    icone: "cash-outline",
    cor: "#9b59b6",

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
    cor: "#3498db",

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
    cor: "#e67e22",

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

export default function AtividadesAluno() {
  const router = useRouter();

  const [temaAtual, setTemaAtual] = useState("claro");
  const [pontos, setPontos] = useState(0);
  const [atividadesConcluidas, setAtividadesConcluidas] = useState([]);

  const Cores =
    temasDoProjeto[temaAtual] || temasDoProjeto.claro;

  useFocusEffect(
    useCallback(() => {
      async function carregarDados() {
        try {
          const temaSalvo =
            await AsyncStorage.getItem("@tema_app");

          if (temaSalvo && temasDoProjeto[temaSalvo]) {
            setTemaAtual(temaSalvo);
          }

          const pontosSalvos =
            await AsyncStorage.getItem("@pontos_atividades");

          if (pontosSalvos) {
            setPontos(Number(pontosSalvos));
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
    }, [])
  );

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

    const concluidas = modulo.atividades.filter(
      (atividade) =>
        atividadesConcluidas.includes(atividade.id)
    ).length;

    if (total === 0) return 0;

    return Math.round((concluidas / total) * 100);
  }

  function moduloDesbloqueado(index) {
    if (index === 0) return true;

    const moduloAnterior = MODULOS[index - 1];

    return porcentagemModulo(moduloAnterior) === 100;
  }

  const totalAtividades = MODULOS.reduce(
    (total, modulo) =>
      total + modulo.atividades.length,
    0
  );

  const totalConcluidas = atividadesConcluidas.length;

  const progressoGeral =
    totalAtividades === 0
      ? 0
      : Math.round(
          (totalConcluidas / totalAtividades) * 100
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

        <View
          style={[
            styles.topo,
            {
              backgroundColor: Cores.botao,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.botaoVoltar}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={Cores.textoBotao}
            />
          </TouchableOpacity>

          <View style={styles.topoTexto}>
            <Text
              style={[
                styles.tituloTopo,
                {
                  color: Cores.textoBotao,
                },
              ]}
            >
              Aprenda Finanças
            </Text>

            <Text
              style={[
                styles.subtituloTopo,
                {
                  color: Cores.textoBotao,
                },
              ]}
            >
              Sua jornada financeira
            </Text>
          </View>

          <View style={styles.pontosTopo}>
            <Ionicons
              name="trophy"
              size={18}
              color="#f1c40f"
            />

            <Text style={styles.pontosTexto}>
              {pontos}
            </Text>
          </View>
        </View>

        {/* ================= PROGRESSO ================= */}

        <View
          style={[
            styles.cardProgresso,
            {
              backgroundColor: Cores.caixaInput,
              borderColor: Cores.borda,
            },
          ]}
        >
          <View style={styles.linhaProgresso}>
            <View>
              <Text
                style={[
                  styles.tituloCard,
                  {
                    color: Cores.textoGeral,
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
                {totalConcluidas} de {totalAtividades}{" "}
                atividades concluídas
              </Text>
            </View>

            <Text
              style={[
                styles.porcentagem,
                {
                  color: Cores.botao,
                },
              ]}
            >
              {progressoGeral}%
            </Text>
          </View>

          <View style={styles.barraFundo}>
            <View
              style={[
                styles.barraProgresso,
                {
                  width: `${progressoGeral}%`,
                  backgroundColor: Cores.botao,
                },
              ]}
            />
          </View>
        </View>

        {/* ================= STATUS ================= */}

        <View style={styles.linhaStatus}>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: Cores.caixaInput,
                borderColor: Cores.borda,
              },
            ]}
          >
            <Text style={styles.statusIcon}>
              🔥
            </Text>

            <View>
              <Text
                style={[
                  styles.statusTitulo,
                  {
                    color: Cores.textoGeral,
                  },
                ]}
              >
                1 dia
              </Text>

              <Text style={styles.statusTexto}>
                sequência
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: Cores.caixaInput,
                borderColor: Cores.borda,
              },
            ]}
          >
            <Text style={styles.statusIcon}>
              ⭐
            </Text>

            <View>
              <Text
                style={[
                  styles.statusTitulo,
                  {
                    color: Cores.textoGeral,
                  },
                ]}
              >
                {pontos} XP
              </Text>

              <Text style={styles.statusTexto}>
                pontos
              </Text>
            </View>
          </View>
        </View>

        {/* ================= JORNADA ================= */}

        <Text
          style={[
            styles.tituloSecao,
            {
              color: Cores.textoGeral,
            },
          ]}
        >
          Sua jornada
        </Text>

        {MODULOS.map((modulo, index) => {
          const desbloqueado =
            moduloDesbloqueado(index);

          const progresso =
            porcentagemModulo(modulo);

          return (
            <View
              key={modulo.id}
              style={[
                styles.modulo,
                {
                  backgroundColor:
                    Cores.caixaInput,

                  borderColor:
                    Cores.borda,

                  opacity:
                    desbloqueado ? 1 : 0.65,
                },
              ]}
            >
              {/* CABEÇALHO DO MÓDULO */}

              <View style={styles.moduloTopo}>
                <View
                  style={[
                    styles.iconeModulo,
                    {
                      backgroundColor:
                        modulo.cor,
                    },
                  ]}
                >
                  <Ionicons
                    name={modulo.icone}
                    size={25}
                    color="#fff"
                  />
                </View>

                <View style={styles.moduloInfo}>
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
                  <Ionicons
                    name="lock-closed"
                    size={20}
                    color="#888"
                  />
                )}
              </View>

              {/* PROGRESSO DO MÓDULO */}

              <View style={styles.linhaModulo}>
                <Text
                  style={styles.progressoTexto}
                >
                  {
                    modulo.atividades.filter(
                      (atividade) =>
                        atividadesConcluidas.includes(
                          atividade.id
                        )
                    ).length
                  }{" "}
                  / {modulo.atividades.length}{" "}
                  atividades
                </Text>

                <Text
                  style={[
                    styles.progressoNumero,
                    {
                      color: modulo.cor,
                    },
                  ]}
                >
                  {progresso}%
                </Text>
              </View>

              <View
                style={styles.barraFundoModulo}
              >
                <View
                  style={[
                    styles.barraModulo,
                    {
                      width: `${progresso}%`,
                      backgroundColor:
                        modulo.cor,
                    },
                  ]}
                />
              </View>

              {/* ATIVIDADES */}

              {desbloqueado ? (
                <View
                  style={styles.listaAtividades}
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
                          key={atividade.id}
                          activeOpacity={0.75}
                          style={[
                            styles.atividade,
                            {
                              borderColor:
                                Cores.borda,
                              backgroundColor:
                                concluida
                                  ? "rgba(46,204,113,0.07)"
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
                          {/* NÚMERO */}

                          <View
                            style={[
                              styles.numeroAtividade,
                              {
                                backgroundColor:
                                  concluida
                                    ? "#2ecc71"
                                    : modulo.cor,
                              },
                            ]}
                          >
                            {concluida ? (
                              <Ionicons
                                name="checkmark"
                                size={18}
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
                          </View>

                          {/* TEXTO */}

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
                              {atividade.titulo}
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

                          {/* SETA */}

                          <View
                            style={[
                              styles.setaAtividade,
                              {
                                backgroundColor:
                                  concluida
                                    ? "rgba(46,204,113,0.12)"
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
                                  ? "#2ecc71"
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
                <View style={styles.bloqueio}>
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
                    Complete o módulo anterior
                    para desbloquear
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* ================= DESAFIO ================= */}

        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.desafio,
            {
              backgroundColor: Cores.botao,
            },
          ]}
        >
          <View style={styles.desafioIcone}>
            <Text style={styles.desafioEmoji}>
              ⚡
            </Text>
          </View>

          <View style={styles.desafioInfo}>
            <Text
              style={[
                styles.desafioTitulo,
                {
                  color: Cores.textoBotao,
                },
              ]}
            >
              Desafio do dia
            </Text>

            <Text
              style={[
                styles.desafioTexto,
                {
                  color: Cores.textoBotao,
                },
              ]}
            >
              Teste seus conhecimentos
              financeiros!
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={Cores.textoBotao}
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

  scroll: {
    paddingBottom: 30,
  },

  /* ================= TOPO ================= */

  topo: {
    paddingHorizontal: 18,
    paddingVertical: 18,

    flexDirection: "row",
    alignItems: "center",

    elevation: 4,
  },

  botaoVoltar: {
    marginRight: 12,
  },

  topoTexto: {
    flex: 1,
  },

  tituloTopo: {
    fontSize: 21,
    fontWeight: "bold",
  },

  subtituloTopo: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.85,
  },

  pontosTopo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  pontosTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },

  /* ================= PROGRESSO ================= */

  cardProgresso: {
    margin: 16,
    padding: 17,

    borderRadius: 16,
    borderWidth: 1,
  },

  linhaProgresso: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  tituloCard: {
    fontSize: 18,
    fontWeight: "bold",
  },

  textoPequeno: {
    fontSize: 12,
    marginTop: 3,
  },

  porcentagem: {
    fontSize: 22,
    fontWeight: "bold",
  },

  barraFundo: {
    height: 9,
    backgroundColor: "#ddd",
    borderRadius: 10,

    overflow: "hidden",
    marginTop: 13,
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
  },

  statusCard: {
    flex: 1,

    borderWidth: 1,
    borderRadius: 14,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    gap: 10,
  },

  statusIcon: {
    fontSize: 25,
  },

  statusTitulo: {
    fontSize: 15,
    fontWeight: "bold",
  },

  statusTexto: {
    color: "#888",
    fontSize: 11,
  },

  /* ================= TÍTULO ================= */

  tituloSecao: {
    fontSize: 21,
    fontWeight: "bold",

    marginHorizontal: 16,
    marginTop: 25,
    marginBottom: 12,
  },

  /* ================= MÓDULO ================= */

  modulo: {
    marginHorizontal: 16,
    marginBottom: 15,

    borderRadius: 17,
    borderWidth: 1,

    padding: 15,
  },

  moduloTopo: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconeModulo: {
    width: 50,
    height: 50,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  moduloInfo: {
    flex: 1,
  },

  moduloTitulo: {
    fontSize: 17,
    fontWeight: "bold",
  },

  moduloDescricao: {
    fontSize: 11,
    color: "#888",

    marginTop: 3,
    lineHeight: 16,
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
    fontWeight: "bold",
  },

  barraFundoModulo: {
    height: 7,

    backgroundColor: "#ddd",
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
    borderRadius: 13,

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
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  atividadeInfo: {
    flex: 1,
    marginHorizontal: 10,
  },

  atividadeTitulo: {
    fontSize: 14,
    fontWeight: "600",
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

    borderRadius: 17,

    padding: 17,

    flexDirection: "row",
    alignItems: "center",
  },

  desafioIcone: {
    width: 50,
    height: 50,

    borderRadius: 15,

    backgroundColor:
      "rgba(255,255,255,0.2)",

    alignItems: "center",
    justifyContent: "center",
  },

  desafioEmoji: {
    fontSize: 27,
  },

  desafioInfo: {
    marginLeft: 12,
    flex: 1,
  },

  desafioTitulo: {
    fontSize: 17,
    fontWeight: "bold",
  },

  desafioTexto: {
    fontSize: 12,
    marginTop: 3,
    opacity: 0.9,
  },
});