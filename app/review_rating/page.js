//references: Chatgpt: app.js
'use client';

import React, { Component } from 'react';
import SpotList from '../components/reviewSpotList';
import SpotDetails from '../components/reviewSpotDetail';
import EventList from '../components/reviewEventList';
import EventDetails from '../components/reviewEventDetail';
import ReviewsComponent from '../components/reviews';


export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen">
            <SpotList/>
            <SpotDetails/>
            <EventList/>
            <EventDetails/>
            <ReviewsComponent/>

    </div>

  );
}

