// src/components/TaskItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskItem({ task, onToggle }) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.taskContainer}>
      <Text style={[styles.taskText, task.completed && styles.completedText]}>
        {task.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    borderRadius: 8,
  },
  taskText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});
