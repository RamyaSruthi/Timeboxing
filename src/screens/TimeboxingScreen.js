// src/screens/TimeboxingScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Calendar from '../components/Calendar';
import HourList from '../components/HourList';
import TaskList from '../components/TaskList';
import { storeFocusHours } from '../utils/storage';

export default function TimeboxingScreen() {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  const handleTaskCompletion = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
    // Calculate focus hours based on completed tasks and store them
    storeFocusHours(tasks.filter(task => task.completed));
  };

  return (
    <View style={styles.container}>
      <Calendar selectedDay={selectedDay} onDaySelect={setSelectedDay} />
      <HourList />
      <TaskList tasks={tasks} onTaskCompletion={handleTaskCompletion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
});
