// src/components/Calendar.js
import React from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarComponent({ selectedDay, onDaySelect }) {
  return (
    <View>
      <Calendar
        onDayPress={(day) => onDaySelect(new Date(day.dateString))}
        markedDates={{
          [selectedDay.toISOString().split('T')[0]]: { selected: true },
        }}
      />
    </View>
  );
}
