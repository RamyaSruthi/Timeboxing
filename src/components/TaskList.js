// src/components/TaskList.js
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onTaskCompletion }) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskItem task={item} onToggle={() => onTaskCompletion(item.id)} />
      )}
      style={styles.taskList}
    />
  );
}

const styles = StyleSheet.create({
  taskList: {
    flex: 1,
    paddingHorizontal: 8,
  },
});
