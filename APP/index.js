import React, {
  useState,
  useEffect,
} from "react";

import {
  SafeAreaView,
  ImageBackground,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import {
  temasDoProjeto,
  obterTemaSalvo,
  salvarTema,
} from "./temas";

import {
  verificarLoginDB,
} from "../database/initializeDatabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeTema, setNomeTema] =
    useState("principal");

  const [carregando, setCarregando] =
    useState(false);

  const [fontsLoaded] = useFonts({
    Amoria: require("../assets/fonts/AMORIA.otf"),
    Fantasia: require("../assets/fonts/Fantasia.ttf"),
    Flowers: require("../assets/fonts/Flowers.otf"),
    Fogo: require("../assets/fonts/Fogo.otf"),
    Gelo: require("../assets/fonts/Gelo.ttf"),
    Gotico: require("../assets/fonts/Gotico.ttf"),
    Magic: require("../assets/fonts/Magic.ttf"),
  });

  useEffect(() => {
    carregarTema();
  }, []);

  const carregarTema = async () => {
    try {
      const temaSalvo =
        await obterTemaSalvo();

      if (
        temaSalvo &&
        temasDoProjeto[temaSalvo]
      ) {
        setNomeTema(temaSalvo);
      }
    } catch (error) {
      console.error(
        "Erro ao carregar tema:",
        error
      );
    }
  };

  const alternarTema = async () => {
    const chaves =
      Object.keys(temasDoProjeto);

    const indiceAtual =
      chaves.indexOf(nomeTema);

    const proximaIndex =
      (indiceAtual + 1) %
      chaves.length;

    const novoTema =
      chaves[proximaIndex];

    setNomeTema(novoTema);

    await salvarTema(novoTema);
  };

  const tema =
    temasDoProjeto[nomeTema] ||
    temasDoProjeto.principal;

  const fazerLogin = async () => {
    if (carregando) {
      return;
    }

    if (!email.trim() || !senha) {
      Alert.alert(
        "Atenção",
        "Preencha o e-mail e a senha."
      );
      return;
    }

    try {
      setCarregando(true);

      const usuario =
        await verificarLoginDB(
          email,
          senha
        );

      if (!usuario) {
        Alert.alert(
          "Login inválido",
          "E-mail ou senha incorretos."
        );
        return;
      }

      router.replace({
        pathname: "/principal",
        params: {
          nomeUsuario:
            usuario.nome,
          usuarioId:
            String(usuario.id),
        },
      });
    } catch (error) {
      console.error(
        "Erro no login:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível realizar o login. Verifique o banco de dados."
      );
    } finally {
      setCarregando(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
source={tema.imagem}
      style={styles.container}
      resizeMode="cover"
      imageStyle={styles.imagemFundo}
    >
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor:
                tema.cardBg,
              borderColor:
                tema.borda,
              shadowColor:
                tema.sombraCor,
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={styles.icone}
            >
              🦋
            </Text>

            <Text
              style={[
                styles.titulo,
                {
                  color:
                    tema.textoGeral,
                  fontFamily:
                    tema.fonteTitulo,
                },
              ]}
            >
              Malomi
            </Text>

            <Text
              style={[
                styles.subtitulo,
                {
                  color:
                    tema.textoGeral,
                },
              ]}
            >
              Seu dinheiro. Seu controle.
              Seu futuro.
            </Text>
          </View>

          <View
            style={styles.inputGroup}
          >
            <Text
              style={[
                styles.label,
                {
                  color:
                    tema.textoGeral,
                },
              ]}
            >
              E-mail
            </Text>

            <TextInput
              placeholder="seu@email.com"
              placeholderTextColor="#A1A1AA"
              style={[
                styles.input,
                {
                  backgroundColor:
                    tema.caixaInput,
                  borderColor:
                    tema.borda,
                  color:
                    tema.textoGeral,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View
            style={styles.inputGroup}
          >
            <Text
              style={[
                styles.label,
                {
                  color:
                    tema.textoGeral,
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
                  backgroundColor:
                    tema.caixaInput,
                  borderColor:
                    tema.borda,
                  color:
                    tema.textoGeral,
                },
              ]}
              value={senha}
              onChangeText={setSenha}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.botao,
              {
                backgroundColor:
                  tema.botao,
              },
            ]}
            onPress={fazerLogin}
            disabled={carregando}
          >
            <Text
              style={[
                styles.textoBotao,
                {
                  color:
                    tema.textoBotao,
                },
              ]}
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "/loginaluno"
              )
            }
          >
            <Text
              style={[
                styles.link,
                {
                  color:
                    tema.link,
                },
              ]}
            >
              Sou Aluno
              (Acesso Escolar)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(
                "/cadastro"
              )
            }
          >
            <Text
              style={[
                styles.link,
                {
                  color:
                    tema.link,
                },
              ]}
            >
              Criar uma conta
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnTema}
            onPress={alternarTema}
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
                  color:
                    tema.textoGeral,
                },
              ]}
            >
              Tema:{" "}
              {tema.nome.toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor:
      "rgba(0,0,0,0.10)",
  },

  imagemFundo: {
    width: "100%",
    height: "100%",
  },

  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1,
    padding: 28,

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },

  header: {
    alignItems: "center",
    marginBottom: 24,
  },

  icone: {
    fontSize: 30,
    marginBottom: 4,
  },

  titulo: {
    fontSize: 42,
    marginBottom: 5,
    letterSpacing: 1,
  },

  subtitulo: {
    fontSize: 13,
    opacity: 0.8,
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
  },

  input: {
    width: "100%",
    height: 52,
    borderWidth: 1.5,
    borderRadius: 13,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  botao: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  textoBotao: {
    fontSize: 17,
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 19,
  },

  btnTema: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 23,
    gap: 7,
  },

  textoBtnTema: {
    fontSize: 12,
    fontWeight: "600",
  },
});