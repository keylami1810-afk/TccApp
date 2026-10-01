import React, { useEffect, useRef } from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function CarregamentoLogin() {
  const router = useRouter();

  const params = useLocalSearchParams();

  const tipo = params.tipo || "normal";

  const cardScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const gatoOpacity = useRef(new Animated.Value(0)).current;
  const gatoScale = useRef(new Animated.Value(0.65)).current;
  const gatoY = useRef(new Animated.Value(50)).current;

  const brilhoOpacity = useRef(new Animated.Value(0)).current;

  const tituloOpacity = useRef(new Animated.Value(0)).current;
  const tituloY = useRef(new Animated.Value(25)).current;

  const subtituloOpacity = useRef(new Animated.Value(0)).current;
  const subtituloY = useRef(new Animated.Value(20)).current;

  const linhaScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    iniciarAnimacao();
  }, []);

  async function iniciarAnimacao() {
    /*
     * ETAPA 1
     * Pequeno tempo para a tela aparecer
     */
    await esperar(120);

    /*
     * ETAPA 2
     * Entrada do gatinho
     */
    Animated.parallel([
      Animated.timing(gatoOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.spring(gatoScale, {
        toValue: 1,
        friction: 7,
        tension: 55,
        useNativeDriver: true,
      }),

      Animated.timing(gatoY, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(brilhoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();

    /*
     * ETAPA 3
     * Entrada do título
     */
    await esperar(380);

    Animated.parallel([
      Animated.timing(tituloOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(tituloY, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(linhaScale, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    /*
     * ETAPA 4
     * Entrada do subtítulo
     */
    await esperar(250);

    Animated.parallel([
      Animated.timing(subtituloOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(subtituloY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    /*
     * Mantém a mensagem na tela
     */
    await esperar(1450);

    /*
     * ETAPA 5
     * Finalização elegante
     */
    Animated.parallel([
      Animated.timing(gatoOpacity, {
        toValue: 0,
        duration: 450,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(gatoScale, {
        toValue: 0.82,
        duration: 450,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(gatoY, {
        toValue: -25,
        duration: 450,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),

      Animated.timing(tituloOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),

      Animated.timing(subtituloOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),

      Animated.timing(brilhoOpacity, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();

    await esperar(450);

    /*
     * Vai para a tela correta
     */
    if (tipo === "aluno") {
      router.replace({
        pathname: "/principalMFS",
        params: {
          pontos: params.pontos || 0,
        },
      });
    } else {
      router.replace({
        pathname: "/principal",
        params: {
          nomeUsuario: params.nomeUsuario || "",
          usuarioId: params.usuarioId || "",
        },
      });
    }
  }

  function esperar(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* FUNDO COM GRADIENTE */}
      <LinearGradient
        colors={[
  "#FFD6EC",
  "#FFEAF5",
  "#FFFFFF",
  "#FFF1F8",
  "#FFDCEC",
  "#FFFFFF",
]}
        locations={[
          0,
          0.22,
          0.48,
          0.63,
          0.82,
          1,
        ]}
        style={styles.background}
      >

        {/* BRILHO CENTRAL */}
        <Animated.View
          style={[
            styles.brilho,
            {
              opacity: brilhoOpacity,
            },
          ]}
        >
          <LinearGradient
            colors={[
  "rgba(255,255,255,0)",
  "rgba(255,255,255,0.75)",
  "rgba(255,182,225,0)",
]}
            style={styles.brilhoGradient}
          />
        </Animated.View>

        {/* CONTEÚDO */}
        <View style={styles.content}>

          {/* GATO */}
          <Animated.View
            style={[
              styles.gatoContainer,
              {
                opacity: gatoOpacity,
                transform: [
                  {
                    translateY: gatoY,
                  },
                  {
                    scale: gatoScale,
                  },
                ],
              },
            ]}
          >
            <View style={styles.gatoGlow} />

            <Image
              source={require("../assets/icone.png")}
              style={styles.gato}
              resizeMode="contain"
            />
          </Animated.View>

          {/* TEXTO */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: tituloOpacity,
                transform: [
                  {
                    translateY: tituloY,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.titulo}>
              Seja bem-vindo!
            </Text>

            <Animated.View
              style={[
                styles.linha,
                {
                  transform: [
                    {
                      scaleX: linhaScale,
                    },
                  ],
                },
              ]}
            />

            <Animated.Text
              style={[
                styles.subtitulo,
                {
                  opacity: subtituloOpacity,
                  transform: [
                    {
                      translateY: subtituloY,
                    },
                  ],
                },
              ]}
            >
              {tipo === "aluno"
                ? "Prepare-se para começar sua jornada no Malomi for Schools."
                : "Seu espaço financeiro está pronto para você."}
            </Animated.Text>
          </Animated.View>

        </View>

        {/* DETALHE INFERIOR */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            MALOMI
          </Text>
        </View>

      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17071F",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  brilho: {
    position: "absolute",
    width: width * 1.4,
    height: height * 0.7,
    left: -width * 0.2,
    top: height * 0.08,
  },

  brilhoGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 500,
  },

 gatoContainer: {
  width: width * 0.42,
  height: width * 0.42,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 10,
},

  gatoGlow: {
  position: "absolute",
  width: width * 0.34,
  height: width * 0.34,
  borderRadius: width,
  backgroundColor: "rgba(255,182,225,0.25)",
  shadowColor: "#FFB6DF",
  shadowOpacity: 0.65,
  shadowRadius: 28,
  shadowOffset: {
    width: 0,
    height: 0,
  },
  elevation: 15,
},
  gato: {
    width: "100%",
    height: "100%",
  },

  textContainer: {
    alignItems: "center",
    width: "100%",
  },

  titulo: {
  color: "#9D174D",
  fontSize: 31,
  fontWeight: "800",
  letterSpacing: 0.4,
  textAlign: "center",
},

  linha: {
  width: 85,
  height: 3,
  borderRadius: 10,
  backgroundColor: "#F9A8D4",
  marginTop: 12,
  marginBottom: 15,
},

  subtitulo: {
  color: "rgba(131,24,67,0.75)",
  fontSize: 15,
  lineHeight: 22,
  textAlign: "center",
  maxWidth: 320,
},

  footer: {
    position: "absolute",
    bottom: 28,
    width: "100%",
    alignItems: "center",
  },

  footerText: {
  color: "rgba(157,23,77,0.40)",
  fontSize: 11,
  fontWeight: "800",
  letterSpacing: 4,
},
});