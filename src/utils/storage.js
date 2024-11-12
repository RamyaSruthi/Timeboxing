// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeFocusHours = async (tasks) => {
  const focusHours = tasks.reduce((total, task) => {
    const duration = (task.endTime - task.startTime) / (1000 * 60 * 60); // calculate in hours
    return total + duration;
  }, 0);

  await AsyncStorage.setItem('focusHours', JSON.stringify(focusHours));
};

export const getFocusHours = async () => {
  const focusHours = await AsyncStorage.getItem('focusHours');
  return focusHours ? JSON.parse(focusHours) : 0;
};
