
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';

// Define basic ASL gestures
const defineSignGestures = () => {
  const SignGestures: Record<string, fp.GestureDescription> = {};
  
  // Hello sign - open palm facing forward
  const helloSign = new fp.GestureDescription('hello');
  helloSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  helloSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  helloSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  helloSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  helloSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Thank you sign - flat hand from chin moving forward
  const thankYouSign = new fp.GestureDescription('thank you');
  thankYouSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  thankYouSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  thankYouSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  thankYouSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  thankYouSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Yes sign - nodding fist
  const yesSign = new fp.GestureDescription('yes');
  yesSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  yesSign.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  yesSign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  yesSign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  yesSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

  // No sign - index and middle finger making an X
  const noSign = new fp.GestureDescription('no');
  noSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  noSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  noSign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  noSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);

  // NEW SIGNS
  
  // Please sign - flat hand circling over heart
  const pleaseSign = new fp.GestureDescription('please');
  pleaseSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  pleaseSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  pleaseSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  pleaseSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  pleaseSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Help sign - fist with thumb up resting on other palm
  const helpSign = new fp.GestureDescription('help');
  helpSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  helpSign.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  helpSign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  helpSign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  helpSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  
  // Sorry sign - fist with thumb moving in circular motion on chest
  const sorrySign = new fp.GestureDescription('sorry');
  sorrySign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  sorrySign.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  sorrySign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  sorrySign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  sorrySign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  
  // Love sign - arms crossed over chest
  const loveSign = new fp.GestureDescription('love');
  loveSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  loveSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  loveSign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  loveSign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  loveSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Learn sign - Open palm tapping forehead
  const learnSign = new fp.GestureDescription('learn');
  learnSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  learnSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  learnSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  learnSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  learnSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Good sign - Flat hand starting at mouth moving downward
  const goodSign = new fp.GestureDescription('good');
  goodSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  goodSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  goodSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  goodSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  goodSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Bad sign - Fingers pointing downward
  const badSign = new fp.GestureDescription('bad');
  badSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  badSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  badSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  badSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  badSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Water sign - W hand shape touching lips
  const waterSign = new fp.GestureDescription('water');
  waterSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.FullCurl, 1.0);
  waterSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  waterSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  waterSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  waterSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);
  
  // NEW ADDITIONAL SIGNS
  
  // Food sign - fingers bunched together touching lips
  const foodSign = new fp.GestureDescription('food');
  foodSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  foodSign.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  foodSign.addCurl(fp.Finger.Middle, fp.FingerCurl.HalfCurl, 1.0);
  foodSign.addCurl(fp.Finger.Ring, fp.FingerCurl.HalfCurl, 1.0);
  foodSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.HalfCurl, 1.0);
  
  // Friend sign - hooked index fingers interlocking
  const friendSign = new fp.GestureDescription('friend');
  friendSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  friendSign.addCurl(fp.Finger.Index, fp.FingerCurl.HalfCurl, 1.0);
  friendSign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  friendSign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  friendSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  
  // Home sign - thumb to cheek with fingers extended
  const homeSign = new fp.GestureDescription('home');
  homeSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  homeSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  homeSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  homeSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  homeSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Work sign - fists tapping on top of each other
  const workSign = new fp.GestureDescription('work');
  workSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 1.0);
  workSign.addCurl(fp.Finger.Index, fp.FingerCurl.FullCurl, 1.0);
  workSign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  workSign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  workSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  
  // School sign - palms facing each other opening and closing like a book
  const schoolSign = new fp.GestureDescription('school');
  schoolSign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  schoolSign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  schoolSign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  schoolSign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  schoolSign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);
  
  // Family sign - both hands making F handshape moving in circle
  const familySign = new fp.GestureDescription('family');
  familySign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  familySign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  familySign.addCurl(fp.Finger.Middle, fp.FingerCurl.FullCurl, 1.0);
  familySign.addCurl(fp.Finger.Ring, fp.FingerCurl.FullCurl, 1.0);
  familySign.addCurl(fp.Finger.Pinky, fp.FingerCurl.FullCurl, 1.0);
  
  // Happy sign - open hand circling up and down on chest
  const happySign = new fp.GestureDescription('happy');
  happySign.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
  happySign.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
  happySign.addCurl(fp.Finger.Middle, fp.FingerCurl.NoCurl, 1.0);
  happySign.addCurl(fp.Finger.Ring, fp.FingerCurl.NoCurl, 1.0);
  happySign.addCurl(fp.Finger.Pinky, fp.FingerCurl.NoCurl, 1.0);

  // Add all signs to the gestures dictionary
  SignGestures['hello'] = helloSign;
  SignGestures['thank you'] = thankYouSign;
  SignGestures['yes'] = yesSign;
  SignGestures['no'] = noSign;
  SignGestures['please'] = pleaseSign;
  SignGestures['help'] = helpSign;
  SignGestures['sorry'] = sorrySign;
  SignGestures['love'] = loveSign;
  SignGestures['learn'] = learnSign;
  SignGestures['good'] = goodSign;
  SignGestures['bad'] = badSign;
  SignGestures['water'] = waterSign;
  SignGestures['food'] = foodSign;
  SignGestures['friend'] = friendSign;
  SignGestures['home'] = homeSign;
  SignGestures['work'] = workSign;
  SignGestures['school'] = schoolSign;
  SignGestures['family'] = familySign;
  SignGestures['happy'] = happySign;
  
  return SignGestures;
};

// Initialize the handpose model
export const loadHandposeModel = async (): Promise<handpose.HandPose> => {
  await tf.ready();
  console.log('TensorFlow.js is ready');
  
  const model = await handpose.load();
  console.log('Handpose model loaded');
  return model;
};

// Create a gesture estimator with our custom gestures
export const createGestureEstimator = () => {
  const knownGestures = defineSignGestures();
  return new fp.GestureEstimator(Object.values(knownGestures));
};

// Detect hands and estimate gestures
export const detectSignGesture = async (
  model: handpose.HandPose, 
  video: HTMLVideoElement,
  gestureEstimator: fp.GestureEstimator
): Promise<string | null> => {
  if (!model || !video) return null;
  
  try {
    // Detect hand landmarks
    const predictions = await model.estimateHands(video);
    
    if (predictions.length > 0) {
      // Get landmarks for the first detected hand
      const landmarks = predictions[0].landmarks;
      
      // Estimate gesture based on landmarks
      const gesture = gestureEstimator.estimate(landmarks, 8.5);
      
      if (gesture.gestures.length > 0) {
        // Find gesture with highest confidence
        const confidence = gesture.gestures.map(g => g.score);
        const bestGesture = gesture.gestures.reduce((prev, curr) => 
          prev.score > curr.score ? prev : curr
        );
        
        // Only return gestures with reasonable confidence
        if (bestGesture.score > 8.5) {
          return bestGesture.name;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error in sign gesture detection:', error);
    return null;
  }
};

