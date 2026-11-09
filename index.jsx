import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Main} from './Main';
import {script, words} from './current';

const FPS = script.fps;
const duration = Math.ceil((words[words.length - 1].end + script.tail) * FPS);

const Root = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={duration}
    fps={FPS}
    width={script.width}
    height={script.height}
  />
);

registerRoot(Root);
