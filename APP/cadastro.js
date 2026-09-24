import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import {
  temasDoProjeto,
  obterTemaSalvo,
} from "./temas";

import {
  cadastrarUsuarioDB,
} from "../database/initializeDatabase";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [temaAtual, setTemaAtual] = useState("principal");
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function carregarTema() {
        const temaSalvo = await obterTemaSalvo();

        if (temaSalvo && temasDoProjeto[temaSalvo]) {
          setTemaAtual(temaSalvo);
        }
      }

      carregarTema();
    }, [])
  );

  const tema =
    temasDoProjeto[temaAtual] ||
    temasDoProjeto.principal;

  const cadastrar = async () => {
    if (carregando) {
      return;
    }

    if (!nome.trim() || !email.trim() || !senha) {
      Alert.alert(
        "Atenção",
        "Preencha todos os campos."
      );
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(
        "E-mail inválido",
        "Digite um e-mail válido."
      );
      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Senha inválida",
        "A senha precisa ter pelo menos 6 caracteres."
      );
      return;
    }

    try {
      setCarregando(true);

      await cadastrarUsuarioDB(
        nome,
        email,
        senha
      );

      Alert.alert(
        "Cadastro realizado! 🎉",
        "Sua conta foi criada com sucesso.",
        [
          {
            text: "Entrar",
            onPress: () => {
              router.replace("/");
            },
          },
        ]
      );

      setNome("");
      setEmail("");
      setSenha("");
    } catch (error) {
      console.error(
        "Erro ao cadastrar:",
        error
      );

      Alert.alert(
        "Não foi possível cadastrar",
        error?.message ||
          "Ocorreu um erro ao criar sua conta."
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ImageBackground
     source={tema.imagem} 
      style={styles.containerFundo}
      resizeMode="cover"
      imageStyle={styles.imagemFundo}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
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
              Criar Conta
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
              Crie sua conta para começar
            </Text>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      tema.textoGeral,
                  },
                ]}
              >
                Nome Completo
              </Text>

              <TextInput
                placeholder="Seu nome completo"
                placeholderTextColor="#999"
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
                value={nome}
                onChangeText={setNome}
              />
            </View>

            <View style={styles.inputGroup}>
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
                placeholderTextColor="#999"
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

            <View style={styles.inputGroup}>
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
                placeholder="Mínimo de 6 caracteres"
                placeholderTextColor="#999"
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
              activeOpacity={0.8}
              style={[
                styles.botao,
                {
                  backgroundColor:
                    tema.botao,
                },
              ]}
              onPress={cadastrar}
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
                  ? "Cadastrando..."
                  : "Criar Conta"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.replace("/")
              }
              disabled={carregando}
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
                Já tenho uma conta
              </Text>
            </TouchableOpacity>

            <Text
              style={[
                styles.tema,
                {
                  color:
                    tema.textoGeral,
                },
              ]}
            >
              🎨 Tema:{" "}
              {tema.nome.toUpperCase()}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  containerFundo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  imagemFundo: {
    width: "100%",
    height: "100%",
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
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

  titulo: {
    fontSize: 34,
    textAlign: "center",
    marginBottom: 6,
  },

  subtitulo: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 26,
  },

  inputGroup: {
    width: "100%",
    marginBottom: 16,
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
    paddingHorizontal: 15,
    fontSize: 15,
  },

  botao: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  textoBotao: {
    fontSize: 17,
    fontWeight: "bold",
  },

  link: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 20,
  },

  tema: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 22,
    opacity: 0.75,
  },
});