import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";

import { useRouter } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useFonts } from "expo-font";

import { Ionicons } from "@expo/vector-icons";

import {
  temasDoProjeto,
  obterTemaSalvo,
  salvarTema,
} from "./temas";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

export default function LoginAluno() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeTema, setNomeTema] = useState("principal");

  const [fontsLoaded] = useFonts({
    Amoria: require("../assets/fonts/AMORIA.otf"),
    Fantasia: require("../assets/fonts/Fantasia.ttf"),
    Flowers: require("../assets/fonts/Flowers.otf"),
    Fogo: require("../assets/fonts/Fogo.otf"),
    Gelo: require("../assets/fonts/Gelo.ttf"),
    Gotico: require("../assets/fonts/Gotico.ttf"),
    Magic: require("../assets/fonts/Magic.ttf"),
  });

  const DOMINIOS_INSTITUCIONAIS = [
    "@al.educacao.sp.gov.br",
    "@aluno.educacao.sp.gov.br",
    "@aluno.cps.sp.gov.br",
  ];

  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    const temaSalvo = await obterTemaSalvo();
    setNomeTema(temaSalvo);
  };

  const alternarTema = async () => {
    const chaves = Object.keys(temasDoProjeto);

    const indiceAtual = chaves.indexOf(nomeTema);

    const proximaIndex =
      indiceAtual === -1
        ? 0
        : (indiceAtual + 1) % chaves.length;

    const novoTema = chaves[proximaIndex];

    setNomeTema(novoTema);

    await salvarTema(novoTema);
  };

  const tema =
    temasDoProjeto[nomeTema] ||
    temasDoProjeto.principal;

  const validarEmailInstitucional = (emailTexto) => {
    const emailMinusculo =
      emailTexto.toLowerCase().trim();

    const ehEmailValido =
      emailMinusculo.includes("@") &&
      emailMinusculo.includes(".");

    const ehInstitucional =
      DOMINIOS_INSTITUCIONAIS.some((dominio) =>
        emailMinusculo.endsWith(dominio)
      );

    return ehEmailValido && ehInstitucional;
  };

  const fazerLoginAluno = async () => {
    const txtEmail = (email || "").trim();
    const txtSenha = (senha || "").trim();

    if (!txtEmail || !txtSenha) {
      Alert.alert(
        "Acesso Negado",
        "Preencha o e-mail e a senha."
      );

      return;
    }

    if (!validarEmailInstitucional(txtEmail)) {
      Alert.alert(
        "Acesso Negado",
        "Por favor, utilize um e-mail institucional do aluno."
      );

      return;
    }

    try {
      const parteNome =
        txtEmail.split("@")[0];

      const nomeFormatado =
        parteNome.charAt(0).toUpperCase() +
        parteNome.slice(1);

      await AsyncStorage.setItem(
        "@nome_aluno",
        nomeFormatado
      );

      router.push({
        pathname: "/principalMFS",
        params: {
          nomeUsuario: nomeFormatado,
          pontos: 100,
        },
      });
    } catch (error) {
      Alert.alert(
        "Erro",
        "Ocorreu uma falha ao realizar o login."
      );
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={
          nomeTema === "gelo" ||
          nomeTema === "pastel" ||
          nomeTema === "retro"
            ? "dark-content"
            : "light-content"
        }
      />

      {/* FUNDO DA TELA */}
      <ImageBackground
        source={tema.imagem}
        style={styles.background}
        resizeMode="cover"
        imageStyle={styles.backgroundImage}
      >

        {/* CAMADA LEVE PARA MELHORAR A LEITURA */}
        <View
          style={[
            styles.overlay,
            {
              backgroundColor:
                nomeTema === "gelo" ||
                nomeTema === "pastel" ||
                nomeTema === "retro"
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.10)",
            },
          ]}
        />

        {/* ÁREA DO CARD */}
        <View style={styles.content}>

          <View
            style={[
              styles.card,
              {
                backgroundColor: tema.cardBg,
                shadowColor: tema.sombraCor,
              },
            ]}
          >

            {/* CABEÇALHO */}
            <View style={styles.header}>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: tema.badgeBg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.textoBadge,
                    {
                      color: tema.textoGeral,
                    },
                  ]}
                >
                  Portal do Aluno 🎓
                </Text>
              </View>

              <Text
                style={[
                  styles.titulo,
                  {
                    color: tema.textoGeral,
                    fontFamily: tema.fonteTitulo,
                  },
                ]}
              >
                Malomi for Schools
              </Text>

              <Text
                style={[
                  styles.subtitulo,
                  {
                    color: tema.textoGeral,
                  },
                ]}
              >
                Insira seu e-mail institucional
              </Text>

            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>

              <Text
                style={[
                  styles.label,
                  {
                    color: tema.textoGeral,
                  },
                ]}
              >
                E-mail Institucional
              </Text>

              <TextInput
                placeholder="seu.nome@aluno.educacao.sp.gov.br"
                placeholderTextColor="#A1A1AA"
                style={[
                  styles.input,
                  {
                    backgroundColor: tema.caixaInput,
                    borderColor: tema.borda,
                    color: tema.textoGeral,
                  },
                ]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

            </View>

            {/* SENHA */}
            <View style={styles.inputGroup}>

              <Text
                style={[
                  styles.label,
                  {
                    color: tema.textoGeral,
                  },
                ]}
              >
                Senha
              </Text>

              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#A1A1AA"
                secureTextEntry
                style={[
                  styles.input,
                  {
                    backgroundColor: tema.caixaInput,
                    borderColor: tema.borda,
                    color: tema.textoGeral,
                  },
                ]}
                value={senha}
                onChangeText={setSenha}
              />

            </View>

            {/* BOTÃO */}
            <TouchableOpacity
              style={[
                styles.botao,
                {
                  backgroundColor: tema.botao,
                },
              ]}
              onPress={fazerLoginAluno}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.textoBotao,
                  {
                    color: tema.textoBotao,
                  },
                ]}
              >
                Acessar Portal
              </Text>
            </TouchableOpacity>

            {/* VOLTAR */}
            <TouchableOpacity
              onPress={() => router.push("/")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.link,
                  {
                    color: tema.link,
                  },
                ]}
              >
                Não é aluno? Voltar
              </Text>
            </TouchableOpacity>

            {/* TROCAR TEMA */}
            <TouchableOpacity
              style={styles.btnTema}
              onPress={alternarTema}
              activeOpacity={0.7}
            >

              <Ionicons
                name="color-palette-outline"
                size={18}
                color={tema.textoGeral}
              />

              <Text
                style={[
                  styles.textoBtnTema,
                  {
                    color: tema.textoGeral,
                  },
                ]}
              >
                Tema: {tema.nome.toUpperCase()}
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },

  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },

  backgroundImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  card: {
    width: "100%",
    maxWidth: 400,

    borderRadius: 28,

    paddingHorizontal: 28,
    paddingVertical: 28,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.25,

    shadowRadius: 18,

    elevation: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 7,

    borderRadius: 30,

    marginBottom: 12,
  },

  textoBadge: {
    fontSize: 15,
    fontWeight: "700",
  },

  titulo: {
    fontSize: 31,
    marginBottom: 8,
    textAlign: "center",
  },

  subtitulo: {
    fontSize: 15,
    opacity: 0.82,
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: 17,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },

  input: {
    width: "100%",

    minHeight: 58,

    borderWidth: 2,

    borderRadius: 14,

    paddingHorizontal: 16,
    paddingVertical: 12,

    fontSize: 16,
  },

  botao: {
    width: "100%",

    minHeight: 60,

    borderRadius: 15,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,
    marginBottom: 16,
  },

  textoBotao: {
    fontWeight: "bold",
    fontSize: 18,
  },

  link: {
    textAlign: "center",

    fontWeight: "700",

    marginTop: 6,

    fontSize: 16,
  },

  btnTema: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 24,

    gap: 7,
  },

  textoBtnTema: {
    fontSize: 14,
    fontWeight: "700",
  },

});
