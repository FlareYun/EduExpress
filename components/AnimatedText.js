import React, {useEffect} from 'react';
import { Text, View, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from "@react-native-masked-view/masked-view";

const START_DEFAULT = { x: 0.5, y: 0 };
const END_DEFAULT = { x: 0.5, y: 1 };
const GRADIENT_COLORS = ["#fdf4c9", "#fbcdf2", "#e8befa", "#acbfff", "#bbf3bf", "#fdf4c9", "#fbcdf2"];
const GRADIENT_LOCATIONS = [0, 0.2, 0.4, 0.6, 0.8, 1, 1];
const MOVEMENT = GRADIENT_LOCATIONS[1] / 20;
const INTERVAL = 30;

let timeout = undefined;

const AnimatedGradientBox = () => {
  const [gradientOptions, setGradientOptions] = React.useState({
    colors: GRADIENT_COLORS,
    locations: GRADIENT_LOCATIONS,
    start: START_DEFAULT,
    end: END_DEFAULT
  });

  const gradientOptionsRef = React.useRef(gradientOptions);
  gradientOptionsRef.current = gradientOptions;

  const reset = () => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    setGradientOptions({
      colors: GRADIENT_COLORS,
      locations: GRADIENT_LOCATIONS,
      start: START_DEFAULT,
      end: END_DEFAULT
    });
  };

  const infiniteRainbow = () => {
    if (gradientOptionsRef.current.locations[1] - MOVEMENT <= 0) {
      const gradientColors = [...gradientOptionsRef.current.colors];
      gradientColors.shift();
      gradientColors.push(gradientColors[1]);

      setGradientOptions({
        colors: gradientColors,
        locations: GRADIENT_LOCATIONS,
        start: START_DEFAULT,
        end: END_DEFAULT
      });
    } else {
      const updatedLocations = gradientOptionsRef.current.locations.map((item, index) => {
        return index === gradientOptionsRef.current.locations.length - 1 ? 1 : parseFloat(Math.max(0, item - MOVEMENT).toFixed(2));
      });

      setGradientOptions({
        colors: [...gradientOptionsRef.current.colors],
        locations: updatedLocations,
        start: gradientOptionsRef.current.start,
        end: gradientOptionsRef.current.end
      });
    }

    timeout = setTimeout(infiniteRainbow, INTERVAL);
  };

  useEffect(() => {
    infiniteRainbow(); 

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return (

<MaskedView
style={{ flex: 1}}
maskElement={
  <View
    style={{

      backgroundColor: 'transparent',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        fontSize: 60,
        color: 'black',
        fontWeight: 'bold',
      }}
    >
      AI Chat
    </Text>
  </View>
}
>

<LinearGradient 
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
      colors={gradientOptions.colors}
      locations={gradientOptions.locations}
      start={gradientOptions.start}
      end={gradientOptions.end}
    >

    </LinearGradient>  
</MaskedView>

  );
};

export default AnimatedGradientBox;