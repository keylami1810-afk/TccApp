import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { temasDoProjeto } from './temas';

export default function Configuracoes() {
  const router = useRouter();
  const [temaAtual, setTemaAtual] = useState('claro');
  const Cores = temasDoProjeto[temaAtual] || temasDoProjeto.claro;

  useEffect(() => {
    async function carregarTemaSalvo() {
      const temaSalvo = await AsyncStorage.getItem('@tema_app');
      if (temaSalvo && temasDoProjeto[temaSalvo]) {
        setTemaAtual(temaSalvo);
      }
    }
    carregarTemaSalvo();
  }, []);

  const selecionarTema = async (nomeTema) => {
    setTemaAtual(nomeTema);
    await AsyncStorage.setItem('@tema_app', nomeTema);
    Alert.alert("Sucesso", `Tema alterado para: ${nomeTema.toUpperCase()}`);
  };

  const SairDaConta = () => {
    Alert.alert("Sair", "Deseja realmente encerrar a sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => router.replace('/') }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: Cores.fundo }]}>
      {/* Topo */}
      <View style={[styles.topo, { backgroundColor: Cores.botao }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Cores.textoBotao} />
        </TouchableOpacity>
        <Text style={[styles.tituloTopo, { color: Cores.textoBotao }]}>Configurações</Text>
      </View>

      <ScrollView style={{ padding: 20 }}>
        {/* Seção de Seleção de Temas */}
        <Text style={[styles.secaoTitulo, { color: Cores.textoGeral }]}>Aparência e Tema</Text>
        
        <View style={[styles.caixaOpcao, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda }]}>
          <TouchableOpacity 
            style={[styles.btnTema, { backgroundColor: '#f5f5f5' }]} 
            onPress={() => selecionarTema('claro')}
          >
            <Text style={{ color: '#333', fontWeight: 'bold' }}>Tema Claro</Text>
            {temaAtual === 'claro' && <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnTema, { backgroundColor: '#121212' }]} 
            onPress={() => selecionarTema('escuro')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tema Escuro</Text>
            {temaAtual === 'escuro' && <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnTema, { backgroundColor: '#0b0c10' }]} 
            onPress={() => selecionarTema('neon')}
          >
            <Text style={{ color: '#45f3ff', fontWeight: 'bold' }}>Tema Dark Neon</Text>
            {temaAtual === 'neon' && <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnTema, { backgroundColor: '#FFC0CB' }]} 
            onPress={() => selecionarTema('pastel')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Tema Pastel</Text>
            {temaAtual === 'pastel' && <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btnTema, { backgroundColor: '#C6AC8F' }]} 
            onPress={() => selecionarTema('retro')}
          >
            <Text style={{ color: '#22333B', fontWeight: 'bold' }}>Tema Retrô</Text>
            {temaAtual === 'retro' && <Ionicons name="checkmark-circle" size={20} color="#2ecc71" />}
          </TouchableOpacity>
        </View>

        {/* Opção Sair */}
        <TouchableOpacity 
          style={[styles.btnSair, { backgroundColor: Cores.caixaInput, borderColor: Cores.borda }]} 
          onPress={SairDaConta}
        >
          <MaterialIcons name="exit-to-app" size={24} color="#e74c3c" />
          <Text style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: 16 }}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topo: { padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center', gap: 15 },
  tituloTopo: { fontSize: 20, fontWeight: 'bold' },
  secaoTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  caixaOpcao: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 20 },
  btnTema: { padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  btnSair: { borderWidth: 1, borderRadius: 12, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }
});
