/**
 * Narrivo Playback Service
 *
 * This service runs in the background and handles remote events
 * from lock screen, notification, Bluetooth, etc.
 */

import TrackPlayer, { Event, State } from 'react-native-track-player';

module.exports = async function () {
  // Handle remote play event
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  // Handle remote pause event
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  // Handle remote stop event
  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.reset();
  });

  // Handle remote seek event (from notification scrubber)
  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    await TrackPlayer.seekTo(event.position);
  });

  // Handle remote jump forward (e.g., +30s from lock screen)
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    await TrackPlayer.seekTo(Math.min(position + event.interval, duration));
  });

  // Handle remote jump backward (e.g., -10s from lock screen)
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(position - event.interval, 0));
  });

  // Handle playback state changes
  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    // You can emit events to the app here if needed
    console.log('Playback state:', event.state);
  });

  // Handle playback errors
  TrackPlayer.addEventListener(Event.PlaybackError, (error) => {
    console.error('Playback error:', error);
  });

  // Handle track ending (for auto-advance or repeat)
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (event) => {
    console.log('Queue ended at track:', event.track);
  });
};
