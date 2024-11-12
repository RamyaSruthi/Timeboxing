// src/components/HourList.js
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function HourList() {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  return (
    <ScrollView style={styles.hourList}>
      {hours.map((hour, index) => (
        <Text key={index} style={styles.hourText}>{hour}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hourList: {
    width: 50,
  },
  hourText: {
    fontSize: 16,
    marginVertical: 10,
  },
});
