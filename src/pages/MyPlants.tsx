import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Alert
} from 'react-native';
import { formatDistance } from 'date-fns/esm';
import { pt } from 'date-fns/locale';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';


import waterdrop from '../assets/waterdrop.png';
import { PlantProps, loadPlant, removePlant } from '../libs/storage';

import fonts from '../styles/fonts';
import colors from '../styles/colors';



export function MyPlants(){
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered]= useState<string>();

    function handleRemove(plant:PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`,[
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😅',
                onPress: async () => {
                    try {
                        await removePlant(plant.id);
                        setMyPlants((oldData) => 
                            oldData.filter((item) => item.id !== plant.id)
                        );

                    }catch(error){
                        Alert.alert('Não foi possível remover! 😢');
                    }
                }
            }
        ])
    }
    
    useEffect(() => {
        async function loadStoragedData(){
            const plantsStoraged = await loadPlant();

            if(plantsStoraged.length > 0){
                const nextTIme = formatDistance(
                    new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                    new Date().getTime(),
                    { locale: pt }
                );

                setNextWatered(
                    `Não esqueça de regar a ${plantsStoraged[0].name} em aproximadamente ${nextTIme}`
                )

                setMyPlants(plantsStoraged);
            } else{
                setNextWatered(
                    'Nenhuma planta foi adicionada para ser regada ainda! 😓'
                )
            }
            setLoading(false);
        }

        loadStoragedData()

    },[])

    if(loading)
        return <Load />

    return (
        <View style={styles.container}>
            <Header/>

            <View style= {styles.spotlight}>
                <Image 
                    source={waterdrop}
                    style={styles.spotilightImage}
                />
                <Text style={styles.spotilightText}>
                    {nextWatered}
                </Text>

            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>
                    Proximas regadas
                </Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                            <PlantCardSecondary 
                                data={item}
                                handleRemove={() => {handleRemove(item)}}
                            />  
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollListContainer}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotilightImage: {
        width: 60,
        height: 60
    },
    spotilightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    },
    scrollListContainer: {
        flexGrow: 1,
        justifyContent: 'space-between'
    }
})