import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import OrphanagesMap from './pages/OrphanagesMap';
import OrphanageData from './pages/CreateOrphanage/OrphanageData';
import SelectMapPosition from './pages/CreateOrphanage/SelectMapPosition';
import OrphanageDetails from './pages/OrphanageDetails';
import Header from './components/Header';

const { Navigator, Screen } = createStackNavigator()

export default function Routes(){
  return(
    <NavigationContainer>
      <Navigator screenOptions={{
        headerShown: false
      }} >
        <Screen name="OrphanagesMap" component={OrphanagesMap} />

        <Screen name="OrphanageData" component={OrphanageData} options={{
          headerShown: true,
          header: () => <Header title="Cadastro" cancelVisible />
        }}/>

        <Screen name="SelectMapPosition" component={SelectMapPosition} options={{
          headerShown: true,
          header: () => <Header title="Selecione no mapa" cancelVisible />
        }}/>

        <Screen name="OrphanageDetails" component={OrphanageDetails} options={{
          headerShown: true,
          header: () => <Header title="Orfanato" />
        }} />
      </Navigator>
    </NavigationContainer>
  )
};