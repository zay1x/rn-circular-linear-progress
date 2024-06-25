import { StyleSheet, View } from 'react-native';
import CircleLinearProgress from 'rn-circular-linear-progress';

export default function App() {
  return (
    <View style={styles.container}>
      <CircleLinearProgress percent={70} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
