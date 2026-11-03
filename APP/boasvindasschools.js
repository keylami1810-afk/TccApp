import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const telas = [
  {
    titulo: "Bem-vindo ao Schools!",
    texto:
      "O Malomi for Schools foi criado para ajudar você a aprender sobre dinheiro de um jeito simples, divertido e interativo.",
    simbolo: "🌸",
  },
  {
    titulo: "Aprenda brincando",
    texto:
      "Aqui você encontrará atividades que vão ensinar conceitos importantes sobre organização, planejamento e educação financeira.",
    simbolo: "📚",
  },
  {
    titulo: "Complete atividades",
    texto:
      "Ao realizar as atividades, você poderá aprender novos conteúdos e acompanhar sua evolução durante sua jornada.",
    simbolo: "⭐",
  },
  {
    titulo: "Sua jornada começa agora!",
    texto:
      "Tudo pronto? Explore o Malomi for Schools e comece a aprender sobre finanças de uma maneira diferente.",
    simbolo: "💗",
  },
];

export default function BoasVindasSchools() {
  const router = useRouter();

  const [pagina, setPagina] = useState(0);

  const animacao = useRef(new Animated.Value(0)).current;

  function mudarPagina(novaPagina) {
    Animated.timing(animacao, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setPagina(novaPagina);
      animacao.setValue(0);
    });
  }

  function finalizarIntroducao() {
    router.replace("/principalMFS");
  }

  function pular() {
    finalizarIntroducao();
  }

  function continuar() {
    if (pagina < telas.length - 1) {
      mudarPagina(pagina + 1);
    } else {
      finalizarIntroducao();
    }
  }

  const tela = telas[pagina];

  return (
    <View style={styles.container}>

      {/* BOTÃO PULAR */}

      <TouchableOpacity
        style={styles.pular}
        onPress={pular}
      >
        <Text style={styles.textoPular}>
          Pular
        </Text>
      </TouchableOpacity>

      {/* CONTEÚDO */}

      <Animated.View
        style={[
          styles.conteudo,
          {
            opacity: animacao.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),

            transform: [
              {
                translateX: animacao.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -30],
                }),
              },
            ],
          },
        ]}
      >

        <View style={styles.ilustracao}>
          <Text style={styles.simbolo}>
            {tela.simbolo}
          </Text>
        </View>

        <Text style={styles.titulo}>
          {tela.titulo}
        </Text>

        <Text style={styles.texto}>
          {tela.texto}
        </Text>

      </Animated.View>

      {/* INDICADORES */}

      <View style={styles.indicadores}>
        {telas.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicador,
              index === pagina && styles.indicadorAtivo,
            ]}
          />
        ))}
      </View>

      {/* BOTÃO */}

      <TouchableOpacity
        style={styles.botao}
        onPress={continuar}
      >
        <Text style={styles.textoBotao}>
          {pagina === telas.length - 1
            ? "Estou pronto!"
            : "Continuar"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5FA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  pular: {
    position: "absolute",
    top: 55,
    right: 25,
    padding: 10,
    zIndex: 10,
  },

  textoPular: {
    color: "#A56A89",
    fontSize: 15,
    fontWeight: "600",
  },

  conteudo: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    minHeight: height * 0.55,
  },

  ilustracao: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#F9DCEB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  simbolo: {
    fontSize: 70,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8E4268",
    textAlign: "center",
    marginBottom: 15,
  },

  texto: {
    fontSize: 16,
    lineHeight: 24,
    color: "#8E7180",
    textAlign: "center",
    maxWidth: 330,
  },

  indicadores: {
    position: "absolute",
    bottom: 130,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  indicador: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E8C4D5",
  },

  indicadorAtivo: {
    width: 24,
    backgroundColor: "#C4779D",
  },

  botao: {
    position: "absolute",
    bottom: 45,
    width: width - 55,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#C4779D",
    alignItems: "center",
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});