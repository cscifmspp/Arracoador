import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const tabWidth = width / state.routes.length;

    return (
        <View style={styles.container}>
            <View style={styles.svgContainer}>
                <Svg width={width} height={70} viewBox={`0 0 ${width} 70`}>
                    <Path
                        d={`M0 0 H${width / 2 - 40} C${width / 2 - 20} 0,${width / 2 - 20} 50,${width / 2} 50 
              C${width / 2 + 20} 50,${width / 2 + 20} 0,${width / 2 + 40} 0 H${width} V70 H0 Z`}
                        fill="white"
                    />
                </Svg>
            </View>

            <View style={styles.tabContainer}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const iconName = options.tabBarIcon || 'ellipse';

                    const isCenter = index === Math.floor(state.routes.length / 2);

                    if (isCenter) {
                        return (
                            <TouchableOpacity
                                key={route.key}
                                onPress={onPress}
                                style={styles.centerButton}
                            >
                                <View style={styles.centerIcon}>
                                    <Icon name="add" size={28} color="#fff" />
                                </View>
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            style={[styles.tabButton, { width: tabWidth }]}
                        >
                            <Icon
                                name={iconName}
                                size={24}
                                color={isFocused ? "#6200ee" : "#999"}
                            />
                            <Text style={{ color: isFocused ? "#6200ee" : "#999", fontSize: 12 }}>
                                {options.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width,
        height: 70,
        alignItems: 'center',
    },
    svgContainer: {
        position: 'absolute',
        bottom: 0,
    },
    tabContainer: {
        flexDirection: 'row',
        height: 70,
        backgroundColor: 'transparent',
    },
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    centerButton: {
        position: 'absolute',
        bottom: 15,
        left: width / 2 - 28,
    },
    centerIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6200ee',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
});

export default CustomTabBar;
