import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  PanResponder,
  Animated,
  Dimensions 
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

const Stack = createStackNavigator();
const screenWidth = Dimensions.get('window').width;

const Task = ({ task, onComplete, onUpdateTime }) => {
  const [pan] = useState(new Animated.ValueXY());

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      pan.setValue({ x: 0, y: gesture.dy });
      // Convert vertical movement to 15-minute increments
      const timeIncrement = Math.round(gesture.dy / 20) * 15;
      onUpdateTime(task.id, timeIncrement);
    },
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false
      }).start();
    }
  });

  return (
    <Animated.View
      style={[
        styles.task,
        task.completed && styles.completedTaskContainer,
        { transform: pan.getTranslateTransform() }
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity onPress={() => onComplete(task.id)}>
        <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
          {task.title}
        </Text>
        <Text style={styles.taskTime}>
          {moment(task.startTime).format('HH:mm')} - 
          {moment(task.endTime).format('HH:mm')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TimeboxScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [tasks, setTasks] = useState([]);
  const [activeHour, setActiveHour] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const toggleTaskComplete = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const updateTaskTime = (taskId, timeChange) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStartTime = moment(task.startTime).add(timeChange, 'minutes');
        const newEndTime = moment(task.endTime).add(timeChange, 'minutes');
        return {
          ...task,
          startTime: newStartTime,
          endTime: newEndTime
        };
      }
      return task;
    }));
  };

  const handleAddTask = (hour) => {
    if (newTaskTitle.trim() === '') {
      return;
    }

    const startTime = moment(selectedDate).hour(hour).minute(0);
    const endTime = moment(startTime).add(1, 'hour');

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle,
      startTime,
      endTime,
      completed: false
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setActiveHour(null);
  };

  return (
    <View style={styles.container}>
      <CalendarStrip
        style={styles.calendar}
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
        calendarHeaderStyle={styles.calendarHeader}
        dateNumberStyle={styles.dateNumber}
        dateNameStyle={styles.dateName}
        highlightDateNumberStyle={styles.highlightDateNumber}
        highlightDateNameStyle={styles.highlightDateName}
        styleWeekend={true}
        calendarColor={'#ffffff'}
        calendarHeaderContainerStyle={styles.calendarHeaderContainer}
        iconContainer={{flex: 0.1}}
        numDaysInWeek={7}
      />
      
      <ScrollView style={styles.timelineContainer}>
        {hours.map(hour => (
          <View key={hour} style={styles.hourRow}>
            <View style={styles.hourLabelContainer}>
              <Text style={styles.hourLabel}>
                {hour.toString().padStart(2, '0')}:00
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.hourContent}
              onPress={() => setActiveHour(hour)}
            >
              {activeHour === hour ? (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter task"
                    value={newTaskTitle}
                    onChangeText={setNewTaskTitle}
                    onSubmitEditing={() => handleAddTask(hour)}
                    autoFocus
                  />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddTask(hour)}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {tasks
                .filter(task => moment(task.startTime).hour() === hour)
                .map(task => (
                  <Task
                    key={task.id}
                    task={task}
                    onComplete={toggleTaskComplete}
                    onUpdateTime={updateTaskTime}
                  />
                ))
              }
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  calendar: {
    height: 100,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  calendarHeaderContainer: {
    padding: 10,
  },
  calendarHeader: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateNumber: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
  },
  dateName: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '400',
  },
  highlightDateNumber: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlightDateName: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineContainer: {
    flex: 1,
  },
  hourRow: {
    flexDirection: 'row',
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hourLabelContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  hourLabel: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  hourContent: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
    minHeight: 60,
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 4,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  task: {
    backgroundColor: '#e3f2fd',
    borderRadius: 4,
    padding: 8,
    marginVertical: 2,
    minHeight: 50,
  },
  taskText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  completedTaskContainer: {
    backgroundColor: '#f5f5f5',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#666666',
  },
  taskTime: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
    fontWeight: '400',
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Timebox" 
          component={TimeboxScreen}
          options={{
            title: 'Daily Schedule',
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: '#000000',
              fontSize: 18,
              fontWeight: '600',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;