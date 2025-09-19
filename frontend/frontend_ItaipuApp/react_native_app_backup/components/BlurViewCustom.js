import { Platform } from 'react-native';
import { BlurView } from 'expo-blur'; // agora vem do expo-blur

const BlurViewCustom = ({ children, style }) => {
    if (Platform.OS === 'web') {
        return (
            <div style={{
                ...style,
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}>
                {children}
            </div>
        );
    }

    return (
        <BlurView intensity={50} style={style}>
            {children}
        </BlurView>
    );
};

export default BlurViewCustom;
