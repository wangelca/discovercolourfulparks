'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button, Container, Typography, FormControl, InputLabel, Select, Box } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Book() {
    const { control, handleSubmit, setValue, watch } = useForm();
    const [facilities, setFacilities] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState('');
    const [message, setMessage] = useState('');
  
    const selectedDate = watch('date'); // watch the date value from react-hook-form
  

  useEffect(() => {
    // Fetch facilities
    fetch('http://localhost:8000/spots')
      .then(res => res.json())
      .then(data => setFacilities(data))
      .catch(error => console.error('Error fetching facilities:', error));
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate('date',date);
    setValue('date', date);
    // Mock time slot availability based on selected date
    if (selectedDate) {
      setAvailableTimeSlots([
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '1:00 PM - 2:00 PM',
        '2:00 PM - 3:00 PM',
      ]);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const onSubmit  = async (e) => {
    e.preventDefault();
    const res = await fetch('../api/spotbooking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 1, // Hardcoded userId for now
        spotId: selectedFacility,
        bookingDate: selectedDate, // Use selectedDate from react-hook-form
        bookingStartTime: data.startTime,
        bookingEndTime: data.endTime,
        calculatedAmount: 100.0, // Replace with actual logic if needed
      }),
    });
    const result = await res.json();
    if (res.ok) {
      setMessage('Booking successful!');
    } else {
      setMessage('Error: ' + result.error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Book a Facility</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Facility Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Facility</InputLabel>
            <Controller
              name="facility"
              control={control}
              render={({ field }) => (
                <Select {...field} value={selectedFacility} onChange={(e) => setSelectedFacility(e.target.value)}>
                  {facilities.map(spot => (
                    <MenuItem key={spot.spotId} value={spot.spotId}>
                      {spot.spotId} - {spot.spotName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Date Picker */}
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">Pick a Date:</Typography>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className="form-control"
                  placeholderText="Select a date"
                  minDate={new Date()}
                  {...field}
                />
              )}
            />
          </FormControl>

          {/* Time Slot Selection (populated after selecting date) */}
          {availableTimeSlots.length > 0 && (
            <>
              <FormControl fullWidth margin="normal">
                <InputLabel>Start Time</InputLabel>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      {availableTimeSlots.map((slot, index) => (
                        <MenuItem key={index} value={slot.start}>
                          {slot.start}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>End Time</InputLabel>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Select {...field}>
                      {availableTimeSlots.map((slot, index) => (
                        <MenuItem key={index} value={slot.end}>
                          {slot.end}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </>
          )}


          {/* Submit Button */}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Book Now
          </Button>
        </form>

        {message && <Typography variant="body2" color="success">{message}</Typography>}
      </Box>
    </Container>
  );
}