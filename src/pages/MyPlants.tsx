import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList
} from 'react-native';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import { PlantProps, loadPlant } from '../libs/storage';
import { formatDistance } from 'date-fns/esm';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { ScrollView } from 'react-native-gesture-handler';


export function MyPlants(){
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered]= useState<string>();

    useEffect(() => {
        async function loadStoragedData(){
            const plantsStoraged = await loadPlant();

            const nextTIme = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} à aproximadamente ${nextTIme} horas`
            )

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStoragedData()

    },[])


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
                            <PlantCardSecondary data={item}/>  
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
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    }
})