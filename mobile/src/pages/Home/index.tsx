import React, { useState, useEffect } from 'react';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import axios from "axios"

import { View, StyleSheet, Image, Text, ImageBackground, TextInput } from 'react-native';
import { RectButton } from "react-native-gesture-handler"

import { Feather as Icon } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

interface IBGE_UF_Response {
  nome: string
  sigla: string
}

interface IBGE_City_Response {
  nome: string
}

const Home: React.FC = () => {
  const navigation = useNavigation()

  const [ufs, setUfs] = useState<IBGE_UF_Response[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState('0')
  const [selectedCity, setSelectedCity] = useState('0')

  useEffect(() => {
    axios.get<IBGE_UF_Response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
        setUfs(response.data)
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (selectedUf === "0") return
    axios
      .get<IBGE_City_Response[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      . then(response => {
        const cityNames = response.data.map((city) => city.nome)
        setCities(cityNames)
      })
      .catch(err => console.log(err))
  }, [selectedUf])

  function handleNavigateToPoints() {
    navigation.navigate('Points', {uf: selectedUf, city: selectedCity})
  }

  function handleSelectUf(value: string) {
    setSelectedUf(value)
  }
  
  function handleSelectCity(value: string) {
    setSelectedCity(value)
  }

  return (
    <ImageBackground
      style={styles.container}
      source={require('../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          style={pickerStyle}
          items={ufs.map((uf) => ({ label: uf.nome, value: uf.sigla }))}
          onValueChange={(value) => handleSelectUf(value)}
          placeholder={{
            label: "Selecione o estado",
            value: null
          }}
        />
        <RNPickerSelect
          style={pickerStyle}
          onValueChange={(value) => handleSelectCity(value)}
          items={cities.map((city) => ({ label: city, value: city }))}
          placeholder={{
            label: "Selecione a cidade",
            value: null
          }}
        />

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const pickerStyle = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 40,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;